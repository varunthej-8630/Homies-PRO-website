import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Image from 'next/image';
import Link from 'next/link';
import MenuButton from '@src/components/dom/navbar/components/MenuButton';
import MenuLinks from '@src/components/dom/navbar/components/MenuLinks';
import clsx from 'clsx';
import styles from '@src/components/dom/navbar/styles/index.module.scss';
import { useAuth } from '@src/context/AuthContext';
import { useCallback } from 'react';
import useIsMobile from '@src/hooks/useIsMobile';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function getDashboardRoute(role) {
  if (role === 'CREATOR') return '/creator/dashboard';
  if (role === 'BUYER') return '/buyer/dashboard';
  return null;
}

function getDashboardLabel(role) {
  if (role === 'CREATOR') return 'CREATOR STUDIO';
  if (role === 'BUYER') return 'MY PORTAL';
  return null;
}

function Navbar() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [lenis, setIsConversationOpen] = useStore(useShallow((state) => [state.lenis, state.setIsConversationOpen]));
  const { user, role } = useAuth();

  const scrollToPosition = useCallback(
    (position, duration = 1.5) => {
      if (lenis) {
        lenis.scrollTo(position, {
          duration,
          force: true,
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          onComplete: () => {
            lenis.start();
          },
        });
      }
    },
    [lenis],
  );

  const goToTop = useCallback(() => {
    if (router.pathname === '/') {
      scrollToPosition(0);
    }
  }, [router.pathname, scrollToPosition]);

  return (
    <>
      <MenuLinks />

      <header className={styles.root} role="banner">
        <div className={styles.innerHeader}>
          <Link onClick={goToTop} aria-label="Go home" scroll={false} href="/" className={styles.logoLink}>
            <Image priority src="/homies/header-logo.png" width={32} height={32} alt="HOMIES STUDIO" className={styles.logoIcon} />
            <h4 className={clsx('bold', 'h4')}>HOMIES STUDIO</h4>
          </Link>

          <div className={styles.rightContainer}>
            {!isMobile &&
              (user && getDashboardRoute(role) ? (
                <Link href={getDashboardRoute(role)} style={{ textDecoration: 'none' }}>
                  <ButtonLink label={getDashboardLabel(role)} />
                </Link>
              ) : (
                <ButtonLink onClick={() => setIsConversationOpen(true)} label="START A CONVERSATION" />
              ))}
            <MenuButton />
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
