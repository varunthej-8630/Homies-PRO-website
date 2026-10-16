import NextHead from 'next/head';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.homiesstudio.com').replace(/\/+$/, '');
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;
export const SITE_NAME = 'Homies Studio';
export const DEFAULT_TITLE = 'HOMIES STUDIO | Final Year Projects & AI Solutions';
export const DEFAULT_DESCRIPTION =
  'Homies Studio builds custom websites, applications, and AI solutions for businesses and startups, and guides engineering students with final year projects across India.';

export const DEFAULT_KEYWORDS = [
  'Homies Studio',
  'HOMIES STUDIO',
  'Custom Website Development India',
  'Custom Web Applications',
  'Final Year Projects India',
  'FYP Guidance India',
  'AI Solutions India',
  'AI Agent Development',
  'SaaS Development India',
  'IoT Projects India',
  'Robotics Projects India',
  'Embedded Systems FYP',
  'Engineering Projects Bangalore',
  'Engineering Projects Hyderabad',
  'B.Tech Projects India',
  'M.Tech Projects India',
  'College Partnership Program',
  'Homies Mart',
  'Homies Creator',
];

const getGlobalSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.homiesstudio.com/#organization',
      name: 'Homies Studio',
      alternateName: ['Homies Studio India', 'HOMIES STUDIO', 'Homies'],
      url: 'https://www.homiesstudio.com/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.homiesstudio.com/logo.png',
        width: 512,
        height: 512,
        caption: 'Homies Studio Logo',
      },
      image: 'https://www.homiesstudio.com/og.png',
      description:
        'Homies Studio is a technology studio that helps students bring engineering projects to life and helps businesses build custom websites, applications, AI solutions, and custom technology.',
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
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'info@homiesstudio.com',
          areaServed: 'IN',
        },
      ],
      sameAs: ['https://www.linkedin.com/company/homies-studio/', 'https://github.com/Homies-Studio', 'https://wa.me/917416636417'],
      knowsAbout: [
        'Custom Website Development',
        'Web Applications',
        'AI Solutions',
        'AI Agent Development',
        'Final Year Projects',
        'IoT Projects',
        'Robotics & Automation',
        'Embedded Systems',
        'SaaS Product Engineering',
        'Engineering Education',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.homiesstudio.com/#website',
      name: 'Homies Studio',
      url: 'https://www.homiesstudio.com/',
      description: 'Homies Studio builds custom websites, web applications, AI solutions, and guides engineering students with final year projects across India.',
      publisher: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Service',
      '@id': 'https://www.homiesstudio.com/#service-fyp',
      name: 'Final Year Engineering Project Guidance & Development',
      provider: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
      serviceType: 'Engineering Project Mentorship and Development',
      description: 'End-to-end engineering project guidance and development in IoT, Robotics, AI/ML, and Embedded Systems for students and institutions across India.',
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://www.homiesstudio.com/#service-web',
      name: 'Custom Website & Web Application Development',
      provider: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
      serviceType: 'Website Development & Web Application Engineering',
      description: '100% custom-coded business websites, web applications, customer portals, and ecommerce systems built around your workflow and brand identity.',
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://www.homiesstudio.com/#service-ai',
      name: 'Custom AI Solutions & Technical Product Engineering',
      provider: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
      serviceType: 'Artificial Intelligence & Software Engineering',
      description: 'Custom AI agents, intelligent workflow automation, and scalable software product development for startups and modern businesses.',
      areaServed: {
        '@type': 'Country',
        name: 'India',
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
  if (noindex) return 'noindex,nofollow';
  return 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
}

export function formatMetaTitle(rawTitle) {
  if (!rawTitle) return DEFAULT_TITLE;
  const trimmed = rawTitle.trim();
  if (/homies\s*studio/i.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed} | Homies Studio`;
}

function CustomHead({ title, description, keywords, canonical, ogImage, noindex, pageSchema }) {
  const metaTitle = formatMetaTitle(title);
  const metaDesc = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = getCanonicalUrl(canonical);
  const metaOgImage = getOgImage(ogImage);
  const robotsDirective = getRobotsDirective(noindex);
  const keywordString = keywords && keywords.length ? keywords.join(', ') : DEFAULT_KEYWORDS.join(', ');

  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

  return (
    <>
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
        <meta property="og:image:alt" content="HOMIES STUDIO | Final Year Projects & AI Solutions" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={metaOgImage} />

        {/* Favicons & App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />

        {/* Search Engine Verification Tags */}
        {googleVerification && <meta name="google-site-verification" content={googleVerification} />}
        {bingVerification && <meta name="msvalidate.01" content={bingVerification} />}

        {/* Global Structured Data JSON-LD */}
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getGlobalSchema()) }} />

        {/* Page Specific Structured Data JSON-LD (if provided) */}
        {pageSchema && (
          /* eslint-disable-next-line react/no-danger */
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
        )}
      </NextHead>
      <NextSeo title={metaTitle} description={metaDesc} noindex={noindex} />
    </>
  );
}

// eslint-disable-next-line react/forbid-prop-types
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
