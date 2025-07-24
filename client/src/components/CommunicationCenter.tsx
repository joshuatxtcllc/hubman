import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, Clock, Users, History, Mic, MicOff } from 'lucide-react';

const CommunicationCenter = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [quickContacts, setQuickContacts] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Sample quick contacts for demonstration
  useEffect(() => {
    setQuickContacts([
      {
        id: 1,
        name: "Larson Juhl Customer Service",
        phone: "+1-800-782-8244",
        type: "supplier",
        lastCalled: "2 days ago"
      },
      {
        id: 2,
        name: "Sarah Johnson - Custom Order",
        phone: "+1-555-0123",
        type: "customer",
        lastCalled: "1 hour ago",
        orderNumber: "JF-2025-001"
      },
      {
        id: 3,
        name: "Mike Chen - Consultation",
        phone: "+1-555-0456",
        type: "customer",
        lastCalled: "Yesterday",
        orderNumber: "JF-2025-002"
      },
      {
        id: 4,
        name: "United Moulding Sales",
        phone: "+1-800-555-6789",
        type: "supplier",
        lastCalled: "3 days ago"
      }
    ]);

    setCallHistory([
      {
        id: 1,
        contact: "Sarah Johnson",
        phone: "+1-555-0123",
        duration: "4:32",
        time: "10:30 AM",
        type: "outbound",
        status: "completed"
      },
      {
        id: 2,
        contact: "Larson Juhl",
        phone: "+1-800-782-8244",
        duration: "2:15",
        time: "9:45 AM",
        type: "outbound",
        status: "completed"
      },
      {
        id: 3,
        contact: "Mike Chen",
        phone: "+1-555-0456",
        duration: "0:00",
        time: "9:15 AM",
        type: "outbound",
        status: "missed"
      }
    ]);
  }, []);

  const handleCall = (contact: any) => {
    setActiveCall(contact.phone);
    // In a real implementation, this would initiate the actual call
    // using WebRTC, Twilio Voice SDK, or similar service
    
    // Simulate call connection
    setTimeout(() => {
      console.log(`Calling ${contact.name} at ${contact.phone}`);
    }, 1000);
  };

  const handleEndCall = () => {
    setActiveCall(null);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Communication Center</h2>
          <p className="text-slate-600">Manage customer calls and supplier contacts</p>
        </div>
        
        {/* Active Call Status */}
        {activeCall && (
          <div className="bg-green-100 border border-green-200 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-medium">Call Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Active Call Interface */}
      {activeCall && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connected</h3>
            <p className="text-green-100 mb-6">{activeCall}</p>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <button
                onClick={handleEndCall}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <PhoneCall className="w-5 h-5 transform rotate-135" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Contacts */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Quick Contacts</h3>
            <Users className="w-5 h-5 text-slate-500" />
          </div>
          
          <div className="space-y-3">
            {quickContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      contact.type === 'customer' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {contact.type === 'customer' ? '👤' : '🏢'}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{contact.name}</h4>
                      <p className="text-sm text-slate-500">{contact.phone}</p>
                      {contact.orderNumber && (
                        <p className="text-xs text-blue-600">Order: {contact.orderNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">{contact.lastCalled}</span>
                  <button
                    onClick={() => handleCall(contact)}
                    disabled={!!activeCall}
                    className="w-10 h-10 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call History */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Recent Calls</h3>
            <History className="w-5 h-5 text-slate-500" />
          </div>
          
          <div className="space-y-3">
            {callHistory.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    call.status === 'completed' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <Phone className={`w-4 h-4 ${
                      call.type === 'outbound' ? '' : 'transform rotate-135'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{call.contact}</h4>
                    <p className="text-sm text-slate-500">{call.phone}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{call.time}</p>
                  <p className="text-xs text-slate-500">
                    {call.status === 'completed' ? call.duration : 'Missed'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
            View All Call History
          </button>
        </div>
      </div>

      {/* Integration Options */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">Communication Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">WebRTC (Browser)</h4>
            <p className="text-sm text-blue-700">Direct browser-to-browser calling without external services</p>
            <button className="mt-3 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors">
              Configure WebRTC
            </button>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">Twilio Voice</h4>
            <p className="text-sm text-blue-700">Professional calling with advanced features and reliability</p>
            <button className="mt-3 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors">
              Setup Twilio
            </button>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">VoIP Integration</h4>
            <p className="text-sm text-blue-700">Connect to existing phone system using SIP.js</p>
            <button className="mt-3 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors">
              Connect VoIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;