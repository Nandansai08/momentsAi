import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn("Razorpay API keys missing. Payment system running in Simulation Mode.");
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }

  return razorpayInstance;
}

// Generate premium mock subscription for local testing if Razorpay keys are not available
export function createMockSubscription(planType: 'pro' | 'business') {
  return {
    id: `sub_mock_${Math.random().toString(36).substring(2, 15)}`,
    status: 'created',
    plan_id: planType === 'pro' ? 'plan_pro_mock' : 'plan_biz_mock',
    current_start: Math.floor(Date.now() / 1000),
    current_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    short_url: '#'
  };
}

export function verifyPaymentSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return true; // Bypass verification in sandbox mode

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest('hex');

  return generatedSignature === signature;
}

export function verifyWebhookSignature(
  payloadString: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return true; // Bypass verification in dev if no secret

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');

  return expectedSignature === signature;
}
