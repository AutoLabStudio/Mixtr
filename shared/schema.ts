import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Bar model
export const bars = pgTable("bars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: doublePrecision("rating").notNull(),
  deliveryTime: text("delivery_time").notNull(),
  tags: text("tags").array().notNull(),
});

// Cocktail model
export const cocktails = pgTable("cocktails", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  ingredients: text("ingredients").array().notNull(),
  imageUrl: text("image_url").notNull(),
  barId: integer("bar_id").notNull(),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating").notNull(),
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  items: jsonb("items").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  deliveryFee: doublePrecision("delivery_fee").notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryTime: timestamp("delivery_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Special offer model
export const specialOffers = pgTable("special_offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  discount: doublePrecision("discount"),
  originalPrice: doublePrecision("original_price"),
  discountedPrice: doublePrecision("discounted_price"),
  promoCode: text("promo_code"),
  type: text("type").notNull(),
});

// Insert schemas
export const insertBarSchema = createInsertSchema(bars).omit({
  id: true,
});

export const insertCocktailSchema = createInsertSchema(cocktails).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertSpecialOfferSchema = createInsertSchema(specialOffers).omit({
  id: true,
});

// Interface types
export type Bar = typeof bars.$inferSelect;
export type InsertBar = z.infer<typeof insertBarSchema>;

export type Cocktail = typeof cocktails.$inferSelect;
export type InsertCocktail = z.infer<typeof insertCocktailSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type SpecialOffer = typeof specialOffers.$inferSelect;
export type InsertSpecialOffer = z.infer<typeof insertSpecialOfferSchema>;

// CartItem interface for the frontend
export interface CartItem {
  id: number;
  name: string;
  price: number;
  barName: string;
  imageUrl: string;
  quantity: number;
}
