import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  CheckSquare, 
  Users, 
  Settings,
  Bell,
  Search,
  ChevronDown,
  Activity,
  Clock,
  Zap,
  Phone,
  Menu,
  X
} from 'lucide-react';
import CommunicationCenter from '../components/CommunicationCenter';
import { useIsMobile } from '../hooks/use-mobile';

const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('This Month');
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleStripeCheckout = async (amount: number, orderId: string, customerEmail?: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId,
          customerEmail
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        alert('Failed to create payment session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Payment system temporarily unavailable. Please try again.');
    }
  };

  

  const applications = [
    {
      title: "POS System",
      subtitle: "Sales & Inventory",
      status: "Online",
      users: 47,
      uptime: "99.9%",
      icon: "🏪",
      gradient: "from-blue-500 to-blue-600",
      priority: "high",
      url: "https://framecraftpro.com/orders"
    },
    {
      title: "Kanban Board",
      subtitle: "Production Tracking",
      status: "Online",
      users: 23,
      uptime: "98.2%",
      icon: "📊",
      gradient: "from-green-500 to-green-600",
      priority: "high",
      url: "https://framecraftpro.com/kanban"
    },
    {
      title: "AI Assistant",
      subtitle: "Smart Recommendations",
      status: "Online",
      users: 12,
      uptime: "97.8%",
      icon: "🤖",
      gradient: "from-purple-500 to-purple-600",
      priority: "medium",
      url: "https://framecraftpro.com/ai-assistant"
    },
    {
      title: "Main Website",
      subtitle: "Customer Portal",
      status: "Online",
      users: 8,
      uptime: "100%",
      icon: "🌐",
      gradient: "from-yellow-500 to-yellow-600",
      priority: "medium",
      url: "https://frame-houston-JayFrames.replit.app"
    },
    {
      title: "Analytics",
      subtitle: "Business Intelligence",
      status: "Online",
      users: 5,
      uptime: "99.5%",
      icon: "📊",
      gradient: "from-indigo-500 to-indigo-600",
      priority: "high",
      url: "#"
    },
    {
      title: "Print Queue",
      subtitle: "Art Production",
      status: "Beta",
      users: 2,
      uptime: "96.1%",
      icon: "🖨️",
      gradient: "from-pink-500 to-pink-600",
      priority: "low",
      url: "#"
    },
    {
      title: "QR Codes",
      subtitle: "Product Tracking",
      status: "Beta",
      users: 3,
      uptime: "98.7%",
      icon: "📱",
      gradient: "from-teal-500 to-teal-600",
      priority: "low",
      url: "#"
    },
    {
      title: "Locations",
      subtitle: "Asset Tracking",
      status: "Beta",
      users: 12,
      uptime: "99.1%",
      icon: "📍",
      gradient: "from-red-500 to-red-600",
      priority: "medium",
      url: "#"
    },
    {
      title: "Stripe Checkout",
      subtitle: "Payment Processing",
      status: "Online",
      users: 24,
      uptime: "99.8%",
      icon: "💳",
      gradient: "from-indigo-500 to-purple-600",
      priority: "high",
      url: "#stripe-checkout"
    },
    {
      title: "Frame Calculator",
      subtitle: "Order Pricing Tool",
      status: "Online",
      users: 18,
      uptime: "100%",
      icon: "🧮",
      gradient: "from-emerald-500 to-teal-600",
      priority: "high",
      url: "https://docs.google.com/spreadsheets/d/10DDLzMGD3WbKoTJ-HdnopyVdXgQ0Q6Pu8LO_UlkTr5s/edit?gid=543232677#gid=543232677&range=1:2"
    }
  ];

  const recentActivity = [
    { action: "New order #1247 received", time: "2 min ago", type: "order" },
    { action: "Frame design completed", time: "15 min ago", type: "design" },
    { action: "Payment processed ($450)", time: "32 min ago", type: "payment" },
    { action: "Inventory updated", time: "1 hour ago", type: "inventory" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Jay's Frames
              </h1>
              <p className="text-sm text-gray-500">Business Intelligence Hub</p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">All Systems Operational</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search applications..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && isMobile && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                <button 
                  onClick={() => {
                    setActiveTab('overview');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">Overview</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('communication');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'communication' 
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Communication Center</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('orders');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Orders</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('wholesale');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'wholesale' 
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Wholesale</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('communication')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'communication'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Communication Center
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('wholesale')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'wholesale'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Wholesale
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-6 max-w-7xl mx-auto">
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Welcome Section with Time Filter */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Good morning, Jay! 👋</h2>
                <p className="text-gray-600">Here's what's happening with your business today</p>
              </div>
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Quarter</option>
                </select>
              </div>
            </div>

        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Applications Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Business Applications</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>Real-time status</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
              <div className="grid grid-cols-4 gap-4">
                {applications.map((app, index) => (
                  <div key={index} className="group cursor-pointer" onClick={() => {
                    if (app.url === '#stripe-checkout') {
                      // Demo checkout - in real app, you'd get these values from form/context
                      handleStripeCheckout(150, 'DEMO-001', 'customer@example.com');
                    } else if (app.url !== '#') {
                      window.open(app.url, '_blank');
                    }
                  }}>
                    <div className="flex flex-col items-center">
                      <div className={`relative w-16 h-16 bg-gradient-to-r ${app.gradient} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 mb-3`}>
                        {app.icon}
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                          app.status === 'Online' ? 'bg-green-500' : 'bg-yellow-500'
                        } border-2 border-white`}></div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 text-xs mb-0.5 group-hover:text-blue-600 transition-colors">
                          {app.title}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">{app.subtitle}</p>
                        <div className="flex items-center justify-center space-x-1 text-xs">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{app.users}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Overview */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="group hover:bg-gray-50 rounded-lg p-2 transition-colors">
                    <div className="flex items-center justify-center mb-1">
                      <Zap className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">8</span>
                    </div>
                    <p className="text-xs text-gray-500">Apps Active</p>
                  </div>
                  <div className="group hover:bg-gray-50 rounded-lg p-2 transition-colors">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">112</span>
                    </div>
                    <p className="text-xs text-gray-500">Active Users</p>
                  </div>
                  <div className="group hover:bg-gray-50 rounded-lg p-2 transition-colors">
                    <div className="flex items-center justify-center mb-1">
                      <Activity className="w-4 h-4 text-purple-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">98.9%</span>
                    </div>
                    <p className="text-xs text-gray-500">Uptime</p>
                  </div>
                  <div className="group hover:bg-gray-50 rounded-lg p-2 transition-colors">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-orange-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">24/7</span>
                    </div>
                    <p className="text-xs text-gray-500">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'order' ? 'bg-green-500' :
                      activity.type === 'payment' ? 'bg-blue-500' :
                      activity.type === 'design' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg py-2 transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Communication Center Tab */}
        {activeTab === 'communication' && (
          <CommunicationCenter />
        )}

        {/* Other tabs content */}
        {activeTab === 'orders' && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
            <p className="text-gray-600">Order management features coming soon</p>
          </div>
        )}

        {activeTab === 'wholesale' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Wholesale Resources</h3>
            <p className="text-gray-600">Wholesale management features coming soon</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;