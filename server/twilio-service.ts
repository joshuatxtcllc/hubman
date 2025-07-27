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

    // Create access token with proper configuration
    const accessToken = new AccessToken(
      accountSid!,
      accountSid!, // Use Account SID as API Key
      authToken!,  // Use Auth Token as API Secret
      {
        identity: identity,
        ttl: 3600 // 1 hour
      }
    );

    // Create voice grant with proper configuration
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true
    });

    accessToken.addGrant(voiceGrant);
    
    const token = accessToken.toJwt();
    console.log('Generated access token for identity:', identity);
    console.log('Token preview:', token.substring(0, 50) + '...');
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