/* eslint-disable */
import { useEffect, useRef } from 'react';

import Link from 'next/link';
import clsx from 'clsx';
import footerLinks from '@src/components/dom/navbar/constants/footerLinks';
import gsap from 'gsap';
import styles from '@src/components/dom/navbar/styles/menuLinks.module.scss';
import { useAuth } from '@src/context/AuthContext';
import useIsMobile from '@src/hooks/useIsMobile';
import { useRouter } from 'next/router';
import { useStore } from '@src/store';

function MenuLinks() {
  const timelineRef = useRef(null);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen, lenis, isLoading, setIsConversationOpen] = useStore((state) => [state.isMenuOpen, state.setIsMenuOpen, state.lenis, state.isLoading, state.setIsConversationOpen]);
  const { user, profile, role, signOut } = useAuth();
  const menuRef = useRef();
  const menuLinksItemsRef = useRef([]);
  const router = useRouter();

  const setupMenuAnimation = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const fluidCanvas = document?.getElementById('fluidCanvas');
    const layout = document?.getElementById('layout');
    const scrollbar = document?.getElementById('scrollbar');
    const header = document?.querySelector('header');

    if (menuRef.current) {
      gsap.set(menuRef.current, { pointerEvents: 'none', autoAlpha: 0 });
    }
    if (menuLinksItemsRef.current) {
      gsap.set(menuLinksItemsRef.current, { x: '-100%' });
    }

    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.8, ease: 'power3.inOut' },
      onReverseComplete: () => {
        if (lenis) lenis.start();
        gsap.set('main', { clearProps: 'transform,border,borderRadius,scale,left,pointerEvents' });
        if (header) gsap.set(header, { clearProps: 'left,top,scale,autoAlpha' });
        if (layout) gsap.set(layout, { clearProps: 'opacity,height' });
      },
    });

    tl.to(menuRef.current, { autoAlpha: 1, stagger: 0.01, pointerEvents: 'auto' }, 0)
      .to(fluidCanvas, { duration: 0, opacity: 0 }, 0)
      .to(menuLinksItemsRef.current, { x: 0, stagger: 0.016, pointerEvents: 'auto' }, 0)
      .to(
        'main',
        {
          borderRadius: '1.3888888889vw',
          border: '2px solid #f0f4f1',
          scale: 0.9,
          pointerEvents: 'none',
          left: '-40vw',
        },
        0,
      )
      .to(layout, { opacity: isMobile ? 0.05 : 0.3, height: '90svh' }, 0)
      .to(scrollbar, { opacity: 0, right: '46vw', scale: 0.9 }, 0)
      .to(
        header,
        {
          autoAlpha: 0,
          left: '-40vw',
          top: isMobile ? '6vw' : '3vw',
          scale: 0.9,
          overwrite: true,
        },
        0,
      );

    timelineRef.current = tl;
    return tl;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      setupMenuAnimation();
    });

    return () => {
      ctx.kill();
    };
  }, [isMobile]);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    if (isMenuOpen) {
      tl.play();
    } else {
      tl.reverse();
    }
  }, [isMenuOpen]);

  // Ensure menu is fully closed and layout restored on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    const tl = timelineRef.current;
    if (tl) {
      tl.progress(0).pause();
    }
    const header = document?.querySelector('header');
    const layout = document?.getElementById('layout');
    gsap.set('main', { clearProps: 'transform,border,borderRadius,scale,left,pointerEvents' });
    if (header) gsap.set(header, { clearProps: 'left,top,scale,autoAlpha' });
    if (layout) gsap.set(layout, { clearProps: 'opacity,height' });
    if (menuRef.current) {
      gsap.set(menuRef.current, { autoAlpha: 0, pointerEvents: 'none' });
    }
    if (lenis) lenis.start();
  }, [router.asPath]);

  const goToBottom = () => {
    setIsMenuOpen(false);

    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        const mainHeight = mainElement.scrollHeight;
        lenis.scrollTo(mainHeight, {
          duration: 1.5,
          force: true,
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          onComplete: () => {
            lenis.start();
          },
        });
      }
    }, 850);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await signOut();
    router.push('/');
  };

  // Dynamic role link for sitemap
  let roleSpecificLink = { title: 'Become a Creator', href: '/become-a-creator' };
  if (role === 'CREATOR') {
    roleSpecificLink = { title: 'Creator Studio', href: '/creator/dashboard' };
  } else if (role === 'ADMIN') {
    roleSpecificLink = { title: 'Admin Console', href: '/admin/dashboard' };
  }

  const dynamicLinks = [
    { title: 'Home', href: '/' },
    { title: 'Homies Mart', href: '/mart' },
    roleSpecificLink,
    ...(role === 'BUYER' ? [{ title: 'Buyer Portal', href: '/buyer/dashboard' }] : []),
    { title: 'About Homies', href: '/about' },
    { title: 'Contact', href: undefined },
  ];

  const renderMenuLinks = (links, refs, pathname) =>
    links.map((link, index) => (
      <div
        ref={(el) => {
          menuLinksItemsRef.current[index + 1] = el;
        }}
        key={link.title}
        className={clsx(styles.menuListItem, pathname === link.href && styles.menuListItemActive)}
      >
        {link.href !== undefined ? (
          <Link aria-label={`Go ${link.title}`} scroll={false} href={link.href} onClick={() => setIsMenuOpen(false)}>
            <span>{link.title}</span>
          </Link>
        ) : (
          <span
            onClick={goToBottom}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToBottom();
              }
            }}
          >
            {link.title}
          </span>
        )}
      </div>
    ));

  return (
    <nav id="menu" ref={menuRef} className={styles.menu}>
      <div className={clsx(styles.menuWrapper, 'layout-block-inner')}>
        <button type="button" className={styles.menuClose} onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
          <p>✕</p>
        </button>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[0] = el;
          }}
          className={clsx(styles.menuList, styles.sitemapList)}
        >
          {renderMenuLinks(dynamicLinks, menuLinksItemsRef, router.pathname)}
        </div>

        {/* Authentication & User Section in Menu */}
        <div
          ref={(el) => {
            menuLinksItemsRef.current[dynamicLinks.length + 1] = el;
          }}
          className={clsx(styles.menuList, styles.conversationList)}
        >
          {user ? (
            <>
              <div className={styles.menuListItem} style={{ opacity: 0.85, fontSize: '0.88rem', cursor: 'default' }}>
                <span>
                  Signed in as: <strong>{profile?.full_name || user.email?.split('@')[0]}</strong>
                </span>
              </div>

              {/* Conditional Portal / Console Link */}
              {role === 'ADMIN' && (
                <div className={styles.menuListItem} style={{ marginTop: '0.2rem' }}>
                  <Link scroll={false} href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>ADMIN CONSOLE →</span>
                  </Link>
                </div>
              )}
              {role === 'CREATOR' && (
                <div className={styles.menuListItem} style={{ marginTop: '0.2rem' }}>
                  <Link scroll={false} href="/creator/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <span>CREATOR STUDIO →</span>
                  </Link>
                </div>
              )}
              {role === 'BUYER' && (
                <div className={styles.menuListItem} style={{ marginTop: '0.2rem' }}>
                  <Link scroll={false} href="/buyer/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <span>MY PORTAL →</span>
                  </Link>
                </div>
              )}

              <div role="presentation" className={styles.menuListItem} style={{ marginTop: '0.4rem' }}>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsConversationOpen(true);
                  }}
                >
                  <span>START A CONVERSATION</span>
                </button>
              </div>

              <div className={styles.menuListItem} style={{ marginTop: '0.4rem' }}>
                <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }} onClick={handleLogout}>
                  <span>LOG OUT →</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div role="presentation" className={styles.menuListItem}>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsConversationOpen(true);
                  }}
                >
                  <span>START A CONVERSATION</span>
                </button>
              </div>

              <div className={styles.menuListItem} style={{ marginTop: '0.3rem' }}>
                <Link scroll={false} href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <span>SIGN IN →</span>
                </Link>
              </div>
              <div className={styles.menuListItem}>
                <Link scroll={false} href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  <span>CREATE ACCOUNT</span>
                </Link>
              </div>
            </>
          )}
        </div>

        <div
          ref={(el) => {
            menuLinksItemsRef.current[dynamicLinks.length + 3] = el;
          }}
          className={clsx(styles.menuList, styles.followList)}
        >
          {footerLinks.map((link, index) => (
            <div
              ref={(el) => {
                menuLinksItemsRef.current[dynamicLinks.length + index + 4] = el;
              }}
              key={link.title}
              className={styles.menuListItem}
            >
              <a aria-label={`Go ${link.title}`} target="_blank" rel="noopener noreferrer" href={link.href || link.url}>
                <span>{link.title}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default MenuLinks;
