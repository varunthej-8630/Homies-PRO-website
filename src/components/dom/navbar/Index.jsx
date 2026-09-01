import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Link from 'next/link';
import MenuButton from '@src/components/dom/navbar/components/MenuButton';
import MenuLinks from '@src/components/dom/navbar/components/MenuLinks';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '@src/components/dom/navbar/styles/index.module.scss';
import { useAuth } from '@src/context/AuthContext';
import { useCallback, useRef } from 'react';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
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
  const logoTextRef = useRef();

  const isDarkHero = router.pathname === '/about';

  useIsomorphicLayoutEffect(() => {
    if (!isDarkHero) {
      if (logoTextRef.current) {
        gsap.set(logoTextRef.current, { color: '#28282b' });
      }
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(logoTextRef.current, { color: '#f0f4f1' });

      ScrollTrigger.create({
        trigger: 'main section:nth-of-type(1)',
        start: 'bottom 15%',
        scroller: document?.querySelector('main'),
        onEnter: () => gsap.to(logoTextRef.current, { color: '#28282b', duration: 0.35 }),
        onLeaveBack: () => gsap.to(logoTextRef.current, { color: '#f0f4f1', duration: 0.35 }),
        invalidateOnRefresh: true,
      });
    });

    return () => ctx.kill();
  }, [isDarkHero, router.pathname]);

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
            <h4 ref={logoTextRef} className={clsx('bold', 'h4', styles.logoText)}>
              HOMIES STUDIO
            </h4>
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
