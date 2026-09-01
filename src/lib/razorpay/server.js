import crypto from 'crypto';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

/**
 * Creates a Razorpay order via Razorpay REST API (Server-Side).
 * @param {Object} options - { amountInPaise, currency, receipt, notes }
 */
export async function createRazorpayOrder({ amountInPaise, currency = 'INR', receipt, notes = {} }) {
  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error('Razorpay credentials are not configured in environment.');
  }

  const authHeader = `Basic ${Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64')}`;

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency,
      receipt,
      notes,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.description || 'Failed to create Razorpay order');
  }

  return response.json();
}

/**
 * Verifies Razorpay payment signature after client checkout completion.
 * @param {string} orderId
 * @param {string} paymentId
 * @param {string} signature
 */
export function verifyRazorpayPaymentSignature(orderId, paymentId, signature) {
  if (!razorpayKeySecret) return false;

  const generatedSignature = crypto.createHmac('sha256', razorpayKeySecret).update(`${orderId}|${paymentId}`).digest('hex');

  return generatedSignature === signature;
}

/**
 * Verifies Razorpay webhook payload signature.
 * @param {string} rawBody - Raw request body string
 * @param {string} webhookSignature - X-Razorpay-Signature header
 */
export function verifyRazorpayWebhookSignature(rawBody, webhookSignature) {
  if (!razorpayWebhookSecret) return false;

  const expectedSignature = crypto.createHmac('sha256', razorpayWebhookSecret).update(rawBody).digest('hex');

  return expectedSignature === webhookSignature;
}
