import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './404.module.scss';

export default function Custom404() {
  return (
    <>
      <CustomHead
        title="Page Not Found (404) | Homies Studio"
        description="The page you are looking for does not exist or has been moved. Explore Homies Studio projects, marketplace, or AI solutions."
        noindex
      />

      <div className={clsx(styles.root, 'layout-block-inner')}>
        <span className={styles.badge}>✦ 404 Error</span>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>The page you requested could not be found or has been moved. Explore our engineering project guidance, marketplace, or AI solutions below.</p>

        <div className={styles.linksGrid}>
          <Link href="/" className={styles.primaryBtn}>
            ← Back to Homepage
          </Link>
          <Link href="/final-year-projects" className={styles.secondaryBtn}>
            Final Year Projects
          </Link>
          <Link href="/mart" className={styles.secondaryBtn}>
            Homies Mart
          </Link>
          <Link href="/ai-solutions" className={styles.secondaryBtn}>
            AI Solutions
          </Link>
          <Link href="/contact" className={styles.secondaryBtn}>
            Contact Support
          </Link>
        </div>
      </div>
    </>
  );
}
