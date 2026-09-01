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
            <h3 className="h3">From the first idea </h3>
            <h3 className="h3">
              to the <span className="medium">final build,</span>
            </h3>
            <h3 className="h3">
              we help you <span className="medium">understand it,</span>
            </h3>
            <h3 className="h3">
              <span className="medium">develop it,</span> and bring it to life.
            </h3>
          </AppearTitle>
        ) : (
          <AppearTitle key="desktop-queto">
            <h3 className="h3">From the first idea to the</h3>
            <h3 className="h3">
              <span className="medium">final build,</span> we help you
            </h3>
            <h3 className="h3">
              <span className="medium">understand it,</span> develop it, and bring it to life.
            </h3>
          </AppearTitle>
        )}
      </div>
      <div className={clsx(styles.text, 'p-l', styles.myStory)}>
        <AppearTitle>
          <span>About Homies</span>
        </AppearTitle>
      </div>
      <div className={styles.desc}>
        {!isMobile ? (
          <AppearTitle key="desktop-overview">
            <h6 className="h6">Homies Studio is a technology-driven studio built around three core pillars:</h6>
            <h6 className="h6">Guidance. Development. Solutions.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>We support students who need the right direction, develop projects across engineering</h6>
            <h6 className="h6">and technology domains, and build custom digital solutions for individuals, startups, and businesses.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>From AI/ML, Web, App Development, IoT, Robotics, Embedded, VLSI, Automation,</h6>
            <h6 className="h6">Data Science, and beyond — we work across domains to build what the requirement demands.</h6>

            <h6 className={clsx(styles.paddingTop, 'h6')}>Let&apos;s build your next idea together!</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>HOMIES STUDIO.</h6>
          </AppearTitle>
        ) : (
          <AppearTitle key="mobile-overview">
            <h6 className="h6">
              Homies Studio is a technology-driven studio built around three things: <strong>Guidance. Development. Solutions.</strong>
            </h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>
              We support students who need the right direction, develop projects across engineering and technology domains, and build custom digital solutions for businesses.
            </h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>
              From AI/ML, Web, App Development, IoT, Robotics, Embedded, VLSI, Automation, Data Science, and beyond — we work across domains to build what the requirement demands.
            </h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>HOMIES STUDIO.</h6>
          </AppearTitle>
        )}
      </div>
    </section>
  );
}
export default Overview;
