/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'https://www.homiesstudio.com';

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
    '/projects',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/',
          '/admin/',
          '/creator/',
          '/buyer/',
          '/checkout/',
          '/api/',
          '/supabase-test',
          '/404',
        ],
      },
    ],
  },
  transform: async (config, path) => {
    if (
      path === '/projects' ||
      path.startsWith('/admin') ||
      path.startsWith('/auth') ||
      path.startsWith('/creator') ||
      path.startsWith('/buyer') ||
      path.startsWith('/checkout') ||
      path.startsWith('/api') ||
      path === '/supabase-test' ||
      path === '/404'
    ) {
      return null;
    }

    let priority = 0.8;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'weekly';
    } else if (path === '/final-year-projects') {
      priority = 0.95;
      changefreq = 'weekly';
    } else if (path === '/mart') {
      priority = 0.95;
      changefreq = 'daily';
    } else if (path === '/ai-solutions') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/for-colleges') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/become-a-creator') {
      priority = 0.9;
      changefreq = 'monthly';
    } else if (path === '/blog') {
      priority = 0.85;
      changefreq = 'weekly';
    } else if (path === '/contact') {
      priority = 0.85;
      changefreq = 'monthly';
    } else if (path === '/about') {
      priority = 0.75;
      changefreq = 'monthly';
    }

    const loc = path === '/' ? `${config.siteUrl}/` : `${config.siteUrl}${path}`;

    return {
      loc,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
