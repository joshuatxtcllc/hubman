import express, { type Request, Response } from "express";
import { storage } from "./storage";
import { insertBusinessMetricSchema, insertApplicationSchema, insertActivitySchema } from "@shared/schema";
import { getAllApplicationStatuses } from "./status";
import { createServer } from "http";
import { TwilioService } from "./twilio-service";
import { StripeService } from "./stripe-service";

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

  // Twilio Voice API routes
  app.get("/api/twilio/access-token", async (req: Request, res: Response) => {
    try {
      const identity = (req.query.identity as string) || 'jays-frames-user';

      // Validate Twilio credentials
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        return res.status(500).json({
          error: 'Missing Twilio credentials',
          message: 'TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN environment variables are not set.'
        });
      }

      const token = TwilioService.generateAccessToken(identity);
      res.json({
        token,
        identity,
        success: true
      });
    } catch (error) {
      console.error("Error generating access token:", error);
      res.status(500).json({
        error: 'Failed to generate access token',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/twilio/call-history", async (req: Request, res: Response) => {
    try {
      const history = await TwilioService.getCallHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching call history:", error);
      res.status(500).json({ message: "Failed to fetch call history" });
    }
  });

  app.post("/api/twilio/make-call", async (req: Request, res: Response) => {
    try {
      const { to, from } = req.body;
      const call = await TwilioService.makeCall(to, from);
      res.json(call);
    } catch (error) {
      console.error("Error making call:", error);
      res.status(500).json({ message: "Failed to make call" });
    }
  });

  app.post("/api/twilio/voice-response", async (req: Request, res: Response) => {
    try {
      const twiml = TwilioService.generateVoiceResponse();
      res.type('text/xml');
      res.send(twiml);
    } catch (error) {
      console.error("Error generating voice response:", error);
      res.status(500).json({ message: "Failed to generate voice response" });
    }
  });

  // Order Tracking API Routes
  const ORDER_STATUSES = {
    'received': 'Order received and in queue',
    'measuring': 'Taking measurements and preparing materials',
    'cutting': 'Cutting frame pieces',
    'assembly': 'Assembling your custom frame',
    'quality_check': 'Final quality inspection',
    'ready': 'Ready for pickup/delivery',
    'completed': 'Order completed',
    'cancelled': 'Order cancelled'
  };

  // SMS sending function for order updates
  async function sendOrderUpdate(phone: string, orderNumber: string, status: string, notes: string = '') {
    if (!phone || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('SMS not sent - missing phone number or Twilio config');
      return false;
    }

    try {
      const message = `🖼️ Jay's Frames Update\n\nOrder #${orderNumber}\nStatus: ${ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]}\n${notes ? '\nNote: ' + notes : ''}\n\nQuestions? Reply to this message!`;

      await TwilioService.makeCall(phone, process.env.TWILIO_PHONE_NUMBER);
      console.log(`SMS sent to ${phone} for order ${orderNumber}`);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  // Get all orders
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get single order by order number
  app.get("/api/orders/:orderNumber", async (req: Request, res: Response) => {
    try {
      const orderNumber = req.params.orderNumber;
      const order = await storage.getOrderByNumber(orderNumber);

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Create new order
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const {
        customer_name,
        customer_phone,
        customer_email,
        frame_type,
        dimensions,
        special_instructions,
        sms_enabled
      } = req.body;

      // Generate order number
      const orderNumber = 'JF' + Date.now().toString().slice(-6);

      const orderData = {
        orderNumber,
        customerName: customer_name,
        customerPhone: customer_phone,
        customerEmail: customer_email,
        frameType: frame_type,
        dimensions,
        specialInstructions: special_instructions,
        status: 'received',
        smsEnabled: sms_enabled || true
      };

      const order = await storage.createOrder(orderData);

      // Send confirmation SMS if enabled
      if (sms_enabled && customer_phone) {
        await sendOrderUpdate(
          customer_phone,
          orderNumber,
          'received',
          'We\'ll keep you updated on your custom frame progress!'
        );
      }

      res.json({
        id: order.id,
        order_number: orderNumber,
        message: 'Order created successfully'
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Update order status
  app.put("/api/orders/:orderNumber/status", async (req: Request, res: Response) => {
    try {
      const orderNumber = req.params.orderNumber;
      const { status, notes } = req.body;

      if (!ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const order = await storage.getOrderByNumber(orderNumber);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      const oldStatus = order.status;
      await storage.updateOrderStatus(orderNumber, status, notes);

      // Send SMS update if enabled
      if (order.smsEnabled && order.customerPhone) {
        await sendOrderUpdate(order.customerPhone, orderNumber, status, notes);
      }

      res.json({
        message: 'Order status updated successfully',
        order_number: orderNumber,
        old_status: oldStatus,
        new_status: status
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Customer order lookup (public endpoint)
  app.get("/api/public/orders/:orderNumber", async (req: Request, res: Response) => {
    try {
      const orderNumber = req.params.orderNumber;
      const order = await storage.getOrderByNumber(orderNumber);

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Return only public information
      res.json({
        order_number: order.orderNumber,
        customer_name: order.customerName,
        frame_type: order.frameType,
        dimensions: order.dimensions,
        status: order.status,
        status_description: ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES],
        created_at: order.createdAt,
        updated_at: order.updatedAt
      });
    } catch (error) {
      console.error("Error fetching public order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Handle Twilio webhook for incoming SMS
  app.post("/webhook/sms", (req: Request, res: Response) => {
    const { From, Body } = req.body;
    console.log(`Received SMS from ${From}: ${Body}`);

    res.set('Content-Type', 'text/xml');
    res.send(`<Response><Message>Thanks for your message! We'll get back to you soon. For immediate assistance, call us directly.</Message></Response>`);
  });

  // Handle Twilio webhook for incoming voice calls
  app.post("/webhook/voice", (req: Request, res: Response) => {
    console.log('Incoming call received from:', req.body.From);
    console.log('Call SID:', req.body.CallSid);

    res.set('Content-Type', 'text/xml');
    res.send(`<Response><Say voice="alice">Thank you for calling Jay's Frames! For order updates, please text your order number to this number, or visit our website at jaysframes.com. Have a great day!</Say><Hangup/></Response>`);
  });

  // Stripe payment routes
  app.post("/api/stripe/create-checkout", async (req: Request, res: Response) => {
    try {
      const { amount, orderId, customerEmail } = req.body;

      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({
          error: 'Stripe not configured',
          message: 'STRIPE_SECRET_KEY environment variable is not set.'
        });
      }

      const session = await StripeService.createCheckoutSession({
        amount,
        currency: 'usd',
        customerEmail,
        orderId,
        successUrl: `${req.protocol}://${req.get('host')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${req.protocol}://${req.get('host')}/payment-cancelled`
      });

      res.json({
        sessionId: session.id,
        url: session.url,
        success: true
      });
    } catch (error) {
      console.error("Error creating Stripe checkout:", error);
      res.status(500).json({
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/stripe/session/:sessionId", async (req: Request, res: Response) => {
    try {
      const session = await StripeService.retrieveSession(req.params.sessionId);
      res.json(session);
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
      res.status(500).json({ message: "Failed to retrieve session" });
    }
  });

  app.get("/api/stripe/payment-history", async (req: Request, res: Response) => {
    try {
      const history = await StripeService.getPaymentHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      res.status(500).json({ message: "Failed to fetch payment history" });
    }
  });

  // Stripe webhook handler
  app.post("/webhook/stripe", express.raw({type: 'application/json'}), (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Payment succeeded for order:', session.metadata?.orderId);
      
      // Update order status to paid
      if (session.metadata?.orderId) {
        storage.updateOrderStatus(session.metadata.orderId, 'paid', 'Payment received via Stripe');
      }
    }

    res.json({received: true});
  });

  return server;
}