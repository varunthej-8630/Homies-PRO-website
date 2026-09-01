/* eslint-disable */
import { useEffect, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Image from 'next/image';
import Link from 'next/link';
import RouteGuard from '@src/components/auth/RouteGuard';
import clsx from 'clsx';
import { supabase } from '@src/lib/supabase/client';
import { useAuth } from '@src/context/AuthContext';
import styles from './dashboard.module.scss';

function getProjectStatusClass(status, stylesObj) {
  switch (status) {
    case 'PUBLISHED':
    case 'APPROVED':
      return stylesObj.statusPublished;
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
      return stylesObj.statusPending;
    case 'DRAFT':
      return stylesObj.statusDraft;
    case 'REJECTED':
      return stylesObj.statusRejected;
    default:
      return stylesObj.statusDraft;
  }
}

function formatCreatorRating(loading, reviewCount, ratingValue) {
  if (loading) return '...';
  if (reviewCount > 0 && ratingValue) return `★ ${Number(ratingValue).toFixed(1)}`;
  return '—';
}

function getWithdrawalStatusColor(status) {
  if (status === 'COMPLETED') return '#15803d';
  if (status === 'FAILED') return '#dc2626';
  return '#d97706';
}

function CreatorDashboardPage() {
  const { user, profile } = useAuth();

  const [creatorProfile, setCreatorProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [creatorInquiries, setCreatorInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'wallet' | 'analytics'
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('UPI');
  const [payoutAddress, setPayoutAddress] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchCreatorData = async () => {
    if (!supabase || !user) return;
    try {
      setLoading(true);

      // 1. Fetch Creator Profile
      let { data: cProf } = await supabase.from('creator_profiles').select('*').eq('user_id', user.id).maybeSingle();

      // Auto-create creator_profile if missing
      if (!cProf) {
        const defaultHandle = (user.email || 'creator').split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
        const { data: newProf, error: insErr } = await supabase
          .from('creator_profiles')
          .insert({
            user_id: user.id,
            display_name: profile?.full_name || 'Verified Creator',
            handle: defaultHandle,
            bio: 'Technical engineering creator on Homies Studio.',
            is_approved: true,
          })
          .select()
          .single();

        if (!insErr && newProf) {
          cProf = newProf;
        }
      }

      setCreatorProfile(cProf);

      if (cProf) {
        // 2. Fetch Projects owned by this Creator
        const { data: projData, error: projErr } = await supabase.from('projects').select('*, categories(name, slug)').eq('creator_id', cProf.id).order('created_at', { ascending: false });

        if (!projErr && projData) {
          setProjects(projData);
        }

        // 3. Fetch Withdrawals
        const { data: wthData, error: wthErr } = await supabase.from('withdrawals').select('*').eq('creator_id', cProf.id).order('requested_at', { ascending: false });

        if (!wthErr && wthData) {
          setWithdrawals(wthData);
        }

        // 4. Fetch Enquiries / Leads
        const { data: enqData } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });

        if (enqData) {
          setCreatorInquiries(enqData);
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('[Creator Dashboard Error]:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorData();

    // Supabase Realtime Subscription for Creator Updates
    let channel;
    if (supabase && user) {
      channel = supabase
        .channel(`creator-updates-${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'creator_profiles', filter: `user_id=eq.${user.id}` }, () => fetchCreatorData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchCreatorData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals' }, () => fetchCreatorData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'creator_earnings' }, () => fetchCreatorData())
        .subscribe();
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    const amountNum = Number(withdrawAmount);
    const available = Number(creatorProfile?.available_balance || 0);

    if (!amountNum || amountNum <= 0) {
      setModalError('Please enter a valid withdrawal amount.');
      return;
    }

    if (amountNum > available) {
      setModalError(`Withdrawal amount (₹${amountNum.toLocaleString('en-IN')}) exceeds your available balance (₹${available.toLocaleString('en-IN')}).`);
      return;
    }

    if (!payoutAddress.trim()) {
      setModalError('Please enter your payout UPI ID or Bank details.');
      return;
    }

    try {
      setModalSubmitting(true);

      const { error } = await supabase.from('withdrawals').insert({
        creator_id: creatorProfile.id,
        amount: amountNum,
        method: payoutMethod,
        payout_details: {
          address: payoutAddress.trim(),
          method: payoutMethod,
        },
        status: 'PENDING',
      });

      if (error) throw error;

      showToast(`✓ Payout request for ₹${amountNum.toLocaleString('en-IN')} submitted successfully!`);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      setPayoutAddress('');
      fetchCreatorData();
    } catch (err) {
      setModalError(err.message || 'Failed to submit withdrawal request.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const totalEarnings = Number(creatorProfile?.total_earnings || 0);
  const availableBalance = Number(creatorProfile?.available_balance || 0);
  const totalSales = Number(creatorProfile?.sales_count || 0);
  const reviewCount = Number(creatorProfile?.review_count || 0);
  const ratingValue = Number(creatorProfile?.rating || 0);

  return (
    <RouteGuard allowedRoles={['CREATOR', 'ADMIN']}>
      <CustomHead title="Creator Studio" noindex />
      <div className={clsx(styles.root, 'layout-block-inner')}>
        {/* Dashboard Top Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <h1 className={clsx(styles.dashboardTitle, 'h2')}>Creator Studio</h1>
            <div className={styles.creatorProfilePill}>
              <span className={styles.creatorName}>{creatorProfile?.display_name || profile?.full_name || 'Creator'}</span>
              <span>•</span>
              <span className={styles.creatorHandle}>@{creatorProfile?.handle || user?.email?.split('@')[0]}</span>
              <span className={styles.verifiedBadge}>✓ Verified Builder</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <Link href="/creator/submit" className={styles.newProjectBtn}>
              <span>+ Submit New Project</span>
            </Link>
          </div>
        </div>

        {/* Real Database KPIs */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Total Earnings</span>
            <span className={clsx(styles.statNumber, 'h3')}>{loading ? '...' : `₹${totalEarnings.toLocaleString('en-IN')}`}</span>
            <span className={styles.statSubtitle}>80% creator net royalties</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statTitle}>Available Balance</span>
            <span className={clsx(styles.statNumber, 'h3')}>{loading ? '...' : `₹${availableBalance.toLocaleString('en-IN')}`}</span>
            <span className={styles.statSubtitle}>Ready for payout</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statTitle}>Total Sales</span>
            <span className={clsx(styles.statNumber, 'h3')}>{loading ? '...' : totalSales}</span>
            <span className={styles.statSubtitle}>{projects.length === 0 ? 'No projects published' : `Across ${projects.length} project(s)`}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statTitle}>Creator Rating</span>
            <span className={clsx(styles.statNumber, 'h3')}>{formatCreatorRating(loading, reviewCount, ratingValue)}</span>
            <span className={styles.statSubtitle}>{reviewCount > 0 ? `${reviewCount} verified review(s)` : 'No reviews yet'}</span>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className={styles.dashboardLayout}>
          <div className={styles.tabNavigation}>
            <button type="button" onClick={() => setActiveTab('projects')} className={clsx(styles.tabBtn, activeTab === 'projects' && styles.activeTabBtn)}>
              My Projects ({projects.length})
            </button>
            <button type="button" onClick={() => setActiveTab('wallet')} className={clsx(styles.tabBtn, activeTab === 'wallet' && styles.activeTabBtn)}>
              Wallet & Payouts ({withdrawals.length})
            </button>
            <button type="button" onClick={() => setActiveTab('analytics')} className={clsx(styles.tabBtn, activeTab === 'analytics' && styles.activeTabBtn)}>
              Inquiries & Leads
            </button>
          </div>

          {/* TAB 1: MY PROJECTS */}
          {activeTab === 'projects' && (
            <div className={styles.projectsTableCard}>
              {loading && <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading projects from database...</div>}

              {!loading && projects.length === 0 && (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ fontSize: '2.5rem' }}>📦</div>
                  <h4 className="h4">No projects yet</h4>
                  <p className="p-xs" style={{ color: '#888', maxWidth: '400px' }}>
                    Start by submitting your first project. Upload source code, architecture documentation, and live preview to monetize on the marketplace.
                  </p>
                  <Link
                    href="/creator/submit"
                    style={{
                      marginTop: '0.8rem',
                      background: 'var(--black)',
                      color: 'var(--white)',
                      padding: '0.8rem 1.8rem',
                      borderRadius: '9999px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                    }}
                  >
                    + Submit New Project
                  </Link>
                </div>
              )}

              {!loading &&
                projects.map((p) => (
                  <div key={p.id} className={styles.projectItemRow}>
                    <div className={styles.projectItemInfo}>
                      <div className={styles.projectItemThumb}>
                        {p.cover_image_url && (p.cover_image_url.startsWith('http') || p.cover_image_url.startsWith('/')) ? (
                          <Image src={p.cover_image_url} fill sizes="80px" style={{ objectFit: 'cover' }} alt={p.title} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', fontSize: '1.4rem' }}>📦</div>
                        )}
                      </div>
                      <div className={styles.projectItemText}>
                        <Link href={`/creator/submit?projectId=${p.id}`} className={styles.projectItemTitle}>
                          {p.title}
                        </Link>
                        <div className={styles.projectItemMeta}>
                          <span>{p.categories?.name || p.project_type}</span>
                          <span>•</span>
                          <span>₹{Number(p.academic_price).toLocaleString('en-IN')}</span>
                          <span>•</span>
                          <span>{p.sales_count || 0} sales</span>
                          <span>•</span>
                          <span>Created {new Date(p.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.projectItemActions}>
                      <span className={clsx(styles.statusPill, getProjectStatusClass(p.status, styles))}>{p.status}</span>
                      <Link href={`/creator/submit?projectId=${p.id}`} className={styles.editBtn}>
                        {p.status === 'DRAFT' ? 'Resume Draft →' : 'Edit Build →'}
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 2: WALLET & PAYOUTS */}
          {activeTab === 'wallet' && (
            <div className={styles.walletCard}>
              <div className={styles.walletHeader}>
                <div className={styles.walletBalance}>
                  <span className="p-xs" style={{ color: '#666' }}>
                    Available Balance for Instant Withdrawal
                  </span>
                  <h3 className="h3">₹{availableBalance.toLocaleString('en-IN')}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(true)}
                  disabled={availableBalance <= 0}
                  className={styles.withdrawBtn}
                  style={{ opacity: availableBalance <= 0 ? 0.6 : 1, cursor: availableBalance <= 0 ? 'not-allowed' : 'pointer' }}
                >
                  Request Payout →
                </button>
              </div>

              <h5 className="h5" style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>
                Recent Withdrawal History
              </h5>

              {withdrawals.length === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#666', border: '1px dashed rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <p className="p-xs">No transactions yet. Once your projects generate sales, your earnings will appear here for withdrawal.</p>
                </div>
              ) : (
                <div className={styles.withdrawalsTable}>
                  {withdrawals.map((w) => (
                    <div key={w.id} className={styles.wthRow}>
                      <div>
                        <div className="p" style={{ fontWeight: 650 }}>
                          {w.method} ({w.payout_details?.address || 'Direct Transfer'})
                        </div>
                        <div className="p-xs" style={{ color: '#777' }}>
                          Ref: {w.transaction_reference || 'Pending Verification'} • {new Date(w.requested_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="p-l" style={{ fontWeight: 750 }}>
                          ₹{Number(w.amount).toLocaleString('en-IN')}
                        </div>
                        <span
                          style={{
                            color: getWithdrawalStatusColor(w.status),
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          ● {w.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PERFORMANCE & INQUIRIES */}
          {activeTab === 'analytics' && (
            <div className={styles.walletCard}>
              <h4 className="h4">Project Performance & Inquiries</h4>
              <p className="p" style={{ color: '#666', marginBottom: '1.5rem' }}>
                Direct inquiries and pre-sales messages received for Homies Studio marketplace engineering solutions.
              </p>

              {creatorInquiries.length === 0 ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#666', border: '1px dashed rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>💬</div>
                  <p className="p" style={{ fontWeight: 600 }}>
                    No inquiries yet
                  </p>
                  <p className="p-xs" style={{ color: '#888', marginTop: '0.2rem' }}>
                    When clients request engineering builds or reach out via &quot;Start a Conversation&quot;, notifications will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {creatorInquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} style={{ background: '#fafafa', border: '1px solid #eee', padding: '1rem 1.2rem', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{inq.name}</span>
                        <span style={{ fontSize: '0.75rem', background: '#e5e7eb', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>Sector: {inq.sector}</span>
                      </div>
                      <p className="p-xs" style={{ color: '#666', marginTop: '0.3rem' }}>
                        Requirement: {inq.service_type || 'General Build'} • Budget: {inq.budget_range || 'Flexible'}
                      </p>
                      <p className="p-xs" style={{ color: '#333', marginTop: '0.4rem', fontStyle: 'italic' }}>
                        &ldquo;{inq.message}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Withdrawal Modal */}
        {isWithdrawModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                color: '#1a1a1a',
                padding: '2.5rem',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '460px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="h4">Request Creator Payout</h3>
                <button type="button" onClick={() => setIsWithdrawModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#666' }}>
                  ✕
                </button>
              </div>

              <p className="p-xs" style={{ color: '#666', marginBottom: '1.2rem' }}>
                Available balance for transfer: <strong>₹{availableBalance.toLocaleString('en-IN')}</strong>. Funds are transferred via instant IMPS or UPI within 24 business hours.
              </p>

              {modalError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {modalError}
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Payout Amount (INR) *</label>
                  <input
                    type="number"
                    min="500"
                    max={availableBalance}
                    required
                    placeholder="e.g. 5000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Payout Method *</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.95rem' }}
                  >
                    <option value="UPI">Instant UPI (VPA)</option>
                    <option value="BANK_TRANSFER">Direct Bank Transfer (IMPS / NEFT)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    {payoutMethod === 'UPI' ? 'UPI ID (e.g. name@okhdfcbank) *' : 'Bank Account Number & IFSC *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={payoutMethod === 'UPI' ? 'yourname@upi' : 'Account No: 1234567890, IFSC: HDFC0001234'}
                    value={payoutAddress}
                    onChange={(e) => setPayoutAddress(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '9999px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 650 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '9999px', border: 'none', background: 'var(--black)', color: 'var(--white)', cursor: 'pointer', fontWeight: 700 }}
                  >
                    {modalSubmitting ? 'Submitting...' : 'Confirm Transfer →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Global Toast */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: 'var(--black)',
              color: 'var(--white)',
              padding: '1rem 1.8rem',
              borderRadius: '10px',
              zIndex: 99999,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              fontWeight: 600,
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>
    </RouteGuard>
  );
}

export default CreatorDashboardPage;
