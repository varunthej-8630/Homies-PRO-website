import NextHead from 'next/head';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.homiesstudio.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;
export const SITE_NAME = 'Homies Studio';
export const DEFAULT_TITLE = 'HOMIES STUDIO — Final Year Projects & AI Solutions';
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
      name: 'Homies Studio',
      alternateName: ['Homies Studio India', 'Homies', 'HOMIES STUDIO'],
      url: 'https://www.homiesstudio.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.homiesstudio.com/logo.png',
        width: 512,
        height: 512,
        caption: 'Homies Studio Logo',
      },
      image: 'https://www.homiesstudio.com/og.png',
      description:
        'Homies Studio is an India-wide tech studio helping B.Tech and M.Tech engineering students complete final year projects in IoT, Robotics, AI/ML, and Embedded Systems. It also builds AI agents, SaaS products, and web applications for startups and EdTech companies across India.',
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
      foundingLocation: {
        '@type': 'Place',
        name: 'India',
      },
      knowsAbout: ['Final Year Projects', 'IoT Projects', 'AI/ML Projects', 'Robotics', 'Embedded Systems', 'Engineering Education', 'AI Agent Development', 'SaaS Development', 'EdTech Solutions'],
    },
    {
      '@type': 'ProfessionalService',
      name: 'Homies Studio',
      description:
        "India's tech studio for engineering final year projects and AI product development. Homies Studio guides B.Tech and M.Tech students through FYP in IoT, Robotics, AI/ML, and Embedded Systems, and builds AI solutions for startups pan-India.",
      url: 'https://www.homiesstudio.com',
      logo: 'https://www.homiesstudio.com/logo.png',
      telephone: '+917416636417',
      email: 'info@homiesstudio.com',
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'UPI, Bank Transfer',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
      areaServed: [
        { '@type': 'Country', name: 'India' },
        { '@type': 'State', name: 'Andhra Pradesh' },
        { '@type': 'State', name: 'Telangana' },
        { '@type': 'State', name: 'Tamil Nadu' },
        { '@type': 'State', name: 'Karnataka' },
        { '@type': 'State', name: 'Maharashtra' },
        { '@type': 'State', name: 'Kerala' },
        { '@type': 'State', name: 'West Bengal' },
        { '@type': 'State', name: 'Uttar Pradesh' },
        { '@type': 'State', name: 'Rajasthan' },
        { '@type': 'State', name: 'Gujarat' },
        { '@type': 'State', name: 'Punjab' },
        { '@type': 'State', name: 'Delhi' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Homies Studio Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Final Year Project Guidance – IoT',
              description: 'End-to-end guidance for B.Tech and M.Tech students building IoT-based final year projects across India.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Final Year Project Guidance – AI/ML',
              description: 'Mentorship and development support for AI and Machine Learning final year projects for engineering students across India.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Final Year Project Guidance – Robotics & Embedded Systems',
              description: 'Hardware and software guidance for Robotics and Embedded Systems FYP for ECE and EEE students.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Final Year Project Guidance – Computer Vision & Deep Learning',
              description: 'Project guidance for computer vision, deep learning, and image processing final year projects for CSE students.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Engineering Project Marketplace – Homies Mart',
              description: 'Buy and sell ready-made verified engineering projects across IoT, AI/ML, Robotics, and Web domains on Homies Mart.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Become a Homies Creator',
              description: 'Engineering students and developers can become creators on Homies Studio, publish their projects, and earn by selling to students across India.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'College Partnership Program',
              description: 'Structured final year project mentorship and support programs for engineering colleges across India.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'B2B AI Agent Development',
              description: 'Custom AI agents and intelligent automation solutions for startups and enterprises across India.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'SaaS & Web App Development',
              description: 'Full-stack SaaS product and web application development for Indian startups and global clients.',
            },
          },
        ],
      },
    },
    {
      '@type': 'WebSite',
      name: 'Homies Studio',
      url: 'https://www.homiesstudio.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.homiesstudio.com/mart?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Homies Studio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Homies Studio is an India-wide tech studio that helps B.Tech and M.Tech engineering students complete final year projects in IoT, Robotics, AI/ML, Embedded Systems, and Computer Vision. It also builds AI agents, SaaS products, and web applications for startups across India. Homies Studio also operates Homies Mart, an engineering project marketplace.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Homies Studio help with final year engineering projects across India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Homies Studio provides final year project guidance to engineering students pan-India remotely. Students from CSE, ECE, and EEE branches across all Indian states can get end-to-end FYP support from ideation to submission.',
          },
        },
        {
          '@type': 'Question',
          name: 'What domains does Homies Studio cover for final year projects?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Homies Studio covers IoT, Robotics, Embedded Systems, AI/ML, Computer Vision, Deep Learning, Full Stack Web Development, Python projects, IEEE-standard projects, mini projects, and major projects for B.Tech and M.Tech students across CSE, ECE, and EEE branches.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Homies Mart?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Homies Mart is an engineering project marketplace by Homies Studio where students and developers can buy ready-made verified projects or sell their own technical builds across domains like IoT, AI/ML, Robotics, and Web Development.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I become a Homies Creator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Engineering students and developers can apply to become a Homies Creator at homiesstudio.com/become-a-creator. Creators can publish and sell their technical projects on Homies Mart and earn from students across India.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Homies Studio work with engineering colleges?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Homies Studio partners with engineering colleges across India to provide structured final year project mentorship programs, domain expertise, and student project management support.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Homies Studio build AI solutions for startups?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. Homies Studio's B2B wing builds custom AI agents, SaaS products, web applications, and automation solutions for startups, EdTech companies, and enterprises across India.",
          },
        },
        {
          '@type': 'Question',
          name: 'How can I contact Homies Studio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can contact Homies Studio via WhatsApp at +91 74166 36417, by email at info@homiesstudio.com, or through the contact form at homiesstudio.com. The team responds to all India-wide project inquiries.',
          },
        },
      ],
    },
    {
      '@type': 'EducationalOrganization',
      name: 'Homies Studio',
      description: 'Homies Studio provides project-based learning support and final year project guidance for engineering students across India in IoT, AI/ML, Robotics, and Embedded Systems.',
      url: 'https://www.homiesstudio.com',
      areaServed: { '@type': 'Country', name: 'India' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Engineering Project Guidance Programs',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Course',
              name: 'IoT Final Year Project Guidance',
              description: 'Guided project development for IoT-based B.Tech and M.Tech final year projects pan-India.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Course',
              name: 'AI/ML Final Year Project Guidance',
              description: 'End-to-end support for Artificial Intelligence and Machine Learning FYP projects.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Course',
              name: 'Robotics & Embedded Systems FYP',
              description: 'Hardware-software integrated project guidance for Robotics and Embedded Systems students.',
            },
          },
        ],
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
  if (process.env.NODE_ENV === 'development') return 'noindex,nofollow';
  return 'index,follow';
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
