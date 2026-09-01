/* eslint-disable */
import { useEffect, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Image from 'next/image';
import RouteGuard from '@src/components/auth/RouteGuard';
import clsx from 'clsx';
import { supabase } from '@src/lib/supabase/client';
import { useAuth } from '@src/context/AuthContext';
import styles from '../creator/dashboard.module.scss';

function getStatusBadgeStyle(status) {
  if (status === 'APPROVED' || status === 'PUBLISHED' || status === 'PAID') return { background: '#dcfce7', color: '#166534' };
  if (status === 'REJECTED' || status === 'FAILED') return { background: '#fee2e2', color: '#991b1b' };
  return { background: '#fef3c7', color: '#92400e' };
}

function AdminDashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'moderation' | 'enquiries' | 'overview'
  const [applications, setApplications] = useState([]);
  const [dbProjects, setDbProjects] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    buyersCount: 0,
    creatorsCount: 0,
    totalGMV: 0,
    platformRevenue: 0,
    totalSales: 0,
    pendingPayouts: 0,
    pendingAppsCount: 0,
    pendingProjectsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [selectedItemForNotes, setSelectedItemForNotes] = useState(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [adminToast, setAdminToast] = useState('');

  const showToast = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 3000);
  };

  const fetchPlatformData = async () => {
    if (!supabase) return;
    try {
      setLoading(true);

      // 1. Fetch Creator Applications
      const { data: appsData } = await supabase.from('creator_applications').select('*').order('created_at', { ascending: false });

      if (appsData) setApplications(appsData);

      // 2. Fetch Projects for Moderation
      const { data: projData } = await supabase.from('projects').select('*, creator_profiles(display_name, handle), categories(name)').order('created_at', { ascending: false });

      if (projData) setDbProjects(projData);

      // 3. Fetch Multi-Sector Enquiries
      const { data: enqData } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });

      if (enqData) setEnquiries(enqData);

      // 4. Fetch Profiles Stats
      const { data: profs } = await supabase.from('profiles').select('id, role');

      const totalUsers = profs?.length || 0;
      const buyersCount = profs?.filter((p) => p.role === 'BUYER').length || 0;
      const creatorsCount = profs?.filter((p) => p.role === 'CREATOR').length || 0;

      // 5. Fetch Orders / GMV Stats
      const { data: orders } = await supabase.from('orders').select('id, total_amount, status').eq('status', 'PAID');

      const totalSales = orders?.length || 0;
      const totalGMV = orders?.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0) || 0;
      const platformRevenue = Math.round(totalGMV * 0.2);

      // 6. Fetch Pending Payouts
      const { data: pendingWth } = await supabase.from('withdrawals').select('amount').eq('status', 'PENDING');

      const pendingPayouts = pendingWth?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

      const pendingAppsCount = appsData?.filter((a) => a.status === 'PENDING').length || 0;
      const pendingProjectsCount = projData?.filter((p) => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length || 0;

      setStats({
        totalUsers,
        buyersCount,
        creatorsCount,
        totalGMV,
        platformRevenue,
        totalSales,
        pendingPayouts,
        pendingAppsCount,
        pendingProjectsCount,
      });
    } catch {
      // Non-blocking fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformData();

    // Supabase Realtime Subscriptions for Platform Events
    let channel;
    if (supabase) {
      channel = supabase
        .channel('admin-dashboard-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'creator_applications' }, () => fetchPlatformData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchPlatformData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, () => fetchPlatformData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchPlatformData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals' }, () => fetchPlatformData())
        .subscribe();
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleApproveApplication = async (appId, applicantName) => {
    if (!supabase || !user) return;
    try {
      const { error } = await supabase
        .from('creator_applications')
        .update({
          status: 'APPROVED',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', appId);

      if (error) throw error;

      showToast(`✓ Approved creator application for ${applicantName}! User upgraded to CREATOR.`);
      fetchPlatformData();
    } catch (err) {
      showToast(`✕ Failed to approve application: ${err.message}`);
    }
  };

  const handleRejectApplication = async (appId, applicantName) => {
    if (!supabase || !user) return;
    try {
      const { error } = await supabase
        .from('creator_applications')
        .update({
          status: 'REJECTED',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', appId);

      if (error) throw error;

      showToast(`✕ Rejected creator application for ${applicantName}.`);
      fetchPlatformData();
    } catch (err) {
      showToast(`✕ Failed to reject application: ${err.message}`);
    }
  };

  const handleApproveProject = async (projectId, title) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('projects').update({ status: 'PUBLISHED', published_at: new Date().toISOString() }).eq('id', projectId);

      if (error) throw error;

      showToast(`✓ Published "${title}" to Homies Studio Marketplace!`);
      fetchPlatformData();
    } catch (err) {
      showToast(`✕ Failed to publish project: ${err.message}`);
    }
  };

  const handleRejectProject = async (projectId, title) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('projects').update({ status: 'REJECTED' }).eq('id', projectId);

      if (error) throw error;

      showToast(`✕ Rejected submission "${title}"`);
      fetchPlatformData();
    } catch (err) {
      showToast(`✕ Failed to reject project: ${err.message}`);
    }
  };

  const handleRequestChangesSubmit = async (e) => {
    e.preventDefault();
    if (!supabase || !selectedItemForNotes) return;
    try {
      const { error } = await supabase.from('projects').update({ status: 'CHANGES_REQUESTED', admin_notes: changeNotes }).eq('id', selectedItemForNotes.id);

      if (error) throw error;

      showToast(`📝 Feedback sent to creator for "${selectedItemForNotes.title}"`);
      setSelectedItemForNotes(null);
      setChangeNotes('');
      fetchPlatformData();
    } catch (err) {
      showToast(`✕ Failed to send feedback: ${err.message}`);
    }
  };

  return (
    <RouteGuard allowedRoles={['ADMIN']}>
      <CustomHead title="Admin Moderation & Platform Console | HOMIES STUDIO" />
      <div className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <h1 className={clsx(styles.dashboardTitle, 'h2')}>Admin Moderation Console</h1>
            <div className={styles.creatorProfilePill}>
              <span style={{ color: '#dc2626', fontWeight: 750 }}>● MASTER MODERATOR</span>
              <span>•</span>
              <span>Project Review & Ecosystem Governance</span>
            </div>
          </div>
        </div>

        {/* Global Real Platform KPIs (Strictly Real Database Data) */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Total Platform GMV</span>
            <span className={clsx(styles.statNumber, 'h3')}>₹{stats.totalGMV.toLocaleString('en-IN')}</span>
            <span className={styles.statSubtitle}>{stats.totalSales > 0 ? `Across ${stats.totalSales} completed sales` : 'No sales transactions yet'}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statTitle}>Platform Commission (20%)</span>
            <span className={clsx(styles.statNumber, 'h3')}>₹{stats.platformRevenue.toLocaleString('en-IN')}</span>
            <span className={styles.statSubtitle}>Retained platform net fee</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statTitle}>Pending Moderation</span>
            <span className={clsx(styles.statNumber, 'h3')}>{stats.pendingAppsCount + stats.pendingProjectsCount}</span>
            <span className={styles.statSubtitle} style={{ color: '#f59e0b' }}>
              {stats.pendingAppsCount} creator app(s), {stats.pendingProjectsCount} project(s)
            </span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statTitle}>Platform Community</span>
            <span className={clsx(styles.statNumber, 'h3')}>{stats.totalUsers} Users</span>
            <span className={styles.statSubtitle}>
              {stats.creatorsCount} Creator(s) • {stats.buyersCount} Buyer(s)
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.dashboardLayout}>
          <div className={styles.tabNavigation}>
            <button type="button" onClick={() => setActiveTab('applications')} className={clsx(styles.tabBtn, activeTab === 'applications' && styles.activeTabBtn)}>
              Creator Applications ({applications.length})
            </button>
            <button type="button" onClick={() => setActiveTab('moderation')} className={clsx(styles.tabBtn, activeTab === 'moderation' && styles.activeTabBtn)}>
              Project Submissions ({dbProjects.length})
            </button>
            <button type="button" onClick={() => setActiveTab('enquiries')} className={clsx(styles.tabBtn, activeTab === 'enquiries' && styles.activeTabBtn)}>
              Client Enquiries ({enquiries.length})
            </button>
            <button type="button" onClick={() => setActiveTab('overview')} className={clsx(styles.tabBtn, activeTab === 'overview' && styles.activeTabBtn)}>
              Commission Rules & Payouts
            </button>
          </div>

          {/* TAB 1: CREATOR APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className={styles.projectsTableCard}>
              {loading && <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading creator applications from Supabase...</div>}

              {!loading && applications.length === 0 && (
                <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#666' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                  <h4 className="h4">No creator applications yet</h4>
                  <p className="p-xs" style={{ color: '#888', marginTop: '0.3rem' }}>
                    When users apply via &quot;Become a Creator&quot;, their portfolio and credentials will appear here for verification.
                  </p>
                </div>
              )}

              {!loading &&
                applications.map((app) => (
                  <div key={app.id} className={styles.projectItemRow}>
                    <div className={styles.projectItemInfo}>
                      <div className={styles.projectItemText}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span className="p" style={{ fontWeight: 750 }}>
                            {app.full_name}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>@{app.handle}</span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '9999px',
                              ...getStatusBadgeStyle(app.status),
                            }}
                          >
                            {app.status}
                          </span>
                        </div>
                        <div className="p-xs" style={{ color: '#666', marginTop: '0.2rem' }}>
                          Email: {app.email} • Applied: {new Date(app.created_at).toLocaleDateString()}
                        </div>
                        {app.portfolio_url && (
                          <div className="p-xs" style={{ color: '#2563eb', marginTop: '0.2rem' }}>
                            Portfolio:{' '}
                            <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                              {app.portfolio_url}
                            </a>
                          </div>
                        )}
                        {app.skills && app.skills.length > 0 && (
                          <div className="p-xs" style={{ color: '#444', marginTop: '0.2rem' }}>
                            Skills: {app.skills.join(', ')}
                          </div>
                        )}
                        {app.bio && (
                          <div className="p-xs" style={{ color: '#555', marginTop: '0.4rem', fontStyle: 'italic' }}>
                            &ldquo;{app.bio}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>

                    {app.status === 'PENDING' && (
                      <div className={styles.projectItemActions}>
                        <button
                          type="button"
                          onClick={() => handleApproveApplication(app.id, app.full_name)}
                          style={{
                            background: '#166534',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Approve as Creator ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectApplication(app.id, app.full_name)}
                          style={{
                            background: 'transparent',
                            color: '#dc2626',
                            border: '1px solid #dc2626',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontWeight: 650,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Reject ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* TAB 2: PROJECT SUBMISSIONS */}
          {activeTab === 'moderation' && (
            <div className={styles.projectsTableCard}>
              {loading && <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading project submissions from Supabase...</div>}

              {!loading && dbProjects.length === 0 && (
                <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#666' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                  <h4 className="h4">No project submissions yet</h4>
                  <p className="p-xs" style={{ color: '#888', marginTop: '0.3rem' }}>
                    When creators upload and submit engineering builds, they will appear here for code & documentation audit.
                  </p>
                </div>
              )}

              {!loading &&
                dbProjects.map((item) => (
                  <div key={item.id} className={styles.projectItemRow}>
                    <div className={styles.projectItemInfo}>
                      <div className={styles.projectItemThumb}>
                        {item.cover_image_url && (item.cover_image_url.startsWith('http') || item.cover_image_url.startsWith('/')) ? (
                          <Image src={item.cover_image_url} fill sizes="80px" style={{ objectFit: 'cover' }} alt={item.title} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', fontSize: '1.4rem' }}>📦</div>
                        )}
                      </div>
                      <div className={styles.projectItemText}>
                        <span className="p" style={{ fontWeight: 750 }}>
                          {item.title}
                        </span>
                        <div className="p-xs" style={{ color: '#666', marginTop: '0.2rem' }}>
                          By {item.creator_profiles?.display_name || 'Creator'} (@{item.creator_profiles?.handle || 'handle'}) • Category: {item.categories?.name || 'Technical'} • Submitted:{' '}
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                        <div className="p-xs" style={{ color: '#444', marginTop: '0.2rem' }}>
                          Tech: {Array.isArray(item.tech_stack) ? item.tech_stack.join(', ') : item.tech_stack} • Platform: {item.platform} • Difficulty: {item.difficulty}
                        </div>
                        {item.admin_notes && (
                          <div className="p-xs" style={{ color: '#b45309', background: '#fef3c7', padding: '0.3rem 0.6rem', borderRadius: '4px', marginTop: '0.4rem' }}>
                            Admin Note: {item.admin_notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.projectItemStats}>
                      <span
                        className={clsx(
                          styles.statusPill,
                          (item.status === 'PUBLISHED' || item.status === 'APPROVED') && styles.statusPublished,
                          (item.status === 'SUBMITTED' || item.status === 'UNDER_REVIEW') && styles.statusPending,
                        )}
                        style={item.status === 'CHANGES_REQUESTED' ? { background: '#fef3c7', color: '#b45309' } : undefined}
                      >
                        {item.status}
                      </span>

                      <span className="p" style={{ fontWeight: 800 }}>
                        ₹{Number(item.academic_price || 0).toLocaleString('en-IN')}
                      </span>

                      {(item.status === 'SUBMITTED' || item.status === 'UNDER_REVIEW' || item.status === 'DRAFT') && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleApproveProject(item.id, item.title)}
                            style={{ background: '#15803d', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 650 }}
                          >
                            ✓ Publish
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedItemForNotes(item)}
                            style={{ background: '#d97706', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 650 }}
                          >
                            Feedback
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectProject(item.id, item.title)}
                            style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 650 }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 3: CLIENT ENQUIRIES (START A CONVERSATION LEADS) */}
          {activeTab === 'enquiries' && (
            <div className={styles.projectsTableCard}>
              {loading && <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading customer enquiries from Supabase...</div>}

              {!loading && enquiries.length === 0 && (
                <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#666' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                  <h4 className="h4">No enquiries yet</h4>
                  <p className="p-xs" style={{ color: '#888', marginTop: '0.3rem' }}>
                    When colleges, startups, or students submit the &quot;Start a Conversation&quot; form, leads will be recorded here.
                  </p>
                </div>
              )}

              {!loading &&
                enquiries.map((enq) => (
                  <div key={enq.id} className={styles.projectItemRow}>
                    <div className={styles.projectItemInfo}>
                      <div className={styles.projectItemText}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span className="p" style={{ fontWeight: 750 }}>
                            {enq.name}
                          </span>
                          <span style={{ fontSize: '0.78rem', background: '#f3f4f6', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 650 }}>Sector: {enq.sector}</span>
                          {enq.reference_id && <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>Ref: {enq.reference_id}</span>}
                        </div>
                        <div className="p-xs" style={{ color: '#555', marginTop: '0.3rem' }}>
                          Email: <strong>{enq.email}</strong> • Phone: <strong>{enq.phone || 'N/A'}</strong>
                          {enq.institution_or_company && ` • Org: ${enq.institution_or_company}`}
                          {enq.budget_range && ` • Budget: ${enq.budget_range}`}
                          {enq.timeline && ` • Timeline: ${enq.timeline}`}
                        </div>
                        {enq.service_type && (
                          <div className="p-xs" style={{ color: '#166534', fontWeight: 600, marginTop: '0.2rem' }}>
                            Requirement: {enq.service_type}
                          </div>
                        )}
                        <div className="p-xs" style={{ color: '#333', background: '#fafafa', padding: '0.6rem 0.8rem', borderRadius: '6px', marginTop: '0.4rem', border: '1px solid #eee' }}>
                          &ldquo;{enq.message}&rdquo;
                        </div>
                      </div>
                    </div>

                    <div className={styles.projectItemActions}>
                      {enq.phone && (
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#25d366',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '0.4rem 0.9rem',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          WhatsApp Reply ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 4: COMMISSION RULES & PAYOUTS */}
          {activeTab === 'overview' && (
            <div className={styles.walletCard}>
              <h4 className="h4">Marketplace Governance & Platform Settings</h4>
              <p className="p">Homies Studio operates on a transparent 80/20 royalty split. Platform fees cover hosting, security scanning, and instant buyer delivery.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <div className="p-xs" style={{ fontWeight: 700 }}>
                    Platform Commission
                  </div>
                  <div className="h3">20%</div>
                  <div className="p-xs" style={{ color: '#666' }}>
                    Covers storage, delivery, security & payment gateway fees.
                  </div>
                </div>
                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <div className="p-xs" style={{ fontWeight: 700 }}>
                    Creator Net Royalties
                  </div>
                  <div className="h3">80%</div>
                  <div className="p-xs" style={{ color: '#666' }}>
                    Directly transferred to creator balance upon verified order.
                  </div>
                </div>
                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <div className="p-xs" style={{ fontWeight: 700 }}>
                    Pending Payouts Total
                  </div>
                  <div className="h3">₹{stats.pendingPayouts.toLocaleString('en-IN')}</div>
                  <div className="p-xs" style={{ color: '#666' }}>
                    Unprocessed creator withdrawal requests.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Change Request Notes Modal */}
        {selectedItemForNotes && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: 'var(--white)',
                color: 'var(--black)',
                padding: '2.5rem',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <h3 className="h4" style={{ marginBottom: '0.4rem' }}>
                Request Changes
              </h3>
              <p className="p-xs" style={{ color: '#666', marginBottom: '1.2rem' }}>
                Specify what the creator needs to modify for &quot;{selectedItemForNotes.title}&quot;.
              </p>

              <form onSubmit={handleRequestChangesSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Please add setup instructions for Docker Compose and include the missing database seed SQL..."
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                />

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedItemForNotes(null)}
                    style={{ flex: 1, padding: '0.7rem', borderRadius: '9999px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '0.7rem', borderRadius: '9999px', border: 'none', background: '#d97706', color: '#fff', fontWeight: 650, cursor: 'pointer' }}>
                    Send Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {adminToast && (
          <div
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: 'var(--black)',
              color: 'var(--white)',
              padding: '1rem 1.8rem',
              borderRadius: '10px',
              zIndex: 9999,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            {adminToast}
          </div>
        )}
      </div>
    </RouteGuard>
  );
}

export default AdminDashboardPage;
