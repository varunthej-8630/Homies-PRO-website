/* eslint-disable */
import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { GraduationCapIcon, ToolIcon, ZapIcon, WhatsAppIcon, SparkleIcon } from '@src/components/ui/Icons';
import styles from './styles/homeMiddleSections.module.scss';

const pillars = [
  {
    icon: <GraduationCapIcon size={32} color="#c5a359" />,
    label: 'For Students',
    heading: 'Final Year Projects',
    body: 'End-to-end FYP guidance in IoT, Robotics, AI/ML, and Embedded Systems. Remote, pan-India.',
    ctaText: 'Explore FYP Guidance →',
    ctaHref: '/final-year-projects',
  },
  {
    icon: <ToolIcon size={32} color="#c5a359" />,
    label: 'For Creators',
    heading: 'Homies Mart',
    body: 'Publish your engineering builds and earn 80% on every sale to students across India.',
    ctaText: 'Become a Creator →',
    ctaHref: '/become-a-creator',
  },
  {
    icon: <ZapIcon size={32} color="#c5a359" />,
    label: 'For Businesses & Startups',
    heading: 'Websites & AI Solutions',
    body: 'Custom-coded websites, web applications, AI agents, and custom technical software.',
    ctaText: 'Explore Web & AI →',
    ctaHref: '/website-development',
  },
];

const domainTags = [
  'Custom Websites',
  'AI & Machine Learning',
  'IoT & Robotics',
  'Embedded Systems',
  'Full Stack Web Apps',
  'E-commerce & Stores',
  'SaaS & Automation',
  'Computer Vision',
];

export default function HomeMiddleSections() {
  return (
    <div id="homeMiddleSections" className={clsx(styles.root, 'layout-block-inner')} data-header-contrast="dark">
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
              <WhatsAppIcon size={18} /> Chat on WhatsApp
            </a>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.ctaColumn}>
            <h3 className={styles.ctaTitle}>Startup or Business?</h3>
            <p className={styles.ctaSubtitle}>Tell us about your website, software, or AI product idea.</p>
            <Link
              href="/get-started?sector=business"
              className={styles.emailButton}
            >
              <SparkleIcon size={18} color="#c5a359" /> Discuss Your Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
