import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMenuOpen] = useStore(useShallow((state) => [state.isMenuOpen]));

  useEffect(() => {
    let handleMotionChange;
    let motionQuery;
    try {
      const consent = localStorage.getItem('hs_cookie_consent');
      if (consent !== 'accepted') {
        setShowBanner(true);
      }

      motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(motionQuery.matches);

      handleMotionChange = (e) => setReducedMotion(e.matches);
      motionQuery.addEventListener?.('change', handleMotionChange);
    } catch (e) {
      // If localStorage is unavailable, do not block UI
    }
    return () => {
      if (motionQuery && handleMotionChange) {
        motionQuery.removeEventListener?.('change', handleMotionChange);
      }
    };
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('hs_cookie_consent', 'accepted');
    } catch (e) {
      // Ignore localStorage write error
    }
    setShowBanner(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('hs_cookie_consent', 'declined');
    } catch (e) {
      // Ignore localStorage write error
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent Banner"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: isMenuOpen ? 'calc(28vw)' : '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2.5rem)',
        maxWidth: isMenuOpen ? 'min(50vw, 680px)' : '840px',
        backgroundColor: 'rgba(16, 16, 22, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '1.25rem',
        padding: '1.2rem 1.6rem',
        zIndex: isMenuOpen ? 900 : 99999,
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 0 35px -5px rgba(197, 163, 89, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        color: '#fff',
        transition: reducedMotion ? 'none' : 'opacity 0.3s ease, transform 0.35s ease, left 0.35s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.35s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 320px' }}>
        <span style={{ fontSize: '1.4rem' }}>🍪</span>
        <p style={{ margin: 0, fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.45 }}>We use cookies to improve your experience.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link
          href="/privacy-policy"
          style={{
            fontSize: '0.88rem',
            color: 'rgba(255, 255, 255, 0.75)',
            textDecoration: 'underline',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.4rem',
            fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
        >
          View Policy
        </Link>
        <button
          type="button"
          onClick={handleDecline}
          style={{
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '9999px',
            padding: '0.6rem 1.1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'border-color 180ms ease, color 180ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
          }}
        >
          Necessary Only
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="cookieAcceptBtn"
          style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.6rem 1.4rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1), background-color 180ms ease',
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
