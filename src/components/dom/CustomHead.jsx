import NextHead from 'next/head';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.homiesstudio.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;
export const SITE_NAME = 'HOMIES STUDIO';
export const DEFAULT_TITLE = 'HOMIES STUDIO — Build, Launch & Grow Digital Products';
export const DEFAULT_DESCRIPTION =
  'Homies Studio is a premier digital product and engineering studio empowering students, creators, startups, and businesses to build, launch, and scale exceptional digital products and engineering solutions.';

const getSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/homies/homies-logo.png`,
      email: 'info.homiesstudio@gmail.com',
      description: DEFAULT_DESCRIPTION,
      sameAs: ['https://github.com/Homies-Studio', 'https://www.linkedin.com/company/homies-studio/', 'https://wa.me/917416636417'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      description: 'Digital Product & Engineering Studio — Build, Launch & Grow Digital Solutions.',
    },
  ],
});

function getCanonicalUrl(canonical) {
  if (!canonical) return SITE_URL;
  if (canonical.startsWith('http')) return canonical;
  return `${SITE_URL}${canonical}`;
}

function getOgImage(ogImage) {
  if (!ogImage) return DEFAULT_OG_IMAGE;
  if (ogImage.startsWith('http')) return ogImage;
  return `${SITE_URL}${ogImage}`;
}

function getRobotsDirective(noindex) {
  if (noindex) return 'noindex,nofollow';
  if (process.env.NODE_ENV === 'development') return 'noindex,nofollow';
  return 'index,follow';
}

function CustomHead({ title, description, keywords, canonical, ogImage, noindex }) {
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

  return (
    <>
      <NextHead>
        {/* General Meta Tags */}
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta httpEquiv="x-dns-prefetch-control" content="off" />
        <meta name="robots" content={robotsDirective} />
        <meta name="googlebot" content={robotsDirective} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="keywords" content={keywords && keywords.length ? keywords.join(', ') : 'HOMIES STUDIO, digital products, engineering studio, build launch grow'} />
        <meta name="author" content="HOMIES STUDIO" />
        <meta name="referrer" content="no-referrer" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="IN" />

        {/* Canonical & Document Title */}
        <link rel="canonical" href={canonicalUrl} />
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />

        {/* OpenGraph / WhatsApp Meta Tags */}
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
        <meta property="og:image:alt" content="HOMIES STUDIO — Build, Launch & Grow Digital Products" />

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
        <meta name="msapplication-TileColor" content="#f0f4f1" />
        <meta name="theme-color" content="#f0f4f1" />

        {/* Structured Data JSON-LD */}
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchema()) }} />
      </NextHead>
      <NextSeo title={metaTitle} description={metaDesc} noindex={noindex} />
    </>
  );
}

CustomHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  canonical: PropTypes.string,
  ogImage: PropTypes.string,
  noindex: PropTypes.bool,
};

CustomHead.defaultProps = {
  title: '',
  description: '',
  keywords: [],
  canonical: '',
  ogImage: '',
  noindex: false,
};

export default CustomHead;
