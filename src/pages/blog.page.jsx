/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
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
  },
  {
    category: 'IoT & ECE',
    title: 'Best IoT Project Ideas for B.Tech ECE Final Year',
    readTime: '5 min read',
  },
  {
    category: 'FYP Strategy',
    title: 'How to Choose Your Final Year Project Topic — A Complete Guide',
    readTime: '8 min read',
  },
  {
    category: 'Startups & AI',
    title: 'What is an AI Agent? How Indian Startups Can Use Them in 2025',
    readTime: '7 min read',
  },
  {
    category: 'Student Advice',
    title: 'Final Year Project Help in India — Where to Get It',
    readTime: '5 min read',
  },
  {
    category: 'Documentation',
    title: 'How to Write a Final Year Project Report — Step by Step',
    readTime: '9 min read',
  },
];

export default function BlogPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={blogSchema} />

      <div className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.taglineBadge}>📚 Engineering Insights &amp; FYP Guides</div>
          <h1 className={clsx('h1', styles.heroTitle)}>Engineering Project Ideas, FYP Tips &amp; AI Insights</h1>
          <p className={clsx('p-l', styles.heroSubtitle)}>
            Curated project blueprints, domain roadmaps, and technical tutorials crafted by the Homies Studio engineering team for students and startups across India.
          </p>
        </section>

        {/* Articles Grid */}
        <div className={styles.blogGrid}>
          {articles.map((item) => (
            <div key={item.title} className={styles.blogCard}>
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge}>{item.category}</span>
                <span className={styles.comingSoonBadge}>Coming Soon</span>
              </div>
              <h3 className={clsx('h4', styles.cardTitle)}>{item.title}</h3>
              <div className={styles.cardFooter}>
                <span>{item.readTime} · Homies Editorial</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
