import NextHead from 'next/head';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.homiesstudio.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;
export const SITE_NAME = 'Homies Studio';
export const DEFAULT_TITLE = 'HOMIES STUDIO | Final Year Projects & AI Solutions';
export const DEFAULT_DESCRIPTION =
  'Homies Studio transforms engineering concepts into real-world solutions, combining IoT, Robotics, AI/ML, and Embedded Systems with practical, end-to-end project development.';

export const DEFAULT_KEYWORDS = [
  'HOMIES STUDIO',
  'Homies Studio',
  'Final Year Projects',
  'FYP Guidance India',
  'IoT Projects India',
  'Robotics Projects India',
  'AI ML Projects',
  'Embedded Systems',
  'Computer Vision Projects',
  'Deep Learning FYP',
  'Engineering Projects Bangalore',
  'Engineering Projects Hyderabad',
  'Engineering Projects Andhra Pradesh',
  'B.Tech Projects India',
  'M.Tech Projects India',
  'Final Year Project Help',
  'AI Agent Development',
  'SaaS Development India',
  'Startup Solutions',
  'Digital Product Studio India',
  'Homies Mart',
  'Homies Creator',
  'College Partnership Program',
  'Pan India Engineering Projects',
];

const getGlobalSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.homiesstudio.com/#organization',
      name: 'Homies Studio',
      alternateName: ['Homies Studio India', 'HOMIES STUDIO', 'Homies'],
      url: 'https://www.homiesstudio.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.homiesstudio.com/logo.png',
        width: 512,
        height: 512,
        caption: 'Homies Studio Logo',
      },
      image: 'https://www.homiesstudio.com/og.png',
      description: 'Homies Studio transforms engineering concepts into real-world solutions, combining IoT, Robotics, AI/ML, and Embedded Systems with practical, end-to-end project development.',
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
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'info@homiesstudio.com',
          areaServed: 'IN',
        },
      ],
      sameAs: ['https://www.linkedin.com/company/homies-studio/', 'https://github.com/Homies-Studio', 'https://wa.me/917416636417'],
      foundingDate: '2024',
      knowsAbout: ['Final Year Projects', 'IoT Projects', 'AI/ML Projects', 'Robotics', 'Embedded Systems', 'Engineering Education', 'AI Agent Development', 'SaaS Development'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.homiesstudio.com/#website',
      name: 'Homies Studio',
      url: 'https://www.homiesstudio.com/',
      description: 'Homies Studio transforms engineering concepts into real-world solutions, combining IoT, Robotics, AI/ML, and Embedded Systems with practical, end-to-end project development.',
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

function CustomHead({ title, description, keywords, canonical, ogImage, noindex, pageSchema }) {
  let metaTitle = title ? title.trim() : DEFAULT_TITLE;
  if (!metaTitle.toUpperCase().startsWith('HOMIES STUDIO')) {
    metaTitle = String('HOMIES STUDIO | ').concat(metaTitle);
  }

  const metaDesc = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = getCanonicalUrl(canonical);
  const metaOgImage = getOgImage(ogImage);
  const robotsDirective = getRobotsDirective(noindex);
  const keywordString = keywords && keywords.length ? keywords.join(', ') : DEFAULT_KEYWORDS.join(', ');

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
