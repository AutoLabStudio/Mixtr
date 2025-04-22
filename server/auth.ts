import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";
import { pool } from "./db";
import { User, Partner } from "@shared/schema";

// Extend Express Request type to include partner property
declare global {
  namespace Express {
    interface User extends Omit<User, 'id'> {
      id: number;
    }
    interface Request {
      partner?: Partner;
    }
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Partner-specific middleware to check if user is an approved partner
export const requirePartner = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  const user = req.user as Express.User;
  
  if (user.role !== "partner") {
    return res.status(403).json({ error: "Not authorized. Partner access required." });
  }
  
  try {
    const partner = await storage.getPartnerByUserId(user.id);
    
    if (!partner) {
      return res.status(404).json({ error: "Partner profile not found" });
    }
    
    if (!partner.approved) {
      return res.status(403).json({ error: "Your partner account is pending approval." });
    }
    
    // Add partner info to request for convenient access
    req.partner = partner;
    next();
  } catch (error) {
    console.error("Error checking partner status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export function setupAuth(app: Express) {
  const MemStore = MemoryStore(session);
  
  let sessionStore;
  
  // Use PostgreSQL session store if DB is connected, otherwise fall back to memory store
  if (process.env.DATABASE_URL) {
    const PgStore = connectPgSimple(session);
    sessionStore = new PgStore({
      pool,
      createTableIfMissing: true,
    });
  } else {
    sessionStore = new MemStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }
  
  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "mixtr-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, (user as User).id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password, role = "customer" } = req.body;
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create new user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role,
      });
      
      // If it's a partner registration, associate with a bar
      if (role === "partner" && req.body.barId && req.body.position && req.body.phone) {
        await storage.createPartner({
          userId: user.id,
          barId: req.body.barId,
          position: req.body.position,
          phone: req.body.phone,
          approved: false, // Partners need to be approved by admin
        });
      }
      
      // Automatically log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to login after registration" });
        }
        
        // Don't send the password to the client
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });
  
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ error: info.message || "Authentication failed" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Don't send the password to the client
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });
  
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/user/current", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Don't send the password to the client
    const { password, ...userWithoutPassword } = req.user as User;
    return res.json(userWithoutPassword);
  });
  
  // Get partner details if the user is a partner
  app.get("/api/partner/current", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = req.user as User;
    
    if (user.role !== "partner") {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    try {
      const partner = await storage.getPartnerByUserId(user.id);
      if (!partner) {
        return res.status(404).json({ error: "Partner profile not found" });
      }
      
      // Get associated bar details
      const bar = await storage.getBar(partner.barId);
      
      return res.json({ partner, bar });
    } catch (error) {
      console.error("Error fetching partner details:", error);
      return res.status(500).json({ error: "Failed to fetch partner details" });
    }
  });
}