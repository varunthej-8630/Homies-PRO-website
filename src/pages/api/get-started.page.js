/* eslint-disable */
// Rate limiting map: IP -> array of timestamps
// TODO: Replace with Upstash Redis in production
const ipSubmissions = new Map();

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_SUBMISSIONS_PER_DAY = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = ipSubmissions.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_SUBMISSIONS_PER_DAY) {
    ipSubmissions.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  ipSubmissions.set(ip, validTimestamps);
  return false;
}

const VALID_SECTORS = [
  '01 — Engineering Student',
  '02 — College or University',
  '03 — EdTech Institute',
  '04 — Startup or Business',
  '05 — Other',
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
      error: 'Too many submissions from this connection today. Please reach out to us directly on WhatsApp.',
    });
  }

  try {
    const data = req.body || {};
    const {
      sector,
      name,
      fullName,
      email,
      phone,
      institutionName,
      designation,
      companyName,
      role,
      branch,
      projectDomain,
      submissionTimeline,
      studentIdea,
      requirementType,
      studentCount,
      institutionalTimeline,
      budgetRange,
      requirementDetails,
      productType,
      stage,
      startupBudget,
      startupTimeline,
      productDescription,
      subject,
      message,
      agreed,
    } = data;

    const applicantName = (name || fullName || '').trim();

    // 1. Validate agreement
    if (!agreed) {
      return res.status(400).json({
        success: false,
        error: 'You must agree to the Terms of Use and Privacy Policy.',
      });
    }

    // 2. Validate Sector
    if (!sector || !VALID_SECTORS.includes(sector)) {
      return res.status(400).json({
        success: false,
        error: 'Please select a valid sector.',
      });
    }

    // 3. Common fields validation
    if (!applicantName || applicantName.length < 2) {
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

    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Phone / WhatsApp number is required.',
      });
    }

    // 4. Sector-specific validation
    if (sector === '02 — College or University' || sector === '03 — EdTech Institute') {
      if (!institutionName || institutionName.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Institution Name is required.',
        });
      }
      if (!requirementType || requirementType.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Requirement Type is required.',
        });
      }
      if (!institutionalTimeline || institutionalTimeline.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Expected Timeline is required.',
        });
      }
      if (!requirementDetails || requirementDetails.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Requirement details and objectives are required.',
        });
      }
    } else if (sector === '01 — Engineering Student') {
      if (!branch || branch.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Engineering Branch is required.',
        });
      }
      if (!projectDomain || projectDomain.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Project Domain is required.',
        });
      }
      if (!submissionTimeline || submissionTimeline.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Expected Submission Timeline is required.',
        });
      }
    } else if (sector === '04 — Startup or Business') {
      if (!productType || productType.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'What you want to build is required.',
        });
      }
      if (!stage || stage.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Stage is required.',
        });
      }
      if (!startupTimeline || startupTimeline.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Expected Timeline is required.',
        });
      }
      if (!productDescription || productDescription.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Product / requirement description is required.',
        });
      }
    } else if (sector === '05 — Other') {
      if (!subject || subject.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Subject is required.',
        });
      }
      if (!message || message.trim().length < 30) {
        return res.status(400).json({
          success: false,
          error: 'Message must be at least 30 characters long.',
        });
      }
    }

    const cleanedEmail = email.trim();
    const cleanedPhone = phone.trim();
    const submissionTime = new Date().toISOString();

    // Prepare fields summary for email
    const fields = [
      { label: 'Sector', value: sector },
      { label: 'Full Name', value: applicantName },
      { label: 'Email', value: cleanedEmail },
      { label: 'Phone / WhatsApp', value: cleanedPhone },
    ];

    if (institutionName) fields.push({ label: 'Institution Name', value: institutionName });
    if (designation) fields.push({ label: 'Designation / Role', value: designation });
    if (companyName) fields.push({ label: 'Company / Startup Name', value: companyName });
    if (role) fields.push({ label: 'Role', value: role });
    if (branch) fields.push({ label: 'Branch', value: branch });
    if (projectDomain) fields.push({ label: 'Project Domain', value: projectDomain });
    if (submissionTimeline) fields.push({ label: 'Submission Timeline', value: submissionTimeline });
    if (studentIdea) fields.push({ label: 'Project Idea / Requirements', value: studentIdea });
    if (requirementType) fields.push({ label: 'Requirement Type', value: requirementType });
    if (studentCount) fields.push({ label: 'Number of Students', value: studentCount });
    if (institutionalTimeline) fields.push({ label: 'Expected Timeline', value: institutionalTimeline });
    if (budgetRange) fields.push({ label: 'Budget Range', value: budgetRange });
    if (requirementDetails) fields.push({ label: 'Requirement Details', value: requirementDetails });
    if (productType) fields.push({ label: 'What to Build', value: productType });
    if (stage) fields.push({ label: 'Stage', value: stage });
    if (startupBudget) fields.push({ label: 'Startup Budget Range', value: startupBudget });
    if (startupTimeline) fields.push({ label: 'Startup Timeline', value: startupTimeline });
    if (productDescription) fields.push({ label: 'Product Description', value: productDescription });
    if (subject) fields.push({ label: 'Subject', value: subject });
    if (message) fields.push({ label: 'Message', value: message });

    const fieldsHtml = fields
      .map(
        (f) => `
        <tr style="border-bottom: 1px solid #222;">
          <td style="padding: 10px 14px; font-weight: bold; color: #888; width: 35%;">${f.label}</td>
          <td style="padding: 10px 14px; color: #111;">${String(f.value).replace(/\n/g, '<br/>')}</td>
        </tr>
      `
      )
      .join('');

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn('[Get-Started API Warning]: RESEND_API_KEY is missing in environment variables. Inquiry recorded locally:', {
        sector,
        name: applicantName,
        email: cleanedEmail,
        phone: cleanedPhone,
        fields,
        submittedAt: submissionTime,
      });
      return res.status(200).json({
        success: true,
        message: "Inquiry received. We'll get back to you within 24 hours.",
      });
    }

    // 1. Admin Email to info@homiesstudio.com
    const adminEmailPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Homies Studio <info@homiesstudio.com>',
        to: ['info@homiesstudio.com'],
        reply_to: cleanedEmail,
        subject: `New Inquiry — ${sector} — ${applicantName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #111; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff;">
            <div style="margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 12px;">
              <h2 style="margin: 0; color: #000; font-size: 20px; font-weight: 800;">New Inquiry Received</h2>
              <p style="margin: 4px 0 0; color: #666; font-size: 14px;">From ${applicantName} (${sector})</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tbody>
                ${fieldsHtml}
              </tbody>
            </table>
            
            <div style="font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 12px;">
              Submitted at ${submissionTime} from IP ${ip}
            </div>
          </div>
        `,
      }),
    });

    // 2. Confirmation Email to the user
    const userEmailPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Homies Studio <info@homiesstudio.com>',
        to: [cleanedEmail],
        subject: "We've received your inquiry — Homies Studio",
        text: `Hi ${applicantName},\n\nThanks for reaching out. Our team will contact you within 24 hours on WhatsApp (+91 74166 36417) or at ${cleanedEmail}.\n\n— Homies Studio Team\nhttps://homiesstudio.com`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #000; margin-top: 0;">We've received your inquiry.</h2>
            <p>Hi <strong>${applicantName}</strong>,</p>
            <p>Thanks for reaching out to Homies Studio. Our team will contact you within 24 hours on WhatsApp (<strong>+91 74166 36417</strong>) or at <strong>${cleanedEmail}</strong>.</p>
            <p style="margin-top: 24px;">Need urgent assistance? <a href="https://wa.me/917416636417" style="color: #0070f3; font-weight: 600;">Chat with us directly on WhatsApp</a>.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
            <p style="font-size: 13px; color: #666; margin: 0;">
              <strong>Homies Studio</strong><br/>
              Building the next generation of academic tech & modern software.
            </p>
          </div>
        `,
      }),
    });

    // Execute both in parallel
    const [adminRes, userRes] = await Promise.allSettled([adminEmailPromise, userEmailPromise]);

    let resendError = null;
    if (adminRes.status === 'fulfilled' && !adminRes.value.ok) {
      try {
        resendError = await adminRes.value.json();
      } catch (e) {
        resendError = adminRes.value.statusText;
      }
      console.warn('[Resend API Admin Notification]:', resendError);
    } else if (adminRes.status === 'rejected') {
      console.warn('[Resend API Network Error]:', adminRes.reason);
    }

    if (userRes.status === 'fulfilled' && !userRes.value.ok) {
      try {
        const userErr = await userRes.value.json();
        console.warn('[Resend API User Confirmation]:', userErr);
      } catch (e) {
        // ignore
      }
    }

    // If Resend returns 403 (unverified domain / sandbox limitation where emails can only go to the account owner)
    // or if in local development, record submission and return success so testing flow works smoothly
    if (adminRes.status === 'fulfilled' && adminRes.value.status === 403) {
      console.warn(
        '[Resend Sandbox Note]: Domain homiesstudio.com is not yet verified in Resend. Emails are currently restricted by Resend to your registered account email. Verification link: https://resend.com/domains'
      );
      return res.status(200).json({
        success: true,
        message: 'Inquiry received successfully (Sandbox simulated).',
      });
    }

    if (adminRes.status === 'rejected' || (adminRes.status === 'fulfilled' && !adminRes.value.ok && adminRes.value.status >= 500)) {
      return res.status(500).json({
        success: false,
        error: 'Unable to deliver inquiry at this moment. Please reach out to us via WhatsApp.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry received successfully.',
    });
  } catch (error) {
    console.error('[Get-Started API Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred. Please try again or reach out on WhatsApp.',
    });
  }
}
