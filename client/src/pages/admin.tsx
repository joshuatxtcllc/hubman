
import React, { useState } from 'react';
import { 
  Settings, 
  Phone, 
  Users, 
  BarChart3, 
  Database, 
  Shield, 
  Bell,
  Activity,
  FileText,
  Headphones
} from 'lucide-react';
import CommunicationCenter from '../components/CommunicationCenter';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('communication');

  const adminSections = [
    {
      id: 'communication',
      title: 'Communication Center',
      icon: Phone,
      description: 'Twilio phone system management'
    },
    {
      id: 'users',
      title: 'User Management',
      icon: Users,
      description: 'Manage customer accounts and permissions'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: BarChart3,
      description: 'Business intelligence and metrics'
    },
    {
      id: 'database',
      title: 'Database Management',
      icon: Database,
      description: 'System data and configurations'
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: Shield,
      description: 'Access control and authentication'
    },
    {
      id: 'notifications',
      title: 'Notification Center',
      icon: Bell,
      description: 'Email and SMS automation settings'
    }
  ];

  const systemStats = [
    { label: 'Active Users', value: '47', status: 'online' },
    { label: 'API Calls Today', value: '1,247', status: 'normal' },
    { label: 'Database Size', value: '2.4 GB', status: 'normal' },
    { label: 'System Uptime', value: '99.9%', status: 'excellent' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600">System management and configuration</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">All Systems Online</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 h-screen overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Tools</h2>
            
            {/* System Stats */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-medium text-slate-700 mb-3">System Status</h3>
              <div className="space-y-2">
                {systemStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">{stat.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-slate-900">{stat.value}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        stat.status === 'excellent' ? 'bg-green-500' :
                        stat.status === 'normal' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Navigation */}
            <nav className="space-y-1">
              {adminSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-start space-x-3 p-3 rounded-xl text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{section.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Admin Content */}
        <main className="flex-1 p-6">
          {activeSection === 'communication' && (
            <CommunicationCenter />
          )}

          {activeSection === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">User Management</h3>
                  <p className="text-slate-600">Customer accounts, permissions, and access control</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add New User
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Analytics & Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    <h3 className="text-lg font-semibold">Sales Analytics</h3>
                  </div>
                  <p className="text-slate-600 text-sm">Revenue trends and order analytics</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="w-8 h-8 text-green-600" />
                    <h3 className="text-lg font-semibold">System Performance</h3>
                  </div>
                  <p className="text-slate-600 text-sm">Application uptime and performance metrics</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <h3 className="text-lg font-semibold">Custom Reports</h3>
                  </div>
                  <p className="text-slate-600 text-sm">Generate custom business reports</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'database' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Database Management</h2>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Database Tools</h3>
                  <p className="text-slate-600 mb-4">Backup, restore, and manage system data</p>
                  <div className="flex justify-center space-x-3">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Backup Database
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      View Tables
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Security Settings</h2>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Security Configuration</h3>
                  <p className="text-slate-600">Access control, authentication, and security policies</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Notification Center</h2>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Notification Settings</h3>
                  <p className="text-slate-600">Configure email alerts, SMS notifications, and automation</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
