/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import ContactForm from '@src/components/forms/ContactForm';
import { WhatsAppIcon, MailIcon, GlobeIcon, CodeIcon, GraduationCapIcon, ShoppingBagIcon, ZapIcon, BuildingIcon } from '@src/components/ui/Icons';
import styles from './contact.module.scss';

const seo = {
  title: 'Contact Homies Studio — Discuss Your Project or FYP',
  description: 'Get in touch with Homies Studio to discuss custom website development, startup software, college partnerships, or final year project guidance.',
  keywords: [
    'Contact Homies Studio',
    'Homies Studio WhatsApp',
    'Homies Studio Email',
    'Website Development Inquiry',
    'Final Year Project Support Contact',
    'AI Solutions Inquiry',
    'Engineering College Partnership Contact',
  ],
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
          item: 'https://www.homiesstudio.com/',
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
          <p className={clsx('p-l', styles.heroSubtitle)}>
            We&apos;re Here For Students, Colleges &amp; Startups Across India. Whether you need custom website development, urgent FYP guidance, or want to build an AI product &mdash; let&apos;s
            talk.
          </p>
        </div>

        {/* Contact Form Component */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="h3" style={{ marginBottom: '1rem', fontWeight: 750 }}>
            Send Us a Message
          </h2>
          <p className="p-m" style={{ marginBottom: '1.5rem', opacity: 0.85, maxWidth: '650px' }}>
            Fill out the form below with your inquiry details and our technical team will review and respond within 24 hours.
          </p>
          <ContactForm />
        </div>

        {/* Contact Channels Grid */}
        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <span className={styles.cardIcon}>
              <WhatsAppIcon size={28} color="#128c44" />
            </span>
            <h3 className={clsx('h4', styles.cardTitle)}>WhatsApp (Fastest)</h3>
            <a href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20would%20like%20to%20get%20in%20touch." target="_blank" rel="noopener noreferrer" className={styles.cardValue}>
              +91 74166 36417
            </a>
            <span className={styles.cardNote}>Instant replies · Mon - Sun (9 AM - 10 PM IST)</span>
          </div>

          <div className={styles.contactCard}>
            <span className={styles.cardIcon}>
              <MailIcon size={28} color="#c5a359" />
            </span>
            <h3 className={clsx('h4', styles.cardTitle)}>Official Email</h3>
            <a href="mailto:info@homiesstudio.com" className={styles.cardValue}>
              info@homiesstudio.com
            </a>
            <span className={styles.cardNote}>Response within 24 hours guaranteed</span>
          </div>

          <div className={styles.contactCard}>
            <span className={styles.cardIcon}>
              <GlobeIcon size={28} color="#c5a359" />
            </span>
            <h3 className={clsx('h4', styles.cardTitle)}>Service Area</h3>
            <span className={styles.cardValue}>Pan-India (100% Remote)</span>
            <span className={styles.cardNote}>Serving Bangalore, Hyderabad, AP &amp; all states</span>
          </div>
        </div>

        {/* Quick Direct Routing Hub */}
        <div style={{ margin: '2.5rem 0', padding: '2.25rem 1.75rem', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)' }}>
          <h3 className="h4" style={{ marginBottom: '0.6rem', fontWeight: 700 }}>
            Looking for a Specific Service Hub?
          </h3>
          <p className="p-m" style={{ maxWidth: '600px', margin: '0 auto 1.5rem', opacity: 0.8 }}>
            Navigate directly to our dedicated engineering wings for student guidance, product marketplace, startup builds, or college partnerships.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center' }}>
            <Link
              href="/website-development"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: '44px',
                padding: '0.65rem 1.4rem',
                borderRadius: '9999px',
                background: '#111115',
                color: '#f0f4f1',
                border: '1px solid rgba(255,255,255,0.15)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <CodeIcon size={16} color="#c5a359" /> Website Development →
            </Link>
            <Link
              href="/final-year-projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: '44px',
                padding: '0.65rem 1.4rem',
                borderRadius: '9999px',
                background: '#111115',
                color: '#f0f4f1',
                border: '1px solid rgba(255,255,255,0.15)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <GraduationCapIcon size={16} color="#c5a359" /> Final Year Project Guidance →
            </Link>
            <Link
              href="/mart"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: '44px',
                padding: '0.65rem 1.4rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.05)',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.14)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <ShoppingBagIcon size={16} color="currentColor" /> Homies Mart Marketplace →
            </Link>
            <Link
              href="/ai-solutions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: '44px',
                padding: '0.65rem 1.4rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.05)',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.14)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <ZapIcon size={16} color="currentColor" /> AI &amp; SaaS Solutions →
            </Link>
            <Link
              href="/for-colleges"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: '44px',
                padding: '0.65rem 1.4rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.05)',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.14)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <BuildingIcon size={16} color="currentColor" /> College Partnerships →
            </Link>
          </div>
        </div>

        {/* Action Box */}
        <div className={styles.formBox}>
          <h3 className={clsx('h2', styles.formTitle)}>Ready to Start Your Project?</h3>
          <p className={clsx('p-m', styles.formSubtitle)}>Tell us about your requirements on WhatsApp or send us an email. Our technical team is ready to assist you right away.</p>
          <div className={styles.directCtaRow}>
            <a href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20want%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" className={styles.whatsappCta}>
              <WhatsAppIcon size={18} /> Message on WhatsApp Now
            </a>
            <a href="mailto:info@homiesstudio.com" className={styles.emailCta}>
              <MailIcon size={18} /> Send Email Inquiry
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
