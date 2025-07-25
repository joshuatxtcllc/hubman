
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  ShoppingCart, 
  CheckSquare, 
  TrendingUp, 
  Users, 
  Package,
  Activity,
  ExternalLink,
  Workflow,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import WorkflowEnhancement from '@/components/WorkflowEnhancement';
import CommunicationCenter from '@/components/CommunicationCenter';
import WholesaleResources from '@/components/WholesaleResources';

interface Metric {
  id: number;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface Application {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  url: string;
  lastUpdated: string;
}

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, applicationsRes, activitiesRes] = await Promise.all([
          fetch('/api/metrics'),
          fetch('/api/applications'),
          fetch('/api/activities')
        ]);

        const metricsData = await metricsRes.json();
        const applicationsData = await applicationsRes.json();
        const activitiesData = await activitiesRes.json();

        setMetrics(metricsData);
        setApplications(applicationsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'monthly revenue': return DollarSign;
      case 'orders processed': return ShoppingCart;
      case 'completion rate': return CheckSquare;
      case 'growth rate': return TrendingUp;
      case 'active customers': return Users;
      case 'inventory items': return Package;
      default: return Activity;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Jay's Frames Command Center</h1>
              <p className="text-slate-600 mt-2">Business Intelligence & Workflow Automation</p>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-green-100 text-green-800 border-green-300">
              All Systems Operational
            </Badge>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="glass-card rounded-2xl shadow-lg p-2">
            <TabsList className="grid w-full grid-cols-4 bg-transparent">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">Overview</TabsTrigger>
              <TabsTrigger value="workflows" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">
                <Workflow className="w-4 h-4 mr-2" />
                Workflows
              </TabsTrigger>
              <TabsTrigger value="communication" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">
                <MessageSquare className="w-4 h-4 mr-2" />
                Communication
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">
                <BookOpen className="w-4 h-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Business Applications Grid */}
            <div className="glass-card rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Business Applications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                  {
                    name: "Larson Juhl Designer",
                    description: "Frame design studio",
                    url: "https://shop.larsonjuhl.com/en-US/lj-design-studio",
                    icon: "🎯",
                    gradient: "from-red-500 to-red-600",
                    status: "active"
                  },
                  {
                    name: "POS System",
                    description: "Point of sale calculator",
                    url: "https://frame-craft-pro-JayFrames.replit.app",
                    icon: "💰",
                    gradient: "from-green-500 to-green-600",
                    status: "active"
                  },
                  {
                    name: "Kanban Production",
                    description: "Production workflow",
                    url: "https://kanbanmain-JayFrames.replit.app",
                    icon: "📋",
                    gradient: "from-blue-500 to-blue-600",
                    status: "active"
                  },
                  {
                    name: "Main Website",
                    description: "Business website",
                    url: "https://frame-houston-JayFrames.replit.app",
                    icon: "🌐",
                    gradient: "from-purple-500 to-purple-600",
                    status: "active"
                  },
                  {
                    name: "Enterprise CRM",
                    description: "Customer management",
                    url: "https://enterprise-intelligence-JayFrames.replit.app",
                    icon: "👥",
                    gradient: "from-yellow-500 to-yellow-600",
                    status: "active"
                  },
                  {
                    name: "Business Analyzer",
                    description: "Listing analysis",
                    url: "https://business-listing-analyzer-JayFrames.replit.app",
                    icon: "📊",
                    gradient: "from-indigo-500 to-indigo-600",
                    status: "active"
                  }
                ].map((app, index) => (
                  <div key={index} className="glass-card rounded-xl p-4 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <div className={`w-12 h-12 bg-gradient-to-r ${app.gradient} rounded-xl flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition-transform`}>
                      {app.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{app.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">{app.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {app.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(app.url, '_blank')}
                        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Workflow className="w-5 h-5 mr-2 text-blue-600" />
                  Quick Workflow Actions
                </h3>
                <div className="space-y-3">
                  {[
                    { action: "Start New Order Workflow", time: "~10 min", icon: "🚀" },
                    { action: "Generate Invoice", time: "~2 min", icon: "📄" },
                    { action: "Update Production Status", time: "~1 min", icon: "⚡" },
                    { action: "Send Customer Update", time: "~1 min", icon: "📧" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium text-slate-900">{item.action}</span>
                      </div>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  System Status
                </h3>
                <div className="space-y-3">
                  {[
                    { system: "All Applications", status: "Operational", color: "green" },
                    { system: "Workflow Automation", status: "Active", color: "green" },
                    { system: "Communication Center", status: "Ready", color: "green" },
                    { system: "Database Sync", status: "Connected", color: "green" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="text-sm font-medium text-slate-900">{item.system}</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-${item.color}-500 animate-pulse`}></div>
                        <span className="text-xs text-slate-600">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowEnhancement />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationCenter />
          </TabsContent>

          <TabsContent value="resources">
            <WholesaleResources />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
