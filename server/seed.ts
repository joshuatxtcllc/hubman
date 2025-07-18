import { storage } from "./storage";

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Seed applications
    const applications = [
      {
        name: "POS System",
        description: "Sales & Inventory",
        icon: "🏪",
        status: "active" as const,
        activeUsers: 47,
        uptime: "99.9",
        priority: "high" as const,
      },
      {
        name: "Frame Designer",
        description: "Virtual Design Tool",
        icon: "🎨",
        status: "beta" as const,
        activeUsers: 23,
        uptime: "98.2",
        priority: "high" as const,
      },
      {
        name: "AI Assistant",
        description: "Smart Recommendations",
        icon: "🤖",
        status: "beta" as const,
        activeUsers: 12,
        uptime: "97.8",
        priority: "medium" as const,
      },
      {
        name: "Notifications",
        description: "System Alerts",
        icon: "🔔",
        status: "active" as const,
        activeUsers: 8,
        uptime: "100.0",
        priority: "medium" as const,
      },
      {
        name: "Analytics",
        description: "Business Intelligence",
        icon: "📊",
        status: "active" as const,
        activeUsers: 5,
        uptime: "99.5",
        priority: "high" as const,
      },
      {
        name: "Print Queue",
        description: "Art Production",
        icon: "🖨️",
        status: "beta" as const,
        activeUsers: 2,
        uptime: "96.1",
        priority: "low" as const,
      },
      {
        name: "QR Codes",
        description: "Product Tracking",
        icon: "📱",
        status: "beta" as const,
        activeUsers: 3,
        uptime: "98.7",
        priority: "low" as const,
      },
      {
        name: "Locations",
        description: "Asset Tracking",
        icon: "📍",
        status: "beta" as const,
        activeUsers: 12,
        uptime: "99.1",
        priority: "medium" as const,
      },
    ];

    for (const app of applications) {
      await storage.createApplication(app);
    }

    // Seed business metrics
    const metrics = [
      {
        name: "Monthly Revenue",
        value: "$24,580",
        change: "+12%",
        target: "$25,000",
        progress: 98,
        category: "revenue",
      },
      {
        name: "Active Orders",
        value: "347",
        change: "+8%",
        target: "350",
        progress: 99,
        category: "orders",
      },
      {
        name: "Pending Tasks",
        value: "24",
        change: "-12",
        target: "< 20",
        progress: 80,
        category: "tasks",
      },
      {
        name: "Total Customers",
        value: "1,248",
        change: "+24%",
        target: "1,300",
        progress: 96,
        category: "customers",
      },
    ];

    for (const metric of metrics) {
      await storage.createBusinessMetric(metric);
    }

    // Seed activities
    const activities = [
      {
        action: "New order #1247 received",
        type: "order",
        userId: null,
      },
      {
        action: "Frame design completed",
        type: "design",
        userId: null,
      },
      {
        action: "Payment processed ($450)",
        type: "payment",
        userId: null,
      },
      {
        action: "Inventory updated",
        type: "inventory",
        userId: null,
      },
      {
        action: "New customer registered",
        type: "customer",
        userId: null,
      },
      {
        action: "Print job completed",
        type: "print",
        userId: null,
      },
    ];

    for (const activity of activities) {
      await storage.createActivity(activity);
    }

    // Seed customers
    const customers = [
      {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "(555) 123-4567",
        address: "123 Main St, City, State 12345",
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "(555) 234-5678",
        address: "456 Oak Ave, City, State 12345",
      },
      {
        name: "Michael Brown",
        email: "michael.brown@email.com",
        phone: "(555) 345-6789",
        address: "789 Pine Rd, City, State 12345",
      },
    ];

    for (const customer of customers) {
      await storage.createCustomer(customer);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };