import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { partnerRouter } from "./partner-routes";
import { 
  insertOrderSchema, insertSubscriptionSchema, 
  insertClassEnrollmentSchema, insertLoyaltyProgramSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Partner routes
  app.use("/api/partner", partnerRouter);
  
  // API Routes
  
  // Get all bars
  app.get("/api/bars", async (req: Request, res: Response) => {
    const bars = await storage.getBars();
    res.json(bars);
  });
  
  // Get a specific bar
  app.get("/api/bars/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid bar ID" });
    }
    
    const bar = await storage.getBar(id);
    if (!bar) {
      return res.status(404).json({ message: "Bar not found" });
    }
    
    res.json(bar);
  });
  
  // Get cocktails for a specific bar
  app.get("/api/bars/:id/cocktails", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid bar ID" });
    }
    
    const bar = await storage.getBar(id);
    if (!bar) {
      return res.status(404).json({ message: "Bar not found" });
    }
    
    const cocktails = await storage.getCocktailsByBar(id);
    res.json(cocktails);
  });
  
  // Get all cocktails
  app.get("/api/cocktails", async (req: Request, res: Response) => {
    const cocktails = await storage.getCocktails();
    res.json(cocktails);
  });
  
  // Get featured cocktails
  app.get("/api/cocktails/featured", async (req: Request, res: Response) => {
    const featuredCocktails = await storage.getFeaturedCocktails();
    res.json(featuredCocktails);
  });
  
  // Get a specific cocktail
  app.get("/api/cocktails/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid cocktail ID" });
    }
    
    const cocktail = await storage.getCocktail(id);
    if (!cocktail) {
      return res.status(404).json({ message: "Cocktail not found" });
    }
    
    // Get the bar information for this cocktail
    const bar = await storage.getBar(cocktail.barId);
    
    res.json({
      ...cocktail,
      bar,
    });
  });
  
  // Get special offers
  app.get("/api/special-offers", async (req: Request, res: Response) => {
    const specialOffers = await storage.getSpecialOffers();
    res.json(specialOffers);
  });
  
  // Create a new order
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const newOrder = await storage.createOrder(orderData);
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data", error });
    }
  });
  
  // Get a specific order
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    const order = await storage.getOrder(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  });
  
  // Get orders for a user
  app.get("/api/user/:userId/orders", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const orders = await storage.getOrdersByUser(userId);
    res.json(orders);
  });
  
  // Update order status
  app.patch("/api/orders/:id/status", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const updatedOrder = await storage.updateOrderStatus(id, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(updatedOrder);
  });

  // ===== SUBSCRIPTION SERVICE ROUTES =====
  
  // Get all subscriptions
  app.get("/api/subscriptions", async (req: Request, res: Response) => {
    const subscriptions = await storage.getSubscriptions();
    res.json(subscriptions);
  });
  
  // Get a specific subscription
  app.get("/api/subscriptions/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid subscription ID" });
    }
    
    const subscription = await storage.getSubscription(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    
    res.json(subscription);
  });
  
  // Get user's subscriptions
  app.get("/api/user/:userId/subscriptions", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const subscriptions = await storage.getSubscriptionsByUser(userId);
    res.json(subscriptions);
  });
  
  // Create a new subscription
  app.post("/api/subscriptions", async (req: Request, res: Response) => {
    try {
      const subscriptionData = insertSubscriptionSchema.parse(req.body);
      const subscription = await storage.createSubscription(subscriptionData);
      res.status(201).json(subscription);
    } catch (error) {
      res.status(400).json({ message: "Invalid subscription data", error });
    }
  });
  
  // Update a subscription
  app.patch("/api/subscriptions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid subscription ID" });
      }
      
      const subscription = await storage.getSubscription(id);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      const updatedSubscription = await storage.updateSubscription(id, req.body);
      res.json(updatedSubscription);
    } catch (error) {
      res.status(400).json({ message: "Failed to update subscription", error });
    }
  });
  
  // Cancel a subscription
  app.post("/api/subscriptions/:id/cancel", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid subscription ID" });
      }
      
      const subscription = await storage.getSubscription(id);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      const canceledSubscription = await storage.cancelSubscription(id);
      res.json(canceledSubscription);
    } catch (error) {
      res.status(400).json({ message: "Failed to cancel subscription", error });
    }
  });
  
  // ===== MIXOLOGY CLASSES ROUTES =====
  
  // Get all mixology classes
  app.get("/api/mixology-classes", async (req: Request, res: Response) => {
    const classes = await storage.getMixologyClasses();
    res.json(classes);
  });
  
  // Get upcoming mixology classes
  app.get("/api/mixology-classes/upcoming", async (req: Request, res: Response) => {
    const classes = await storage.getUpcomingMixologyClasses();
    res.json(classes);
  });
  
  // Get a specific mixology class
  app.get("/api/mixology-classes/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }
    
    const mixologyClass = await storage.getMixologyClass(id);
    if (!mixologyClass) {
      return res.status(404).json({ message: "Mixology class not found" });
    }
    
    // Get the bar information for this class
    const bar = await storage.getBar(mixologyClass.barId);
    
    res.json({
      ...mixologyClass,
      bar,
    });
  });
  
  // Get mixology classes by bar
  app.get("/api/bars/:barId/mixology-classes", async (req: Request, res: Response) => {
    const barId = parseInt(req.params.barId);
    if (isNaN(barId)) {
      return res.status(400).json({ message: "Invalid bar ID" });
    }
    
    const bar = await storage.getBar(barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar not found" });
    }
    
    const classes = await storage.getMixologyClassesByBar(barId);
    res.json(classes);
  });
  
  // Enroll in a mixology class
  app.post("/api/mixology-classes/enroll", async (req: Request, res: Response) => {
    try {
      const enrollmentData = insertClassEnrollmentSchema.parse(req.body);
      
      // Check if the class exists
      const mixologyClass = await storage.getMixologyClass(enrollmentData.classId);
      if (!mixologyClass) {
        return res.status(404).json({ message: "Mixology class not found" });
      }
      
      // Check if class is at capacity
      const currentEnrolled = mixologyClass.enrolled || 0;
      if (currentEnrolled >= mixologyClass.capacity) {
        return res.status(400).json({ message: "Class is at full capacity" });
      }
      
      const enrollment = await storage.enrollInClass(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Invalid enrollment data", error });
    }
  });
  
  // Get user's class enrollments
  app.get("/api/user/:userId/class-enrollments", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const enrollments = await storage.getClassEnrollmentsByUser(userId);
    
    // Enhance with class details
    const enhancedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        const mixologyClass = await storage.getMixologyClass(enrollment.classId);
        return {
          ...enrollment,
          class: mixologyClass
        };
      })
    );
    
    res.json(enhancedEnrollments);
  });
  
  // ===== LOYALTY PROGRAM ROUTES =====
  
  // Get user's loyalty program
  app.get("/api/user/:userId/loyalty", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const loyaltyProgram = await storage.getLoyaltyProgram(userId);
    
    if (!loyaltyProgram) {
      return res.status(404).json({ message: "No loyalty program found for this user" });
    }
    
    res.json(loyaltyProgram);
  });
  
  // Enroll in loyalty program
  app.post("/api/loyalty/enroll", async (req: Request, res: Response) => {
    try {
      const programData = insertLoyaltyProgramSchema.parse(req.body);
      
      // Check if user is already enrolled
      const existingProgram = await storage.getLoyaltyProgram(programData.userId);
      if (existingProgram) {
        return res.status(409).json({ message: "User is already enrolled in loyalty program" });
      }
      
      const program = await storage.createLoyaltyProgram(programData);
      res.status(201).json(program);
    } catch (error) {
      res.status(400).json({ message: "Invalid loyalty program data", error });
    }
  });
  
  // Update loyalty points
  app.patch("/api/user/:userId/loyalty/points", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { points } = req.body;
      
      if (typeof points !== 'number') {
        return res.status(400).json({ message: "Points must be a number" });
      }
      
      const program = await storage.getLoyaltyProgram(userId);
      if (!program) {
        return res.status(404).json({ message: "No loyalty program found for this user" });
      }
      
      const updatedProgram = await storage.updateLoyaltyPoints(userId, points);
      res.json(updatedProgram);
    } catch (error) {
      res.status(400).json({ message: "Failed to update loyalty points", error });
    }
  });
  
  // Get all loyalty rewards
  app.get("/api/loyalty/rewards", async (req: Request, res: Response) => {
    const rewards = await storage.getLoyaltyRewards();
    res.json(rewards);
  });
  
  // Get loyalty rewards by tier
  app.get("/api/loyalty/rewards/tier/:tier", async (req: Request, res: Response) => {
    const tier = req.params.tier;
    const validTiers = ["bronze", "silver", "gold", "platinum"];
    
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ 
        message: "Invalid tier, must be one of: bronze, silver, gold, platinum" 
      });
    }
    
    const rewards = await storage.getLoyaltyRewardsByTier(tier);
    res.json(rewards);
  });
  
  // Redeem a loyalty reward
  app.post("/api/user/:userId/loyalty/redeem", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { rewardId } = req.body;
      
      if (typeof rewardId !== 'number') {
        return res.status(400).json({ message: "Reward ID must be a number" });
      }
      
      // Check if user has a loyalty program
      const program = await storage.getLoyaltyProgram(userId);
      if (!program) {
        return res.status(404).json({ message: "No loyalty program found for this user" });
      }
      
      // Check if reward exists
      const reward = await storage.getLoyaltyReward(rewardId);
      if (!reward) {
        return res.status(404).json({ message: "Loyalty reward not found" });
      }
      
      // Attempt to redeem the reward
      const success = await storage.redeemReward(userId, rewardId);
      
      if (success) {
        const updatedProgram = await storage.getLoyaltyProgram(userId);
        res.json({ success: true, program: updatedProgram });
      } else {
        res.status(400).json({ 
          message: "Failed to redeem reward. Check if user has enough points or is in the required tier."
        });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to redeem reward", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
