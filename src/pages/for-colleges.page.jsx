/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import clsx from 'clsx';
import styles from './for-colleges.module.scss';

const seo = {
  title: 'Engineering College Project Partnerships & FYP Mentorship | Homies Studio',
  description: 'Homies Studio partners with engineering colleges across India for structured FYP mentorship, domain expertise and student project management. IoT, AI/ML, Robotics and more.',
  keywords: [
    'College Partnership Program',
    'Engineering College FYP Support',
    'Final Year Project Mentorship for Colleges',
    'B.Tech College Project Management',
    'College Incubation Tech Support',
    'IoT Labs Mentorship',
    'AI ML College Workshops',
    'Homies Studio Institutional Partners',
  ],
  canonical: '/for-colleges',
};

const collegeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.homiesstudio.com/for-colleges#breadcrumb',
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
          name: 'For Colleges',
          item: 'https://www.homiesstudio.com/for-colleges',
        },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://www.homiesstudio.com/for-colleges#service',
      name: 'Engineering College Project Partnership Program',
      provider: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
      serviceType: 'Institutional Mentorship & Project Management',
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      description: 'Structured final year project supervision, department milestones, hardware kits, and evaluation support for engineering colleges across India.',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.homiesstudio.com/for-colleges#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does Homies Studio partner with engineering colleges?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We partner with departments (CSE, ECE, EEE, IT) to provide structured project supervision, industry-grade hardware/software blueprints, weekly review milestones, and evaluation support.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can Homies Studio support large student batches?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, our modular ecosystem allows us to support entire department cohorts with domain-specific tech leads, standard code templates, and progress tracking dashboards.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you conduct campus workshops and bootcamps?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, we conduct hands-on bootcamps in AI Agent Building, Industrial IoT, Robotics, and Full-Stack Engineering for partnered colleges.',
          },
        },
      ],
    },
  ],
};

const collegeOfferings = [
  {
    title: 'Curriculum-Aligned FYP Mentorship',
    desc: 'Structured project milestones aligning with university submission timelines, internal review rubrics, and final viva criteria.',
  },
  {
    title: 'Domain Expertise Across 9+ Fields',
    desc: 'Specialized guidance across IoT, Robotics, AI/ML, Embedded Systems, Computer Vision, and Full Stack Web architectures.',
  },
  {
    title: 'Hardware Kits & Component Logistics',
    desc: 'Sourcing, pre-testing, and shipping microcontrollers, sensors, and actuator kits directly to students or college labs.',
  },
  {
    title: 'Research Paper Publication Support',
    desc: 'Assisting top-performing student groups with documentation, formatting, and conference submissions (IEEE, Springer, Scopus).',
  },
  {
    title: 'Industry Evaluation & Viva Prep',
    desc: 'Mock viva defense sessions with practicing software architects and embedded hardware engineers.',
  },
  {
    title: 'Campus Incubation & Productization',
    desc: 'Helping standout student engineering projects transition into market-ready SaaS products or monetized creator projects on Homies Mart.',
  },
];

export default function ForCollegesPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={collegeSchema} />

      <div className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.taglineBadge}>🏛️ Institutional Partnership Program · Pan-India</div>
          <h1 className={clsx('h1', styles.heroTitle)}>Partner With Homies Studio — Final Year Project Support for Your College</h1>
          <p className={clsx('p-l', styles.heroSubtitle)}>
            Empower your engineering students with industry-standard project mentorship, specialized tech leads, and structured execution milestones. We partner with universities and colleges across
            India.
          </p>
          <div className={styles.ctaRow}>
            <a href="mailto:info@homiesstudio.com?subject=College%20Partnership%20Inquiry%20-%20Homies%20Studio" className={styles.primaryBtn}>
              ✉️ Email Partnership Team
            </a>
            <a
              href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20we%20would%20like%20to%20discuss%20a%20College%20Partnership."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
            >
              💬 Connect on WhatsApp (+91 74166 36417)
            </a>
          </div>
        </section>

        {/* What We Offer */}
        <section className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>What We Offer Colleges &amp; Departments</h2>
          <p className={styles.sectionDesc}>A plug-and-play engineering project support framework that elevates student outcome metrics and project quality.</p>
        </section>
        <div className={styles.gridCards}>
          {collegeOfferings.map((item) => (
            <div key={item.title} className={styles.featureCard}>
              <h3 className={clsx('h4', styles.cardTitle)}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <h2 className={clsx('h2', styles.sectionTitle)}>Frequently Asked Questions</h2>
            <p className={styles.sectionDesc}>Common questions about institutional collaborations and department partnerships.</p>
          </div>
          <div className={styles.faqList}>
            {collegeSchema['@graph'][2].mainEntity.map((faq) => (
              <div key={faq.name} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.name}</h3>
                <p className={styles.faqAnswer}>{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
