/* eslint-disable */
import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles/homeMiddleSections.module.scss';

const pillars = [
  {
    icon: '🎓',
    label: 'For Students',
    heading: 'Final Year Projects',
    body: 'End-to-end FYP guidance in IoT, Robotics, AI/ML, and Embedded Systems. Remote, pan-India.',
    ctaText: 'Explore FYP Guidance →',
    ctaHref: '/final-year-projects',
  },
  {
    icon: '🛠️',
    label: 'For Creators',
    heading: 'Homies Mart',
    body: 'Publish your engineering builds and earn 80% on every sale to students across India.',
    ctaText: 'Become a Creator →',
    ctaHref: '/become-a-creator',
  },
  {
    icon: '⚡',
    label: 'For Startups',
    heading: 'AI Solutions',
    body: 'Custom AI agents, SaaS platforms, and full-stack web apps for Indian startups.',
    ctaText: 'Start a Project →',
    ctaHref: '/ai-solutions',
  },
];

const domainTags = [
  'IoT & Robotics',
  'AI & Machine Learning',
  'Embedded Systems',
  'Full Stack Web',
  'Computer Vision',
  'SaaS & Automation',
  'Cybersecurity',
  'Data Engineering',
];

export default function HomeMiddleSections() {
  return (
    <div className={clsx(styles.root, 'layout-block-inner')}>
      {/* SECTION A — Three Pillars */}
      <div className={styles.pillarsSection}>
        <div className={styles.pillarsGrid}>
          {pillars.map((pillar) => (
            <div key={pillar.heading} className={styles.pillarCard}>
              <div className={pillar.pillarTop}>
                <div className={styles.pillarIcon}>{pillar.icon}</div>
                <div className={styles.pillarLabel}>{pillar.label}</div>
                <h3 className={styles.pillarHeading}>{pillar.heading}</h3>
                <p className={styles.pillarBody}>{pillar.body}</p>
              </div>
              <div>
                <Link href={pillar.ctaHref} className={styles.pillarCta}>
                  {pillar.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION B — Domain Tags */}
      <div className={styles.domainSection}>
        <h2 className={styles.domainHeading}>What We Build</h2>
        <div className={styles.tagsRow}>
          {domainTags.map((tag) => (
            <span key={tag} className={styles.domainTag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION C — Dual CTA Block */}
      <div className={styles.dualCtaSection}>
        <div className={styles.dualCtaGrid}>
          <div className={styles.ctaColumn}>
            <h3 className={styles.ctaTitle}>Student or College?</h3>
            <p className={styles.ctaSubtitle}>WhatsApp us your requirements. We reply same day.</p>
            <a
              href="https://wa.me/917416636417"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              💬 Chat on WhatsApp
            </a>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.ctaColumn}>
            <h3 className={styles.ctaTitle}>Startup or Business?</h3>
            <p className={styles.ctaSubtitle}>Tell us about your product idea.</p>
            <a
              href="mailto:info@homiesstudio.com"
              className={styles.emailButton}
            >
              📧 Email the Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
