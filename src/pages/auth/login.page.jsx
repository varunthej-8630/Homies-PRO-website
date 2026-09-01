/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
import { useEffect, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import { useAuth } from '@src/context/AuthContext';
import { useRouter } from 'next/router';
import styles from './auth.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect to intended page or role dashboard
  useEffect(() => {
    if (user) {
      const targetRedirect = router.query.redirect;
      if (targetRedirect && typeof targetRedirect === 'string' && targetRedirect.startsWith('/')) {
        router.push(targetRedirect);
        return;
      }

      if (role === 'CREATOR') {
        router.push('/creator/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/buyer/dashboard');
      }
    }
  }, [user, role, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email, password });
      // Successful login will trigger user useEffect redirect above
    } catch (err) {
      if (err.message?.includes('Supabase client is not configured') || err.message?.includes('not configured')) {
        setErrorMsg('Supabase client is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Project Settings → Environment Variables and redeploy.');
      } else if (err.message?.includes('Invalid login credentials')) {
        setErrorMsg('Invalid email or password. Please check your credentials and try again.');
      } else if (err.message?.includes('Email not confirmed')) {
        setErrorMsg('Please check your inbox and verify your email address before signing in.');
      } else {
        setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomHead title="Sign In" noindex />
      <div className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <span className={styles.brandBadge}>✦ HOMIES STUDIO ECOSYSTEM</span>
            <h1 className={clsx(styles.title, 'h3')}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to access your projects, downloads, or Creator Studio.</p>
          </div>

          {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="loginEmail">Email Address</label>
              <input id="loginEmail" type="email" required autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.inputField} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="loginPassword">
                <span>Password</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => alert('Password reset will be sent to your email.')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') alert('Password reset will be sent to your email.');
                  }}
                  className={styles.forgotLink}
                >
                  Forgot password?
                </span>
              </label>
              <input
                id="loginPassword"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <div className={styles.authFooter}>
            Don&apos;t have an account yet?
            <Link href="/auth/signup" className={styles.switchLink}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
