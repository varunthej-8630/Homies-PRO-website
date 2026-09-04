import NextHead from 'next/head';
import PropTypes from 'prop-types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.homiesstudio.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;
export const SITE_NAME = 'Homies Studio';
export const DEFAULT_TITLE = 'Homies Studio — Final Year Projects, Homies Mart & AI Solutions India';
export const DEFAULT_DESCRIPTION =
  'Homies Studio is India’s tech studio providing B.Tech & M.Tech final year project guidance, verified engineering builds on Homies Mart, and custom AI agent and SaaS development for startups.';

export const DEFAULT_KEYWORDS = [
  'Homies Studio',
  'Final Year Projects',
  'FYP Guidance India',
  'Homies Mart',
  'Homies Creator',
  'Engineering Projects India',
  'IoT Projects',
  'Robotics Projects',
  'AI ML Projects',
  'Embedded Systems',
  'Computer Vision Projects',
  'B.Tech Final Year Projects',
  'M.Tech Projects',
  'College Partnership Program',
  'AI Agent Development',
  'SaaS Development India',
  'Custom Software Development',
];

const getGlobalSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.homiesstudio.com/#organization',
      name: 'Homies Studio',
      alternateName: ['Homies Studio India', 'Homies', 'HOMIES STUDIO'],
      url: 'https://www.homiesstudio.com',
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://www.homiesstudio.com/#logo',
        url: 'https://www.homiesstudio.com/logo.png',
        contentUrl: 'https://www.homiesstudio.com/logo.png',
        width: 512,
        height: 512,
        caption: 'Homies Studio Logo',
      },
      image: {
        '@id': 'https://www.homiesstudio.com/#logo',
      },
      description:
        'Homies Studio is an Indian technology studio that guides engineering students through final year projects in IoT, Robotics, AI/ML, and Embedded Systems, operates the Homies Mart engineering project marketplace, and engineers custom AI agents and SaaS platforms for startups.',
      email: 'info@homiesstudio.com',
      telephone: '+917416636417',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+91-74166-36417',
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['English', 'Telugu', 'Hindi'],
        },
      ],
      sameAs: ['https://www.linkedin.com/company/homies-studio/', 'https://github.com/Homies-Studio', 'https://wa.me/917416636417'],
      knowsAbout: [
        'Final Year Projects',
        'Internet of Things (IoT)',
        'Artificial Intelligence',
        'Machine Learning',
        'Robotics',
        'Embedded Systems',
        'Computer Vision',
        'Full Stack Web Development',
        'AI Agent Engineering',
        'SaaS Product Development',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.homiesstudio.com/#website',
      url: 'https://www.homiesstudio.com',
      name: 'Homies Studio',
      description: 'Final Year Projects, Homies Mart Marketplace & AI Solutions for Startups',
      publisher: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.homiesstudio.com/mart?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
});

function getCanonicalUrl(canonical) {
  if (!canonical || canonical === '/') return 'https://www.homiesstudio.com/';
  if (canonical.startsWith('http')) return canonical;
  const cleanPath = canonical.startsWith('/') ? canonical : `/${canonical}`;
  return `${SITE_URL}${cleanPath}`;
}

function getOgImage(ogImage) {
  if (!ogImage) return DEFAULT_OG_IMAGE;
  if (ogImage.startsWith('http')) return ogImage;
  const cleanPath = ogImage.startsWith('/') ? ogImage : `/${ogImage}`;
  return `${SITE_URL}${cleanPath}`;
}

function getRobotsDirective(noindex) {
  if (noindex) return 'noindex, nofollow';
  if (process.env.NODE_ENV === 'development') return 'noindex, nofollow';
  return 'index, follow';
}

function CustomHead({ title, description, keywords, canonical, ogImage, noindex, pageSchema }) {
  let metaTitle = title;
  if (!metaTitle) {
    metaTitle = DEFAULT_TITLE;
  } else if (!metaTitle.includes('HOMIES STUDIO') && !metaTitle.includes('Homies Studio')) {
    metaTitle = `${metaTitle} | ${SITE_NAME}`;
  }

  const metaDesc = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = getCanonicalUrl(canonical);
  const metaOgImage = getOgImage(ogImage);
  const robotsDirective = getRobotsDirective(noindex);
  const keywordString = keywords && keywords.length ? keywords.join(', ') : DEFAULT_KEYWORDS.join(', ');

  return (
    <NextHead>
      {/* General Meta Tags */}
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta httpEquiv="x-dns-prefetch-control" content="off" />
      <meta name="robots" content={robotsDirective} />
      <meta name="googlebot" content={robotsDirective} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="keywords" content={keywordString} />
      <meta name="author" content="Homies Studio" />
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Canonical & Document Title */}
      <link rel="canonical" href={canonicalUrl} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />

      {/* OpenGraph / Social Meta Tags */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={metaOgImage} />
      <meta property="og:image:secure_url" content={metaOgImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Homies Studio — Final Year Projects, Homies Mart & AI Solutions" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaOgImage} />

      {/* Favicons & App Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#000000" />

      {/* Global Structured Data JSON-LD */}
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getGlobalSchema()) }} />

      {/* Page Specific Structured Data JSON-LD (if provided) */}
      {pageSchema && (
        /* eslint-disable-next-line react/no-danger */
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      )}
    </NextHead>
  );
}

CustomHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  canonical: PropTypes.string,
  ogImage: PropTypes.string,
  noindex: PropTypes.bool,
  pageSchema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

CustomHead.defaultProps = {
  title: '',
  description: '',
  keywords: [],
  canonical: '',
  ogImage: '',
  noindex: false,
  pageSchema: null,
};

export default CustomHead;
