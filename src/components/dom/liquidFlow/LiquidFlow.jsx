import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import styles from './styles/liquidFlow.module.scss';

export default function LiquidFlow() {
  const cursorRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  const [isMenuOpen] = useStore(useShallow((state) => [state.isMenuOpen]));
  const isMenuOpenRef = useRef(isMenuOpen);

  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  useEffect(() => {
    // Only enable pointer-following liquid light on desktop without reduced-motion
    if (typeof window === 'undefined') return undefined;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion || window.innerWidth < 1024) {
      return undefined;
    }

    let isVisible = true;

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleMouseMove = (e) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        setIsActive(true);
      }
    };

    const handleMouseLeave = () => {
      isActiveRef.current = false;
      setIsActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const loop = () => {
      if (isVisible && !isMenuOpenRef.current && cursorRef.current) {
        currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.08);
        currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.08);

        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className={clsx(styles.root, isMenuOpen && styles.rootPaused)} aria-hidden="true">
      <div className={clsx(styles.orb, styles.orbGold)} />
      <div className={clsx(styles.orb, styles.orbSilver)} />
      <div className={clsx(styles.orb, styles.orbBronze)} />
      <div ref={cursorRef} className={clsx(styles.cursorLight, isActive && !isMenuOpen && styles.cursorLightActive)} />
    </div>
  );
}
