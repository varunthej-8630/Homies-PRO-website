/* eslint-disable */
// Rate limiting map: IP -> array of timestamps
// TODO: Replace with Upstash Redis in production
const ipSubmissions = new Map();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = ipSubmissions.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_SUBMISSIONS_PER_HOUR) {
    ipSubmissions.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  ipSubmissions.set(ip, validTimestamps);
  return false;
}

const ALLOWED_INQUIRY_TYPES = [
  'Student FYP Guidance',
  'College Partnership',
  'AI & SaaS Solutions',
  'Become a Creator',
  'General',
];

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
      error: 'Too many submissions from this connection. Please try again later or contact us on WhatsApp.',
    });
  }

  try {
    const { fullName, email, phone, inquiryType, message } = req.body || {};

    // Server-side validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Full Name is required.',
      });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'A valid email address is required.',
      });
    }

    if (!inquiryType || !ALLOWED_INQUIRY_TYPES.includes(inquiryType)) {
      return res.status(400).json({
        success: false,
        error: 'Please select a valid inquiry type.',
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 20 characters long.',
      });
    }

    const cleanedData = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: typeof phone === 'string' ? phone.trim() : '',
      inquiryType,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Send email via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn('[Contact API Warning]: RESEND_API_KEY is missing in environment variables. Email simulation recorded:', cleanedData);
      return res.status(200).json({
        success: true,
        message: "Message received. We'll reply within 24 hours.",
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
        reply_to: cleanedData.email,
        subject: `New Inquiry [${cleanedData.inquiryType}] from ${cleanedData.fullName}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 8px;">New Contact Inquiry Received</h2>
            <p><strong>Full Name:</strong> ${cleanedData.fullName}</p>
            <p><strong>Email Address:</strong> <a href="mailto:${cleanedData.email}">${cleanedData.email}</a></p>
            <p><strong>Phone Number:</strong> ${cleanedData.phone || 'Not provided'}</p>
            <p><strong>Inquiry Type:</strong> <span style="background: #eee; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${cleanedData.inquiryType}</span></p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; border-left: 4px solid #000; margin: 10px 0; padding: 12px;">${cleanedData.message.replace(/\n/g, '<br/>')}</blockquote>
            <p style="font-size: 12px; color: #777; margin-top: 20px;">Submitted on: ${cleanedData.submittedAt} from IP: ${ip}</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.warn('[Resend API Error]:', errorText);
      if (emailResponse.status === 403) {
        console.warn(
          '[Resend Sandbox Note]: Domain homiesstudio.com is not yet verified in Resend. Emails are currently restricted by Resend to your registered account email.'
        );
        return res.status(200).json({
          success: true,
          message: "Message received (Sandbox simulated). We'll reply within 24 hours.",
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Unable to deliver message at this time. Please contact us via WhatsApp or email directly.',
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message received. We'll reply within 24 hours.",
    });
  } catch (error) {
    console.error('[Contact Form API Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred. Please try again or reach out on WhatsApp.',
    });
  }
}
