/* eslint-disable no-console */
// Next.js API route for Homies Studio multi-sector enquiry submissions
// Endpoint: POST /api/enquiry

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Please use POST.`,
    });
  }

  try {
    const { sector, formData, contact, details, referenceId } = req.body || {};

    const activeSector = sector || 'OTHER';
    const activeContact = formData || contact || {};

    const name = activeContact.contactPerson || activeContact.name || 'Anonymous';
    const email = activeContact.email || '';
    const phone = activeContact.phone || '';
    const message = activeContact.message || details?.projectRequirements || 'Enquiry submitted.';

    // Generate Reference ID if not supplied
    const enquiryId = referenceId || `HS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const enquiryRecord = {
      enquiryId,
      sector: activeSector,
      name,
      email,
      phone,
      institutionOrCompany: activeContact.institutionName || activeContact.companyName || '',
      serviceType: activeContact.requirementType || details?.projectType || '',
      message,
      createdAt,
    };

    console.log('[Homies Studio Enquiry Received]:', JSON.stringify(enquiryRecord, null, 2));

    return res.status(200).json({
      success: true,
      enquiryId,
      message: "We've received your enquiry and will get back to you shortly.",
      data: enquiryRecord,
    });
  } catch (error) {
    console.error('[Homies Studio Enquiry API Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your enquiry. Please try again or continue on WhatsApp.',
    });
  }
}
