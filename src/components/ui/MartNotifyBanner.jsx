/* eslint-disable */
import React, { useState } from 'react';
import { RocketIcon } from '@src/components/ui/Icons';

export default function MartNotifyBanner() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Try again or email us directly.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Try again or email us directly.');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        background: '#0e0e10',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '1.25rem',
        padding: '2rem 2.5rem',
        margin: '2rem 0 3rem',
        boxSizing: 'border-box',
        color: '#fff',
      }}
    >
      <div style={{ maxWidth: '720px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(197, 163, 89, 0.12)',
            border: '1px solid rgba(197, 163, 89, 0.25)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.8rem',
            color: '#c5a359',
          }}
        >
          <RocketIcon size={14} color="#c5a359" /> Launching Soon
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 750, lineHeight: 1.2, margin: '0 0 0.5rem', color: '#fff' }}>Homies Mart is opening soon.</h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
          We&apos;re verifying our first batch of creator projects. Be the first to know when real projects go live.
        </p>

        {status === 'success' ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(37, 211, 102, 0.15)',
              border: '1px solid #25d366',
              color: '#25d366',
              padding: '0.75rem 1.4rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.92rem',
            }}
            role="status"
          >
            <span>✓</span> You&apos;re on the list.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              style={{
                flex: '1 1 260px',
                minWidth: '220px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '9999px',
                padding: '0.8rem 1.3rem',
                color: '#fff',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                background: '#fff',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.92rem',
                padding: '0.8rem 1.8rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {status === 'loading' ? 'Submitting…' : 'Notify Me'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{ color: '#fca5a5', fontSize: '0.85rem', marginTop: '0.75rem' }} role="alert">
            {errorMessage || 'Try again or email us directly.'}
          </p>
        )}
      </div>
    </div>
  );
}
