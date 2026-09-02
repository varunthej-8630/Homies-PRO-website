/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import { CREATOR_STEPS } from '@src/constants/marketplace';
import { supabase } from '@src/lib/supabase/client';
import { useAuth } from '@src/context/AuthContext';
import { useRouter } from 'next/router';
import styles from './become-a-creator.module.scss';

const seo = {
  title: 'Join as a Creator — Build & Launch with Homies Studio',
  description: 'Collaborate with Homies Studio to build, showcase, and monetize high-impact digital products, software tools, and engineering projects.',
  keywords: ['Become a Creator', 'Homies Studio Creators', 'Digital Product Studio', 'Build and Launch', 'Engineering Collaboration', 'Developer Ecosystem'],
  canonical: '/become-a-creator',
};

function getBottomCtaText(role) {
  if (role === 'CREATOR' || role === 'ADMIN') {
    return 'OPEN CREATOR STUDIO →';
  }
  return 'SUBMIT CREATOR APPLICATION NOW →';
}

function BecomeACreatorPage() {
  const router = useRouter();
  const { user, role, profile } = useAuth();

  const [price, setPrice] = useState(3000);
  const [salesEstimate, setSalesEstimate] = useState(15);

  const [existingApplication, setExistingApplication] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [experience, setExperience] = useState('2+ years in software engineering');
  const [skills, setSkills] = useState('Python, Next.js, PyTorch');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const platformFee = Math.round(price * 0.2);
  const creatorPayoutPerSale = price - platformFee;
  const totalMonthlyEarnings = creatorPayoutPerSale * salesEstimate;

  // Check if user already has an existing application
  useEffect(() => {
    async function checkApplication() {
      if (!supabase || !user) return;
      try {
        const { data } = await supabase.from('creator_applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);

        if (data && data.length > 0) {
          setExistingApplication(data[0]);
        }
      } catch {
        // Fallback silently if table not reachable
      }
    }

    checkApplication();
  }, [user]);

  const handleApplyClick = () => {
    if (!user) {
      router.push('/auth/login?redirect=/become-a-creator');
      return;
    }
    if (role === 'CREATOR' || role === 'ADMIN') {
      router.push('/creator/dashboard');
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!handle.trim()) {
      setSubmitError('Please provide a unique creator handle.');
      return;
    }

    if (!supabase) {
      setSubmitError('Service is temporarily unavailable. Please try again later.');
      return;
    }

    try {
      setSubmitting(true);

      // Verify active authenticated session directly from Supabase Auth
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        setSubmitError('Your session has expired. Please sign in again to submit your application.');
        router.push('/auth/login?redirect=/become-a-creator');
        return;
      }

      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const { data, error } = await supabase
        .from('creator_applications')
        .insert({
          user_id: currentUser.id,
          full_name: profile?.full_name || currentUser.user_metadata?.full_name || 'Homies Creator',
          email: currentUser.email,
          handle: handle.trim().toLowerCase().replace(/^@/, ''),
          bio: bio.trim(),
          portfolio_url: portfolioUrl.trim(),
          experience: experience.trim(),
          skills: skillsArray,
          status: 'PENDING',
        })
        .select()
        .single();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[Creator Application Error]:', error);
        }
        throw error;
      }

      setExistingApplication(data);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setSubmitSuccess(false);
      }, 2500);
    } catch (err) {
      if (err.message?.includes('duplicate key') || err.message?.includes('unique constraint')) {
        setSubmitError('This creator handle is already taken. Please choose another handle.');
      } else if (err.message?.includes('permission denied') || err.message?.includes('violates row-level security')) {
        setSubmitError('You must be signed in with an active account to submit a creator application.');
      } else {
        setSubmitError('Your creator application could not be submitted at this time. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderHeroCta = () => {
    if (role === 'CREATOR' || role === 'ADMIN') {
      return (
        <Link href="/creator/dashboard" className={styles.primaryButton}>
          <span>GO TO CREATOR STUDIO →</span>
        </Link>
      );
    }
    if (existingApplication?.status === 'PENDING') {
      return (
        <div className={styles.primaryButton} style={{ opacity: 0.8, cursor: 'default' }}>
          <span>APPLICATION UNDER REVIEW ⏳</span>
        </div>
      );
    }
    return (
      <button type="button" onClick={handleApplyClick} className={styles.primaryButton} style={{ border: 'none', cursor: 'pointer' }}>
        <span>{user ? 'APPLY TO BECOME A CREATOR →' : 'SIGN IN & APPLY TO BECOME A CREATOR →'}</span>
      </button>
    );
  };

  return (
    <>
      <CustomHead {...seo} />
      <div className={clsx(styles.root, 'layout-block-inner')}>
        {/* Upgrade / Application Notice */}
        {router.query.status === 'upgrade_required' && !existingApplication && (
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              color: '#92400e',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            ✦ Creator Studio Access: You are currently signed in as a Buyer. Please submit your Creator Application below to unlock Creator Studio and project publishing!
          </div>
        )}

        {existingApplication && (
          <div
            style={{
              background: existingApplication.status === 'APPROVED' ? '#f0fdf4' : '#eff6ff',
              border: `1px solid ${existingApplication.status === 'APPROVED' ? '#86efac' : '#93c5fd'}`,
              color: existingApplication.status === 'APPROVED' ? '#166534' : '#1e40af',
              padding: '1.2rem 1.8rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              fontSize: '0.95rem',
            }}
          >
            <strong>Application Status: {existingApplication.status}</strong>
            <p style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
              {existingApplication.status === 'PENDING' && 'Your application has been received and is being reviewed by our moderation team. You will be upgraded to Creator once approved.'}
              {existingApplication.status === 'APPROVED' && 'Congratulations! Your creator application has been approved. You now have full access to Creator Studio.'}
              {existingApplication.status === 'REJECTED' && `Your application was not approved at this time: ${existingApplication.admin_notes || 'Please enhance your portfolio and re-apply.'}`}
            </p>
          </div>
        )}

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={clsx(styles.taglineBadge, 'p-xs')}>
            <span>✦ CREATOR & BUILDER ECOSYSTEM</span>
          </div>

          <h1 className={clsx(styles.heroTitle, 'h1')}>Turn Your Projects Into Opportunities.</h1>

          <p className={clsx(styles.heroSubtitle, 'p-l')}>
            Have an engineering project, machine learning pipeline, or hardware prototype you&apos;ve built? Put it in front of thousands of students, developers, startups, and institutions who need
            proven foundations.
          </p>

          <div className={styles.ctaRow}>
            {renderHeroCta()}

            {role === 'CREATOR' || role === 'ADMIN' ? (
              <Link href="/creator/submit" className={clsx(styles.secondaryLink, 'p')}>
                Submit New Project →
              </Link>
            ) : (
              <Link href="/mart" className={clsx(styles.secondaryLink, 'p')}>
                Browse Homies Mart Projects →
              </Link>
            )}
          </div>
        </section>

        {/* 6-Step Visual Process */}
        <section className={styles.stepsSection}>
          <h2 className={clsx(styles.sectionTitle, 'h2')}>How It Works</h2>
          <div className={styles.stepsGrid}>
            {CREATOR_STEPS.map((step) => (
              <div key={step.step} className={styles.stepCard}>
                <span className={styles.stepNumber}>{step.step}</span>
                <h4 className={clsx(styles.stepTitle, 'h4')}>{step.title}</h4>
                <p className={clsx(styles.stepDesc, 'p-xs')}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Earnings Calculator */}
        <section className={styles.calculatorSection}>
          <div className={styles.calculatorHeader}>
            <h2 className={clsx(styles.sectionTitle, 'h2')}>Calculate Your Earning Potential</h2>
            <p className={clsx(styles.calcSubtitle, 'p')}>
              Transparent, automated payouts. You retain <strong>80%</strong> on every direct sale with zero listing fees.
            </p>
          </div>

          <div className={styles.calculatorGrid}>
            <div className={styles.controlsSide}>
              <div className={styles.controlGroup}>
                <div className={styles.controlLabelRow}>
                  <label htmlFor="priceRange" className={clsx(styles.label, 'p-xs')}>
                    Project Price (INR):
                  </label>
                  <span className={styles.valueDisplay}>₹{price.toLocaleString('en-IN')}</span>
                </div>
                <input id="priceRange" type="range" min="500" max="15000" step="500" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={styles.slider} />
              </div>

              <div className={styles.controlGroup}>
                <div className={styles.controlLabelRow}>
                  <label htmlFor="salesRange" className={clsx(styles.label, 'p-xs')}>
                    Estimated Monthly Purchases:
                  </label>
                  <span className={styles.valueDisplay}>{salesEstimate} sales / mo</span>
                </div>
                <input id="salesRange" type="range" min="1" max="100" step="1" value={salesEstimate} onChange={(e) => setSalesEstimate(Number(e.target.value))} className={styles.slider} />
              </div>

              <div className={styles.feeBreakdown}>
                <div className={styles.feeRow}>
                  <span>Homies Studio Platform Fee (20%):</span>
                  <span>-₹{platformFee.toLocaleString('en-IN')} / sale</span>
                </div>
                <div className={styles.feeRow}>
                  <span>Creator Net Payout (80%):</span>
                  <span className={styles.highlightFee}>₹{creatorPayoutPerSale.toLocaleString('en-IN')} / sale</span>
                </div>
              </div>
            </div>

            <div className={styles.resultSide}>
              <span className={styles.resultLabel}>ESTIMATED MONTHLY PAYOUT</span>
              <div className={styles.resultAmount}>₹{totalMonthlyEarnings.toLocaleString('en-IN')}</div>
              <p className={styles.resultDesc}>Direct to your verified UPI / Bank Account via automated monthly or on-demand instant withdrawals.</p>
            </div>
          </div>
        </section>

        {/* Creator Perks & Standards */}
        <section className={styles.perksSection}>
          <h2 className={clsx(styles.sectionTitle, 'h2')}>Why Create With Homies Studio?</h2>
          <div className={styles.perksGrid}>
            <div className={styles.perkCard}>
              <span className={styles.perkIcon}>🔒</span>
              <h5 className={clsx(styles.perkTitle, 'h5')}>Protected Digital Delivery</h5>
              <p className={clsx(styles.perkDesc, 'p-xs')}>Private file storage with expiring secure download tokens. Your raw source code is never exposed publicly.</p>
            </div>
            <div className={styles.perkCard}>
              <span className={styles.perkIcon}>⚡</span>
              <h5 className={clsx(styles.perkTitle, 'h5')}>Fast Payouts</h5>
              <p className={clsx(styles.perkDesc, 'p-xs')}>Withdraw earnings directly to your Indian Bank Account via IMPS/NEFT or instant UPI transfers with zero hidden deductions.</p>
            </div>
            <div className={styles.perkCard}>
              <span className={styles.perkIcon}>💬</span>
              <h5 className={clsx(styles.perkTitle, 'h5')}>Direct Buyer Chat</h5>
              <p className={clsx(styles.perkDesc, 'p-xs')}>Communicate with prospective buyers, clarify installation queries, and receive direct custom consulting requests.</p>
            </div>
            <div className={styles.perkCard}>
              <span className={styles.perkIcon}>🛡️</span>
              <h5 className={clsx(styles.perkTitle, 'h5')}>Quality Verification</h5>
              <p className={clsx(styles.perkDesc, 'p-xs')}>Our moderation badge signals high credibility and IEEE-level standards, driving higher conversion and trusted purchases.</p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', paddingTop: '2vw' }}>
          <button
            type="button"
            onClick={handleApplyClick}
            style={{
              background: 'var(--black)',
              color: 'var(--white)',
              padding: '1vw 2.5vw',
              borderRadius: '9999px',
              fontWeight: 650,
              display: 'inline-block',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            {getBottomCtaText(role)}
          </button>
        </div>

        {/* Creator Application Modal */}
        {isApplyModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                color: '#1a1a1a',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '520px',
                padding: '2rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Creator Application</h3>
                <button type="button" onClick={() => setIsApplyModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>
                  ✕
                </button>
              </div>

              {submitSuccess ? (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '1.5rem', borderRadius: '10px', textAlign: 'center' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.4rem' }}>✓ Application Submitted!</h4>
                  <p style={{ fontSize: '0.9rem' }}>Thank you! Our platform admins will review your portfolio and approve your Creator account within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {submitError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>{submitError}</div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Desired Creator Handle (@handle) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. alexcodes"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Portfolio / GitHub / LinkedIn URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/yourname"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Key Technical Skills & Domains</label>
                    <input
                      type="text"
                      placeholder="Python, PyTorch, React, Embedded C, VLSI"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Experience & Background</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 years Full-Stack / ML Engineer"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Brief Bio & Project Vision</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your background and the types of projects you plan to publish..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsApplyModalOpen(false)}
                      style={{ flex: 1, padding: '0.8rem', borderRadius: '9999px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{ flex: 1, padding: '0.8rem', borderRadius: '9999px', border: 'none', background: 'var(--black)', color: 'var(--white)', cursor: 'pointer', fontWeight: 700 }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Application →'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BecomeACreatorPage;
