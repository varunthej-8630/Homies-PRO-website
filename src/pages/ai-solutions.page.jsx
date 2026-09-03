/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import clsx from 'clsx';
import { useStore } from '@src/store';
import styles from './ai-solutions.module.scss';

const seo = {
  title: 'AI Agents, SaaS & Web App Development for Startups | Homies Studio India',
  description: 'Homies Studio builds custom AI agents, SaaS platforms, web apps and automation tools for startups and EdTech companies across India. End-to-end tech product development.',
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
          item: 'https://www.homiesstudio.com',
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
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What types of AI agents does Homies Studio build?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We engineer autonomous workflow agents, customer support LLM bots, document parsing agents, lead generation bots, and multi-agent systems using LangChain, CrewAI, and custom OpenAI/Gemini/Anthropic pipelines.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you build full SaaS MVPs for startups?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! We handle the complete tech lifecycle from UI/UX and frontend (Next.js/React) to scalable backends (Node/Python/Supabase/Postgres), AI model integration, Stripe/Razorpay billing, and cloud deployment.',
          },
        },
        {
          '@type': 'Question',
          name: 'How fast can an MVP be delivered?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our agile sprint framework typically delivers functional, production-grade MVPs in 2 to 4 weeks.',
          },
        },
      ],
    },
  ],
};

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

      <div className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
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
        </section>

        {/* What We Build */}
        <section className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>What We Build</h2>
          <p className={styles.sectionDesc}>Tailored engineering capabilities that power modern digital businesses, startups, and EdTech ventures.</p>
        </section>
        <div className={styles.gridCards}>
          {services.map((item) => (
            <div key={item.title} className={styles.serviceCard}>
              <span className={styles.serviceBadge}>{item.badge}</span>
              <h3 className={clsx('h4', styles.cardTitle)}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <h2 className={clsx('h2', styles.sectionTitle)}>Frequently Asked Questions</h2>
            <p className={styles.sectionDesc}>Learn more about our product development workflows, pricing models, and tech stack.</p>
          </div>
          <div className={styles.faqList}>
            {aiSchema['@graph'][1].mainEntity.map((faq) => (
              <div key={faq.name} className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>{faq.name}</h4>
                <p className={styles.faqAnswer}>{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
