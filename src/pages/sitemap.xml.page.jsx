import { getPublishedProjects } from '@src/lib/services/projectService';

const SITE_URL = 'https://www.homiesstudio.com';

const STATIC_CANONICAL_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/mart', priority: '0.95', changefreq: 'daily' },
  { path: '/website-development', priority: '0.95', changefreq: 'weekly' },
  { path: '/final-year-projects', priority: '0.95', changefreq: 'weekly' },
  { path: '/ai-solutions', priority: '0.9', changefreq: 'weekly' },
  { path: '/for-colleges', priority: '0.9', changefreq: 'weekly' },
  { path: '/become-a-creator', priority: '0.9', changefreq: 'monthly' },
  { path: '/get-started', priority: '0.9', changefreq: 'monthly' },
  { path: '/blog', priority: '0.85', changefreq: 'weekly' },
  { path: '/blog/how-to-choose-your-fyp-topic', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog/iot-vs-robotics-for-final-year', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog/what-is-an-ai-agent', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.85', changefreq: 'monthly' },
  { path: '/about', priority: '0.75', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
];

function generateSiteMap(projects) {
  const currentDate = new Date().toISOString();

  const staticUrls = STATIC_CANONICAL_PAGES.map((page) => {
    const loc = page.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${page.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  // Filter strictly for PUBLISHED projects
  const publishedProjects = (projects || []).filter((p) => (p.status ? p.status === 'PUBLISHED' : true));

  const projectUrls = publishedProjects
    .map((proj) => {
      // Use legacy ID for legacy projects (e.g. project1), otherwise slug or id
      const routeSlug = proj.legacyId || proj.legacy_id || proj.slug || proj.id;
      const lastMod = proj.published_at || proj.updated_at || currentDate;
      return `  <url>
    <loc>${SITE_URL}/projects/${routeSlug}</loc>
    <lastmod>${new Date(lastMod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${projectUrls}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  try {
    const projects = await getPublishedProjects();
    const sitemap = generateSiteMap(projects);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.write(sitemap);
    res.end();
  } catch {
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
}

export default function SiteMap() {
  return null;
}
