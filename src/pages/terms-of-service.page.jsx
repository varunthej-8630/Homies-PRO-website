/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './legal.module.scss';

const seo = {
  title: 'Terms of Service | Homies Studio',
  description: 'Terms of Service governing the use of Homies Studio website, project guidance programs, creator marketplace, and AI engineering services.',
  keywords: ['Terms of Service', 'Terms and Conditions', 'Homies Studio Terms', 'User Agreement'],
  canonical: '/terms-of-service',
};

const termsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.homiesstudio.com/terms-of-service#breadcrumb',
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
          name: 'Terms of Service',
          item: 'https://www.homiesstudio.com/terms-of-service',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.homiesstudio.com/terms-of-service#webpage',
      url: 'https://www.homiesstudio.com/terms-of-service',
      name: 'Terms of Service — Homies Studio',
      description: 'Terms of Service and legal agreements for Homies Studio users, students, creators, and enterprise clients.',
      publisher: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
    },
  ],
};

export default function TermsOfServicePage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={termsSchema} />

      <div className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.header}>
          <div className={styles.taglineBadge}>Legal &amp; Trust</div>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last Updated: September 2024</p>
        </div>

        <div className={styles.content}>
          <p>
            These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and Homies Studio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), governing your access
            to and use of <Link href="/">homiesstudio.com</Link> and associated services. By accessing or using our website, services, or marketplace, you agree to be bound by these Terms.
          </p>

          <h2>1. Services Overview</h2>
          <p>Homies Studio provides technical services across three primary areas:</p>
          <ul>
            <li>
              <strong>Final Year Project Guidance:</strong> Academic project mentoring, source code guidance, hardware circuit design, and documentation assistance for educational purposes.
            </li>
            <li>
              <strong>Homies Mart Marketplace:</strong> A curated digital platform enabling buyers to discover and purchase verified engineering projects and creators to monetize their technical
              builds.
            </li>
            <li>
              <strong>AI &amp; Product Solutions:</strong> Custom software, SaaS platforms, and AI agent engineering for startups, EdTech companies, and enterprises.
            </li>
          </ul>

          <h2>2. User Responsibilities &amp; Academic Integrity</h2>
          <p>
            When utilizing our project guidance and educational deliverables, students are expected to use all materials as learning references and educational foundations to understand engineering
            concepts and viva defense principles. Users agree not to misuse intellectual property or violate their respective institution&apos;s academic policies.
          </p>

          <h2>3. Marketplace Transactions &amp; Creator Terms</h2>
          <p>
            Creators publishing technical projects on Homies Mart warrant that they own or have the lawful rights to the code and documentation submitted. Buyers receive a non-exclusive license to use
            downloaded digital assets for educational or authorized development purposes.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All original branding, designs, illustrations, software code, and written content on homiesstudio.com are the exclusive intellectual property of Homies Studio, protected by applicable
            copyright and trademark laws.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            Homies Studio provides services and materials on an &quot;as is&quot; and &quot;as available&quot; basis. In no event shall Homies Studio be liable for indirect, incidental, or
            consequential damages arising from the use of our services or digital assets.
          </p>

          <h2>6. Contact Information</h2>
          <p>
            For legal inquiries or questions regarding these Terms, contact us at <a href="mailto:info@homiesstudio.com">info@homiesstudio.com</a> or via WhatsApp at{' '}
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
