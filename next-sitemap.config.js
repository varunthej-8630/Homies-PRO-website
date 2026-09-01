/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://homies-agency.vercel.app';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin',
    '/admin/*',
    '/creator/dashboard',
    '/creator/submit',
    '/buyer/dashboard',
    '/checkout',
    '/checkout/*',
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
          '/creator/dashboard',
          '/creator/submit',
          '/buyer/dashboard',
          '/checkout',
          '/checkout/*',
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
      {
        loc: '/auth/signup',
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/auth/login',
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      },
    ];

    return customEntries.map((entry) => ({
      ...entry,
      alternateRefs: config.alternateRefs ?? [],
    }));
  },
  transform: async (config, path) => {
    // If it's already one of the custom defined paths, let it format consistently
    let priority = 0.7;
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
    } else if (path.startsWith('/auth/')) {
      priority = 0.6;
      changefreq = 'monthly';
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
