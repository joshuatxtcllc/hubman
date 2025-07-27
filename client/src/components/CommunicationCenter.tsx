import { useState, useEffect } from 'react';
import { Phone, PhoneCall, Clock, Users, History, Mic, MicOff, Delete } from 'lucide-react';
import { Device } from '@twilio/voice-sdk';

const CommunicationCenter = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [quickContacts, setQuickContacts] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [isDeviceReady, setIsDeviceReady] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState<'ready' | 'calling' | 'connected' | 'incoming' | 'ended'>('ready');

  // Initialize Twilio Device and load data
  useEffect(() => {
    // Initialize Twilio Device
    const initializeTwilioDevice = async () => {
      try {
        console.log('Initializing Twilio Device...');
        const response = await fetch('/api/twilio/access-token?identity=jays-frames-user');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('Token response:', responseData);
        
        if (!responseData.token) {
          throw new Error('No access token received');
        }

        const twilioDevice = new Device(responseData.token, {
          logLevel: 1,
          codecPreferences: ['opus', 'pcmu']
        });

        twilioDevice.on('ready', () => {
          console.log('Twilio Device is ready');
          setIsDeviceReady(true);
          setCallStatus('ready');
        });

        twilioDevice.on('error', (error) => {
          console.error('Twilio Device error:', error);
          setIsDeviceReady(false);
          setCallStatus('ready');
          
          // If JWT is invalid, show helpful message
          if (error.code === 31204) {
            console.warn('JWT Token invalid - this may be due to Twilio API Key configuration');
          }
        });

        twilioDevice.on('offline', () => {
          console.log('Twilio Device is offline');
          setIsDeviceReady(false);
        });

        twilioDevice.on('incoming', (call) => {
          console.log('Incoming call from:', call.parameters.From);
          setCurrentCall(call);
          setActiveCall(call.parameters.From);
          setCallStatus('incoming');
        });

        twilioDevice.on('disconnect', () => {
          console.log('Call disconnected');
          setActiveCall(null);
          setCurrentCall(null);
          setIsMuted(false);
          loadCallHistory(); // Refresh call history
          setCallStatus('ready');
        });

        // Register the device
        await twilioDevice.register();
        setDevice(twilioDevice);

      } catch (error) {
        console.error('Failed to initialize Twilio Device:', error);
        setIsDeviceReady(false);
        setCallStatus('ready');
      }
    };

    // Load call history from Twilio
    const loadCallHistory = async () => {
      try {
        const response = await fetch('/api/twilio/call-history');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const history = await response.json();
        
        setCallHistory(history.map((call: any) => {
          // Handle date formatting safely
          let formattedDate = 'Unknown date';
          let formattedTime = 'Unknown time';
          
          try {
            if (call.dateCreated) {
              const date = new Date(call.dateCreated);
              if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString();
                formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }
            }
          } catch (dateError) {
            console.warn('Date parsing error for call:', call.sid, dateError);
          }
          
          return {
            id: call.sid,
            contact: call.to ? call.to.replace('+1', '') : call.from?.replace('+1', '') || 'Unknown',
            phone: call.to || call.from || 'Unknown',
            duration: call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : '0:00',
            time: formattedTime,
            type: call.direction,
            status: call.status === 'completed' ? 'completed' : (call.status || 'unknown'),
            to: call.to,
            from: call.from,
            dateCreated: formattedDate,
            direction: call.direction
          };
        }));
      } catch (error) {
        console.error('Failed to load call history:', error);
        // Set empty array on error
        setCallHistory([]);
      }
    };

    // Set up quick contacts
    setQuickContacts([
      {
        id: 1,
        name: "Larson Juhl Customer Service",
        number: "+18007828244",
        phone: "+18007828244",
        type: "supplier",
        lastCalled: "2 days ago"
      },
      {
        id: 2,
        name: "Sarah Johnson - Custom Order",
        number: "+15550123456",
        phone: "+15550123456",
        type: "customer",
        lastCalled: "1 hour ago",
        orderNumber: "JF-2025-001"
      },
      {
        id: 3,
        name: "Mike Chen - Consultation",
        number: "+15550456789",
        phone: "+15550456789",
        type: "customer",
        lastCalled: "Yesterday",
        orderNumber: "JF-2025-002"
      },
      {
        id: 4,
        name: "United Moulding Sales",
        number: "+18005556789",
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

  const formatPhoneNumber = (number: string) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,3})?(\d{3})?(\d{4})$/);
    if (match) {
      const intlCode = (match[1] ? `+${match[1]} ` : '');
      const areaCode = (match[2] ? `(${match[2]}) ` : '');
      const local = match[3];
      return intlCode + areaCode + local;
    }
    return number;
  };

  const handleDialerInput = (digit: string) => {
    setPhoneNumber(phoneNumber + digit);
  };

  const clearDialer = () => {
    setPhoneNumber('');
  };

  const deleteLastDigit = () => {
    setPhoneNumber(phoneNumber.slice(0, -1));
  };

  const makeCall = async (number: string) => {
    // Clean the phone number
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      alert('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    // Format number properly
    let formattedNumber;
    if (cleanNumber.startsWith('1') && cleanNumber.length === 11) {
      formattedNumber = `+${cleanNumber}`;
    } else if (cleanNumber.length === 10) {
      formattedNumber = `+1${cleanNumber}`;
    } else {
      formattedNumber = `+${cleanNumber}`;
    }
    
    console.log('Making call to:', formattedNumber);
    setCallStatus('calling');

    // Try using Twilio Device first, fallback to API call
    if (device && isDeviceReady) {
      try {
        const call = await device.connect({
          params: {
            To: formattedNumber
          }
        });

        setCurrentCall(call);
        setActiveCall(formattedNumber);

        call.on('accept', () => {
          console.log('Call accepted');
          setCallStatus('connected');
        });

        call.on('disconnect', () => {
          console.log('Call disconnected');
          setActiveCall(null);
          setCurrentCall(null);
          setIsMuted(false);
          setCallStatus('ready');
        });

        call.on('error', (error) => {
          console.error('Call error:', error);
          setActiveCall(null);
          setCurrentCall(null);
          setCallStatus('ready');
          alert('Call failed: ' + error.message);
        });

        call.on('cancel', () => {
          console.log('Call was cancelled');
          setActiveCall(null);
          setCurrentCall(null);
          setCallStatus('ready');
        });

      } catch (error) {
        console.error('Failed to make call via Device:', error);
        // Fallback to API call
        makeApiCall(formattedNumber);
      }
    } else {
      // Fallback to API call if device not ready
      makeApiCall(formattedNumber);
    }
  };

  const makeApiCall = async (number: string) => {
    try {
      const response = await fetch('/api/twilio/make-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: number
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Call initiated via API:', result);
      
      setActiveCall(number);
      setCallStatus('connected');
      
      // Simulate call completion after some time
      setTimeout(() => {
        setActiveCall(null);
        setCurrentCall(null);
        setCallStatus('ready');
        loadCallHistory(); // Refresh call history
      }, 5000);

    } catch (error) {
      console.error('Failed to make API call:', error);
      setCallStatus('ready');
      alert('Failed to initiate call. Please check your connection and try again.');
    }
  };

  const hangUpCall = () => {
    if (currentCall) {
      currentCall.disconnect();
      setCallStatus('ended');
    }
    setActiveCall(null);
    setCurrentCall(null);
    setIsMuted(false);
    setCallStatus('ready');
  };

  const answerCall = () => {
    if (currentCall) {
      currentCall.accept();
      setActiveCall(currentCall.parameters.From);
      setCallStatus('connected');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Communication Center</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isDeviceReady ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-slate-600 font-medium">
              {isDeviceReady ? 'Phone Ready' : 'Connecting...'}
            </span>
          </div>
          <button 
            onClick={() => setIsDialerOpen(!isDialerOpen)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Make Call</span>
          </button>
        </div>
      </div>

      {/* Call Status Bar */}
      <div className={`rounded-xl p-4 border-l-4 ${
        callStatus === 'ready' ? 'bg-green-50 border-green-500' :
        callStatus === 'calling' ? 'bg-yellow-50 border-yellow-500' :
        callStatus === 'connected' ? 'bg-blue-50 border-blue-500' :
        callStatus === 'incoming' ? 'bg-purple-50 border-purple-500' :
        'bg-gray-50 border-gray-500'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Phone className={`w-5 h-5 ${
              callStatus === 'ready' ? 'text-green-600' :
              callStatus === 'calling' ? 'text-yellow-600' :
              callStatus === 'connected' ? 'text-blue-600' :
              callStatus === 'incoming' ? 'text-purple-600' :
              'text-gray-600'
            }`} />
            <div>
              <p className="font-semibold text-slate-900">
                {callStatus === 'ready' ? 'Ready to make calls' :
                 callStatus === 'calling' ? 'Calling...' :
                 callStatus === 'connected' ? 'Call in progress' :
                 callStatus === 'incoming' ? 'Incoming call' :
                 'Phone system status'}
              </p>
              {activeCall && (
                <p className="text-sm text-slate-600">{formatPhoneNumber(activeCall)}</p>
              )}
            </div>
          </div>
          {callStatus === 'incoming' && (
            <div className="flex space-x-2">
              <button 
                onClick={answerCall}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Answer
              </button>
              <button 
                onClick={hangUpCall}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Call Controls */}
      {(callStatus === 'connected' || callStatus === 'calling') && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                {callStatus === 'calling' ? 'Calling...' : 'Active Call'}
              </h3>
              <p className="text-blue-100">{formatPhoneNumber(activeCall || '')}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Call duration will show here</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button 
                onClick={hangUpCall}
                className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                title="Hang up"
              >
                <PhoneCall className="w-5 h-5 rotate-135" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phone Dialer */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Phone Dialer
            </h3>

            {/* Phone Number Display */}
            <div className="mb-4">
              <input 
                type="text" 
                value={formatPhoneNumber(phoneNumber)}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter phone number"
                className="w-full p-3 border border-slate-300 rounded-xl text-lg text-center font-mono"
              />
            </div>

            {/* Dial Pad */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDialerInput(digit)}
                  className="aspect-square bg-slate-100 hover:bg-slate-200 rounded-xl text-xl font-semibold transition-colors"
                  disabled={callStatus !== 'ready'}
                >
                  {digit}
                </button>
              ))}
            </div>

            {/* Dial Actions */}
            <div className="flex space-x-2">
              <button 
                onClick={() => makeCall(phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`)}
                disabled={!phoneNumber || !isDeviceReady || callStatus !== 'ready'}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center"
              >
                <PhoneCall className="w-5 h-5 mr-2" />
                Call
              </button>
              <button 
                onClick={deleteLastDigit}
                disabled={!phoneNumber}
                className="px-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-xl transition-colors"
                title="Delete last digit"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button 
                onClick={clearDialer}
                className="px-4 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Quick Contacts */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Quick Contacts
            </h3>
            <div className="space-y-3">
              {quickContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900">{contact.name}</p>
                    <p className="text-sm text-slate-600">{contact.type}</p>
                    <p className="text-xs text-slate-500">{formatPhoneNumber(contact.number)}</p>
                  </div>
                  <button 
                    onClick={() => makeCall(contact.number)}
                    disabled={!isDeviceReady || callStatus !== 'ready'}
                    className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call History */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <History className="w-5 h-5 mr-2 text-purple-600" />
              Recent Calls
            </h3>
            <div className="space-y-3">
              {callHistory.slice(0, 6).map((call, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {formatPhoneNumber(call.to || call.from)}
                    </p>
                    <p className="text-sm text-slate-600">
                      {call.direction === 'outbound-api' ? 'Outgoing' : 'Incoming'} • {call.status}
                    </p>
                    <p className="text-xs text-slate-500">
                      {call.dateCreated}
                    </p>
                  </div>
                  <button 
                    onClick={() => makeCall(call.to || call.from)}
                    disabled={!isDeviceReady || callStatus !== 'ready'}
                    className="p-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;