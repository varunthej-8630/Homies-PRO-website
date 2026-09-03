import NextHead from 'next/head';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.homiesstudio.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;
export const SITE_NAME = 'Homies Studio';
export const DEFAULT_TITLE = 'Final Year Projects, IoT, AI/ML & Robotics | Homies Studio – Hyderabad, India';
export const DEFAULT_DESCRIPTION =
  'Homies Studio helps B.Tech & M.Tech students complete final year projects in IoT, Robotics, AI/ML, and Embedded Systems. Also builds AI agents, web apps & SaaS for startups. Based in Hyderabad, India.';

export const DEFAULT_KEYWORDS = [
  'HOMIES STUDIO',
  'Homies Studio',
  'Final Year Projects',
  'FYP Guidance',
  'IoT Projects',
  'Robotics Projects',
  'AI ML Projects',
  'Embedded Systems',
  'Engineering Projects Hyderabad',
  'B.Tech Projects India',
  'Final Year Project Help',
  'AI Agent Development',
  'SaaS Development India',
  'Startup Solutions',
  'Digital Product Studio',
  'Hyderabad Tech Studio',
  'Ongole',
  'banglore',
];

const getSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Homies Studio',
      url: 'https://www.homiesstudio.com',
      logo: 'https://www.homiesstudio.com/logo.png',
      email: 'info.homiesstudio@gmail.com',
      telephone: '+917416636417',
      foundingLocation: 'Hyderabad, India',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-74166-36417',
        contactType: 'customer service',
        availableLanguage: ['English', 'Telugu'],
      },
      sameAs: ['https://www.linkedin.com/company/homies-studio/', 'https://github.com/Homies-Studio', 'https://wa.me/917416636417'],
    },
    {
      '@type': 'LocalBusiness',
      name: 'Homies Studio',
      description:
        'Homies Studio is a India based tech studio that helps B.Tech and M.Tech engineering students complete final year projects in IoT, Robotics, Embedded Systems, and AI/ML. It also provides B2B AI solutions including AI agents, web apps, and SaaS products for startups and enterprises.',
      url: 'https://www.homiesstudio.com',
      telephone: '+917416636417',
      email: 'info.homiesstudio@gmail.com',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ongole',
        addressRegion: 'Andhra Pradesh',
        addressCountry: 'IN',
      },
      areaServed: ['Hyderabad', 'Ongole', 'Andhra Pradesh', 'Telangana', 'India'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Homies Studio Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Final Year Project Guidance – IoT',
              description: 'End-to-end guidance for B.Tech and M.Tech students building IoT-based final year projects.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Final Year Project Guidance – AI/ML',
              description: 'Mentorship and development support for AI and Machine Learning final year projects.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Final Year Project Guidance – Robotics & Embedded Systems',
              description: 'Hardware and software guidance for Robotics and Embedded Systems FYP projects.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'B2B AI Agent Development',
              description: 'Custom AI agents and automation solutions for startups and enterprises.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'SaaS & Web App Development',
              description: 'Full-stack SaaS product and web application development for startups.',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does Homies Studio help with final year engineering projects?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Homies Studio specializes in guiding B.Tech and M.Tech engineering students through final year projects in IoT, Robotics, Embedded Systems, and AI/ML — from ideation and design to development and final submission.',
          },
        },
        {
          '@type': 'Question',
          name: 'What domains does Homies Studio cover for final year projects (FYP)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Homies Studio covers IoT, Robotics, Embedded Systems, AI/ML, Computer Vision, Full Stack Web Apps, and Python-based projects for CSE, ECE, and EEE engineering students.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where is Homies Studio located?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Homies Studio is based in Hyderabad, Telangana, India. It serves students and startups across Hyderabad, Ongole, Andhra Pradesh, and pan-India remotely.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Homies Studio build AI solutions for startups?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. Homies Studio's B2B wing builds AI agents, SaaS products, web applications, and automation solutions for startups, colleges, and enterprises.",
          },
        },
        {
          '@type': 'Question',
          name: 'How can I contact Homies Studio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can reach Homies Studio via WhatsApp at +91 74166 36417, email at info.homiesstudio@gmail.com, or through the contact form on homiesstudio.com.',
          },
        },
      ],
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
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad" />

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
        <meta property="og:image:alt" content="Homies Studio — Final Year Projects & AI Solutions" />

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
