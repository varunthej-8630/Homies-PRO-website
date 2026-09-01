/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import { useAuth } from '@src/context/AuthContext';
import { useRouter } from 'next/router';
import styles from './auth.module.scss';

export default function SignupPage() {
  const router = useRouter();
  const { user, signUp, role } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  // If already logged in, redirect
  useEffect(() => {
    if (user && !successData) {
      if (role === 'CREATOR') {
        router.push('/creator/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/buyer/dashboard');
      }
    }
  }, [user, role, router, successData]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    try {
      setLoading(true);
      const data = await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });

      setSuccessData(data);
    } catch (err) {
      if (err.message?.includes('Supabase client is not configured') || err.message?.includes('not configured')) {
        setErrorMsg('Supabase client is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Project Settings → Environment Variables and redeploy.');
      } else if (err.message?.includes('User already registered')) {
        setErrorMsg('An account with this email already exists. Please sign in instead.');
      } else if (err.message?.includes('email rate limit exceeded')) {
        setErrorMsg(
          'Supabase email confirmation rate limit reached (3 emails/hr). Please wait a few minutes or disable "Confirm email" in Supabase Dashboard -> Auth -> Providers -> Email for development.',
        );
      } else if (err.message?.includes('Password should be')) {
        setErrorMsg('Password is too weak. Please use a stronger password.');
      } else {
        setErrorMsg(err.message || 'An unexpected error occurred during signup.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomHead title="Create Account" noindex />
      <div className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <span className={styles.brandBadge}>✦ HOMIES STUDIO ECOSYSTEM</span>
            <h1 className={clsx(styles.title, 'h3')}>Create an Account</h1>
            <p className={styles.subtitle}>Join our creator and builder community to buy, build, and publish.</p>
          </div>

          {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

          {successData ? (
            <div className={styles.successBanner}>
              <div className={styles.successTitle}>✓ Registration Successful!</div>
              <p>
                Welcome to Homies Studio, <strong>{fullName}</strong>!
              </p>
              <p style={{ marginTop: '0.4rem', color: '#14532d' }}>
                {successData.session ? 'Your account is active and you are now signed in.' : 'Please check your email inbox to confirm your address before signing in.'}
              </p>
              <div style={{ marginTop: '1.2rem' }}>
                <Link href={successData.session ? '/buyer/dashboard' : '/auth/login'} className={styles.submitBtn} style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                  {successData.session ? 'Go to Buyer Portal →' : 'Proceed to Sign In →'}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignup} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="signupFullName">Full Name</label>
                <input
                  id="signupFullName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="signupEmail">Email Address</label>
                <input
                  id="signupEmail"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="signupPassword">Password (6+ characters)</label>
                <input
                  id="signupPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="signupConfirmPassword">Confirm Password</label>
                <input
                  id="signupConfirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.inputField}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>
          )}

          <div className={styles.authFooter}>
            Already have an account?
            <Link href="/auth/login" className={styles.switchLink}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
