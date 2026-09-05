import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import Link from 'next/link';
import clsx from 'clsx';
import styles from '@src/pages/about/components/overview/styles/overview.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';

function Overview() {
  const isMobile = useIsMobile();

  return (
    <section className={clsx(styles.root, 'layout-grid-inner')}>
      <div className={styles.title}>
        {isMobile ? (
          <AppearTitle key="mobile-queto">
            <h3 className="h3">Bridging engineering education</h3>
            <h3 className="h3">
              and <span className="medium">real-world technical execution</span>
            </h3>
            <h3 className="h3">
              across <span className="medium">India.</span>
            </h3>
          </AppearTitle>
        ) : (
          <AppearTitle key="desktop-queto">
            <h3 className="h3">Bridging engineering education</h3>
            <h3 className="h3">
              and <span className="medium">real-world technical execution</span>
            </h3>
            <h3 className="h3">
              for students and startups <span className="medium">pan-India.</span>
            </h3>
          </AppearTitle>
        )}
      </div>
      <div className={clsx(styles.text, 'p-l', styles.myStory)}>
        <AppearTitle>
          <span>About Homies Studio</span>
        </AppearTitle>
      </div>
      <div className={styles.desc}>
        <AppearTitle key="overview-desc">
          <h6 className="h6">Homies Studio is a technology studio operating across India, founded to bridge the gap between engineering education and real-world technical execution.</h6>
          <h6 className={clsx(styles.paddingTop, 'h6')}>The studio operates two primary service wings and one marketplace:</h6>

          <h6 className={clsx(styles.paddingTop, 'h6')} style={{ color: '#c5a359', letterSpacing: '0.04em', fontWeight: 700 }}>
            &mdash;&mdash;&mdash; ENGINEERING &amp; STUDENT PROJECTS WING &mdash;&mdash;&mdash;
          </h6>
          <h6 className="h6">
            Homies Studio provides end-to-end{' '}
            <Link href="/final-year-projects" style={{ textDecoration: 'underline', color: 'inherit' }}>
              Final Year Project (FYP) Guidance
            </Link>{' '}
            for B.Tech and M.Tech engineering students across India &mdash; entirely remotely, pan-India. Supported domains include IoT (Internet of Things), Robotics, Embedded Systems, Artificial
            Intelligence, Machine Learning, Computer Vision, Deep Learning, and Full Stack Web Development. Students from CSE, ECE, and EEE branches are supported with project topic selection,
            implementation, documentation, and submission.
          </h6>

          <h6 className={clsx(styles.paddingTop, 'h6')} style={{ color: '#c5a359', letterSpacing: '0.04em', fontWeight: 700 }}>
            &mdash;&mdash;&mdash; B2B AI SOLUTIONS WING &mdash;&mdash;&mdash;
          </h6>
          <h6 className="h6">
            Homies Studio builds custom technology products through our{' '}
            <Link href="/ai-solutions" style={{ textDecoration: 'underline', color: 'inherit' }}>
              B2B AI Solutions Wing
            </Link>{' '}
            for startups, EdTech companies, and enterprises &mdash; including AI agents, SaaS platforms, web applications, and workflow automation tools.
          </h6>

          <h6 className={clsx(styles.paddingTop, 'h6')} style={{ color: '#c5a359', letterSpacing: '0.04em', fontWeight: 700 }}>
            &mdash;&mdash;&mdash; HOMIES MART &mdash;&mdash;&mdash;
          </h6>
          <h6 className="h6">
            <Link href="/mart" style={{ textDecoration: 'underline', color: 'inherit' }}>
              Homies Mart
            </Link>{' '}
            is Homies Studio&apos;s engineering project marketplace &mdash; where students and developers can buy verified ready-made projects or apply to{' '}
            <Link href="/become-a-creator" style={{ textDecoration: 'underline', color: 'inherit' }}>
              Become a Homies Creator
            </Link>{' '}
            and sell their own technical builds to students across India.
          </h6>

          <h6 className={clsx(styles.paddingTop, 'h6')} style={{ color: '#c5a359', letterSpacing: '0.04em', fontWeight: 700 }}>
            &mdash;&mdash;&mdash; CORE AUDIENCES SERVED &mdash;&mdash;&mdash;
          </h6>
          <h6 className="h6">
            1. Engineering students seeking{' '}
            <Link href="/final-year-projects" style={{ textDecoration: 'underline', color: 'inherit' }}>
              Final Year Project Guidance
            </Link>{' '}
            (pan-India, remote)
          </h6>
          <h6 className="h6">
            2. Engineering colleges seeking structured{' '}
            <Link href="/for-colleges" style={{ textDecoration: 'underline', color: 'inherit' }}>
              Student Project Support Programs
            </Link>
          </h6>
          <h6 className="h6">
            3. Startups and EdTech companies seeking{' '}
            <Link href="/ai-solutions" style={{ textDecoration: 'underline', color: 'inherit' }}>
              AI Product Development
            </Link>
          </h6>
          <h6 className="h6">
            4. Developer-creators looking to monetize on{' '}
            <Link href="/become-a-creator" style={{ textDecoration: 'underline', color: 'inherit' }}>
              Homies Creator Marketplace
            </Link>
          </h6>

          <h6 className={clsx(styles.paddingTop, 'h6')}>
            Email:{' '}
            <a href="mailto:info@homiesstudio.com" style={{ textDecoration: 'underline' }}>
              info@homiesstudio.com
            </a>{' '}
            | WhatsApp:{' '}
            <a href="https://wa.me/917416636417" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
              +91 74166 36417
            </a>{' '}
            |{' '}
            <Link href="/contact" style={{ textDecoration: 'underline', color: 'inherit' }}>
              Contact Homies Studio
            </Link>
          </h6>
        </AppearTitle>
      </div>
    </section>
  );
}
export default Overview;
