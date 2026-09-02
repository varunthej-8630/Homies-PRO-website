/* eslint-disable */

import { useEffect, useRef, useState } from 'react';
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

  const [visible, setVisible] = useState(false);
  const root = useRef(null);
  const textContainerRef = useRef(null);
  const router = useRouter();

  const dismiss = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('introSeen', 'true');
        document.body.style.overflow = 'auto';
      }
    } catch {
      // Ignore sessionStorage issues
    }

    setIntroOut(true);
    setIsLoading(false);
    setVisible(false);

    if (lenis) {
      lenis.start();
      lenis.resize();
    }
    ScrollTrigger.refresh();
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = typeof window !== 'undefined' && sessionStorage.getItem('introSeen') === 'true';
    } catch {
      seen = false;
    }

    if (seen) {
      dismiss();
    } else {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    }

    // Safety fallback timeout: always release scroll and dismiss loader
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = 'auto';
      dismiss();
    }, 1200);

    return () => {
      clearTimeout(fallbackTimer);
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    let ctx;
    if (visible && !introOut) {
      setIsAbout(router.asPath === '/about');

      ctx = gsap.context(() => {
        // Initial setup - NEVER hide header so navbar is immediately visible
        gsap.set(textContainerRef.current, {
          opacity: 0,
          scale: 0.94,
          filter: 'blur(4px)',
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
            dismiss();
          },
        });

        // 1. Text Flash In (smooth emergence)
        tl.to(textContainerRef.current, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.35,
          ease: 'power3.out',
        })
          // 2. Brief Hold
          .to(
            textContainerRef.current,
            {
              scale: 1.02,
              duration: 0.2,
              ease: 'sine.inOut',
            },
            '+=0.05',
          )
          // 3. Clean Flash Out & Immediate Reveal
          .to(textContainerRef.current, {
            opacity: 0,
            scale: 1.05,
            y: -6,
            duration: 0.25,
            ease: 'power2.in',
          })
          .to(
            root.current,
            {
              opacity: 0,
              duration: 0.25,
              ease: 'power2.inOut',
            },
            '-=0.1',
          )
          .set('main', {
            height: 'auto',
            pointerEvents: 'auto',
          });
      });
    } else if (ctx) {
      ctx.kill();
    }

    return () => {
      if (ctx) {
        ctx.kill();
      }
    };
  }, [visible, introOut]);

  // When intro is done, return null completely so no transparent overlay remains in DOM
  if (!visible || introOut) return null;

  return (
    <div id="loader" ref={root} className={styles.root}>
      <div ref={textContainerRef} className={styles.innerContainer}>
        <h1 className={styles.brandTitle}>HOMIES STUDIO</h1>
        <p className={styles.brandSubtitle}>Digital Product & Engineering Studio</p>
      </div>
    </div>
  );
}

export default Loader;
