import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
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
          <h1 className={clsx('h1', 'medium')}>Hey, We&apos;re</h1>
          <h1 className={clsx('h1', 'medium')}>Homies Studio!</h1>
        </AppearTitle>
      </div>

      <div className={clsx(styles.container, 'layout-grid-inner')}>
        <div className={clsx(styles.descWrapper)} ref={animatedImageRef}>
          <AppearTitle>
            <div className="p-l">“Create. Showcase. Discover. Sell. Grow.</div>
            <div className="p-l">From the first spark of an idea to production deployment,</div>
            <div className="p-l">we turn engineering projects into real possibilities.”</div>
          </AppearTitle>
        </div>
        <div className={clsx(styles.descWrapperBottom)}>
          {!isMobile ? (
            <AppearTitle key="desktop-descWrapperBottom">
              <h6 className="h6">Homies Studio is a project marketplace and creator ecosystem built around three pillars:</h6>
              <h6 className="h6">Creation. Marketplace. Solutions.</h6>
              <h6 className="h6">We empower creators to publish and monetize their technical builds, help students</h6>
              <h6 className="h6">and developers discover verified, ready-made projects across domains, and build</h6>
              <h6 className="h6">bespoke digital solutions for startups and enterprises globally.</h6>
            </AppearTitle>
          ) : (
            <AppearTitle key="mobile-descWrapperBottom">
              <h6 className="h6">Homies Studio is a project marketplace and creator ecosystem built around three pillars: Creation. Marketplace. Solutions.</h6>
              <h6 className="h6">We empower creators to monetize their builds, help developers discover ready-made projects, and engineer custom digital solutions.</h6>
            </AppearTitle>
          )}
          <div className={clsx(styles.buttonContainer)}>
            <ButtonLink href="/projects" label="EXPLORE MARKETPLACE" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
