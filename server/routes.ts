import express, { type Request, Response } from "express";
import { storage } from "./storage";
import { insertBusinessMetricSchema, insertApplicationSchema, insertActivitySchema } from "@shared/schema";
import { getAllApplicationStatuses } from "./status";
import { createServer } from "http";

export async function registerRoutes(app: express.Application) {
  const server = createServer(app);

  // API Routes for dashboard data - metrics disabled for glass morphism interface
  app.get("/api/metrics", async (req: Request, res: Response) => {
    // Return empty array since we're not using traditional metrics in the glass design
    res.json([]);
  });

  app.get("/api/applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getApplications();
      
      // Transform database applications to match frontend interface
      const transformedApplications = applications.map(app => ({
        id: app.id,
        name: app.name,
        description: app.description || "No description available",
        status: app.status || "active",
        url: "#", // Default URL for internal apps
        lastUpdated: app.createdAt?.toISOString() || new Date().toISOString()
      }));

      // Add some default applications if none exist
      if (transformedApplications.length === 0) {
        const defaultApplications = [
          {
            id: 1,
            name: "Larson Juhl Designer",
            description: "Frame design and customization tool",
            status: "active",
            url: "https://shop.larsonjuhl.com/en-US/lj-design-studio",
            lastUpdated: new Date().toISOString()
          },
          {
            id: 2,
            name: "Kanban Production",
            description: "Production workflow management",
            status: "active", 
            url: "https://kanbanmain-JayFrames.replit.app",
            lastUpdated: new Date().toISOString()
          },
          {
            id: 3,
            name: "Enterprise CRM",
            description: "Customer relationship management",
            status: "active",
            url: "https://enterprise-intelligence-JayFrames.replit.app",
            lastUpdated: new Date().toISOString()
          },
          {
            id: 4,
            name: "POS System",
            description: "Point of sale management",
            status: "maintenance",
            url: "https://frame-craft-pro-JayFrames.replit.app",
            lastUpdated: new Date().toISOString()
          }
        ];
        return res.json(defaultApplications);
      }

      res.json(transformedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const activities = await storage.getActivities(20);
      
      // Transform database activities to match frontend interface
      const transformedActivities = activities.map(activity => ({
        id: activity.id,
        action: activity.action,
        timestamp: activity.createdAt?.toISOString() || new Date().toISOString(),
        status: "completed" // Default status
      }));

      // Add some default activities if none exist
      if (transformedActivities.length === 0) {
        const defaultActivities = [
          {
            id: 1,
            action: "Order #1234 completed and shipped",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            status: "completed"
          },
          {
            id: 2,
            action: "New customer registration: Smith Inc.",
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            status: "completed"
          },
          {
            id: 3,
            action: "Inventory update: 50 new frames added",
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            status: "completed"
          },
          {
            id: 4,
            action: "Weekly backup completed",
            timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            status: "completed"
          },
          {
            id: 5,
            action: "System maintenance scheduled",
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            status: "pending"
          }
        ];
        return res.json(defaultActivities);
      }

      res.json(transformedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Application status monitoring
  app.get("/api/status", async (req: Request, res: Response) => {
    try {
      const statuses = await getAllApplicationStatuses();
      res.json(statuses);
    } catch (error) {
      console.error("Error fetching application statuses:", error);
      res.status(500).json({ message: "Failed to fetch application statuses" });
    }
  });

  // Create new metric
  app.post("/api/metrics", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBusinessMetricSchema.parse(req.body);
      const metric = await storage.createBusinessMetric(validatedData);
      res.status(201).json(metric);
    } catch (error) {
      console.error("Error creating metric:", error);
      res.status(400).json({ message: "Invalid metric data" });
    }
  });

  // Create new application
  app.post("/api/applications", async (req: Request, res: Response) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  // Create new activity
  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  return server;
}