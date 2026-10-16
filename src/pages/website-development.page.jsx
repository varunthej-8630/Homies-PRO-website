/* eslint-disable react/jsx-props-no-spreading */
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import clsx from 'clsx';
import styles from './website-development.module.scss';

const seo = {
  title: 'Custom Website Development Services | Homies Studio',
  description: '100% custom-coded business websites, web applications, and digital platforms built around your workflow and brand. No generic templates.',
  keywords: [
    'Custom Website Development',
    'Custom Coded Websites India',
    'Business Website Development',
    'Web Application Development',
    'Ecommerce Website Development India',
    'Custom Web Portals',
    'Next.js Website Development',
    'Homies Studio Web Development',
  ],
  canonical: '/website-development',
};

const pageSchema = {
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
          name: 'Website Development',
          item: 'https://www.homiesstudio.com/website-development',
        },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://www.homiesstudio.com/website-development#service',
      name: 'Custom Website & Web Application Development',
      provider: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
      serviceType: 'Website Development',
      description: 'Custom-coded business websites, online stores, web applications, and portals built around your brand and workflow.',
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
    },
  ],
};

const faqs = [
  {
    q: 'How does Homies Studio approach website development?',
    a: 'We design and build custom-coded websites tailored around your brand, your audience, and your workflow, rather than relying on off-the-shelf templates.',
  },
  {
    q: 'What types of websites do you build?',
    a: 'We build company websites, online stores, custom web applications, customer portals, booking/inquiry workflows, and AI-powered web tools.',
  },
  {
    q: 'How does pricing work for custom website projects?',
    a: 'Every project begins with a conversation to understand your goals, features, and timeline. We then prepare a transparent, custom quote before development starts.',
  },
];

const principles = [
  {
    num: '01',
    title: 'Designed for your brand',
    desc: 'The visual direction is developed around your business, audience, and brand identity.',
  },
  {
    num: '02',
    title: 'Custom-coded functionality',
    desc: 'Website features are developed to meet the agreed requirements rather than relying on a pre-made website template.',
  },
  {
    num: '03',
    title: 'Built around your workflow',
    desc: 'Features can include enquiry forms, online stores, booking systems, customer portals, subscription management, and other custom functionality, depending on the project scope.',
  },
  {
    num: '04',
    title: 'Flexible for future growth',
    desc: 'The architecture and functionality are planned around the project requirements and the possibility of future improvements.',
  },
];

const capabilities = [
  {
    icon: '🌐',
    title: 'Business & Company Websites',
    desc: 'Clean, professional digital presences designed to clearly communicate what your business does and convert visitors into clients.',
  },
  {
    icon: '🛍️',
    title: 'E-commerce & Online Stores',
    desc: 'Direct-to-consumer catalogs, cart flows, secure payment gateway integrations, and order management tailored to your products.',
  },
  {
    icon: '⚡',
    title: 'Web Applications & Portals',
    desc: 'Interactive customer portals, dashboards, internal business tools, and data-driven platforms engineered with modern frameworks.',
  },
  {
    icon: '📅',
    title: 'Booking & Enquiry Workflows',
    desc: 'Structured intake forms, calendar schedulers, automated notifications, and lead management built into your daily operations.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Websites & Tools',
    desc: 'Custom software, intelligent assistants, document parsing, and dynamic features integrated seamlessly into your web experience.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Understand',
    desc: 'We discuss your business, goals, audience, and requirements.',
  },
  {
    num: '02',
    title: 'Define',
    desc: 'We agree on the scope, functionality, design direction, deliverables, and timeline.',
  },
  {
    num: '03',
    title: 'Build',
    desc: 'We develop the website and review progress with you against the agreed requirements.',
  },
  {
    num: '04',
    title: 'Launch',
    desc: 'We test the website, prepare it for launch, and agree on any ongoing support needed.',
  },
];

export default function WebsiteDevelopmentPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={pageSchema} />

      <section className={clsx(styles.root, 'layout-block-inner')}>
        {/* Section 1 — Hero */}
        <div className={styles.heroSection}>
          <div className={styles.taglineBadge}>💻 Custom Website Development · Homies Studio</div>
          <h1 className={clsx('h1', styles.heroTitle)}>Your business deserves more than a template.</h1>
          <p className={clsx('p-l', styles.heroSubtitle)}>We design and build custom-coded websites around your business, your customers, and the way you work.</p>
          <p className={styles.heroAdditional}>From business websites and online stores to web applications and custom business tools, every project starts with your requirements.</p>
          <div className={styles.ctaRow}>
            <Link href="/get-started?sector=business&product=website" className={styles.primaryBtn}>
              Discuss Your Website &rarr;
            </Link>
            <a
              href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20would%20like%20to%20discuss%20a%20website%20development%20project."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              💬 Chat on WhatsApp
            </a>
            <Link href="/contact" className={styles.secondaryBtn}>
              General Contact &rarr;
            </Link>
          </div>
        </div>

        {/* Section 2 — Our Development Approach */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>Our Development Approach — 100% Custom-Coded</h2>
          <p className={styles.sectionDesc}>
            We build websites around your brand, your requirements, and the experience you want to create for your customers. The goal is to deliver a website that feels unique to your business,
            rather than a standard template with your logo and colours added.
          </p>
        </div>
        <div className={styles.principlesGrid}>
          {principles.map((item) => (
            <div key={item.title} className={styles.principleCard}>
              <span className={styles.cardNumber}>{item.num}</span>
              <h3 className={clsx('h4', styles.cardTitle)}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Section 3 — What We Can Build */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>What We Can Build</h2>
          <p className={styles.sectionDesc}>Whether you need a new website from scratch or custom functionality for your business operations, we plan and build around your project scope.</p>
        </div>
        <div className={styles.buildGrid}>
          {capabilities.map((item) => (
            <div key={item.title} className={styles.buildCard}>
              <div className={styles.buildIcon}>{item.icon}</div>
              <h3 className={clsx('h4', styles.cardTitle)}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Section 4 — How We Work */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>From First Conversation to Launch</h2>
          <p className={styles.sectionDesc}>A structured, collaborative process focused on clear communication, transparency, and steady progress.</p>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((item) => (
            <div key={item.num} className={styles.stepCard}>
              <span className={styles.stepNumber}>{item.num}</span>
              <h3 className={clsx('h4', styles.stepTitle)}>{item.title}</h3>
              <p className={styles.stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Section 5 — Pricing and Scope */}
        <div className={styles.pricingBlock}>
          <h2 className={clsx('h2', styles.pricingTitle)}>Every Project Starts With a Conversation.</h2>
          <p className={styles.pricingText}>
            Every project is different. We discuss your goals, required features, complexity, and timeline before preparing a custom quote. Development begins after the scope, deliverables, and price
            are agreed upon.
          </p>
        </div>

        {/* Section 6 — Enquiry Call to Action */}
        <div className={styles.ctaBox}>
          <h2 className={clsx('h2', styles.ctaTitle)}>Discuss Your Website</h2>
          <p className={clsx('p-l', styles.ctaSubtitle)}>Tell us what you want to build. We&apos;ll discuss your requirements and the next steps.</p>
          <div className={styles.ctaBtnGroup}>
            <Link href="/get-started?sector=business&product=website" className={styles.ctaPrimary}>
              Start a Project Enquiry &rarr;
            </Link>
            <a
              href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20would%20like%20to%20discuss%20a%20website%20development%20project."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaSecondary}
            >
              💬 WhatsApp Tech Leads
            </a>
            <Link href="/contact" className={styles.ctaTertiary}>
              General Contact Form &rarr;
            </Link>
          </div>
        </div>

        {/* Connected Ecosystem */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>Explore Connected Solutions</h2>
          <p className={styles.sectionDesc}>Learn more about our broader engineering capabilities across AI product development, student project mentorship, and college partnerships.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', margin: '1.5rem 0 3.5rem' }}>
          <Link href="/ai-solutions" className={styles.secondaryBtn} style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
            ⚡ AI Solutions &amp; Product Engineering &rarr;
          </Link>
          <Link href="/final-year-projects" className={styles.secondaryBtn} style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
            🎓 Final Year Engineering Projects &rarr;
          </Link>
          <Link href="/for-colleges" className={styles.secondaryBtn} style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
            🏛️ Institutional Partnerships for Colleges &rarr;
          </Link>
          <Link href="/about" className={styles.secondaryBtn} style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
            🏢 About Homies Studio &rarr;
          </Link>
        </div>

        {/* FAQs */}
        <div className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <h2 className={clsx('h2', styles.sectionTitle)}>Frequently Asked Questions</h2>
            <p className={styles.sectionDesc}>Answers to common questions about our custom website design and engineering services.</p>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq) => (
              <div key={faq.q} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
