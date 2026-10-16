/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import styles from '@src/pages/blog.module.scss';

const seo = {
  title: 'Engineering & Tech Insights Blog | Homies Studio',
  description: 'Practical guides on final year engineering projects, IoT, Robotics, AI agent development, and custom web engineering by Homies Studio.',
  keywords: [
    'Final Year Project Ideas',
    'CSE Project Topics 2026',
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
          item: 'https://www.homiesstudio.com/',
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

// TODO: Replace with CMS or database-driven content
const articles = [
  {
    category: 'FYP Guidance',
    title: 'How to Choose Your Final Year Project Topic (2026 Guide)',
    date: 'September 2026',
    excerpt: 'A practical guide for B.Tech students on picking a final year project topic that scores well, is achievable, and stands out at viva.',
    slug: '/blog/how-to-choose-your-fyp-topic',
  },
  {
    category: 'FYP Guidance',
    title: 'IoT vs Robotics for Final Year Projects — Which Should You Pick?',
    date: 'September 2026',
    excerpt: 'Breaking down the key differences between IoT and Robotics FYP paths — cost, hardware complexity, viva performance, and career signal.',
    slug: '/blog/iot-vs-robotics-for-final-year',
  },
  {
    category: 'AI Explained',
    title: 'What Is an AI Agent? A Plain Explanation for Students and Founders',
    date: 'September 2026',
    excerpt: 'AI agents are everywhere in 2026. Here’s what they actually are, how they work, and why startups are building them.',
    slug: '/blog/what-is-an-ai-agent',
  },
];

export default function BlogPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={blogSchema} />

      <section className={clsx(styles.root, 'layout-block-inner')}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.taglineBadge}>📖 Engineering Perspectives</div>
          <h1 className={clsx('h1', styles.heroTitle)}>Engineering Insights</h1>
          <p className={clsx('p-l', styles.heroSubtitle)}>Guides and perspectives for students, creators, and builders.</p>
        </div>

        {/* Article Grid (2 columns on md+, 1 on mobile) */}
        <div className={styles.blogGrid}>
          {articles.map((item) => (
            <Link key={item.slug} href={item.slug} className={styles.blogCard}>
              <div className={styles.cardTop}>
                <div className={styles.cardMeta}>
                  <span className={styles.categoryBadge}>{item.category}</span>
                  <span className={styles.dateText}>{item.date}</span>
                </div>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardExcerpt}>{item.excerpt}</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.readLink}>Read →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Contextual Resource Hub */}
        <div style={{ margin: '3.5rem 0 1rem', padding: '2.5rem 2rem', background: '#0e0e10', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '1.25rem', textAlign: 'center' }}>
          <h3 className="h3" style={{ marginBottom: '0.6rem', fontWeight: 750, color: '#fff' }}>
            Ready to Build Your Project?
          </h3>
          <p className="p-m" style={{ maxWidth: '600px', margin: '0 auto 1.5rem', color: 'rgba(255,255,255,0.75)' }}>
            Explore our project mentorship programs, buy verified code packages on Homies Mart, or engineer custom AI software.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center' }}>
            <Link
              href="/final-year-projects"
              style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', background: '#fff', color: '#000', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}
            >
              🎓 Final Year Project Guidance &rarr;
            </Link>
            <Link
              href="/mart"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.18)',
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
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.18)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              ⚡ Custom AI Solutions &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
