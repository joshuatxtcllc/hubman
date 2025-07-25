import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error('Missing required Twilio environment variables');
}

const client = twilio(accountSid, authToken);

export class TwilioService {
  // Generate access token for Twilio Voice SDK
  static generateAccessToken(identity: string): string {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Use API key if available, otherwise use account SID
    const apiKey = process.env.TWILIO_API_KEY || accountSid;
    const apiSecret = process.env.TWILIO_API_SECRET || authToken;

    const accessToken = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: identity,
      ttl: 3600 // 1 hour
    });

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true
    });

    accessToken.addGrant(voiceGrant);
    return accessToken.toJwt();
  }

  // Make outbound call
  static async makeCall(to: string, from?: string): Promise<any> {
    try {
      const call = await client.calls.create({
        to: to,
        from: from || twilioPhoneNumber,
        url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/twilio/voice-response`
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
    }, 'Hello from Jay\'s Frames! Please hold while we connect you.');
    
    response.dial({
      callerId: twilioPhoneNumber
    }, '+1-555-0123'); // Replace with actual business number
    
    return response.toString();
  }
}

export default TwilioService;