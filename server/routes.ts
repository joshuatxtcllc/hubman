import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertOrderSchema, insertApplicationSchema, insertBusinessMetricSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard data endpoints
  app.get("/api/dashboard/overview", async (req, res) => {
    try {
      const [applications, metrics, activities] = await Promise.all([
        storage.getApplications(),
        storage.getBusinessMetrics(),
        storage.getActivities(6)
      ]);
      
      res.json({
        applications: applications.slice(0, 8),
        metrics: metrics.slice(0, 4),
        activities
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Applications endpoints
  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ error: "Invalid application data" });
    }
  });

  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.updateApplication(id, req.body);
      res.json(application);
    } catch (error) {
      res.status(400).json({ error: "Failed to update application" });
    }
  });

  // Business metrics endpoints
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getBusinessMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  app.post("/api/metrics", async (req, res) => {
    try {
      const validatedData = insertBusinessMetricSchema.parse(req.body);
      const metric = await storage.createBusinessMetric(validatedData);
      res.status(201).json(metric);
    } catch (error) {
      res.status(400).json({ error: "Invalid metric data" });
    }
  });

  // Activities endpoints
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid activity data" });
    }
  });

  // Customers endpoints
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  // Orders endpoints
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
