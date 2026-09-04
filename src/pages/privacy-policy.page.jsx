/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './legal.module.scss';

const seo = {
  title: 'Privacy Policy | Homies Studio',
  description: 'Privacy Policy for Homies Studio. Learn how we collect, use, and protect your personal information across our final year project guidance, marketplace, and AI services.',
  keywords: ['Privacy Policy', 'Homies Studio Privacy', 'Data Protection', 'Terms'],
  canonical: '/privacy-policy',
};

const policySchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.homiesstudio.com/privacy-policy#breadcrumb',
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
    {
      '@type': 'WebPage',
      '@id': 'https://www.homiesstudio.com/privacy-policy#webpage',
      url: 'https://www.homiesstudio.com/privacy-policy',
      name: 'Privacy Policy — Homies Studio',
      description: 'Privacy Policy and data protection standards of Homies Studio.',
      publisher: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
    },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={policySchema} />

      <div className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.header}>
          <div className={styles.taglineBadge}>Legal &amp; Trust</div>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: September 2024</p>
        </div>

        <div className={styles.content}>
          <p>
            Welcome to Homies Studio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you visit our website (<Link href="/">homiesstudio.com</Link>) or use our services, including Final Year Project
            guidance, Homies Mart marketplace, and AI product engineering.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways, including:</p>
          <ul>
            <li>
              <strong>Personal Data:</strong> Name, email address, phone/WhatsApp number, college/university name, and academic branch provided voluntarily when requesting project guidance or
              submitting inquiries.
            </li>
            <li>
              <strong>Account &amp; Creator Data:</strong> Credentials, profile information, and technical project files uploaded by creators on Homies Mart.
            </li>
            <li>
              <strong>Payment &amp; Transaction Details:</strong> Billing details and transaction records processed securely through verified payment gateways (e.g. Razorpay/Stripe). We do not store
              sensitive credit card numbers or banking passwords on our servers.
            </li>
            <li>
              <strong>Technical Usage Data:</strong> IP address, browser type, operating system, access times, and pages viewed directly to optimize website performance and responsiveness.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information collected to:</p>
          <ul>
            <li>Provide, maintain, and deliver personalized final year project mentorship and documentation.</li>
            <li>Process marketplace transactions and digital asset deliveries on Homies Mart.</li>
            <li>Communicate with you regarding project updates, technical support, and customer inquiries via WhatsApp or email.</li>
            <li>Protect against fraudulent transactions, unauthorized access, and security violations.</li>
          </ul>

          <h2>3. Data Protection and Security</h2>
          <p>
            We implement industry-standard technical and organizational security measures to protect your personal information. Database communications are encrypted via SSL/TLS, and authentication is
            handled through secure role-based protocols.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>
            We do not sell, rent, or trade your personal information. We may share information with trusted third-party service providers (such as hosting infrastructure, database hosting via
            Supabase, and payment gateways) solely to fulfill our service commitments.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact our team at <a href="mailto:info@homiesstudio.com">info@homiesstudio.com</a> or via WhatsApp at{' '}
            <a href="https://wa.me/917416636417" target="_blank" rel="noopener noreferrer">
              +91 74166 36417
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
