/* eslint-disable */

import { useRef } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '@src/components/dom/styles/loader.module.scss';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Loader() {
  const [lenis, introOut, setIntroOut, setIsLoading, setIsAbout] = useStore(
    useShallow((state) => [state.lenis, state.introOut, state.setIntroOut, state.setIsLoading, state.setIsAbout]),
  );

  const root = useRef(null);
  const logoContainerRef = useRef(null);
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    let ctx;
    if (!introOut) {
      setIsAbout(router.asPath === '/about');

      ctx = gsap.context(() => {
        // Initial setup
        gsap.set(logoContainerRef.current, {
          opacity: 0,
          scale: 0.94,
          filter: 'blur(6px)',
        });
        gsap.set('header', {
          autoAlpha: 0,
        });
        gsap.set('main', {
          opacity: 1,
          x: '0px',
          scale: 1,
          borderRadius: 0,
          border: 'none',
        });
        gsap.set(document?.getElementById('layout'), {
          height: '100%',
          opacity: 1,
        });

        const tl = gsap.timeline({
          onComplete: () => {
            setIntroOut(true);
            setIsLoading(false);
            if (lenis) {
              lenis.start();
              lenis.resize();
            }
            ScrollTrigger.refresh();
            if (root.current) {
              gsap.set(root.current, { autoAlpha: 0, pointerEvents: 'none' });
            }
          },
        });

        // 1. Logo Flash In (smooth emergence)
        tl.to(logoContainerRef.current, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.45,
          ease: 'power3.out',
        })
          // 2. Brief Hold
          .to(
            logoContainerRef.current,
            {
              scale: 1.02,
              duration: 0.25,
              ease: 'sine.inOut',
            },
            '+=0.08',
          )
          // 3. Clean Flash Out & Immediate Transition to Website
          .to(logoContainerRef.current, {
            opacity: 0,
            scale: 1.06,
            y: -10,
            duration: 0.3,
            ease: 'power2.in',
          })
          .to(
            root.current,
            {
              opacity: 0,
              autoAlpha: 0,
              duration: 0.35,
              ease: 'power2.inOut',
            },
            '-=0.15',
          )
          .to(
            'header',
            {
              autoAlpha: 1,
              duration: 0.3,
              ease: 'power2.out',
            },
            '-=0.2',
          )
          .set('main', {
            height: 'auto',
            pointerEvents: 'auto',
          });
      });
    } else {
      gsap.set('header', { autoAlpha: 1 });
      if (root.current) {
        gsap.set(root.current, { autoAlpha: 0, pointerEvents: 'none' });
      }
    }

    return () => {
      if (ctx) {
        ctx.kill();
      }
    };
  }, [lenis, introOut]);

  return (
    <div id="loader" ref={root} className={styles.root}>
      <div ref={logoContainerRef} className={styles.innerContainer}>
        <h1 className={styles.brandTitle}>HOMIES STUDIO</h1>
        <p className={styles.brandSubtitle}>Digital Product & Engineering Studio</p>
      </div>
    </div>
  );
}

export default Loader;
