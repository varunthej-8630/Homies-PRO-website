/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './legal.module.scss';

const seo = {
  title: 'Refund & Cancellation Policy | Homies Studio',
  description: 'Refund & Cancellation Policy for Homies Studio project guidance programs, marketplace digital assets, and custom AI development services.',
  keywords: ['Refund Policy', 'Cancellation Policy', 'Homies Studio Returns', 'Customer Protection'],
  canonical: '/refund-policy',
};

const refundSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.homiesstudio.com/refund-policy#breadcrumb',
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
          name: 'Refund Policy',
          item: 'https://www.homiesstudio.com/refund-policy',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.homiesstudio.com/refund-policy#webpage',
      url: 'https://www.homiesstudio.com/refund-policy',
      name: 'Refund & Cancellation Policy — Homies Studio',
      description: 'Refund, return, and cancellation policies for Homies Studio clients, students, and marketplace buyers.',
      publisher: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
    },
  ],
};

export default function RefundPolicyPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={refundSchema} />

      <div className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.header}>
          <div className={styles.taglineBadge}>Legal &amp; Trust</div>
          <h1 className={styles.title}>Refund &amp; Cancellation Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: September 2024</p>
        </div>

        <div className={styles.content}>
          <p>
            At Homies Studio (<Link href="/">homiesstudio.com</Link>), customer satisfaction, clear communication, and transparency are fundamental to how we operate. This Refund &amp; Cancellation
            Policy outlines the guidelines for refunds across our project guidance services, digital marketplace products, and custom development contracts.
          </p>

          <h2>1. Digital Marketplace Purchases (Homies Mart)</h2>
          <p>
            Due to the downloadable nature of source code, circuit schematics, and digital documents, purchases made on Homies Mart are generally non-refundable once digital access or download links
            have been granted. However, refunds or replacement credits will be promptly honored under the following circumstances:
          </p>
          <ul>
            <li>The downloaded archive is corrupted, incomplete, or missing critical core files described in the product listing.</li>
            <li>The codebase fundamentally fails to match the documented technical specifications and our support team is unable to rectify the issue within 48 hours.</li>
            <li>Duplicate charges or erroneous double billing occurred during checkout.</li>
          </ul>

          <h2>2. Final Year Project Guidance &amp; Mentorship</h2>
          <p>
            For customized project guidance programs, payments are typically split into milestones (e.g. topic approval, hardware assembly, software implementation, final review). If you wish to
            cancel prior to the commencement of technical work on an upcoming milestone, a prorated refund for unexecuted milestones may be requested.
          </p>

          <h2>3. Custom AI &amp; B2B Software Engineering</h2>
          <p>
            B2B software contracts and bespoke development projects operate under defined Statements of Work (SOW) with staged milestone deliverables and acceptance testing periods as agreed in your
            service agreement.
          </p>

          <h2>4. How to Request Support or a Refund</h2>
          <p>To initiate a review or request resolution, please contact our support team within 7 days of purchase:</p>
          <ul>
            <li>
              Email: <a href="mailto:info@homiesstudio.com">info@homiesstudio.com</a> with your Order ID or project name.
            </li>
            <li>
              WhatsApp:{' '}
              <a href="https://wa.me/917416636417" target="_blank" rel="noopener noreferrer">
                +91 74166 36417
              </a>{' '}
              for direct assistance.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
