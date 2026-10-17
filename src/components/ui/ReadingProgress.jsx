import React, { useRef } from 'react';
import useScroll from '@src/hooks/useScroll';

export default function ReadingProgress() {
  const barRef = useRef(null);

  useScroll(({ scroll, limit }) => {
    if (barRef.current && limit > 0) {
      const progress = Math.min(1, Math.max(0, scroll / limit));
      barRef.current.style.transform = `scaleX(${progress})`;
    }
  });

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2.5px',
        zIndex: 9999,
        pointerEvents: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <div
        ref={barRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#c5a359',
          transformOrigin: '0% 50%',
          transform: 'scaleX(0)',
          transition: 'transform 0.08s ease-out',
        }}
      />
    </div>
  );
}
