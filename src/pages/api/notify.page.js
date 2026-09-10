/* eslint-disable */
// Rate limiting map: IP -> array of timestamps
// TODO: Replace with Upstash Redis in production
const ipNotifySubmissions = new Map();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 1;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = ipNotifySubmissions.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_SUBMISSIONS_PER_HOUR) {
    ipNotifySubmissions.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  ipNotifySubmissions.set(ip, validTimestamps);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Please use POST.',
    });
  }

  // Get Client IP for Rate Limiting
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown-ip';

  if (isRateLimited(ip)) {
    return res.status(429).json({
      success: false,
      error: 'Too many notification requests. Please try again in an hour.',
    });
  }

  try {
    const { email } = req.body || {};

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    const cleanEmail = email.trim();
    const timestamp = new Date().toISOString();

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn('[Notify API Warning]: RESEND_API_KEY is missing in environment variables. Email simulation recorded for notify list:', cleanEmail);
      return res.status(200).json({
        success: true,
        message: "You're on the list.",
      });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Homies Studio <info@homiesstudio.com>',
        to: ['info@homiesstudio.com'],
        reply_to: cleanEmail,
        subject: `New Homies Mart Launch Notification Request: ${cleanEmail}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 8px;">Homies Mart Waitlist Signup</h2>
            <p>A user has requested to be notified when real projects go live on Homies Mart.</p>
            <p><strong>Email Address:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
            <p style="font-size: 12px; color: #777; margin-top: 20px;">Submitted on: ${timestamp} from IP: ${ip}</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('[Resend API Error]:', errorText);
      return res.status(500).json({
        success: false,
        error: 'Unable to register notification at this time.',
      });
    }

    return res.status(200).json({
      success: true,
      message: "You're on the list.",
    });
  } catch (error) {
    console.error('[Notify Form API Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred.',
    });
  }
}
