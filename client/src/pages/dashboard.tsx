
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

        {/* Navigation Pills */}
        <div className="glass-card rounded-2xl shadow-lg p-3 border border-white/30">
          <div className="flex space-x-2">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-xl font-medium shadow-lg">
              Dashboard Overview
            </button>
            <button className="px-6 py-2 bg-white/60 text-slate-700 rounded-xl font-medium hover:bg-white/80 transition-colors">
              Workflow Intelligence
            </button>
            <button className="px-6 py-2 bg-white/60 text-slate-700 rounded-xl font-medium hover:bg-white/80 transition-colors">
              Wholesale Resources
            </button>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-xl font-medium shadow-lg">
              Communication
            </button>
          </div>
        </div>

        {/* Main Content - Dashboard Overview */}
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">Here's what's happening with your business today</p>
          
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-4 gap-4">
            <button className="glass-card rounded-2xl p-4 hover:shadow-lg transition-all border border-white/30 group">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-900">Dashboard Overview</span>
              </div>
            </button>
            <button className="glass-card rounded-2xl p-4 hover:shadow-lg transition-all border border-white/30 group">
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Workflow className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-slate-900">Workflow Intelligence</span>
              </div>
            </button>
            <button className="glass-card rounded-2xl p-4 hover:shadow-lg transition-all border border-white/30 group">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-slate-900">Wholesale Resources</span>
              </div>
            </button>
            <button className="glass-card rounded-2xl p-4 hover:shadow-lg transition-all border border-white/30 group">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-900">Communication</span>
              </div>
            </button>
          </div>

          {/* Communication Center Interface matching screenshot */}
          <div className="glass-card rounded-3xl shadow-xl p-6 border border-white/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Communication Center</h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600">Connected</span>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl">
                  Make Call
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Phone Dialer */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Ready to make calls</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <button
                      key={digit}
                      className="aspect-square bg-white/60 hover:bg-white/80 rounded-xl text-lg font-semibold transition-colors border border-white/40"
                    >
                      {digit}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl">
                    Call
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    Clear
                  </Button>
                </div>
              </div>

              {/* Quick Contacts */}
              <div>
                <h3 className="font-medium text-slate-900 mb-4">Quick Contacts</h3>
                <div className="space-y-2">
                  {[
                    { name: "Larson Juhl Customer Service", number: "(832) 8871 - 3766", icon: "🏢" },
                    { name: "Sarah Johnson - Custom Order", number: "+13480589799", icon: "👤" },
                    { name: "Mike Chen - Consultation", number: "+13480589799", icon: "👤" },
                    { name: "United Moulding Sales", number: "+13480589799", icon: "🏢" }
                  ].map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/30">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{contact.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                          <p className="text-xs text-slate-500">{contact.number}</p>
                        </div>
                      </div>
                      <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Phone className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Calls */}
              <div>
                <h3 className="font-medium text-slate-900 mb-4">Recent Calls</h3>
                <div className="space-y-2">
                  {[
                    { contact: "+13480589799", time: "12:46 PM", duration: "2:34", type: "outgoing" },
                    { contact: "+13480589799", time: "11:23 AM", duration: "1:45", type: "incoming" },
                    { contact: "+13480589799", time: "10:15 AM", duration: "0:23", type: "missed" },
                    { contact: "+13480589799", time: "9:47 AM", duration: "3:12", type: "outgoing" },
                    { contact: "+13480589799", time: "Yesterday", duration: "1:56", type: "incoming" },
                    { contact: "+13480589799", time: "Yesterday", duration: "0:45", type: "outgoing" }
                  ].map((call, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-white/30 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          call.type === 'outgoing' ? 'bg-green-100' : 
                          call.type === 'incoming' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            call.type === 'outgoing' ? 'bg-green-500' : 
                            call.type === 'incoming' ? 'bg-blue-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{call.contact}</p>
                          <p className="text-xs text-slate-500">{call.time}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">{call.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
