import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Link from 'next/link';
import MenuButton from '@src/components/dom/navbar/components/MenuButton';
import MenuLinks from '@src/components/dom/navbar/components/MenuLinks';
import Logo from '@src/components/ui/Logo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '@src/components/dom/navbar/styles/index.module.scss';
import { useAuth } from '@src/context/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import useIsMobile from '@src/hooks/useIsMobile';
import useScroll from '@src/hooks/useScroll';
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
  const [lenis, isMenuOpen] = useStore(useShallow((state) => [state.lenis, state.isMenuOpen]));
  const { user, role } = useAuth();
  const headerRef = useRef();
  const isHiddenRef = useRef(false);

  const isInitialDark = router.pathname === '/about' || router.pathname === '/get-started';
  const [logoVariant, setLogoVariant] = useState(isInitialDark ? 'dark' : 'light');

  useEffect(() => {
    const isDark = router.pathname === '/about' || router.pathname === '/get-started';
    setLogoVariant(isDark ? 'dark' : 'light');
    if (headerRef.current) {
      gsap.to(headerRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      isHiddenRef.current = false;
    }
  }, [router.pathname]);

  // Mobile scroll behavior: hide header on scroll down so it never covers section headings/subtitles
  useScroll(
    ({ scroll, direction, velocity }) => {
      if (!isMobile || isMenuOpen || !headerRef.current) return;

      if (scroll < 80) {
        if (isHiddenRef.current) {
          gsap.to(headerRef.current, {
            yPercent: 0,
            opacity: 1,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          isHiddenRef.current = false;
        }
        return;
      }

      if (direction === 1 && Math.abs(velocity) > 0.15 && !isHiddenRef.current) {
        gsap.to(headerRef.current, {
          yPercent: -120,
          opacity: 0,
          duration: 0.28,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        isHiddenRef.current = true;
      } else if (direction === -1 && isHiddenRef.current) {
        gsap.to(headerRef.current, {
          yPercent: 0,
          opacity: 1,
          duration: 0.28,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        isHiddenRef.current = false;
      }
    },
    [isMobile, isMenuOpen],
  );

  useIsomorphicLayoutEffect(() => {
    const scroller = document?.querySelector('main') || window;
    const ctx = gsap.context(() => {
      if (router.pathname === '/about') {
        ScrollTrigger.create({
          id: 'aboutHeroLogoContrast',
          trigger: 'main section:nth-of-type(1)',
          start: 'bottom 70px',
          scroller,
          onEnter: () => setLogoVariant('light'),
          onLeaveBack: () => setLogoVariant('dark'),
          invalidateOnRefresh: true,
        });
      }

      if (router.pathname === '/') {
        ScrollTrigger.create({
          id: 'homeMiddleSectionContrast',
          trigger: '#homeMiddleSections',
          start: 'top 70px',
          end: 'bottom 70px',
          scroller,
          onEnter: () => setLogoVariant('dark'),
          onLeave: () => setLogoVariant('light'),
          onEnterBack: () => setLogoVariant('dark'),
          onLeaveBack: () => setLogoVariant('light'),
          invalidateOnRefresh: true,
        });
      }

      // Smoothly hide header when reaching the footer to prevent overlapping content or duplicate logo
      const footerEl = document.querySelector('footer');
      if (footerEl && headerRef.current) {
        ScrollTrigger.create({
          id: 'navbarFooterHide',
          trigger: footerEl,
          start: 'top 85%',
          scroller,
          onEnter: () => {
            gsap.to(headerRef.current, {
              yPercent: -120,
              opacity: 0,
              duration: 0.35,
              ease: 'power2.inOut',
              pointerEvents: 'none',
            });
          },
          onLeaveBack: () => {
            gsap.to(headerRef.current, {
              yPercent: 0,
              opacity: 1,
              duration: 0.35,
              ease: 'power2.inOut',
              clearProps: 'pointerEvents',
            });
          },
          invalidateOnRefresh: true,
        });
      }
    });

    return () => ctx.kill();
  }, [router.pathname]);

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

      <header ref={headerRef} className={styles.root} role="banner">
        <div className={styles.innerHeader}>
          <Link onClick={goToTop} aria-label="HOMIES STUDIO homepage" scroll={false} href="/" className={styles.logoLink}>
            <Logo variant={logoVariant} size="md" as="span" />
          </Link>

          <div className={styles.rightContainer}>
            {!isMobile &&
              (user && getDashboardRoute(role) ? (
                <Link href={getDashboardRoute(role)} style={{ textDecoration: 'none' }}>
                  <ButtonLink label={getDashboardLabel(role)} />
                </Link>
              ) : (
                <ButtonLink href="/get-started" label="START A CONVERSATION" />
              ))}
            <MenuButton />
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
