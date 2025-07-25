
export interface ApplicationStatus {
  id: number;
  name: string;
  url: string;
  status: 'Active' | 'Down' | 'Maintenance';
  responseTime: number;
  lastChecked: Date;
}

const applications = [
  { id: 1, name: "Main Website", url: "https://frame-houston-JayFrames.replit.app" },
  { id: 2, name: "Virtual Designer", url: "https://jays-frames-ai-JayFrames.replit.app" },
  { id: 3, name: "Kanban Production", url: "https://4ac71b60-f981-4aba-8f8c-73dde0fc14da-00-3gz99m4rduv0e.kirk.replit.dev/kanban" },
  { id: 4, name: "Enterprise CRM", url: "https://enterprise-intelligence-JayFrames.replit.app" },
  { id: 5, name: "POS System", url: "https://frame-craft-pro-JayFrames.replit.app" },
  { id: 6, name: "Business Listing Analyzer", url: "https://business-listing-analyzer-JayFrames.replit.app" },
  { id: 7, name: "Larson Juhl Designer", url: "https://shop.larsonjuhl.com/en-US/lj-design-studio?customizable=#maincontent" }
];

export async function checkApplicationStatus(url: string): Promise<{ status: string; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    return {
      status: response.ok ? 'Active' : 'Down',
      responseTime
    };
  } catch (error) {
    return {
      status: 'Down',
      responseTime: Date.now() - startTime
    };
  }
}

export async function getAllApplicationStatuses(): Promise<ApplicationStatus[]> {
  const statusPromises = applications.map(async (app) => {
    const { status, responseTime } = await checkApplicationStatus(app.url);
    
    return {
      id: app.id,
      name: app.name,
      url: app.url,
      status: status as 'Active' | 'Down' | 'Maintenance',
      responseTime,
      lastChecked: new Date()
    };
  });
  
  return Promise.all(statusPromises);
}
