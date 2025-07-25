import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  url: text("url"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  activeUsers: integer("active_users").default(0),
  uptime: decimal("uptime", { precision: 5, scale: 2 }).default('99.9'),
  priority: varchar("priority", { length: 10 }).default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessMetrics = pgTable("business_metrics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  change: text("change"),
  target: text("target"),
  progress: integer("progress"),
  category: varchar("category", { length: 50 }),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  type: varchar("type", { length: 50 }),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  name: true,
  email: true,
  phone: true,
  address: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerId: true,
  status: true,
  totalAmount: true,
  description: true,
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  name: true,
  description: true,
  icon: true,
  url: true,
  status: true,
  activeUsers: true,
  uptime: true,
  priority: true,
});

export const insertBusinessMetricSchema = createInsertSchema(businessMetrics).pick({
  name: true,
  value: true,
  change: true,
  target: true,
  progress: true,
  category: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  action: true,
  type: true,
  userId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertBusinessMetric = z.infer<typeof insertBusinessMetricSchema>;
export type BusinessMetric = typeof businessMetrics.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
