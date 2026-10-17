/* eslint-disable react/jsx-props-no-spreading */
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import { WhatsAppIcon, MailIcon } from '@src/components/ui/Icons';

const seo = {
  title: 'How to Choose Your Final Year Project Topic | Homies Studio',
  description: 'A practical guide for B.Tech students on picking an achievable final year project topic that scores high marks and stands out in viva voce.',
  canonical: '/blog/how-to-choose-your-fyp-topic',
  keywords: ['How to choose FYP topic', 'B.Tech Final Year Projects 2026', 'CSE Project Topics 2026', 'ECE Final Year Project Ideas', 'Engineering Project Selection Guide', 'Viva Voce Preparation'],
};

const articleSchema = {
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
          name: 'Blog',
          item: 'https://www.homiesstudio.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'How to Choose Your Final Year Project Topic',
          item: 'https://www.homiesstudio.com/blog/how-to-choose-your-fyp-topic',
        },
      ],
    },
    {
      '@type': 'BlogPosting',
      '@id': 'https://www.homiesstudio.com/blog/how-to-choose-your-fyp-topic#article',
      headline: 'How to Choose Your Final Year Project Topic (2026 Guide)',
      description: 'A practical guide for B.Tech students on picking an achievable final year project topic that scores high marks and stands out in viva voce.',
      image: 'https://www.homiesstudio.com/og.png',
      datePublished: '2026-09-01T00:00:00+05:30',
      dateModified: '2026-09-01T00:00:00+05:30',
      author: {
        '@type': 'Organization',
        name: 'Homies Studio',
        url: 'https://www.homiesstudio.com/',
      },
      publisher: {
        '@id': 'https://www.homiesstudio.com/#organization',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://www.homiesstudio.com/blog/how-to-choose-your-fyp-topic',
      },
    },
  ],
};

export default function ChooseFypTopicPage() {
  return (
    <>
      <CustomHead {...seo} pageSchema={articleSchema} />

      <article className={clsx('layout-block-inner')} style={{ color: '#fff', paddingTop: 'calc(var(--layout-columns-gap) * 3)', paddingBottom: 'calc(var(--layout-columns-gap) * 4)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', boxSizing: 'border-box' }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.75rem', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>
              Blog
            </Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>How to Choose Your FYP Topic</span>
          </nav>

          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(197, 163, 89, 0.15)',
                  color: '#c5a359',
                  border: '1px solid rgba(197, 163, 89, 0.3)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '9999px',
                }}
              >
                FYP Guidance
              </span>
              <span style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.5)' }}>September 2026 · 6 min read</span>
            </div>

            <h1 className="h1" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.2, color: '#fff', marginBottom: '1rem' }}>
              How to Choose Your Final Year Project Topic (2026 Guide)
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6 }}>
              A practical guide for B.Tech &amp; M.Tech students on selecting an engineering topic that scores high with external examiners, stays feasible on budget, and opens career opportunities.
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.12)', margin: '2rem 0 2.5rem' }} />

          {/* Article Body */}
          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <p>
              Your final year engineering project (FYP) represents the capstone of your four-year B.Tech journey. It is not merely another semester submission; it is frequently the central talking
              point in campus placement interviews, technical evaluations, and graduate school applications. Yet, over 60% of engineering students struggle during the initial topic finalization phase,
              often oscillating between overly ambitious concepts and outdated textbook templates.
            </p>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 750, color: '#fff', marginTop: '1rem' }}>1. The Three Core Pillars of Topic Evaluation</h2>
            <p>Before settling on any project title, evaluate it ruthlessly against three objective criteria:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>Feasibility within Timeline:</strong> Can your team realistically prototype, assemble, test, and document the entire system in 4 to 6 months? If your architecture relies on
                expensive proprietary sensors or custom FPGA boards with 8-week shipping delays, the project risk multiplies exponentially.
              </li>
              <li>
                <strong>Clear Problem Statement &amp; Novelty:</strong> Does your project address a measurable real-world challenge? A project titled &ldquo;Smart Waste Management using IoT&rdquo;
                sounds generic, but &ldquo;Solar-Powered Edge AI Waste Classification with Optimized LoRaWAN Routing for Urban Municipalities&rdquo; demonstrates technical precision and tangible
                value.
              </li>
              <li>
                <strong>Alignment with Core Department Curriculum:</strong> If you are in ECE, external evaluators expect circuit schematics, microcontroller firmware, and signal conditioning. If you
                are in CSE, data structures, backend latency, ML inference metrics, and API scalability take center stage.
              </li>
            </ul>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 750, color: '#fff', marginTop: '1rem' }}>2. Hot Engineering Domains in 2026 for B.Tech Students</h2>
            <p>Engineering trends have evolved rapidly. In 2026, external evaluators look favorably upon projects combining edge hardware with intelligent software systems:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>AIoT &amp; TinyML:</strong> Deploying quantized neural network models (e.g. MobileNet, YOLOv8 nano) directly on microcontrollers like ESP32-S3 or Raspberry Pi RP2040 for
                real-time vibration anomaly detection or localized audio classification without cloud dependency.
              </li>
              <li>
                <strong>Precision Agriculture &amp; Environmental Sensing:</strong> Multi-sensor telemetry nodes communicating over long-range LoRa meshes with solar energy harvesting and automated
                irrigation actuators.
              </li>
              <li>
                <strong>Non-Invasive Healthcare Monitoring:</strong> Remote patient diagnostics incorporating photoplethysmography (PPG), ECG signal processing, and anomaly alerting via encrypted MQTT
                pipelines.
              </li>
              <li>
                <strong>Autonomous Mobile Robotics (AMR):</strong> ROS 2-based SLAM mapping, LiDAR obstacle avoidance, and computer vision object tracking for indoor logistics.
              </li>
            </ul>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 750, color: '#fff', marginTop: '1rem' }}>3. How to Avoid Overcrowded and Cliché Topics</h2>
            <p>
              Every year, internal project committees reject dozens of proposals featuring &ldquo;Smart Attendance using Face Recognition&rdquo;, &ldquo;Library Management System&rdquo;, or basic
              &ldquo;Ultrasonic Blind Sticks&rdquo;. If a project can be completed in a single weekend following a generic tutorial, it will not earn top marks at final viva.
            </p>
            <p>To upgrade a standard domain into an award-winning submission, introduce a comparative benchmark, a hardware optimization constraint, or an edge deployment requirement.</p>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 750, color: '#fff', marginTop: '1rem' }}>4. Validating and Pitching Your Topic to Faculty Guides</h2>
            <p>When presenting your topic to your internal project coordinator, avoid walking in with vague verbal ideas. Prepare a crisp 1-page Synopsis containing:</p>
            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Block diagram illustrating hardware and software interconnects.</li>
              <li>Bill of Materials (BOM) with approximate component pricing.</li>
              <li>Three IEEE reference papers from the past 24 months backing the methodology.</li>
              <li>Expected quantitative outcomes (e.g. &ldquo;94.2% accuracy with under 80ms edge inference&rdquo;).</li>
            </ol>
            <p>Faculty guides appreciate students who demonstrate pre-emptive planning and risk mitigation.</p>
          </div>

          {/* Article Footer CTA Block */}
          <div style={{ marginTop: '4rem', padding: '2.5rem 2rem', background: '#0e0e10', border: '1px solid rgba(255, 255, 255, 0.14)', borderRadius: '1.25rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 750, color: '#fff', marginBottom: '0.6rem' }}>Need Help Choosing or Building Your FYP Topic?</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', maxWidth: '560px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              Chat with our tech leads on WhatsApp to brainstorm custom ideas tailored to your department, budget, and college guidelines.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20need%20help%20choosing%20my%20FYP%20topic."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(37, 211, 102, 0.12)',
                  border: '1px solid rgba(37, 211, 102, 0.35)',
                  color: '#25d366',
                  fontWeight: 650,
                  fontSize: '0.92rem',
                  minHeight: '44px',
                  padding: '0.65rem 1.4rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                }}
              >
                <WhatsAppIcon size={18} /> Chat on WhatsApp
              </a>
              <a
                href="mailto:info@homiesstudio.com?subject=FYP%20Topic%20Consultation"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#f0f4f1',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  fontWeight: 650,
                  fontSize: '0.92rem',
                  minHeight: '44px',
                  padding: '0.65rem 1.4rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                }}
              >
                <MailIcon size={18} /> Email the Team
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
