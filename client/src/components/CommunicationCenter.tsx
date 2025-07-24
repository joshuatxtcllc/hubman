import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, Clock, Users, History, Mic, MicOff } from 'lucide-react';
import { Device } from '@twilio/voice-sdk';

const CommunicationCenter = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [quickContacts, setQuickContacts] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [isDeviceReady, setIsDeviceReady] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);

  // Initialize Twilio Device and load data
  useEffect(() => {
    // Initialize Twilio Device
    const initializeTwilioDevice = async () => {
      try {
        const response = await fetch('/api/twilio/access-token?identity=jays-frames-user');
        const { token } = await response.json();
        
        const twilioDevice = new Device(token, {
          logLevel: 1,
          answerOnBridge: true
        });

        twilioDevice.on('ready', () => {
          console.log('Twilio Device is ready');
          setIsDeviceReady(true);
        });

        twilioDevice.on('error', (error) => {
          console.error('Twilio Device error:', error);
        });

        twilioDevice.on('incoming', (call) => {
          console.log('Incoming call from:', call.parameters.From);
          setCurrentCall(call);
          setActiveCall(call.parameters.From);
        });

        twilioDevice.on('disconnect', () => {
          console.log('Call disconnected');
          setActiveCall(null);
          setCurrentCall(null);
          setIsMuted(false);
          loadCallHistory(); // Refresh call history
        });

        setDevice(twilioDevice);
      } catch (error) {
        console.error('Failed to initialize Twilio Device:', error);
      }
    };

    // Load call history from Twilio
    const loadCallHistory = async () => {
      try {
        const response = await fetch('/api/twilio/call-history');
        const history = await response.json();
        setCallHistory(history.map((call: any) => ({
          id: call.sid,
          contact: call.to.replace('+1', ''),
          phone: call.to,
          duration: call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : '0:00',
          time: new Date(call.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: call.direction,
          status: call.status === 'completed' ? 'completed' : 'missed'
        })));
      } catch (error) {
        console.error('Failed to load call history:', error);
      }
    };

    // Set up quick contacts
    setQuickContacts([
      {
        id: 1,
        name: "Larson Juhl Customer Service",
        phone: "+18007828244",
        type: "supplier",
        lastCalled: "2 days ago"
      },
      {
        id: 2,
        name: "Sarah Johnson - Custom Order",
        phone: "+15550123456",
        type: "customer",
        lastCalled: "1 hour ago",
        orderNumber: "JF-2025-001"
      },
      {
        id: 3,
        name: "Mike Chen - Consultation",
        phone: "+15550456789",
        type: "customer",
        lastCalled: "Yesterday",
        orderNumber: "JF-2025-002"
      },
      {
        id: 4,
        name: "United Moulding Sales",
        phone: "+18005556789",
        type: "supplier",
        lastCalled: "3 days ago"
      }
    ]);

    initializeTwilioDevice();
    loadCallHistory();
  }, []);

  const handleCall = async (contact: any) => {
    if (!device || !isDeviceReady) {
      console.error('Twilio Device not ready');
      return;
    }

    try {
      // Make outbound call using Twilio Device
      const call = await device.connect({
        params: {
          To: contact.phone
        }
      });

      setCurrentCall(call);
      setActiveCall(contact.phone);
      
      call.on('accept', () => {
        console.log('Call accepted');
      });

      call.on('disconnect', () => {
        console.log('Call disconnected');
        setActiveCall(null);
        setCurrentCall(null);
        setIsMuted(false);
      });

      call.on('error', (error) => {
        console.error('Call error:', error);
        setActiveCall(null);
        setCurrentCall(null);
      });

    } catch (error) {
      console.error('Failed to make call:', error);
    }
  };

  const handleEndCall = () => {
    if (currentCall) {
      currentCall.disconnect();
    }
    setActiveCall(null);
    setCurrentCall(null);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (currentCall) {
      currentCall.mute(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Communication Center</h2>
          <p className="text-slate-600">Manage customer calls and supplier contacts</p>
        </div>
        
        {/* Device Status */}
        <div className="flex items-center space-x-4">
          {/* Twilio Device Status */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
            isDeviceReady 
              ? 'bg-green-100 border border-green-200' 
              : 'bg-gray-100 border border-gray-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isDeviceReady ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className={`text-sm font-medium ${
              isDeviceReady ? 'text-green-800' : 'text-gray-600'
            }`}>
              {isDeviceReady ? 'Phone Ready' : 'Connecting...'}
            </span>
          </div>

          {/* Active Call Status */}
          {activeCall && (
            <div className="bg-blue-100 border border-blue-200 rounded-lg px-3 py-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-800 font-medium text-sm">Call Active</span>
              </div>
            </div>
          )}
        </div>
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
                    disabled={!!activeCall || !isDeviceReady}
                    className="w-10 h-10 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!isDeviceReady ? 'Phone system connecting...' : activeCall ? 'Call in progress' : 'Make call'}
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