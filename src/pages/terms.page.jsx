/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';

const seo = {
  title: 'Terms of Use | Homies Studio',
  description: 'Terms and conditions governing the use of Homies Studio services, final year project guidance, website development, and Homies Mart marketplace.',
  canonical: '/terms',
};

const termsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.homiesstudio.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Terms of Use',
          item: 'https://www.homiesstudio.com/terms',
        },
      ],
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={termsSchema} />

      <section className={clsx('layout-block-inner')} style={{ color: '#fff', paddingTop: 'calc(var(--layout-columns-gap) * 3)', paddingBottom: 'calc(var(--layout-columns-gap) * 4)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>Terms of Use</span>
          </nav>

          <h1 className="h1" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.15 }}>
            Terms of Use
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '3rem' }}>Last updated: September 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', lineHeight: 1.7, fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or utilizing the services provided by Homies Studio (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) via homiesstudio.com, you
                acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, you must discontinue use of
                the platform immediately.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>2. Services Description</h2>
              <p>Homies Studio is a multi-sector technology and engineering studio providing three primary wings of capability:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>
                  <strong>Final Year Project (FYP) Guidance:</strong> Remote, end-to-end technical mentoring, architecture consulting, hardware guidance, and documentation support for B.Tech and
                  M.Tech engineering students across India.
                </li>
                <li>
                  <strong>Homies Mart:</strong> A curated engineering marketplace where verified creators can publish digital technical builds, starter kits, and blueprints, and buyers can license
                  engineering code packages.
                </li>
                <li>
                  <strong>AI &amp; SaaS Solutions:</strong> Bespoke digital product development, custom AI agent architecture, workflow automation, and full-stack software development for startups and
                  businesses.
                </li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>3. Homies Mart Responsibilities &amp; Digital Purchases</h2>
              <p>Homies Mart operates as an engineering marketplace connecting creators and buyers.</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>
                  <strong>Creator Commitments:</strong> Creators warrant that all uploaded code, schematics, and documentation are original or appropriately licensed open-source dependencies, free of
                  malicious code or undisclosed third-party restrictions.
                </li>
                <li>
                  <strong>Buyer Rights:</strong> Purchasing a project provides a non-exclusive license for personal educational or internal development use in accordance with the specified tier.
                </li>
                <li>
                  <strong>Digital Goods Refund Policy:</strong> Due to the immediate delivery nature of downloadable digital engineering assets and blueprints, all completed digital purchases on
                  Homies Mart are non-refundable once source code access has been granted.
                  {/* // TODO: confirm refund policy with team */}
                </li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>4. Intellectual Property</h2>
              <p>
                All visual design, branding, typography, site copy, trademarks, and proprietary software architecture powering Homies Studio remain the exclusive intellectual property of Homies
                Studio. Unapproved copying, duplication, or reverse-engineering of our proprietary platform components is strictly prohibited.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>5. Limitation of Liability</h2>
              <p>
                In no event shall Homies Studio, its founders, directors, or employees be liable for any indirect, punitive, incidental, or consequential damages arising from the use or inability to
                use our services, mentorship advice, or third-party creator assets. Academic mentorship is advisory and educational; students remain solely responsible for understanding, presenting,
                and submitting their own work to their respective academic institutions.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>6. Governing Law &amp; Jurisdiction</h2>
              <p>
                These Terms of Use shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any legal proceedings or disputes arising
                out of these terms shall be subject to the exclusive jurisdiction of the courts located in Andhra Pradesh / Telangana, India.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>7. Contact Information</h2>
              <p>For any questions or legal notices regarding these Terms of Use, please reach out to us:</p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Email:</strong>{' '}
                <a href="mailto:info@homiesstudio.com" style={{ color: '#fff', fontWeight: 600, textDecoration: 'underline' }}>
                  info@homiesstudio.com
                </a>
                <br />
                <strong>WhatsApp / Support:</strong> +91 74166 36417
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
