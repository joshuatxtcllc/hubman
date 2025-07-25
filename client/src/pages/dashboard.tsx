import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Phone,
  Layers,
  Settings
} from 'lucide-react';
import WorkflowEnhancement from '@/components/WorkflowEnhancement';
import WholesaleResources from '@/components/WholesaleResources';
import CommunicationCenter from '@/components/CommunicationCenter';

interface Application {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  url: string | null;
  status: string;
  activeUsers: number | null;
  uptime: string | null;
  priority: string | null;
  createdAt: Date | null;
}

interface BusinessMetric {
  id: number;
  name: string;
  value: string;
  change: string | null;
  target: string | null;
  progress: number | null;
  category: string | null;
  recordedAt: Date | null;
}

interface Activity {
  id: number;
  action: string;
  type: string | null;
  userId: number | null;
  createdAt: Date | null;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch applications data
  const { data: applications = [], isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  // Fetch business metrics
  const { data: metrics = [], isLoading: metricsLoading } = useQuery<BusinessMetric[]>({
    queryKey: ['/api/metrics'],
  });

  // Fetch recent activities
  const { data: activities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'down': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getChangeIcon = (change: string | null) => {
    if (!change) return null;
    if (change.includes('+')) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (change.includes('-')) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'revenue': return <DollarSign className="w-5 h-5" />;
      case 'orders': return <Activity className="w-5 h-5" />;
      case 'customers': return <Users className="w-5 h-5" />;
      case 'tasks': return <CheckCircle className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Jay's Frames Business Intelligence
              </h1>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              All Systems Active
            </Badge>
            <Button variant="ghost" size="sm" data-testid="button-settings">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="workflow" data-testid="tab-workflow">Workflow Intelligence</TabsTrigger>
            <TabsTrigger value="wholesale" data-testid="tab-wholesale">Wholesale Resources</TabsTrigger>
            <TabsTrigger value="communication" data-testid="tab-communication">Communication</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-white/20">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                metrics.map((metric) => (
                  <Card key={metric.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-white/20 hover:bg-white/70 transition-all duration-200" data-testid={`card-metric-${metric.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {metric.name}
                        </CardTitle>
                        {getCategoryIcon(metric.category)}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white" data-testid={`text-value-${metric.id}`}>
                          {metric.value}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
                          {getChangeIcon(metric.change)}
                          <span>{metric.change} from last month</span>
                        </div>
                        {metric.progress && metric.target && (
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress to {metric.target}</span>
                              <span>{metric.progress}%</span>
                            </div>
                            <Progress value={metric.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Business Applications Grid */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Business Applications</span>
                </CardTitle>
                <CardDescription>
                  Real-time status monitoring of your integrated business tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-4 rounded-lg border animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {applications.map((app) => (
                      <div key={app.id} className="p-4 rounded-lg border bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200" data-testid={`card-app-${app.id}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(app.status)}`}></div>
                            <div>
                              <h3 className="font-medium text-slate-900 dark:text-white" data-testid={`text-app-name-${app.id}`}>
                                {app.name}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {app.description}
                              </p>
                            </div>
                          </div>
                          {app.url && (
                            <Button variant="ghost" size="sm" asChild data-testid={`button-open-app-${app.id}`}>
                              <a href={app.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span>Users: {app.activeUsers || 0}</span>
                          <span>Uptime: {app.uptime || 'N/A'}%</span>
                          <Badge variant="outline" size="sm">
                            {app.priority || 'medium'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 animate-pulse">
                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-700/50" data-testid={`activity-${activity.id}`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-slate-900 dark:text-white" data-testid={`text-activity-action-${activity.id}`}>
                            {activity.action}
                          </span>
                          {activity.type && (
                            <Badge variant="outline" size="sm">
                              {activity.type}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {activity.createdAt ? new Date(activity.createdAt).toLocaleTimeString() : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow">
            <WorkflowEnhancement />
          </TabsContent>

          <TabsContent value="wholesale">
            <WholesaleResources />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationCenter />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Advanced Analytics</span>
                </CardTitle>
                <CardDescription>
                  Detailed business intelligence and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg bg-white/50 dark:bg-slate-700/50">
                    <h3 className="font-semibold mb-4">Performance Trends</h3>
                    <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Chart visualization would go here</p>
                        <p className="text-sm">Connect your analytics data source</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-lg bg-white/50 dark:bg-slate-700/50">
                    <h3 className="font-semibold mb-4">Revenue Analysis</h3>
                    <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Revenue breakdown chart</p>
                        <p className="text-sm">Data visualization coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;