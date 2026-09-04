/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './final-year-projects.module.scss';

const seo = {
  title: 'Final Year Project Help for B.Tech & M.Tech Students Across India | Homies Studio',
  description: 'Get end-to-end final year project guidance in IoT, Robotics, AI/ML, Embedded Systems & more. Homies Studio helps engineering students across India complete and submit FYP remotely.',
  keywords: [
    'Final Year Projects',
    'B.Tech Final Year Projects',
    'M.Tech Projects India',
    'IoT Project Guidance',
    'Robotics Final Year Projects',
    'AI ML Engineering Projects',
    'Embedded Systems FYP',
    'Computer Vision Projects',
    'Deep Learning Projects',
    'Engineering Projects Bangalore',
    'Engineering Projects Hyderabad',
    'Final Year Project Help India',
  ],
  canonical: '/final-year-projects',
};

const fypSchema = {
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
          name: 'Final Year Projects',
          item: 'https://www.homiesstudio.com/final-year-projects',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does Homies Studio help with final year engineering projects?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Homies Studio provides end-to-end guidance including topic selection, system architecture design, hardware/software implementation, documentation, and viva preparation for B.Tech and M.Tech students.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can students from outside Hyderabad or Bangalore get guidance?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Homies Studio operates 100% remotely across all states in India. We ship components where needed and provide video guidance, code reviews, and remote debugging.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which engineering branches do you support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We support students from Computer Science Engineering (CSE), Electronics and Communication Engineering (ECE), Electrical and Electronics Engineering (EEE), and Information Technology (IT).',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide IEEE-standard project implementations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, we specialize in recent IEEE paper implementations across AI/ML, IoT, Cloud Computing, Cyber Security, and Embedded Robotics.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get started with my final year project?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can contact us directly on WhatsApp at +91 74166 36417 with your branch, domain preference, or college requirements, and our technical leads will guide you immediately.',
          },
        },
      ],
    },
  ],
};

const domains = [
  {
    title: 'Internet of Things (IoT)',
    badge: 'Hardware + Cloud',
    desc: 'Smart cities, industrial IoT, healthcare monitoring, and agriculture automation using ESP32, Raspberry Pi, LoRa, MQTT, and cloud dashboards.',
  },
  {
    title: 'Robotics & Automation',
    badge: 'Hardware + Firmware',
    desc: 'Autonomous rovers, robotic arms, obstacle avoidance systems, ROS integrations, and smart surveillance robots.',
  },
  {
    title: 'AI & Machine Learning',
    badge: 'Python + ML',
    desc: 'Predictive analytics, NLP models, automated diagnostic tools, and deep reinforcement learning implementations.',
  },
  {
    title: 'Embedded Systems & VLSI',
    badge: 'Firmware + Microcontrollers',
    desc: 'STM32, Arduino, ARM Cortex, FPGA designs, Verilog/VHDL simulations, and custom sensor network interfaces.',
  },
  {
    title: 'Computer Vision & Deep Learning',
    badge: 'OpenCV + PyTorch / TF',
    desc: 'Object detection (YOLO), facial recognition, anomaly detection, medical image segmentation, and real-time tracking.',
  },
  {
    title: 'Full Stack Web Applications',
    badge: 'Next.js + Node + DB',
    desc: 'Scalable SaaS web platforms, healthcare management portals, real-time collaboration engines, and e-commerce architectures.',
  },
  {
    title: 'Python & Data Engineering',
    badge: 'Python + Big Data',
    desc: 'Automated scraping pipelines, high-speed data dashboards, algorithmic models, and ETL workflows.',
  },
  {
    title: 'IEEE Research Implementations',
    badge: 'Research Standard',
    desc: 'Exact replication and algorithmic enhancement of the latest IEEE transaction and conference papers with complete reports.',
  },
  {
    title: 'Cybersecurity & Blockchain',
    badge: 'Security + Web3',
    desc: 'Smart contract development, intrusion detection systems, cryptographic hashing protocols, and secure IoT networks.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Share Topic & Requirements',
    desc: 'Tell us your branch, college guidelines, or preferred domain. We help you choose or refine a winning topic.',
  },
  {
    num: '02',
    title: 'Get Matched with Tech Lead',
    desc: 'Work 1-on-1 with experienced engineers who specialize in your specific hardware or software domain.',
  },
  {
    num: '03',
    title: 'Build With Live Guidance',
    desc: 'Get circuit blueprints, working source code, step-by-step documentation, and remote debugging sessions.',
  },
  {
    num: '04',
    title: 'Submit With Full Confidence',
    desc: 'Complete PPTs, project reports, and viva mock interviews so you ace your internal reviews and final presentation.',
  },
];

export default function FinalYearProjectsPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={fypSchema} />

      <section className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.taglineBadge}>🎓 Pan-India Engineering Guidance · 100% Remote</div>
          <h1 className={clsx('h1', styles.heroTitle)}>Final Year Project Guidance for Engineering Students Across India</h1>
          <p className={clsx('p-l', styles.heroSubtitle)}>
            From topic selection and circuit design to full code deployment, research report writing, and viva preparation. We guide B.Tech and M.Tech students in CSE, ECE, EEE, and IT pan-India.
          </p>
          <div className={styles.ctaRow}>
            <a
              href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20need%20guidance%20for%20my%20Final%20Year%20Project."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryBtn}
            >
              💬 Get Instant FYP Guidance on WhatsApp
            </a>
            <Link href="/mart" className={styles.secondaryBtn}>
              🛒 Explore Verified Projects on Homies Mart
            </Link>
          </div>
        </div>

        {/* Domains We Cover */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>Domains We Cover</h2>
          <p className={styles.sectionDesc}>Comprehensive hardware, firmware, AI, and software project mentorship tailored for CSE, ECE, EEE, and IT branches.</p>
        </div>
        <div className={styles.gridCards}>
          {domains.map((item) => (
            <div key={item.title} className={styles.domainCard}>
              <span className={styles.domainBadge}>{item.badge}</span>
              <h3 className={clsx('h4', styles.cardTitle)}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className={styles.sectionHeader}>
          <h2 className={clsx('h2', styles.sectionTitle)}>How It Works (4 Simple Steps)</h2>
          <p className={styles.sectionDesc}>A structured, stress-free path from project ideation to high-grade final viva submission.</p>
        </div>
        <div className={styles.processGrid}>
          {steps.map((step) => (
            <div key={step.num} className={styles.processCard}>
              <span className={styles.stepNum}>{step.num}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <h2 className={clsx('h2', styles.sectionTitle)}>Frequently Asked Questions</h2>
            <p className={styles.sectionDesc}>Everything you need to know about getting project mentorship with Homies Studio.</p>
          </div>
          <div className={styles.faqList}>
            {fypSchema['@graph'][1].mainEntity.map((faq) => (
              <div key={faq.name} className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>{faq.name}</h4>
                <p className={styles.faqAnswer}>{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
