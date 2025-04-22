import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, jsonb, date } from "drizzle-orm/pg-core";
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
  location: text("location").notNull().default(""),
  latitude: doublePrecision("latitude").notNull().default(0),
  longitude: doublePrecision("longitude").notNull().default(0),
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

// Subscription model
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: doublePrecision("price").notNull(),
  frequency: text("frequency").notNull(), // weekly, biweekly, monthly
  preferences: jsonb("preferences").notNull(), // spirit preferences, flavor preferences
  active: boolean("active").default(true),
  nextDeliveryDate: timestamp("next_delivery_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mixology Class model
export const mixologyClasses = pgTable("mixology_classes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  instructorName: text("instructor_name").notNull(),
  barId: integer("bar_id").notNull(),
  price: doublePrecision("price").notNull(),
  duration: integer("duration").notNull(), // in minutes
  date: timestamp("date").notNull(),
  capacity: integer("capacity").notNull(),
  enrolled: integer("enrolled").default(0),
  ingredients: jsonb("ingredients").notNull(), // list of ingredients that will be delivered
  level: text("level").notNull(), // beginner, intermediate, advanced
  videoUrl: text("video_url"),
});

// Class Enrollment model
export const classEnrollments = pgTable("class_enrollments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  classId: integer("class_id").notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  status: text("status").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
});

// Loyalty Program model
export const loyaltyProgram = pgTable("loyalty_program", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  points: integer("points").default(0),
  tier: text("tier").notNull(), // bronze, silver, gold, platinum
  enrollmentDate: timestamp("enrollment_date").defaultNow().notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

// Loyalty Reward model
export const loyaltyRewards = pgTable("loyalty_rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  pointsCost: integer("points_cost").notNull(),
  tier: text("tier").notNull(), // minimum tier required
  type: text("type").notNull(), // free drink, discount, exclusive access, etc.
  active: boolean("active").default(true),
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

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertMixologyClassSchema = createInsertSchema(mixologyClasses).omit({
  id: true,
});

export const insertClassEnrollmentSchema = createInsertSchema(classEnrollments).omit({
  id: true,
  purchaseDate: true,
});

export const insertLoyaltyProgramSchema = createInsertSchema(loyaltyProgram).omit({
  id: true,
  points: true,
  enrollmentDate: true,
  lastActivity: true,
});

export const insertLoyaltyRewardSchema = createInsertSchema(loyaltyRewards).omit({
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

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type MixologyClass = typeof mixologyClasses.$inferSelect;
export type InsertMixologyClass = z.infer<typeof insertMixologyClassSchema>;

export type ClassEnrollment = typeof classEnrollments.$inferSelect;
export type InsertClassEnrollment = z.infer<typeof insertClassEnrollmentSchema>;

export type LoyaltyProgram = typeof loyaltyProgram.$inferSelect;
export type InsertLoyaltyProgram = z.infer<typeof insertLoyaltyProgramSchema>;

export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type InsertLoyaltyReward = z.infer<typeof insertLoyaltyRewardSchema>;

// CartItem interface for the frontend
export interface CartItem {
  id: number;
  name: string;
  price: number;
  barName: string;
  imageUrl: string;
  quantity: number;
}
