import { 
  users, 
  customers, 
  orders, 
  applications, 
  businessMetrics, 
  activities,
  statusUpdates,
  type User, 
  type InsertUser,
  type Customer,
  type InsertCustomer,
  type Order,
  type InsertOrder,
  type Application,
  type InsertApplication,
  type BusinessMetric,
  type InsertBusinessMetric,
  type Activity,
  type InsertActivity
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Customer methods
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;

  // Order methods
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;

  // Application methods
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application>;

  // Business Metrics methods
  getBusinessMetrics(): Promise<BusinessMetric[]>;
  getBusinessMetric(id: number): Promise<BusinessMetric | undefined>;
  createBusinessMetric(metric: InsertBusinessMetric): Promise<BusinessMetric>;

  // Activity methods
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values(insertCustomer)
      .returning();
    return customer;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  // Application methods
  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.createdAt));
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async updateApplication(id: number, updateData: Partial<InsertApplication>): Promise<Application> {
    const [application] = await db
      .update(applications)
      .set(updateData)
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  // Business Metrics methods
  async getBusinessMetrics(): Promise<BusinessMetric[]> {
    return await db.select().from(businessMetrics).orderBy(desc(businessMetrics.recordedAt));
  }

  async getBusinessMetric(id: number): Promise<BusinessMetric | undefined> {
    const [metric] = await db.select().from(businessMetrics).where(eq(businessMetrics.id, id));
    return metric || undefined;
  }

  async createBusinessMetric(insertMetric: InsertBusinessMetric): Promise<BusinessMetric> {
    const [metric] = await db
      .insert(businessMetrics)
      .values(insertMetric)
      .returning();
    return metric;
  }

  // Activity methods
  async getActivities(limit = 10): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.createdAt)).limit(limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  // Order tracking methods
  async getOrders() {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrderByNumber(orderNumber: string) {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order;
  }

  async createOrder(order: any) {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(orderNumber: string, status: string, notes?: string) {
    const order = await this.getOrderByNumber(orderNumber);
    if (!order) throw new Error('Order not found');

    // Update order status
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.orderNumber, orderNumber))
      .returning();

    // Log status change
    // @ts-expect-error
    await db.insert(statusUpdates).values({
      orderId: order.id,
      oldStatus: order.status,
      newStatus: status,
      notes: notes || ''
    });

    return updatedOrder;
  }

  async getOrderStatusHistory(orderId: number) {
    return await db
      .select()
      .from(statusUpdates)
      .where(eq(statusUpdates.orderId, orderId))
      .orderBy(desc(statusUpdates.createdAt));
  }
}

export const storage = new DatabaseStorage();