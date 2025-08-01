
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export class StripeService {
  static async createCheckoutSession(orderData: {
    amount: number;
    currency: string;
    customerEmail?: string;
    orderId: string;
    description?: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    try {
      console.log('Creating Stripe session with amount:', orderData.amount, 'cents:', Math.round(orderData.amount * 100));
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: orderData.currency,
              product_data: {
                name: `Custom Frame Order #${orderData.orderId}`,
                description: orderData.description || 'Professional custom framing service',
              },
              unit_amount: Math.round(orderData.amount * 100), // Convert to cents and round
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: orderData.successUrl,
        cancel_url: orderData.cancelUrl,
        customer_email: orderData.customerEmail,
        metadata: {
          orderId: orderData.orderId,
          originalAmount: orderData.amount.toString(),
        },
      });

      return session;
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw error;
    }
  }

  static async retrieveSession(sessionId: string) {
    try {
      return await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error('Error retrieving Stripe session:', error);
      throw error;
    }
  }

  static async createPaymentIntent(amount: number, currency: string = 'usd') {
    try {
      return await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async getPaymentHistory(limit: number = 10) {
    try {
      const charges = await stripe.charges.list({
        limit,
      });

      return charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount / 100, // Convert from cents
        currency: charge.currency,
        status: charge.status,
        created: new Date(charge.created * 1000),
        customerEmail: charge.billing_details?.email,
        description: charge.description,
      }));
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }
}
