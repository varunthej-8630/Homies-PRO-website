/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.homiesstudio.com';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin', '/admin/*', '/creator', '/creator/*', '/buyer', '/buyer/*', '/checkout', '/checkout/*', '/auth', '/auth/*', '/api/*', '/supabase-test', '/404', '/projects'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/creator/dashboard', '/buyer/dashboard', '/admin', '/admin/*', '/creator/*', '/buyer/*', '/checkout', '/checkout/*', '/api/*', '/supabase-test'],
      },
    ],
  },
  additionalPaths: async (config) => {
    const customEntries = [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/mart', changefreq: 'daily', priority: 0.95 },
      { loc: '/final-year-projects', changefreq: 'weekly', priority: 0.95 },
      { loc: '/become-a-creator', changefreq: 'monthly', priority: 0.9 },
      { loc: '/for-colleges', changefreq: 'weekly', priority: 0.9 },
      { loc: '/ai-solutions', changefreq: 'weekly', priority: 0.9 },
      { loc: '/contact', changefreq: 'monthly', priority: 0.85 },
      { loc: '/blog', changefreq: 'weekly', priority: 0.85 },
      { loc: '/about', changefreq: 'monthly', priority: 0.75 },
      { loc: '/privacy-policy', changefreq: 'yearly', priority: 0.4 },
      { loc: '/terms-of-service', changefreq: 'yearly', priority: 0.4 },
      { loc: '/refund-policy', changefreq: 'yearly', priority: 0.4 },
    ];

    return customEntries.map((entry) => ({
      ...entry,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    }));
  },
  transform: async (config, path) => {
    let priority = 0.8;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'weekly';
    } else if (path === '/mart') {
      priority = 0.95;
      changefreq = 'daily';
    } else if (path === '/final-year-projects') {
      priority = 0.95;
      changefreq = 'weekly';
    } else if (path === '/become-a-creator') {
      priority = 0.9;
      changefreq = 'monthly';
    } else if (path === '/for-colleges') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/ai-solutions') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/contact') {
      priority = 0.85;
      changefreq = 'monthly';
    } else if (path === '/blog') {
      priority = 0.85;
      changefreq = 'weekly';
    } else if (path === '/about') {
      priority = 0.75;
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
