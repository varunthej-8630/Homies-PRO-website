/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';

const seo = {
  title: 'Privacy Policy | Homies Studio',
  description: 'Homies Studio privacy policy — how we collect, use and protect your data.',
  canonical: 'https://www.homiesstudio.com/privacy-policy',
};

const privacySchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.homiesstudio.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Privacy Policy',
          item: 'https://www.homiesstudio.com/privacy-policy',
        },
      ],
    },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={privacySchema} />

      <section className={clsx('layout-block-inner')} style={{ color: '#fff', paddingTop: 'calc(var(--layout-columns-gap) * 3)', paddingBottom: 'calc(var(--layout-columns-gap) * 4)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>Privacy Policy</span>
          </nav>

          <h1 className="h1" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.15 }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '3rem' }}>Last updated: September 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', lineHeight: 1.7, fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>1. What Data We Collect</h2>
              <p>
                We collect personal information that you voluntarily provide to us when submitting inquiries through our contact forms, applying for mentorship or partnerships, or signing up for
                updates. This information may include:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number (optional)</li>
                <li>Inquiry details, project specifications, or institutional requirements</li>
                <li>Basic, non-identifiable usage analytics to improve website performance</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>2. How We Use It</h2>
              <p>The information collected is used solely for legitimate business purposes, including:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>Responding promptly to your project requests, FYP inquiries, or partnership proposals.</li>
                <li>Communicating updates regarding our marketplace and technical offerings.</li>
                <li>Analyzing site traffic and optimizing user experience.</li>
                <li>Fulfilling our contractual commitments and service agreements.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>3. Data Storage &amp; Security</h2>
              <p>
                Your contact form submissions and notification requests are securely processed and dispatched via our email service provider (Resend). We do not store sensitive payment credentials or
                sensitive personal data in your browser. All transmissions across our platform are encrypted in transit using industry-standard Transport Layer Security (TLS/HTTPS).
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>4. Third-Party Services</h2>
              <p>We collaborate with trusted third-party infrastructure providers to operate our platform securely and efficiently:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>
                  <strong>Resend:</strong> Used for transactional email dispatch and inquiry delivery.
                </li>
                <li>
                  <strong>Vercel:</strong> Used for global website hosting, edge infrastructure, and performance monitoring.
                </li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}>These providers process information strictly on our behalf and are bound by stringent confidentiality and data protection obligations.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>5. Your Rights</h2>
              <p>You retain full control over your personal information. Depending on your jurisdiction, your rights include:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>Accessing the personal data we hold about you.</li>
                <li>Requesting the correction of inaccurate or incomplete records.</li>
                <li>Requesting the permanent deletion of your contact data from our communication channels.</li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}>
                To exercise any of these rights, please write to us at{' '}
                <a href="mailto:info@homiesstudio.com" style={{ color: '#fff', fontWeight: 600, textDecoration: 'underline' }}>
                  info@homiesstudio.com
                </a>
                .
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>6. Cookies &amp; Tracking Technologies</h2>
              <p>
                We use functional cookies and localized browser storage (such as recording your cookie consent preferences) to ensure proper site navigation. Basic performance analytics cookies may
                also be utilized to evaluate aggregate visitor trends without identifying individual visitors.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>7. Contact Us</h2>
              <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data management practices, please contact our team directly:</p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Email:</strong>{' '}
                <a href="mailto:info@homiesstudio.com" style={{ color: '#fff', fontWeight: 600, textDecoration: 'underline' }}>
                  info@homiesstudio.com
                </a>
                <br />
                <strong>WhatsApp / Telephone:</strong> +91 74166 36417
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
