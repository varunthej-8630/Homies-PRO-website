import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import styles from '@src/components/dom/styles/scrollbar.module.scss';
import useScroll from '@src/hooks/useScroll';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Scrollbar() {
  const progressBar = useRef();
  const scrollbarRef = useRef();
  const [isLoading, isMenuOpen, introOut] = useStore(useShallow((state) => [state.isLoading, state.isMenuOpen, state.introOut]));
  const fadeTimeoutRef = useRef(null);

  const updateScrollbar = (scroll, limit) => {
    if (!progressBar.current || !limit) return;
    const progress = Math.max(0, Math.min(1, scroll / limit));
    const maxTopValueInVh = 80 - 6;
    const newTopValueInVh = progress * maxTopValueInVh;

    gsap.to(progressBar.current, {
      y: `${newTopValueInVh}svh`,
      duration: 0.15,
      ease: 'none',
      overwrite: 'auto',
    });
  };

  useScroll(({ scroll, limit }) => {
    if (!isLoading && !isMenuOpen && scrollbarRef.current) {
      gsap.to(scrollbarRef.current, { opacity: 1, duration: 0.2, overwrite: 'auto' });
      updateScrollbar(scroll, limit);

      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      fadeTimeoutRef.current = setTimeout(() => {
        if (scrollbarRef.current) {
          gsap.to(scrollbarRef.current, { opacity: 0, duration: 0.5, overwrite: 'auto' });
        }
      }, 1500);
    }
  });

  useEffect(
    () => () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    },
    [],
  );

  if (isLoading && introOut) {
    return null;
  }

  return (
    <div id="scrollbar" ref={scrollbarRef} className={styles.scrollbar} aria-hidden="true">
      <div ref={progressBar} className={styles.inner} />
    </div>
  );
}

export default Scrollbar;
