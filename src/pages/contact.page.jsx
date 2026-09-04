/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import clsx from 'clsx';
import styles from './contact.module.scss';

const seo = {
  title: 'Contact Homies Studio — WhatsApp, Email & Project Inquiries | India',
  description: 'Get in touch with Homies Studio for final year project guidance, college partnerships, or AI product development. Direct WhatsApp and email support available daily.',
  keywords: ['Contact Homies Studio', 'Homies Studio WhatsApp', 'Homies Studio Email', 'Final Year Project Support Contact', 'AI Solutions Inquiry', 'Engineering College Partnership Contact'],
  canonical: '/contact',
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.homiesstudio.com/contact#breadcrumb',
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
    {
      '@type': 'ContactPage',
      '@id': 'https://www.homiesstudio.com/contact#page',
      url: 'https://www.homiesstudio.com/contact',
      name: 'Contact Homies Studio',
      description: 'Official contact channels for Homies Studio final year project guidance, college partnerships, and AI product development.',
      mainEntity: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={contactSchema} />

      <div className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.taglineBadge}>📍 Pan-India Remote Service · Fast Response</div>
          <h1 className={clsx('h1', styles.heroTitle)}>Get In Touch With Homies Studio</h1>
          <p className={clsx('p-l', styles.heroSubtitle)}>
            We&apos;re here for students, colleges &amp; startups across India. Whether you need urgent FYP guidance, wish to partner with your institution, or want to build an AI product — let&apos;s
            talk.
          </p>
        </section>

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

        {/* Action Box */}
        <section className={styles.formBox}>
          <h2 className={clsx('h2', styles.formTitle)}>Ready to Start Your Project?</h2>
          <p className={clsx('p-m', styles.formSubtitle)}>Tell us about your requirements on WhatsApp or send us an email. Our technical team is ready to assist you right away.</p>
          <div className={styles.directCtaRow}>
            <a href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20want%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" className={styles.whatsappCta}>
              💬 Message on WhatsApp Now
            </a>
            <a href="mailto:info@homiesstudio.com" className={styles.emailCta}>
              ✉️ Send Email Inquiry
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
