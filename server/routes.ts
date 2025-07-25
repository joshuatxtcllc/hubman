
import { Express } from "express";
import { createServer } from "http";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { applications, businessMetrics, activities } from "@shared/schema";
import { checkApplicationStatus } from "./status";

export function registerRoutes(app: Express) {
  const server = createServer(app);

  // Get applications with status
  app.get("/api/applications", async (req, res) => {
    try {
      const apps = await db.select().from(applications);
      res.json(apps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Get business metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await db.select().from(businessMetrics);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Get recent activities
  app.get("/api/activities", async (req, res) => {
    try {
      const recentActivities = await db.select().from(activities).limit(10);
      res.json(recentActivities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Status check endpoint
  app.get("/api/status/:id", async (req, res) => {
    try {
      const app = await db.select().from(applications).where(eq(applications.id, parseInt(req.params.id)));
      if (!app.length) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      const statusResult = await checkApplicationStatus(app[0].url || "");
      res.json(statusResult);
    } catch (error) {
      res.status(500).json({ error: "Failed to check status" });
    }
  });

  return server;
}
