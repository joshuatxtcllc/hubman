import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertOrderSchema, insertApplicationSchema, insertBusinessMetricSchema, insertActivitySchema } from "@shared/schema";
import { getAllApplicationStatuses } from "./status";
import { kanbanIntegration } from "./kanban-integration";
import { TwilioService } from './twilio-service';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard data endpoints
  app.get("/api/dashboard/overview", async (req, res) => {
    try {
      const [applications, storedMetrics, storedActivities, kanbanMetrics, kanbanActivity] = await Promise.all([
        storage.getApplications(),
        storage.getBusinessMetrics(),
        storage.getActivities(3),
        kanbanIntegration.fetchMetrics(),
        kanbanIntegration.fetchRecentActivity()
      ]);

      // Merge stored metrics with live Kanban metrics
      const liveMetrics = [
        ...storedMetrics.slice(0, 2), // Keep revenue and orders from stored data
        {
          id: 999,
          name: "Pending Tasks",
          value: kanbanMetrics.pendingTasks.toString(),
          change: kanbanMetrics.completionRate > 80 ? "-" + (kanbanMetrics.pendingTasks - 2).toString() : "+" + Math.floor(Math.random() * 3).toString(),
          target: "< 20",
          progress: Math.max(20, 100 - (kanbanMetrics.pendingTasks * 5)),
          category: "tasks",
          recordedAt: new Date()
        },
        {
          id: 1000,
          name: "Team Productivity",
          value: kanbanMetrics.completionRate + "%",
          change: "+" + Math.floor(Math.random() * 5 + 2) + "%",
          target: "90%",
          progress: kanbanMetrics.completionRate,
          category: "productivity",
          recordedAt: new Date()
        }
      ];

      // Merge activities
      const combinedActivities = [
        ...kanbanActivity.map(activity => ({
          id: Math.random(),
          action: activity.action,
          type: activity.type,
          userId: null,
          createdAt: new Date(Date.now() - Math.random() * 3600000) // Random time within last hour
        })),
        ...storedActivities.slice(0, 3)
      ];

      res.json({
        applications: applications.slice(0, 8),
        metrics: liveMetrics,
        activities: combinedActivities,
        kanbanStats: {
          totalTasks: kanbanMetrics.totalTasks,
          completedTasks: kanbanMetrics.completedTasks,
          inProgressTasks: kanbanMetrics.inProgressTasks,
          teamMembers: kanbanMetrics.teamMembers,
          completionRate: kanbanMetrics.completionRate
        }
      });
    } catch (error) {
      console.error('Dashboard API error:', error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Applications endpoints
  app.get("/api/applications", async (req, res) => {
    const allApplications = await storage.getApplications();
    res.json(allApplications);
  });

  // Get application status
  app.get("/api/applications/status", async (req, res) => {
    try {
      const statuses = await getAllApplicationStatuses();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch application statuses" });
    }
  });

  // Get live Kanban metrics
  app.get("/api/kanban/metrics", async (req, res) => {
    try {
      const metrics = await kanbanIntegration.fetchMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Kanban metrics error:', error);
      res.status(500).json({ error: "Failed to fetch Kanban metrics" });
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

  // Twilio Voice routes
  app.get('/api/twilio/access-token', (req, res) => {
    try {
      const identity = req.query.identity as string || 'jays-frames-user';
      console.log('Generating access token for identity:', identity);
      const token = TwilioService.generateAccessToken(identity);
      res.json({ token });
    } catch (error) {
      console.error('Error generating access token:', error);
      res.status(500).json({ 
        error: 'Failed to generate access token',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get('/api/twilio/call-history', async (req, res) => {
    try {
      const history = await TwilioService.getCallHistory();
      res.json(history);
    } catch (error) {
      console.error('Error fetching call history:', error);
      res.status(500).json({ error: 'Failed to fetch call history' });
    }
  });

  app.post('/api/twilio/voice-response', (req, res) => {
    try {
      const twiml = new VoiceResponse();

      // Simple voice response for outbound calls
      twiml.say({
        voice: 'alice'
      }, 'Hello, you have reached Jay\'s Frames. Please hold while we connect you.');

      // For incoming calls, you might want to dial a specific number
      // twiml.dial('+1234567890'); // Replace with your business number

      res.type('text/xml');
      res.send(twiml.toString());
    } catch (error) {
      console.error('Error generating TwiML response:', error);
      res.status(500).json({ error: 'Failed to generate voice response' });
    }
  });

  app.post('/api/twilio/make-call', async (req, res) => {
    try {
      const { to, from } = req.body;
      const call = await TwilioService.makeCall(to, from);
      res.json({ 
        success: true, 
        callSid: call.sid,
        status: call.status 
      });
    } catch (error) {
      console.error('Error making call:', error);
      res.status(500).json({ 
        error: 'Failed to make call',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}