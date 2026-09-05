import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Link from 'next/link';
import clsx from 'clsx';
import { gsap } from 'gsap';
import styles from '@src/pages/components/about/styles/about.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';

function About() {
  const isMobile = useIsMobile();
  const rootRef = useRef();
  const animatedImageRef = useRef();

  const setupScrollAnimation = () => {
    const ctx = gsap.context(() => {
      gsap.set(animatedImageRef.current, { top: !isMobile ? '-20vw' : '0' });
      if (!isMobile) {
        gsap.to(animatedImageRef.current, {
          top: '20vw',
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            scroller: document?.querySelector('main'),
            invalidateOnRefresh: true,
          },
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupScrollAnimation();
    return () => ctx.kill();
  }, [isMobile]);

  return (
    <section ref={rootRef} className={styles.root}>
      <div className={clsx(styles.nameContainer, 'layout-block-inner')}>
        <AppearTitle>
          <h2 className={clsx('h1', 'medium')}>Hey, We&apos;re</h2>
          <h2 className={clsx('h1', 'medium')}>Homies Studio!</h2>
        </AppearTitle>
      </div>

      <div className={clsx(styles.container, 'layout-grid-inner')}>
        <div className={clsx(styles.descWrapper)} ref={animatedImageRef}>
          <AppearTitle>
            <div className="p-l">
              &ldquo;Your partner for{' '}
              <Link href="/final-year-projects" style={{ textDecoration: 'underline', color: 'inherit' }}>
                Final Year Projects
              </Link>
              ,{' '}
              <Link href="/ai-solutions" style={{ textDecoration: 'underline', color: 'inherit' }}>
                AI Solutions
              </Link>{' '}
              &amp; Digital Products &mdash;
            </div>
            <div className="p-l">
              serving students,{' '}
              <Link href="/for-colleges" style={{ textDecoration: 'underline', color: 'inherit' }}>
                colleges
              </Link>
              , and startups across India.
            </div>
            <div className="p-l">From the first idea to final submission, we build real things.&rdquo;</div>
          </AppearTitle>
        </div>
        <div className={clsx(styles.descWrapperBottom)}>
          {!isMobile ? (
            <AppearTitle key="desktop-descWrapperBottom">
              <h6 className="h6">
                Homies Studio is a project marketplace and creator ecosystem built around three pillars:{' '}
                <Link href="/final-year-projects" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Creation
                </Link>
                .{' '}
                <Link href="/mart" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Marketplace
                </Link>
                .{' '}
                <Link href="/ai-solutions" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Solutions
                </Link>
                .
              </h6>
              <h6 className="h6">
                We empower creators to publish and monetize their technical builds on{' '}
                <Link href="/mart" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Homies Mart
                </Link>
                , help students
              </h6>
              <h6 className="h6">and developers discover verified, ready-made projects across domains, and build</h6>
              <h6 className="h6">
                bespoke digital solutions for startups and enterprises globally. Learn more{' '}
                <Link href="/about" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  about Homies Studio
                </Link>
                .
              </h6>
            </AppearTitle>
          ) : (
            <AppearTitle key="mobile-descWrapperBottom">
              <h6 className="h6">
                Homies Studio is a project marketplace and creator ecosystem built around three pillars:{' '}
                <Link href="/final-year-projects" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Creation
                </Link>
                .{' '}
                <Link href="/mart" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Marketplace
                </Link>
                .{' '}
                <Link href="/ai-solutions" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Solutions
                </Link>
                .
              </h6>
              <h6 className="h6">We empower creators to monetize their builds, help developers discover ready-made projects, and engineer custom digital solutions.</h6>
            </AppearTitle>
          )}
          <div className={clsx(styles.buttonContainer)}>
            <ButtonLink href="/mart" label="EXPLORE HOMIES MART" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
