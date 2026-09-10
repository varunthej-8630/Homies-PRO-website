import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './404.module.scss';

export default function Custom404() {
  return (
    <>
      <CustomHead title="Page Not Found | Homies Studio" description="The requested page could not be found on Homies Studio." noindex />
      <section className={clsx(styles.root, 'layout-block-inner')} role="main">
        <div className={styles.contentWrapper}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Page not found.</h1>
          <p className={styles.subtext}>This link might be broken or the page may have moved.</p>

          <div className={styles.linksRow}>
            <Link href="/" className={clsx(styles.recoveryLink, styles.primaryRecoveryLink)}>
              ← Back to Home
            </Link>
            <Link href="/mart" className={styles.recoveryLink}>
              Explore Homies Mart
            </Link>
            <Link href="/contact" className={styles.recoveryLink}>
              Contact Us
            </Link>
          </div>

          <div className={styles.whatsappBlock}>
            <span>Or reach us directly on </span>
            <a href="https://wa.me/917416636417" target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
