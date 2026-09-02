import React, { useCallback, useRef } from 'react';
import { Transition as ReactTransition, SwitchTransition } from 'react-transition-group';

import Footer from '@src/components/dom/Footer';
import PreFooter from '@src/components/dom/PreFooter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '@src/components/dom/styles/layout.module.scss';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Layout({ children, mainRef, router }) {
  const [lenis, setIsLoading, isMenuOpen, setIsMenuOpen, setIsAbout] = useStore(useShallow((state) => [state.lenis, state.setIsLoading, state.isMenuOpen, state.setIsMenuOpen, state.setIsAbout]));

  const enterTimelineRef = useRef(null);
  const exitTimelineRef = useRef(null);

  const handleEnter = useCallback(() => {
    if (exitTimelineRef.current) exitTimelineRef.current.kill();

    setIsAbout(router.asPath === '/about');
    setIsLoading(false);

    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.start();
      lenis.resize();
    }
    ScrollTrigger.refresh();

    if (mainRef?.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (lenis) {
            lenis.start();
            lenis.resize();
          }
          ScrollTrigger.refresh();
        },
      });
      enterTimelineRef.current = tl;

      tl.fromTo(
        mainRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
      );
    }
  }, [router.asPath, lenis, setIsAbout, setIsLoading, mainRef]);

  const handleExit = useCallback(() => {
    if (enterTimelineRef.current) enterTimelineRef.current.kill();
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    setIsLoading(true);
  }, [isMenuOpen, setIsMenuOpen, setIsLoading]);

  return (
    <>
      <SwitchTransition mode="out-in">
        <ReactTransition
          key={router.asPath}
          in={false}
          unmountOnExit
          timeout={{
            enter: 350,
            exit: 150,
          }}
          onEnter={handleEnter}
          onExit={handleExit}
        >
          {children}
        </ReactTransition>
      </SwitchTransition>

      <PreFooter />
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </>
  );
}

export default Layout;
