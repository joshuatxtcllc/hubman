import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  CheckSquare, 
  Users, 
  Settings,
  Bell,
  Search,
  ChevronDown,
  TrendingUp,
  Activity,
  Clock,
  Zap,
  Plus,
  BarChart3,
  ArrowRight,
  ExternalLink,
  Maximize2,
  MoreHorizontal,
  Workflow,
  Home,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WorkflowEnhancement from '@/components/WorkflowEnhancement';
import WholesaleResources from '@/components/WholesaleResources';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('This Month');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch live dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard/overview');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Connection Error",
          description: "Unable to fetch live data. Using cached metrics.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  // Enhanced metrics with trends - now using live data
  const metrics = useMemo(() => {
    if (!dashboardData?.metrics) {
      // Fallback data while loading
      return [
    {
          title: "Monthly Revenue",
          value: "$24,580",
          change: "+12%",
          trend: "up",
          icon: DollarSign,
          gradient: "from-blue-500 to-blue-600",
          comparison: "vs last month",
          target: "$25,000",
          progress: 98
        },
        {
          title: "Active Orders",
          value: "347",
          change: "+8%",
          trend: "up",
          icon: ShoppingCart,
          gradient: "from-green-500 to-green-600",
          comparison: "vs last week",
          target: "350",
          progress: 99
        },
        {
          title: "Pending Tasks",
          value: "24",
          change: "-12",
          trend: "down",
          icon: CheckSquare,
          gradient: "from-purple-500 to-purple-600",
          comparison: "from yesterday",
          target: "< 20",
          progress: 80
        },
        {
          title: "Total Customers",
          value: "1,248",
          change: "+24%",
          trend: "up",
          icon: Users,
          gradient: "from-orange-500 to-orange-600",
          comparison: "vs last quarter",
          target: "1,300",
          progress: 96
        }
      ];
    }

    // Map live data to metrics format
    return dashboardData.metrics.map((metric: any) => ({
      title: metric.name,
      value: metric.value,
      change: metric.change,
      trend: metric.change.includes('+') ? 'up' : 'down',
      icon: metric.name.includes('Revenue') ? DollarSign : 
            metric.name.includes('Orders') ? ShoppingCart : 
            metric.name.includes('Tasks') || metric.name.includes('Pending') ? CheckSquare :
            metric.name.includes('Productivity') ? TrendingUp : Users,
      gradient: metric.name.includes('Revenue') ? "from-blue-500 to-blue-600" :
               metric.name.includes('Orders') ? "from-green-500 to-green-600" :
               metric.name.includes('Tasks') || metric.name.includes('Pending') ? "from-purple-500 to-purple-600" :
               metric.name.includes('Productivity') ? "from-indigo-500 to-indigo-600" : "from-orange-500 to-orange-600",
      comparison: metric.name.includes('Revenue') ? "vs last month" : 
                 metric.name.includes('Orders') ? "vs last week" :
                 metric.name.includes('Tasks') ? "from Kanban" :
                 metric.name.includes('Productivity') ? "team efficiency" : "vs last quarter",
      target: metric.target || "N/A",
      progress: metric.progress || 50
    }));
  }, [dashboardData]);

  const applications = useMemo(() => [
    {
      title: "POS System",
      subtitle: "Sales & Inventory",
      status: "Online",
      users: 47,
      uptime: "99.9%",
      icon: "🏪",
      gradient: "from-blue-500 to-blue-600",
      priority: "high",
      url: "https://therealposmain-JayFrames.replit.app"
    },
    {
      title: "Frame Designer",
      subtitle: "Virtual Design Tool",
      status: "Online",
      users: 23,
      uptime: "98.2%",
      icon: "🎨",
      gradient: "from-green-500 to-green-600",
      priority: "high",
      url: "https://jays-frames-ai-JayFrames.replit.app"
    },
    {
      title: "AI Assistant",
      subtitle: "Smart Recommendations",
      status: "Online",
      users: 12,
      uptime: "97.8%",
      icon: "🤖",
      gradient: "from-purple-500 to-purple-600",
      priority: "high",
      url: "https://jays-frames-assistant-JayFrames.replit.app"
    },
    {
      title: "CRM",
      subtitle: "Enterprise Intelligence",
      status: "Online",
      users: 18,
      uptime: "99.5%",
      icon: "👥",
      gradient: "from-yellow-500 to-yellow-600",
      priority: "high",
      url: "https://enterprise-intelligence-JayFrames.replit.app"
    },
    {
      title: "Kanban Board",
      subtitle: "Production Management",
      status: "Online",
      users: 15,
      uptime: "99.2%",
      icon: "📋",
      gradient: "from-indigo-500 to-indigo-600",
      priority: "high",
      url: "https://kanbanmain-JayFrames.replit.app"
    },
    {
      title: "SEO Analyzer",
      subtitle: "Business Listing Analysis",
      status: "Online",
      users: 8,
      uptime: "98.8%",
      icon: "🔍",
      gradient: "from-pink-500 to-pink-600",
      priority: "medium",
      url: "https://business-listing-analyzer-JayFrames.replit.app"
    },
    {
      title: "Analytics",
      subtitle: "Business Intelligence",
      status: "Beta",
      users: 5,
      uptime: "97.5%",
      icon: "📊",
      gradient: "from-teal-500 to-teal-600",
      priority: "medium",
      url: "#"
    },
    {
      title: "Reports",
      subtitle: "Data Export & Insights",
      status: "Beta",
      users: 3,
      uptime: "96.1%",
      icon: "📈",
      gradient: "from-red-500 to-red-600",
      priority: "low",
      url: "#"
    },
    {
      title: "Larson Juhl Designer",
      subtitle: "Professional Frame Design Studio",
      status: "Online",
      users: 12,
      uptime: "99.8%",
      icon: "🎯",
      gradient: "from-emerald-500 to-emerald-600",
      priority: "high",
      url: "https://shop.larsonjuhl.com/en-US/lj-design-studio?customizable=#maincontent"
    }
  ], []);

  const recentActivity = useMemo(() => {
    if (!dashboardData?.activities) {
      return [
        { action: "Loading live activity...", time: "now", type: "system", icon: Activity },
        { action: "Connecting to Kanban app...", time: "now", type: "system", icon: Activity }
      ];
    }

    return dashboardData.activities.map((activity: any) => ({
      action: activity.action,
      time: activity.createdAt ? new Date(activity.createdAt).toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true 
      }) + ' ago' : activity.time,
      type: activity.type,
      icon: activity.type === 'order' ? ShoppingCart :
            activity.type === 'task' ? CheckSquare :
            activity.type === 'payment' ? DollarSign :
            activity.type === 'customer' ? Users :
            Activity
    }));
  }, [dashboardData]);

  // Handler functions for various actions - optimized with useCallback
  const handleNotificationClick = useCallback(() => {
    setNotifications(0);
    toast({
      title: "Notifications",
      description: "You have 3 new notifications",
    });
  }, [toast]);

  const handleSettingsClick = useCallback(() => {
    toast({
      title: "Settings",
      description: "Opening settings panel...",
    });
  }, [toast]);

  const handleApplicationClick = useCallback((appName: string, url: string) => {
    if (url && url !== "#") {
      window.open(url, '_blank');
      toast({
        title: `Opening ${appName}`,
        description: `Launching ${appName} in a new tab...`,
      });
    } else {
      toast({
        title: `${appName} Coming Soon`,
        description: `${appName} is currently in development.`,
      });
    }
  }, [toast]);

  const handleMetricClick = useCallback((metricName: string) => {
    toast({
      title: `${metricName} Details`,
      description: `Viewing detailed analytics for ${metricName}...`,
    });
  }, [toast]);

  const handleQuickAction = useCallback((actionTitle: string) => {
    toast({
      title: actionTitle,
      description: `Executing ${actionTitle}...`,
    });
  }, [toast]);

  const handleTimeRangeChange = useCallback((newRange: string) => {
    setSelectedTimeRange(newRange);
    toast({
      title: "Time Range Updated",
      description: `Dashboard updated to show data for ${newRange}`,
    });
  }, [toast]);

  const quickActions = useMemo(() => [
    {
      title: "New Order",
      description: "Create a new custom frame order",
      icon: Plus,
      gradient: "from-blue-500 to-blue-600",
      action: () => handleQuickAction("New Order")
    },
    {
      title: "View Reports",
      description: "Analyze business performance",
      icon: BarChart3,
      gradient: "from-purple-500 to-purple-600",
      action: () => handleQuickAction("View Reports")
    },
    {
      title: "Manage Customers",
      description: "Customer database & communication",
      icon: Users,
      gradient: "from-green-500 to-green-600",
      action: () => handleQuickAction("Manage Customers")
    }
  ], [handleQuickAction]);

  const filteredApplications = useMemo(() => 
    applications.filter(app => 
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    ), [applications, searchQuery]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 glass-morphism border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">J</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Jay's Frames
                  </h1>
                  <p className="text-sm text-slate-600 font-medium">Business Intelligence Hub</p>
                </div>
              </div>
              {/* System Status */}
              <div className={`hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full border ${
                isLoading 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : dashboardData 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isLoading 
                    ? 'bg-yellow-500 animate-spin' 
                    : dashboardData 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-red-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  isLoading 
                    ? 'text-yellow-700' 
                    : dashboardData 
                      ? 'text-green-700' 
                      : 'text-red-700'
                }`}>
                  {isLoading 
                    ? 'Loading Live Data...' 
                    : dashboardData 
                      ? 'Live Data Connected' 
                      : 'Connection Error'}
                </span>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search applications..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-64 bg-white/70 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium placeholder-slate-500 transition-all duration-200"
                />
              </div>

              {/* Notifications */}
              <button 
                onClick={handleNotificationClick}
                className="relative p-2.5 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-xl transition-all duration-200 group"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{notifications}</span>
                  </div>
                )}
              </button>

              {/* Settings */}
              <button 
                onClick={handleSettingsClick}
                className="p-2.5 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-xl transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Profile */}
              <div 
                onClick={() => handleQuickAction("View Profile")}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-lg transition-all duration-200"
              >
                J
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Good morning, Jay! 👋</h2>
            <p className="text-lg text-slate-600 font-medium">Here's what's happening with your business today</p>
          </div>
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-600">Time Range:</label>
            <select 
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-1.5 border border-white/30 shadow-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'workflow'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Workflow className="w-5 h-5" />
            <span>Workflow Intelligence</span>
          </button>
          <button
            onClick={() => setActiveTab('wholesale')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'wholesale'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Wholesale Resources</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="gradient-border hover:scale-105 transition-all duration-300 group cursor-pointer" onClick={() => handleMetricClick(metric.title)}>
                <div className="gradient-border-inner p-6 h-full bg-white rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center text-sm font-semibold ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                        {metric.change}
                      </div>
                      <p className="text-xs text-slate-500">{metric.comparison}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">{metric.value}</p>
                    <p className="text-sm text-slate-600 mb-3 font-medium">{metric.title}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Target: {metric.target}</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${metric.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-green-600 font-semibold">{metric.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Business Applications</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Real-time status</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 shadow-xl border border-white/30">
              {/* Applications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {filteredApplications.map((app, index) => (
                  <div key={index} className="group cursor-pointer" onClick={() => handleApplicationClick(app.title, app.url)}>
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative">
                        <div className={`w-16 h-16 bg-gradient-to-r ${app.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
                          {app.icon}
                        </div>
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          app.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                        }`}></div>
                        {app.url && app.url !== "#" && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                          {app.title}
                        </h4>
                        <p className="text-xs text-slate-500 mb-2">{app.subtitle}</p>
                        <div className="flex items-center justify-center space-x-1 text-xs text-slate-600">
                          <Users className="w-3 h-3" />
                          <span>{app.users}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-green-600 font-medium">{app.uptime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Overview */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">System Overview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl p-4 transition-all duration-200 cursor-pointer" onClick={() => handleQuickAction("View Active Apps")}>
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-2xl font-bold text-slate-900">8</span>
                    </div>
                    <p className="text-xs text-slate-500 text-center font-medium">Apps Active</p>
                  </div>
                  <div className="group hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl p-4 transition-all duration-200 cursor-pointer" onClick={() => handleQuickAction("View Active Users")}>
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-2xl font-bold text-slate-900">112</span>
                    </div>
                    <p className="text-xs text-slate-500 text-center font-medium">Active Users</p>
                  </div>
                  <div className="group hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-xl p-4 transition-all duration-200 cursor-pointer" onClick={() => handleQuickAction("View Uptime Report")}>
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="w-5 h-5 text-purple-500 mr-2" />
                      <span className="text-2xl font-bold text-slate-900">98.9%</span>
                    </div>
                    <p className="text-xs text-slate-500 text-center font-medium">Uptime</p>
                  </div>
                  <div className="group hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 rounded-xl p-4 transition-all duration-200 cursor-pointer" onClick={() => handleQuickAction("Contact Support")}>
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-2xl font-bold text-slate-900">24/7</span>
                    </div>
                    <p className="text-xs text-slate-500 text-center font-medium">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="glass-card rounded-2xl p-6 shadow-xl border border-white/30 mb-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-all duration-200 group">
                      <div className={`w-8 h-8 bg-gradient-to-r ${
                        activity.type === 'order' ? 'from-green-500 to-green-600' :
                        activity.type === 'payment' ? 'from-blue-500 to-blue-600' :
                        activity.type === 'design' ? 'from-purple-500 to-purple-600' :
                        activity.type === 'customer' ? 'from-indigo-500 to-indigo-600' :
                        'from-gray-500 to-gray-600'
                      } rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                      {index < 2 && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                    </div>
                  );
                })}
              </div>

              {/* View All Activity Button */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => handleQuickAction("View All Activity")}
                  className="w-full py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button 
                      key={index}
                      onClick={action.action}
                      className={`w-full p-4 text-left bg-gradient-to-r ${action.gradient} text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-semibold">{action.title}</p>
                          <p className="text-sm opacity-90">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
          </div>
        )}

        {/* Workflow Intelligence Tab */}
        {activeTab === 'workflow' && (
          <WorkflowEnhancement />
        )}

        {/* Wholesale Resources Tab */}
        {activeTab === 'wholesale' && (
          <WholesaleResources />
        )}
      </main>
    </div>
  );
};

export default Dashboard;