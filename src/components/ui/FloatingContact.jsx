import React, { useState } from 'react';
import useScroll from '@src/hooks/useScroll';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { SparkleIcon } from '@src/components/ui/Icons';

export default function FloatingContact() {
  const [visible, setVisible] = useState(false);
  const [isMenuOpen, isConversationOpen, setIsConversationOpen] = useStore(useShallow((state) => [state.isMenuOpen, state.isConversationOpen, state.setIsConversationOpen]));

  useScroll(({ scroll }) => {
    // Only show after user has engaged with the page (scrolled > 400px)
    if (scroll > 400 && !visible) {
      setVisible(true);
    } else if (scroll <= 400 && visible) {
      setVisible(false);
    }
  });

  if (!visible || isMenuOpen || isConversationOpen) return null;

  return (
    <button
      type="button"
      onClick={() => setIsConversationOpen(true)}
      aria-label="Start a conversation with Homies Studio"
      className="floatingContactBtn"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        height: '42px',
        padding: '0 1.1rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(20, 20, 26, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(197, 163, 89, 0.4)',
        color: '#f5f5f7',
        fontSize: '0.86rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '0.55rem',
        cursor: 'pointer',
        zIndex: 90,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = '#c5a359';
        e.currentTarget.style.backgroundColor = 'rgba(28, 28, 36, 0.98)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(197, 163, 89, 0.4)';
        e.currentTarget.style.backgroundColor = 'rgba(20, 20, 26, 0.88)';
      }}
    >
      <SparkleIcon size={16} color="#c5a359" />
      <span>Let&apos;s Talk</span>
    </button>
  );
}
