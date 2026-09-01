/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useMemo, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import defaultProjects from '@src/constants/projects';
import RouteGuard from '@src/components/auth/RouteGuard';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import styles from '../creator/submit.module.scss';

function CheckoutPage() {
  const router = useRouter();
  const { id } = router.query;

  const [creatorProjects, addOrder] = useStore(useShallow((state) => [state.creatorProjects, state.addOrder]));

  const allProjects = creatorProjects && creatorProjects.length > 0 ? creatorProjects : defaultProjects;
  const project = useMemo(() => allProjects.find((p) => p.id === id) || allProjects[0], [allProjects, id]);

  const [licenseType, setLicenseType] = useState('academic'); // 'academic' | 'commercial'
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const basePrice = project?.price || 2999;
  const commercialAddon = licenseType === 'commercial' ? 1999 : 0;
  const totalPrice = basePrice + commercialAddon;

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        projectId: project.id,
        projectTitle: project.title,
        date: new Date().toISOString().split('T')[0],
        amount: totalPrice,
        status: 'Completed',
        downloadToken: `dl_token_${Date.now()}`,
        downloadCount: 0,
        maxDownloads: 10,
        license: licenseType === 'commercial' ? 'Commercial Unlimited License' : 'Academic Defense & Personal License',
        creator: project.creator?.name || 'Homies Creator Studio',
        paymentMethod,
      };

      addOrder(newOrder);
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push('/buyer/dashboard');
      }, 1500);
    }, 1200);
  };

  if (!project) return null;

  return (
    <RouteGuard allowedRoles={['BUYER', 'CREATOR', 'ADMIN']}>
      <CustomHead title={`Checkout — ${project.title}`} noindex />
      <div className={clsx(styles.root, 'layout-block-inner')} style={{ minHeight: '100svh' }}>
        <div className={styles.header}>
          <h1 className={clsx(styles.pageTitle, 'h2')}>Secure Checkout</h1>
          <p className={clsx(styles.pageSubtitle, 'p')}>Instant access grant • Verified source code • IEEE documentation • Perpetual license</p>
        </div>

        {isSuccess ? (
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #166534',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 className="h3" style={{ color: '#166534', marginBottom: '0.6rem' }}>
              Payment Verified & Access Granted!
            </h2>
            <p className="p" style={{ color: '#555', marginBottom: '2rem' }}>
              Your order for <strong>{project.title}</strong> has been confirmed. Generating your secure download token...
            </p>
            <Link
              href="/buyer/dashboard"
              style={{
                background: 'var(--black)',
                color: 'var(--white)',
                padding: '0.9rem 2rem',
                borderRadius: '9999px',
                fontWeight: 650,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Go to My Downloads →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '2rem',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {/* Left: Summary & Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Project Card summary */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(40,40,43,0.15)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.2rem',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: '90px', height: '65px', position: 'relative', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={project.img || '/project1/project1.webp'} fill alt={project.title} style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 className="h5" style={{ fontWeight: 750, marginBottom: '0.2rem' }}>
                    {project.title}
                  </h4>
                  <span className="p-xs" style={{ color: '#666' }}>
                    {project.category} • By {project.creator?.name || 'Homies Creator Studio'}
                  </span>
                </div>
              </div>

              {/* License Option */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(40,40,43,0.15)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <h5 className="h5">Select License Tier</h5>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.8rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: licenseType === 'academic' ? '2px solid var(--black)' : '1px solid #ddd',
                    background: licenseType === 'academic' ? '#f8faf8' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <input type="radio" name="license" checked={licenseType === 'academic'} onChange={() => setLicenseType('academic')} style={{ marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Single Academic & Defense License (Included)</div>
                    <div className="p-xs" style={{ color: '#666' }}>
                      Full source code, thesis report, PPT, circuit diagrams & viva prep for academic or personal deployment.
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.8rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: licenseType === 'commercial' ? '2px solid var(--black)' : '1px solid #ddd',
                    background: licenseType === 'commercial' ? '#f8faf8' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <input type="radio" name="license" checked={licenseType === 'commercial'} onChange={() => setLicenseType('commercial')} style={{ marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Commercial SaaS & Enterprise License (+₹1,999)</div>
                    <div className="p-xs" style={{ color: '#666' }}>
                      Unlimited commercial deployment, white-label usage, SaaS monetization & multi-client redistribution rights.
                    </div>
                  </div>
                </label>
              </div>

              {/* Payment Method */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(40,40,43,0.15)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                }}
              >
                <h5 className="h5" style={{ marginBottom: '1rem' }}>
                  Payment Method
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
                  {['UPI (GPay / PhonePe)', 'Credit / Debit Card', 'Net Banking'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      style={{
                        padding: '0.8rem',
                        border: paymentMethod === method ? '2px solid var(--black)' : '1px solid #ccc',
                        borderRadius: '8px',
                        background: paymentMethod === method ? '#f0f4f1' : '#fafafa',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Price Summary & Pay Action */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid var(--black)',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                height: 'max-content',
                boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
              }}
            >
              <h4 className="h4" style={{ borderBottom: '1px solid #eee', paddingBottom: '0.8rem' }}>
                Order Breakdown
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between' }} className="p-xs">
                <span>Base Project Access</span>
                <span style={{ fontWeight: 650 }}>₹{basePrice.toLocaleString()}</span>
              </div>

              {commercialAddon > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }} className="p-xs">
                  <span>Commercial License Add-on</span>
                  <span style={{ fontWeight: 650 }}>+ ₹{commercialAddon.toLocaleString()}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }} className="p-xs">
                <span>GST & Gateway Processing</span>
                <span style={{ color: '#166534', fontWeight: 650 }}>FREE (Waived)</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '2px solid #eee',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                <span className="p" style={{ fontWeight: 700 }}>
                  Total Payable
                </span>
                <span className="h3" style={{ fontWeight: 850 }}>
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayNow}
                style={{
                  background: 'var(--black)',
                  color: 'var(--white)',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: 750,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '1rem',
                  transition: 'opacity 0.2s ease',
                }}
              >
                {isProcessing ? 'Verifying Transaction...' : `PAY ₹${totalPrice.toLocaleString()} & GET FILES →`}
              </button>

              <div className="p-xs" style={{ color: '#777', textAlign: 'center', lineHeight: 1.4 }}>
                🔒 256-bit encrypted checkout. Instant automated digital entitlement unlock upon completion.
              </div>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}

export default CheckoutPage;
