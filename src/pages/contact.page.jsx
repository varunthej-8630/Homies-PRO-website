/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './contact.module.scss';

const seo = {
  title: 'Contact Homies Studio — Final Year Projects & AI Solutions | India',
  description: 'Contact Homies Studio for final year project guidance, college partnerships, or AI solution development. Reach us on WhatsApp, email, or through our contact form. Serving pan-India.',
  keywords: ['Contact Homies Studio', 'Homies Studio WhatsApp', 'Homies Studio Email', 'Final Year Project Support Contact', 'AI Solutions Inquiry', 'Engineering College Partnership Contact'],
  canonical: '/contact',
};

const contactSchema = {
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
          name: 'Contact',
          item: 'https://www.homiesstudio.com/contact',
        },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={contactSchema} />

      <section className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.taglineBadge}>📍 Pan-India Remote Service · Fast Response</div>
          <h1 className={clsx('h1', styles.heroTitle)}>Get In Touch With Homies Studio</h1>
          <h2 className={clsx('p-l', styles.heroSubtitle)}>
            We&apos;re Here For Students, Colleges &amp; Startups Across India. Whether you need urgent FYP guidance, wish to partner with your institution, or want to build an AI product &mdash;
            let&apos;s talk.
          </h2>
        </div>

        {/* Contact Channels Grid */}
        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <span className={styles.cardIcon}>💬</span>
            <h3 className={clsx('h4', styles.cardTitle)}>WhatsApp (Fastest)</h3>
            <a href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20would%20like%20to%20get%20in%20touch." target="_blank" rel="noopener noreferrer" className={styles.cardValue}>
              +91 74166 36417
            </a>
            <span className={styles.cardNote}>Instant replies · Mon - Sun (9 AM - 10 PM IST)</span>
          </div>

          <div className={styles.contactCard}>
            <span className={styles.cardIcon}>✉️</span>
            <h3 className={clsx('h4', styles.cardTitle)}>Official Email</h3>
            <a href="mailto:info@homiesstudio.com" className={styles.cardValue}>
              info@homiesstudio.com
            </a>
            <span className={styles.cardNote}>Response within 24 hours guaranteed</span>
          </div>

          <div className={styles.contactCard}>
            <span className={styles.cardIcon}>🇮🇳</span>
            <h3 className={clsx('h4', styles.cardTitle)}>Service Area</h3>
            <span className={styles.cardValue}>Pan-India (100% Remote)</span>
            <span className={styles.cardNote}>Serving Bangalore, Hyderabad, AP &amp; all states</span>
          </div>
        </div>

        {/* Quick Direct Routing Hub */}
        <div style={{ margin: '2.5rem 0', padding: '2rem 1.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)' }}>
          <h3 className="h4" style={{ marginBottom: '0.6rem', fontWeight: 700 }}>
            Looking for a Specific Service Hub?
          </h3>
          <p className="p-m" style={{ maxWidth: '600px', margin: '0 auto 1.5rem', opacity: 0.8 }}>
            Navigate directly to our dedicated engineering wings for student guidance, product marketplace, startup builds, or college partnerships.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center' }}>
            <Link
              href="/final-year-projects"
              style={{ padding: '0.65rem 1.3rem', borderRadius: '9999px', background: '#000', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
            >
              🎓 Final Year Project Guidance &rarr;
            </Link>
            <Link
              href="/mart"
              style={{
                padding: '0.65rem 1.3rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.06)',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.15)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              🛒 Homies Mart Marketplace &rarr;
            </Link>
            <Link
              href="/ai-solutions"
              style={{
                padding: '0.65rem 1.3rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.06)',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.15)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              ⚡ AI &amp; SaaS Solutions &rarr;
            </Link>
            <Link
              href="/for-colleges"
              style={{
                padding: '0.65rem 1.3rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.06)',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.15)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              🏛️ College Partnerships &rarr;
            </Link>
          </div>
        </div>

        {/* Action Box */}
        <div className={styles.formBox}>
          <h3 className={clsx('h2', styles.formTitle)}>Ready to Start Your Project?</h3>
          <p className={clsx('p-m', styles.formSubtitle)}>Tell us about your requirements on WhatsApp or send us an email. Our technical team is ready to assist you right away.</p>
          <div className={styles.directCtaRow}>
            <a href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20want%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" className={styles.whatsappCta}>
              💬 Message on WhatsApp Now
            </a>
            <a href="mailto:info@homiesstudio.com" className={styles.emailCta}>
              ✉️ Send Email Inquiry
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
