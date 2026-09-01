/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://homies-agency.vercel.app';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin',
    '/admin/*',
    '/creator',
    '/creator/*',
    '/buyer',
    '/buyer/*',
    '/checkout',
    '/checkout/*',
    '/auth',
    '/auth/*',
    '/api/*',
    '/supabase-test',
    '/404',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/creator',
          '/creator/*',
          '/buyer',
          '/buyer/*',
          '/checkout',
          '/checkout/*',
          '/auth',
          '/auth/*',
          '/api/*',
          '/supabase-test',
        ],
      },
    ],
  },
  additionalPaths: async (config) => {
    const customEntries = [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/about',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/projects',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/become-a-creator',
        changefreq: 'weekly',
        priority: 0.85,
        lastmod: new Date().toISOString(),
      },
    ];

    return customEntries.map((entry) => ({
      ...entry,
      alternateRefs: config.alternateRefs ?? [],
    }));
  },
  transform: async (config, path) => {
    let priority = 0.8;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/about') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/projects') {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.startsWith('/projects/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path === '/become-a-creator') {
      priority = 0.85;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
