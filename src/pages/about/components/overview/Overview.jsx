import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
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

          <h6 className={clsx(styles.paddingTop, 'h6')} style={{ color: '#c5a359', letterSpacing: '0.04em' }}>
            ─── ENGINEERING &amp; STUDENT PROJECTS WING ───
          </h6>
          <h6 className="h6">
            Homies Studio provides end-to-end final year project (FYP) guidance for B.Tech and M.Tech engineering students across India — entirely remotely, pan-India. Supported domains include IoT
            (Internet of Things), Robotics, Embedded Systems, Artificial Intelligence, Machine Learning, Computer Vision, Deep Learning, and Full Stack Web Development. Students from CSE (Computer
            Science Engineering), ECE (Electronics and Communication Engineering), and EEE (Electrical and Electronics Engineering) branches are supported with project topic selection, implementation,
            documentation, and submission.
          </h6>

          <h6 className={clsx(styles.paddingTop, 'h6')} style={{ color: '#c5a359', letterSpacing: '0.04em' }}>
            ─── B2B AI SOLUTIONS WING ───
          </h6>
          <h6 className="h6">
            Homies Studio builds custom technology products for startups, EdTech companies, and enterprises — including AI agents, SaaS platforms, web applications, and workflow automation tools. The
            studio works with early-stage and growth-stage startups across India.
          </h6>

          <h6 className={clsx(styles.paddingTop, 'h6')} style={{ color: '#c5a359', letterSpacing: '0.04em' }}>
            ─── HOMIES MART ───
          </h6>
          <h6 className="h6">
            Homies Mart is Homies Studio&apos;s engineering project marketplace — where students and developers can buy verified ready-made projects or become a Homies Creator and sell their own
            technical builds to students across India.
          </h6>

          <h6 className={clsx(styles.paddingTop, 'h6')} style={{ color: '#c5a359', letterSpacing: '0.04em' }}>
            ─── CORE AUDIENCES SERVED ───
          </h6>
          <h6 className="h6">1. Engineering students seeking final year project guidance (pan-India, remote)</h6>
          <h6 className="h6">2. Engineering colleges seeking structured student project support programs</h6>
          <h6 className="h6">3. Startups and EdTech companies seeking AI product development</h6>
          <h6 className="h6">4. Developer-creators looking to monetize their technical projects</h6>

          <h6 className={clsx(styles.paddingTop, 'h6')}>
            Email:{' '}
            <a href="mailto:info@homiesstudio.com" style={{ textDecoration: 'underline' }}>
              info@homiesstudio.com
            </a>{' '}
            | WhatsApp:{' '}
            <a href="https://wa.me/917416636417" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
              +91 74166 36417
            </a>{' '}
            | Service: Pan-India · Remote · India-wide
          </h6>
        </AppearTitle>
      </div>
    </section>
  );
}
export default Overview;
