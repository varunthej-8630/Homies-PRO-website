/* eslint-disable */
import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import clsx from 'clsx';
import footerLinks from '@src/components/dom/navbar/constants/footerLinks';
import gsap from 'gsap';
import Logo from '@src/components/ui/Logo';
import styles from '@src/components/dom/navbar/styles/menuLinks.module.scss';
import { useAuth } from '@src/context/AuthContext';
import useIsMobile from '@src/hooks/useIsMobile';
import { useRouter } from 'next/router';
import { useStore } from '@src/store';

const SEARCHABLE_ENTRIES = [
  { title: 'Homepage', category: 'Navigation', href: '/' },
  { title: 'Homies Mart — Project Store', category: 'Store', href: '/mart' },
  { title: 'Website Development', category: 'Services', href: '/website-development' },
  { title: 'AI Solutions & Agents', category: 'Services', href: '/ai-solutions' },
  { title: 'Final Year Projects Guidance', category: 'Services', href: '/final-year-projects' },
  { title: 'For Engineering Colleges', category: 'Institutional', href: '/for-colleges' },
  { title: 'Become a Creator', category: 'Ecosystem', href: '/become-a-creator' },
  { title: 'About Homies Studio', category: 'Company', href: '/about' },
  { title: 'Engineering & Tech Blog', category: 'Articles', href: '/blog' },
  { title: 'What Is an AI Agent? (Guide)', category: 'Articles', href: '/blog/what-is-an-ai-agent' },
  { title: 'Contact Us', category: 'Support', href: '/contact' },
  { title: 'Creator Dashboard', category: 'Portal', href: '/creator/dashboard' },
  { title: 'Buyer Dashboard', category: 'Portal', href: '/buyer/dashboard' },
  { title: 'Sign In', category: 'Account', href: '/auth/login' },
  { title: 'Create Account', category: 'Account', href: '/auth/signup' },
  { title: 'Privacy Policy', category: 'Legal', href: '/privacy-policy' },
  { title: 'Terms of Service', category: 'Legal', href: '/terms-of-use' },
];

function MenuLinks() {
  const [searchQuery, setSearchQuery] = useState('');
  const timelineRef = useRef(null);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen, lenis, isLoading, setIsConversationOpen] = useStore((state) => [state.isMenuOpen, state.setIsMenuOpen, state.lenis, state.isLoading, state.setIsConversationOpen]);
  const { user, profile, role, signOut } = useAuth();
  const menuRef = useRef();
  const closeButtonRef = useRef();
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
        document.body.style.overflow = '';
        if (lenis) lenis.start();
        gsap.set('main', { clearProps: 'transform,border,borderRadius,scale,pointerEvents' });
        if (header) gsap.set(header, { clearProps: 'transform,scale,autoAlpha' });
        if (layout) gsap.set(layout, { clearProps: 'opacity' });
        if (menuRef.current) gsap.set(menuRef.current, { autoAlpha: 0, pointerEvents: 'none' });
      },
    });

    tl.to(menuRef.current, { autoAlpha: 1, pointerEvents: 'auto', duration: 0.4 }, 0)
      .to(fluidCanvas, { duration: 0, opacity: 0 }, 0)
      .to(menuLinksItemsRef.current, { x: 0, stagger: 0.016, pointerEvents: 'auto' }, 0)
      .to(
        'main',
        {
          borderRadius: '1.3888888889vw',
          border: '2px solid #f0f4f1',
          scale: 0.9,
          pointerEvents: 'none',
          x: '-40vw',
        },
        0,
      )
      .to(layout, { opacity: isMobile ? 0.05 : 0.3 }, 0)
      .to(scrollbar, { opacity: 0, x: '-46vw', scale: 0.9 }, 0)
      .to(
        header,
        {
          autoAlpha: 0,
          x: '-40vw',
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
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      tl.play();
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      tl.reverse();
    }
  }, [isMenuOpen, lenis]);

  // Accessibility: close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        e.preventDefault();
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  // Ensure menu is fully closed and layout restored on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    document.body.style.overflow = '';
    const tl = timelineRef.current;
    if (tl) {
      tl.progress(0).pause();
    }
    const header = document?.querySelector('header');
    const layout = document?.getElementById('layout');
    gsap.set('main', { clearProps: 'transform,border,borderRadius,scale,pointerEvents' });
    if (header) gsap.set(header, { clearProps: 'transform,scale,autoAlpha' });
    if (layout) gsap.set(layout, { clearProps: 'opacity' });
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
    { title: 'Website Development', href: '/website-development' },
    { title: 'AI Solutions', href: '/ai-solutions' },
    { title: 'Final Year Projects', href: '/final-year-projects' },
    roleSpecificLink,
    { title: 'For Colleges', href: '/for-colleges' },
    ...(role === 'BUYER' ? [{ title: 'Buyer Portal', href: '/buyer/dashboard' }] : []),
    { title: 'About Homies', href: '/about' },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact', href: '/contact' },
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
    <nav id="menu" ref={menuRef} className={styles.menu} aria-label="Sitemap navigation">
      <div className={styles.menuHeader}>
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          aria-label="HOMIES STUDIO homepage"
          className={styles.menuLogoLink}
        >
          <Logo variant="dark" size="sm" />
        </Link>
      </div>

      <button
        ref={closeButtonRef}
        type="button"
        className={styles.menuClose}
        onClick={() => setIsMenuOpen(false)}
        aria-label="Close menu"
      >
        <p aria-hidden="true">✕</p>
      </button>

      <div className={clsx(styles.menuWrapper, 'layout-block-inner')}>
        {/* Instant Site Search Bar */}
        <div style={{ width: '100%', marginBottom: '1.75rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.9rem' }} aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              role="searchbox"
              aria-label="Search pages and services"
              placeholder="Search services, pages, articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.6rem',
                borderRadius: '0.75rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease, background 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#c5a359';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {searchQuery.trim() ? (
          <div style={{ width: '100%', minHeight: '300px' }}>
            {(() => {
              const q = searchQuery.toLowerCase().trim();
              const results = SEARCHABLE_ENTRIES.filter(
                (item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
              );
              if (results.length === 0) {
                return (
                  <div style={{ padding: '2rem 0', color: 'rgba(255, 255, 255, 0.65)' }}>
                    <p style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>No matching pages found for &ldquo;{searchQuery}&rdquo;.</p>
                    <p style={{ fontSize: '0.88rem', opacity: 0.7 }}>Try searching for &ldquo;projects&rdquo;, &ldquo;ai&rdquo;, &ldquo;mart&rdquo;, or &ldquo;contact&rdquo;.</p>
                  </div>
                );
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '580px' }}>
                  <p style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c5a359', margin: 0 }}>
                    {results.length} {results.length === 1 ? 'Result' : 'Results'} Found:
                  </p>
                  {results.map((res) => (
                    <Link
                      key={res.href}
                      href={res.href}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setSearchQuery('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.25rem',
                        borderRadius: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        textDecoration: 'none',
                        transition: 'border-color 0.2s ease, background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(197, 163, 89, 0.4)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '1rem' }}>{res.title}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          background: 'rgba(197, 163, 89, 0.15)',
                          color: '#c5a359',
                        }}
                      >
                        {res.category}
                      </span>
                    </Link>
                  ))}
                </div>
              );
            })()}
          </div>
        ) : (
          <div
            ref={(el) => {
              menuLinksItemsRef.current[0] = el;
            }}
            className={clsx(styles.menuList, styles.sitemapList)}
          >
            {renderMenuLinks(dynamicLinks, menuLinksItemsRef, router.pathname)}
          </div>
        )}

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
                <Link scroll={false} href="/get-started" onClick={() => setIsMenuOpen(false)}>
                  <span>START A CONVERSATION</span>
                </Link>
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
                <Link scroll={false} href="/get-started" onClick={() => setIsMenuOpen(false)}>
                  <span>START A CONVERSATION</span>
                </Link>
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
