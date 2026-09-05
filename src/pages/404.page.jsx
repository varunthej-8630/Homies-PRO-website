import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './404.module.scss';

export default function Custom404() {
  return (
    <>
      <CustomHead
        title="Page Not Found | Homies Studio"
        description="The requested page could not be found on Homies Studio. Explore our engineering final year project guidance, Homies Mart, or AI solutions."
        noindex
      />
      <section className={clsx(styles.root, 'layout-block-inner')} role="main">
        <div className={styles.contentWrapper}>
          <span className={styles.badge}>HTTP 404 — Error</span>
          <h1 className={styles.errorCode}>404</h1>
          <h2 className={styles.title}>Page Not Found</h2>
          <p className={styles.description}>
            The technical resource or page you are looking for might have been moved, renamed, or is temporarily unavailable. Explore our primary engineering hubs below.
          </p>

          <div className={styles.navSection}>
            <span className={styles.navTitle}>Quick Navigation</span>
            <div className={styles.linkGrid}>
              <Link href="/" className={clsx(styles.navPill, styles.primaryPill)}>
                Return Home
              </Link>
              <Link href="/final-year-projects" className={styles.navPill}>
                Final Year Projects
              </Link>
              <Link href="/mart" className={styles.navPill}>
                Homies Mart
              </Link>
              <Link href="/ai-solutions" className={styles.navPill}>
                AI Solutions
              </Link>
              <Link href="/contact" className={styles.navPill}>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
