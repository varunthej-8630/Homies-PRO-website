/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import RouteGuard from '@src/components/auth/RouteGuard';
import clsx from 'clsx';
import defaultProjects from '@src/constants/projects';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import styles from './dashboard.module.scss';

function BuyerDashboardPage() {
  const [orders, purchasedProjectIds, wishlist, creatorProjects, setIsConversationOpen] = useStore(
    useShallow((state) => [state.orders, state.purchasedProjectIds, state.wishlist, state.creatorProjects, state.setIsConversationOpen]),
  );

  const allProjects = creatorProjects && creatorProjects.length > 0 ? creatorProjects : defaultProjects;

  const [activeTab, setActiveTab] = useState('downloads'); // 'downloads' | 'orders' | 'wishlist'
  const [downloadNotification, setDownloadNotification] = useState('');

  const purchasedProjects = allProjects.filter((p) => purchasedProjectIds.includes(p.id));
  const wishlistedProjects = allProjects.filter((p) => wishlist.includes(p.id));

  const handleDownload = (filename) => {
    setDownloadNotification(`✓ Decrypting and streaming secure asset: ${filename}`);
    setTimeout(() => setDownloadNotification(''), 3000);
  };

  return (
    <RouteGuard allowedRoles={['BUYER', 'CREATOR', 'ADMIN']}>
      <CustomHead title="Buyer Portal & Downloads | HOMIES STUDIO" noindex />
      <div className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.header}>
          <h1 className={clsx(styles.title, 'h2')}>Buyer Portal</h1>
          <p className={clsx(styles.subtitle, 'p')}>Manage your project entitlements, generate secure expiring download links, and chat with verified creators.</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabNavigation}>
          <button type="button" onClick={() => setActiveTab('downloads')} className={clsx(styles.tabBtn, activeTab === 'downloads' && styles.activeTabBtn)}>
            Secure Downloads ({purchasedProjects.length})
          </button>
          <button type="button" onClick={() => setActiveTab('orders')} className={clsx(styles.tabBtn, activeTab === 'orders' && styles.activeTabBtn)}>
            Order History ({orders.length})
          </button>
          <button type="button" onClick={() => setActiveTab('wishlist')} className={clsx(styles.tabBtn, activeTab === 'wishlist' && styles.activeTabBtn)}>
            Saved Wishlist ({wishlistedProjects.length})
          </button>
        </div>

        {/* TAB 1: SECURE DOWNLOADS */}
        {activeTab === 'downloads' && (
          <div className={styles.downloadsList}>
            {purchasedProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                <p className="p">No purchased projects found yet.</p>
                <Link href="/projects" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'underline' }}>
                  Explore Project Marketplace →
                </Link>
              </div>
            ) : (
              purchasedProjects.map((p) => (
                <div key={p.id} className={styles.downloadCard}>
                  <div className={styles.downloadHeader}>
                    <div>
                      <h4 className={clsx(styles.projectTitle, 'h4')}>{p.title}</h4>
                      <p className="p-xs" style={{ color: '#666' }}>
                        {p.category} • License: {p.license || 'Academic & Commercial Entitlement'}
                      </p>
                    </div>

                    <span className={styles.tokenBadge}>🛡️ Token Active: exp_48h_verified</span>
                  </div>

                  <div className={styles.filesGrid}>
                    {p.deliverableFiles ? (
                      p.deliverableFiles.map((file, idx) => (
                        <div key={`file-${idx}`} className={styles.fileDownloadRow}>
                          <div className={styles.fileMeta}>
                            <span>📦</span>
                            <div>
                              <div className="p-xs">{file.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#888' }}>{file.size}</div>
                            </div>
                          </div>
                          <button type="button" onClick={() => handleDownload(file.name)} className={styles.downloadActionBtn}>
                            Download ↓
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className={styles.fileDownloadRow}>
                        <div className="p-xs">Complete Project Package (ZIP)</div>
                        <button type="button" onClick={() => handleDownload(`${p.id}-source.zip`)} className={styles.downloadActionBtn}>
                          Download ↓
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setIsConversationOpen(true)}
                      style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'inherit', cursor: 'pointer', font: 'inherit', fontSize: '0.85rem' }}
                    >
                      💬 Message Creator for Setup Support
                    </button>
                    <span>•</span>
                    <Link href={p.link} style={{ fontSize: '0.85rem', color: 'inherit', textDecoration: 'underline' }}>
                      View Project Documentation Page
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className={styles.ordersCard}>
            {orders.map((o) => (
              <div key={o.id} className={styles.orderRow}>
                <div className={styles.orderInfo}>
                  <div className="p" style={{ fontWeight: 700 }}>
                    {o.projectTitle}
                  </div>
                  <div className="p-xs" style={{ color: '#777' }}>
                    Order #{o.id} • Purchased on {o.date} • {o.license}
                  </div>
                </div>

                <div className={styles.orderMeta}>
                  <div className="p-l" style={{ fontWeight: 800 }}>
                    ₹{o.amount.toLocaleString()}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownload(`Invoice-${o.id}.pdf`)}
                    style={{ background: 'transparent', border: '1px solid #ccc', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Invoice PDF ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className={styles.downloadsList}>
            {wishlistedProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                <p className="p">Your saved wishlist is empty.</p>
                <Link href="/projects" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'underline' }}>
                  Discover Projects →
                </Link>
              </div>
            ) : (
              wishlistedProjects.map((p) => (
                <div key={p.id} className={styles.downloadCard}>
                  <div className={styles.downloadHeader}>
                    <div>
                      <h4 className={clsx(styles.projectTitle, 'h4')}>{p.title}</h4>
                      <p className="p-xs" style={{ color: '#666' }}>
                        {p.category} • {p.tagline}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="h4" style={{ fontWeight: 800 }}>
                        ₹{p.price?.toLocaleString()}
                      </div>
                      <Link
                        href={`/checkout/${p.id}`}
                        style={{
                          background: 'var(--black)',
                          color: 'var(--white)',
                          padding: '0.4rem 1rem',
                          borderRadius: '9999px',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          display: 'inline-block',
                          marginTop: '0.4rem',
                        }}
                      >
                        Buy Now →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {downloadNotification && (
          <div
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: '#166534',
              color: '#ffffff',
              padding: '1rem 1.8rem',
              borderRadius: '10px',
              zIndex: 9999,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            {downloadNotification}
          </div>
        )}
      </div>
    </RouteGuard>
  );
}

export default BuyerDashboardPage;
