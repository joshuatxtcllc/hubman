
import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jay's Frames Dashboard</h1>
            <p className="text-gray-600 mt-2">Business Intelligence & Workflow Management</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Live Data
          </Badge>
        </div>

        <Separator />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">
              <Workflow className="w-4 h-4 mr-2" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="communication">
              <MessageSquare className="w-4 h-4 mr-2" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="resources">
              <BookOpen className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric) => {
                const Icon = getMetricIcon(metric.name);
                return (
                  <Card key={metric.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {metric.name}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                      <div className={`text-xs flex items-center mt-1 ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`h-3 w-3 mr-1 ${
                          metric.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        {metric.change}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Applications Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{app.name}</h3>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Updated: {new Date(app.lastUpdated).toLocaleDateString()}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(app.url, '_blank')}
                          className="text-xs"
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
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
