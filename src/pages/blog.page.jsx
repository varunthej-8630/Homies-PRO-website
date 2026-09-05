/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './blog.module.scss';

const seo = {
  title: 'Engineering Project Ideas, FYP Tips & AI Insights | Homies Studio Blog',
  description: 'Explore final year project ideas, IoT guides, AI/ML tutorials, and startup insights from the Homies Studio team — helping engineering students and startups across India.',
  keywords: [
    'Final Year Project Ideas',
    'CSE Project Topics 2025',
    'IoT Project Ideas for ECE',
    'AI Agent Guide India',
    'Final Year Project Report Writing',
    'Engineering Project Guidance Blog',
    'Homies Studio Insights',
  ],
  canonical: '/blog',
};

const blogSchema = {
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
          name: 'Blog',
          item: 'https://www.homiesstudio.com/blog',
        },
      ],
    },
  ],
};

const articles = [
  {
    category: 'CSE & AI/ML',
    title: 'Top 10 Final Year Project Ideas for CSE Students in 2025',
    readTime: '6 min read',
    relatedUrl: '/final-year-projects',
    relatedLabel: 'Explore CSE Projects',
  },
  {
    category: 'IoT & ECE',
    title: 'Best IoT Project Ideas for B.Tech ECE Final Year',
    readTime: '5 min read',
    relatedUrl: '/final-year-projects',
    relatedLabel: 'Explore IoT Projects',
  },
  {
    category: 'FYP Strategy',
    title: 'How to Choose Your Final Year Project Topic — A Complete Guide',
    readTime: '8 min read',
    relatedUrl: '/final-year-projects',
    relatedLabel: 'Get Topic Guidance',
  },
  {
    category: 'Startups & AI',
    title: 'What is an AI Agent? How Indian Startups Can Use Them in 2025',
    readTime: '7 min read',
    relatedUrl: '/ai-solutions',
    relatedLabel: 'Explore AI Solutions',
  },
  {
    category: 'Student Advice',
    title: 'Final Year Project Help in India — Where to Get It',
    readTime: '5 min read',
    relatedUrl: '/final-year-projects',
    relatedLabel: 'Explore Remote FYP Help',
  },
  {
    category: 'Documentation',
    title: 'How to Write a Final Year Project Report — Step by Step',
    readTime: '9 min read',
    relatedUrl: '/mart',
    relatedLabel: 'Browse Sample Reports on Mart',
  },
];

export default function BlogPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={blogSchema} />

      <section className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.taglineBadge}>📖 Engineering Insights &amp; FYP Guides</div>
          <h1 className={clsx('h1', styles.heroTitle)}>Engineering Project Ideas, FYP Tips &amp; AI Insights</h1>
          <p className={clsx('p-l', styles.heroSubtitle)}>
            Curated project blueprints, domain roadmaps, and technical tutorials crafted by the Homies Studio engineering team for students and startups across India.
          </p>
        </div>

        {/* Articles Grid */}
        <div className={styles.blogGrid}>
          {articles.map((item) => (
            <div key={item.title} className={styles.blogCard}>
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge}>{item.category}</span>
                <span className={styles.comingSoonBadge}>Coming Soon</span>
              </div>
              <h3 className={clsx('h4', styles.cardTitle)}>{item.title}</h3>
              <div className={styles.cardFooter} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.readTime} · Homies Editorial</span>
                <Link href={item.relatedUrl} style={{ fontSize: '0.82rem', fontWeight: 600, textDecoration: 'underline', color: 'inherit' }}>
                  {item.relatedLabel} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Contextual Resource Hub */}
        <div style={{ margin: '3.5rem 0 1rem', padding: '2rem 1.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)' }}>
          <h3 className="h4" style={{ marginBottom: '0.6rem', fontWeight: 700 }}>
            Ready to Build Your Project?
          </h3>
          <p className="p-m" style={{ maxWidth: '600px', margin: '0 auto 1.5rem', opacity: 0.8 }}>
            Explore our project mentorship programs, buy verified code packages on Homies Mart, or engineer custom AI software.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center' }}>
            <Link
              href="/final-year-projects"
              style={{ padding: '0.65rem 1.3rem', borderRadius: '9999px', background: '#000', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
            >
              🎓 Final Year Project Guidance &rarr;
            </Link>
            <Link
              href="/mart"
              style={{
                padding: '0.65rem 1.3rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.06)',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.15)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              🛒 Browse Homies Mart &rarr;
            </Link>
            <Link
              href="/ai-solutions"
              style={{
                padding: '0.65rem 1.3rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.06)',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.15)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              ⚡ Custom AI Solutions &rarr;
            </Link>
            <Link
              href="/for-colleges"
              style={{
                padding: '0.65rem 1.3rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.06)',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.15)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              🏛️ College Partnerships &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
