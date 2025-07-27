import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log('Twilio configuration check:');
console.log('- Account SID:', accountSid ? 'Set' : 'Missing');
console.log('- Auth Token:', authToken ? 'Set' : 'Missing');
console.log('- Phone Number:', twilioPhoneNumber ? 'Set' : 'Missing');
console.log('- TwiML App SID:', process.env.TWILIO_TWIML_APP_SID ? 'Set' : 'Not set (optional)');

if (!accountSid || !authToken || !twilioPhoneNumber) {
  const missing = [];
  if (!accountSid) missing.push('TWILIO_ACCOUNT_SID');
  if (!authToken) missing.push('TWILIO_AUTH_TOKEN');
  if (!twilioPhoneNumber) missing.push('TWILIO_PHONE_NUMBER');
  
  throw new Error(`Missing required Twilio environment variables: ${missing.join(', ')}`);
}

const client = twilio(accountSid, authToken);

export class TwilioService {
  // Generate access token for Twilio Voice SDK
  static generateAccessToken(identity: string): string {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // For demo purposes, we'll create a simple token without API Keys
    // In production, you should use proper API Key/Secret pairs
    const accessToken = new AccessToken(
      accountSid!,
      process.env.TWILIO_API_KEY || accountSid!, // Use API Key if available, fallback to Account SID
      process.env.TWILIO_API_SECRET || authToken!, // Use API Secret if available, fallback to Auth Token
      {
        identity: identity,
        ttl: 3600 // 1 hour
      }
    );

    // Create voice grant - simplified for basic calling
    const voiceGrant = new VoiceGrant({
      incomingAllow: true,
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID
    });

    accessToken.addGrant(voiceGrant);
    
    const token = accessToken.toJwt();
    console.log('Generated access token for identity:', identity);
    console.log('Using API Key:', process.env.TWILIO_API_KEY ? 'Custom API Key' : 'Account SID');
    return token;
  }

  // Make outbound call
  static async makeCall(to: string, from?: string): Promise<any> {
    try {
      const call = await client.calls.create({
        to: to,
        from: from || twilioPhoneNumber,
        url: 'https://jays-frames-dashboard-jayframes.replit.app/webhook/voice'
      });
      return call;
    } catch (error) {
      console.error('Error making call:', error);
      throw error;
    }
  }

  // Get call history
  static async getCallHistory(): Promise<any[]> {
    try {
      const calls = await client.calls.list({ limit: 50 });
      return calls.map(call => ({
        sid: call.sid,
        to: call.to,
        from: call.from,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime,
        direction: call.direction
      }));
    } catch (error) {
      console.error('Error fetching call history:', error);
      throw error;
    }
  }

  // Generate TwiML response for voice calls
  static generateVoiceResponse(): string {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    response.say({
      voice: 'alice'
    }, 'Thank you for calling Jay\'s Frames! For order updates, please text your order number to this number, or visit our website. Have a great day!');
    
    response.hangup();
    
    return response.toString();
  }
}

export default TwilioService;