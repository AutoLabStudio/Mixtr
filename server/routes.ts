import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertOrderSchema, insertSubscriptionSchema, 
  insertClassEnrollmentSchema, insertLoyaltyProgramSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
