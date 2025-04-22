import { Router, Request } from "express";
import { storage } from "./storage";
import { InsertPromotion, Partner } from "@shared/schema";
import { requirePartner } from "./auth";

// Extend Express Request type to include partner property
declare global {
  namespace Express {
    interface Request {
      partner?: Partner;
    }
  }
}

const partnerRouter = Router();

// Get all cocktails for partner's bar
partnerRouter.get("/cocktails", requirePartner, async (req, res) => {
  try {
    const partner = req.partner;
    if (!partner) {
      return res.status(403).json({ error: "Partner information not available" });
    }
    const cocktails = await storage.getCocktailsByBar(partner.barId);
    res.json(cocktails);
  } catch (error) {
    console.error("Error fetching cocktails:", error);
    res.status(500).json({ error: "Failed to fetch cocktails" });
  }
});

// Get all promotions for partner's bar
partnerRouter.get("/promotions", requirePartner, async (req, res) => {
  try {
    const partner = req.partner;
    if (!partner) {
      return res.status(403).json({ error: "Partner information not available" });
    }
    const promotions = await storage.getPromotionsByBar(partner.barId);
    res.json(promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    res.status(500).json({ error: "Failed to fetch promotions" });
  }
});

// Create a new promotion
partnerRouter.post("/promotions", requirePartner, async (req, res) => {
  try {
    const partner = req.partner;
    if (!partner) {
      return res.status(403).json({ error: "Partner information not available" });
    }
    const promotionData: InsertPromotion = {
      ...req.body,
      barId: partner.barId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    };
    
    const promotion = await storage.createPromotion(promotionData);
    res.status(201).json(promotion);
  } catch (error) {
    console.error("Error creating promotion:", error);
    res.status(500).json({ error: "Failed to create promotion" });
  }
});

// Update a promotion
partnerRouter.patch("/promotions/:id", requirePartner, async (req, res) => {
  try {
    const promotionId = parseInt(req.params.id);
    const partner = req.partner;
    if (!partner) {
      return res.status(403).json({ error: "Partner information not available" });
    }
    
    // Verify the promotion belongs to this partner's bar
    const promotion = await storage.getPromotion(promotionId);
    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }
    
    if (promotion.barId !== partner.barId) {
      return res.status(403).json({ error: "Not authorized to update this promotion" });
    }
    
    // Process dates if they're provided
    const updateData = { ...req.body };
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }
    
    const updatedPromotion = await storage.updatePromotion(promotionId, updateData);
    res.json(updatedPromotion);
  } catch (error) {
    console.error("Error updating promotion:", error);
    res.status(500).json({ error: "Failed to update promotion" });
  }
});

// Delete a promotion
partnerRouter.delete("/promotions/:id", requirePartner, async (req, res) => {
  try {
    const promotionId = parseInt(req.params.id);
    const partner = req.partner;
    if (!partner) {
      return res.status(403).json({ error: "Partner information not available" });
    }
    
    // Verify the promotion belongs to this partner's bar
    const promotion = await storage.getPromotion(promotionId);
    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }
    
    if (promotion.barId !== partner.barId) {
      return res.status(403).json({ error: "Not authorized to delete this promotion" });
    }
    
    await storage.deletePromotion(promotionId);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting promotion:", error);
    res.status(500).json({ error: "Failed to delete promotion" });
  }
});

// Get orders for partner's bar
partnerRouter.get("/orders", requirePartner, async (req, res) => {
  try {
    const partner = req.partner;
    if (!partner) {
      return res.status(403).json({ error: "Partner information not available" });
    }
    const allOrders = await storage.getOrders();
    
    // Filter orders that include cocktails from this bar
    const barOrders = allOrders.filter(order => {
      const items = Array.isArray(order.items) ? order.items : [];
      return items.some((item: any) => item.barId === partner.barId);
    });
    
    res.json(barOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update order status (for orders related to partner's bar)
partnerRouter.patch("/orders/:id/status", requirePartner, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const partner = req.partner;
    if (!partner) {
      return res.status(403).json({ error: "Partner information not available" });
    }
    
    // Verify the order includes items from this partner's bar
    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const items = Array.isArray(order.items) ? order.items : [];
    const relatedToBar = items.some((item: any) => item.barId === partner.barId);
    
    if (!relatedToBar) {
      return res.status(403).json({ error: "Not authorized to update this order" });
    }
    
    const updatedOrder = await storage.updateOrderStatus(orderId, status);
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Get bar analytics
partnerRouter.get("/analytics", requirePartner, async (req, res) => {
  try {
    const partner = req.partner;
    if (!partner) {
      return res.status(403).json({ error: "Partner information not available" });
    }
    const allOrders = await storage.getOrders();
    const promotions = await storage.getPromotionsByBar(partner.barId);
    const cocktails = await storage.getCocktailsByBar(partner.barId);
    
    // Filter orders related to this bar
    const barOrders = allOrders.filter(order => {
      const items = Array.isArray(order.items) ? order.items : [];
      return items.some((item: any) => item.barId === partner.barId);
    });
    
    // Calculate total revenue
    const totalRevenue = barOrders.reduce((sum, order) => {
      const items = Array.isArray(order.items) ? order.items : [];
      const barItems = items.filter((item: any) => item.barId === partner.barId);
      const orderRevenue = barItems.reduce((itemSum, item: any) => {
        return itemSum + (item.price * item.quantity);
      }, 0);
      return sum + orderRevenue;
    }, 0);
    
    // Popular cocktails
    const cocktailCounts: Record<number, { count: number, name: string }> = {};
    barOrders.forEach(order => {
      const items = Array.isArray(order.items) ? order.items : [];
      items.forEach((item: any) => {
        if (item.barId === partner.barId) {
          if (!cocktailCounts[item.id]) {
            cocktailCounts[item.id] = { count: 0, name: item.name };
          }
          cocktailCounts[item.id].count += item.quantity;
        }
      });
    });
    
    const popularCocktails = Object.values(cocktailCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Active promotions
    const activePromotions = promotions.filter(promo => {
      const now = new Date();
      return promo.active && promo.startDate <= now && promo.endDate >= now;
    });
    
    res.json({
      totalRevenue,
      totalOrders: barOrders.length,
      activePromotions: activePromotions.length,
      totalCocktails: cocktails.length,
      popularCocktails
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export { partnerRouter };