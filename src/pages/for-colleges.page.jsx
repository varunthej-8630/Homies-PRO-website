import Link from 'next/link';
/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import clsx from 'clsx';
import AccordionFAQ from '@src/components/ui/AccordionFAQ';
import { LandmarkIcon, MailIcon, WhatsAppIcon, GraduationCapIcon, ShoppingBagIcon, BuildingIcon } from '@src/components/ui/Icons';
import styles from './for-colleges.module.scss';

const seo = {
  title: 'Engineering College Partnerships & FYP Support | Homies Studio',
  description: 'Partner with Homies Studio for structured final year project guidance, lab mentorship, and technical bootcamps for engineering institutions.',
  keywords: [
    'College Partnership Program',
    'Engineering College FYP Support',
    'Final Year Projects Mentorship for Colleges',
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
          name: 'For Colleges',
          item: 'https://www.homiesstudio.com/for-colleges',
        },
      ],
    },
  ],
};

const faqs = [
  {
    q: 'How does Homies Studio partner with engineering colleges?',
    a: 'We partner with departments (CSE, ECE, EEE, IT) to provide structured project supervision, industry-grade hardware/software blueprints, weekly review milestones, and evaluation support.',
  },
  {
    q: 'Can Homies Studio support large student batches?',
    a: 'Yes, our modular ecosystem allows us to support entire department cohorts with domain-specific tech leads, standard code templates, and progress tracking dashboards.',
  },
  {
    q: 'Do you conduct campus workshops and bootcamps?',
    a: 'Yes, we conduct hands-on bootcamps in AI Agent Building, Industrial IoT, Robotics, and Full-Stack Engineering for partnered colleges.',
  },
];

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

      <section className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.taglineBadge}>
            <LandmarkIcon size={14} color="#c5a359" />
            <span>Institutional Partnership Program · Pan-India</span>
          </div>
          <h1 className={clsx('h1', styles.heroTitle)}>Partner With Homies Studio — Final Year Project Support for Your College</h1>
          <p className={clsx('p-l', styles.heroSubtitle)}>
            Empower your engineering students with industry-standard project mentorship, specialized tech leads, and structured execution milestones. We partner with universities and colleges across
            India.
          </p>
          <div className={styles.ctaRow}>
            <a href="mailto:info@homiesstudio.com?subject=College%20Partnership%20Inquiry%20-%20Homies%20Studio" className={styles.primaryBtn}>
              <MailIcon size={18} />
              <span>Email Partnership Team</span>
            </a>
            <a
              href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20we%20would%20like%20to%20discuss%20a%20College%20Partnership."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <WhatsAppIcon size={18} />
              <span>Connect on WhatsApp (+91 74166 36417)</span>
            </a>
          </div>
        </div>

        {/* What We Offer */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>What We Offer Colleges &amp; Departments</h2>
          <p className={styles.sectionDesc}>A plug-and-play engineering project support framework that elevates student outcome metrics and project quality.</p>
        </div>
        <div className={styles.gridCards}>
          {collegeOfferings.map((item) => (
            <div key={item.title} className={styles.featureCard}>
              <h3 className={clsx('h4', styles.cardTitle)}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Connected Ecosystem */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>Explore Related Resources</h2>
          <p className={styles.sectionDesc}>Discover complementary programs for student projects, ready-made builds, and institutional collaborations.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', margin: '1.5rem 0 3.5rem' }}>
          <Link href="/final-year-projects" className={styles.ecosystemLink}>
            <GraduationCapIcon size={16} color="#c5a359" />
            <span>Student Final Year Projects Guidance &rarr;</span>
          </Link>
          <Link href="/mart" className={styles.ecosystemLink}>
            <ShoppingBagIcon size={16} color="#c5a359" />
            <span>Browse Homies Mart Repository &rarr;</span>
          </Link>
          <Link href="/about" className={styles.ecosystemLink}>
            <BuildingIcon size={16} color="#c5a359" />
            <span>About Homies Studio &rarr;</span>
          </Link>
          <Link href="/contact" className={styles.ecosystemLink}>
            <MailIcon size={16} color="#c5a359" />
            <span>Contact Partnership Team &rarr;</span>
          </Link>
        </div>

        {/* FAQs */}
        <div className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <h2 className={clsx('h2', styles.sectionTitle)}>Frequently Asked Questions</h2>
            <p className={styles.sectionDesc}>Common questions about institutional collaborations and department partnerships.</p>
          </div>
          <AccordionFAQ items={faqs} />
        </div>
      </section>
    </>
  );
}
