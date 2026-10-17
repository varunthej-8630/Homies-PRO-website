import React, { useState } from 'react';
import useScroll from '@src/hooks/useScroll';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [lenis, isMenuOpen] = useStore(useShallow((state) => [state.lenis, state.isMenuOpen]));

  useScroll(({ scroll }) => {
    if (scroll > 550 && !visible) {
      setVisible(true);
    } else if (scroll <= 550 && visible) {
      setVisible(false);
    }
  });

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!visible || isMenuOpen) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top of page"
      className="backToTopBtn"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: 'rgba(20, 20, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(197, 163, 89, 0.35)',
        color: '#c5a359',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 90,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = '#c5a359';
        e.currentTarget.style.backgroundColor = 'rgba(30, 30, 38, 0.95)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(197, 163, 89, 0.35)';
        e.currentTarget.style.backgroundColor = 'rgba(20, 20, 26, 0.85)';
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
}
