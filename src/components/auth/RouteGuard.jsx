import { useEffect } from 'react';
import { useAuth } from '@src/context/AuthContext';
import { useRouter } from 'next/router';

export default function RouteGuard({ children, allowedRoles = [], fallbackPath = '/auth/login' }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // 1. Unauthenticated guest check
    if (!user) {
      router.replace(`${fallbackPath}?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    // 2. Role-based authorization check
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      if (role === 'BUYER' && allowedRoles.includes('CREATOR')) {
        router.replace('/become-a-creator?status=upgrade_required');
      } else if (role !== 'ADMIN' && allowedRoles.includes('ADMIN')) {
        router.replace('/buyer/dashboard');
      } else {
        router.replace('/buyer/dashboard');
      }
    }
  }, [user, role, loading, router, allowedRoles, fallbackPath]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f0f4f1',
          background: 'transparent',
          fontFamily: 'var(--font-primary), sans-serif',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '2px solid rgba(240, 244, 241, 0.2)',
            borderTopColor: '#f0f4f1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Verifying authorization...</p>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated or role not allowed, don't render children while redirecting
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
    return null;
  }

  return children;
}
