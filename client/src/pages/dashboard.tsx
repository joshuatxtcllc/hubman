
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
  BookOpen,
  Phone
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
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now since API calls are failing
        setMetrics([
          { id: 1, name: 'Monthly Revenue', value: '$12,543', change: '+12%', trend: 'up' },
          { id: 2, name: 'Orders Processed', value: '847', change: '+8%', trend: 'up' },
          { id: 3, name: 'Completion Rate', value: '98.2%', change: '+2%', trend: 'up' },
          { id: 4, name: 'Active Customers', value: '234', change: '+15%', trend: 'up' }
        ]);
        
        setApplications([
          { id: 1, name: 'POS System', description: 'Point of Sale', status: 'active', url: 'https://frame-craft-pro-JayFrames.replit.app', lastUpdated: '2 min ago' },
          { id: 2, name: 'Kanban Board', description: 'Production Tracking', status: 'active', url: 'https://kanbanmain-JayFrames.replit.app', lastUpdated: '5 min ago' },
          { id: 3, name: 'Main Website', description: 'Customer Portal', status: 'active', url: 'https://frame-houston-JayFrames.replit.app', lastUpdated: '1 hour ago' }
        ]);
        
        setActivities([
          { id: 1, action: 'New order processed', timestamp: '2 min ago', status: 'completed' },
          { id: 2, action: 'Invoice generated', timestamp: '5 min ago', status: 'completed' },
          { id: 3, action: 'Customer email sent', timestamp: '10 min ago', status: 'completed' }
        ]);
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

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = getMetricIcon(metric.name);
          return (
            <Card key={metric.id} className="glass-card border border-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Applications Grid */}
      <Card className="glass-card border border-white/30">
        <CardHeader>
          <CardTitle>Business Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {applications.map((app) => (
              <div key={app.id} className="p-4 border rounded-lg bg-white/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{app.name}</h3>
                  <Badge className={getStatusColor(app.status)}>
                    {app.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{app.lastUpdated}</span>
                  <Button 
                    size="sm" 
                    onClick={() => window.open(app.url, '_blank')}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="glass-card border border-white/30">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="glass-card rounded-3xl shadow-xl p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">J</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Jay's Frames</h1>
                <p className="text-slate-600 text-sm">Command Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                All Systems Operational
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="glass-card rounded-2xl shadow-lg p-3 border border-white/30">
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeView === 'dashboard' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white/60 text-slate-700 hover:bg-white/80'
              }`}
            >
              Dashboard Overview
            </button>
            <button 
              onClick={() => setActiveView('workflow')}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeView === 'workflow' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white/60 text-slate-700 hover:bg-white/80'
              }`}
            >
              Workflow Intelligence
            </button>
            <button 
              onClick={() => setActiveView('resources')}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeView === 'resources' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white/60 text-slate-700 hover:bg-white/80'
              }`}
            >
              Wholesale Resources
            </button>
            <button 
              onClick={() => setActiveView('communication')}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeView === 'communication' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white/60 text-slate-700 hover:bg-white/80'
              }`}
            >
              Communication
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {activeView === 'dashboard' && renderDashboardOverview()}
          {activeView === 'workflow' && <WorkflowEnhancement />}
          {activeView === 'resources' && <WholesaleResources />}
          {activeView === 'communication' && <CommunicationCenter />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
