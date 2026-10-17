import Link from 'next/link';
/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import clsx from 'clsx';
import { useStore } from '@src/store';
import AccordionFAQ from '@src/components/ui/AccordionFAQ';
import styles from './ai-solutions.module.scss';

const seo = {
  title: 'Custom AI Solutions & Software Development | Homies Studio',
  description: 'We design and build custom AI agents, web applications, and automation software for startups and businesses across India.',
  keywords: [
    'AI Solutions India',
    'AI Agent Development',
    'SaaS Development India',
    'Startup Web App Development',
    'Intelligent Automation',
    'EdTech Platform Development',
    'Custom AI Development Bangalore',
    'AI Studio Hyderabad',
    'B2B AI Solutions',
  ],
  canonical: '/ai-solutions',
};

const aiSchema = {
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
          name: 'AI Solutions',
          item: 'https://www.homiesstudio.com/ai-solutions',
        },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://www.homiesstudio.com/ai-solutions#service',
      name: 'Custom AI Solutions & Technical Product Engineering',
      provider: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
      serviceType: 'Artificial Intelligence & Software Engineering',
      description: 'Custom AI agents, intelligent workflow automation, and scalable software product development for startups and modern businesses.',
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
    },
  ],
};

const faqs = [
  {
    q: 'What types of AI agents does Homies Studio build?',
    a: 'We engineer autonomous workflow agents, customer support LLM bots, document parsing agents, lead generation bots, and multi-agent systems using LangChain, CrewAI, and custom OpenAI/Gemini/Anthropic pipelines.',
  },
  {
    q: 'Do you build full SaaS MVPs for startups?',
    a: 'Yes! We handle the complete tech lifecycle from UI/UX and frontend (Next.js/React) to scalable backends (Node/Python/Supabase/Postgres), AI model integration, Stripe/Razorpay billing, and cloud deployment.',
  },
  {
    q: 'How is project scope and timeline determined?',
    a: 'Development phases depend on system architecture, data models, and integrations. We define the scope, deliverables, and milestone timeline with you before development starts.',
  },
];

const services = [
  {
    badge: 'Autonomous Systems',
    title: 'Custom AI Agents',
    desc: 'Intelligent multi-agent systems, automated decision engines, and domain-trained assistants that handle complex business operations.',
  },
  {
    badge: 'Cloud & Subscriptions',
    title: 'SaaS Product Engineering',
    desc: 'High-performance SaaS platforms built with Next.js, TypeScript, multi-tenant databases, authentication, and payment gateways.',
  },
  {
    badge: 'Web & Mobile',
    title: 'Full Stack Web Apps',
    desc: 'Modern, high-converting digital applications optimized for speed, reliability, SEO, and fluid user experiences.',
  },
  {
    badge: 'Efficiency',
    title: 'Intelligent Automation',
    desc: 'End-to-end robotic process automation, CRM/ERP connectors, automated scraping, and data synchronization pipelines.',
  },
  {
    badge: 'Education Tech',
    title: 'EdTech Platforms',
    desc: 'Interactive learning portals, LMS architectures, code execution sandboxes, and student progress tracking systems.',
  },
  {
    badge: 'Backend Architecture',
    title: 'Custom APIs & Microservices',
    desc: 'High-throughput REST and GraphQL backend architectures designed for zero downtime and secure third-party integrations.',
  },
];

export default function AISolutionsPage() {
  const setIsConversationOpen = useStore((state) => state.setIsConversationOpen);

  return (
    <>
      <CustomHead {...seo} pageSchema={aiSchema} />

      <section className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.taglineBadge}>⚡ B2B AI &amp; Product Engineering · Pan-India</div>
          <h1 className={clsx('h1', styles.heroTitle)}>AI Solutions &amp; Product Development for Indian Startups</h1>
          <p className={clsx('p-l', styles.heroSubtitle)}>
            From custom autonomous AI agents and intelligent workflows to full-stack SaaS platforms and scalable web products. We turn your product vision into production-ready software.
          </p>
          <div className={styles.ctaRow}>
            <button type="button" className={styles.primaryBtn} onClick={() => setIsConversationOpen(true)}>
              🚀 Start a Conversation
            </button>
            <a
              href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20we%20want%20to%20discuss%20an%20AI%20%2F%20SaaS%20project."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
            >
              💬 WhatsApp Tech Leads
            </a>
          </div>
        </div>

        {/* What We Build */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>What We Build</h2>
          <p className={styles.sectionDesc}>Tailored engineering capabilities that power modern digital businesses, startups, and EdTech ventures.</p>
        </div>
        <div className={styles.gridCards}>
          {services.map((item) => (
            <div key={item.title} className={styles.serviceCard}>
              <span className={styles.serviceBadge}>{item.badge}</span>
              <h3 className={clsx('h4', styles.cardTitle)}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Connected Ecosystem */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>Explore Connected Solutions</h2>
          <p className={styles.sectionDesc}>Connect with our wider technical ecosystem for student projects, college partnerships, and company information.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', margin: '1.5rem 0 3.5rem' }}>
          <Link href="/website-development" className={styles.secondaryBtn} style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
            💻 Custom Website Development &rarr;
          </Link>
          <Link href="/contact" className={styles.secondaryBtn} style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
            🚀 Start an AI Project / Contact Us &rarr;
          </Link>
          <Link href="/about" className={styles.secondaryBtn} style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
            🏢 Learn About Homies Studio &rarr;
          </Link>
          <Link href="/final-year-projects" className={styles.secondaryBtn} style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
            🎓 Explore Engineering Project Support &rarr;
          </Link>
          <Link href="/for-colleges" className={styles.secondaryBtn} style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
            🏛️ Explore College Partnerships &rarr;
          </Link>
        </div>

        {/* FAQs */}
        <div className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <h2 className={clsx('h2', styles.sectionTitle)}>Frequently Asked Questions</h2>
            <p className={styles.sectionDesc}>Learn more about our product development workflows, pricing models, and tech stack.</p>
          </div>
          <AccordionFAQ items={faqs} />
        </div>
      </section>
    </>
  );
}
