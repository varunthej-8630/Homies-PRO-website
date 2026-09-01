/* eslint-disable */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import styles from '@src/pages/projects/components/projectDetails/styles/projectDetails.module.scss';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function ProjectDetails({ project }) {
  const [setIsConversationOpen, purchasedProjectIds, toggleWishlist, wishlist] = useStore(
    useShallow((state) => [state.setIsConversationOpen, state.purchasedProjectIds, state.toggleWishlist, state.wishlist]),
  );

  if (!project) return null;

  const isPurchased = purchasedProjectIds.includes(project.id);
  const isWishlisted = wishlist.includes(project.id);
  const creator = project.creator || {
    name: 'Homies Creator Studio',
    handle: '@homies_studio',
    role: 'Verified Digital Architect',
    rating: 4.96,
    sales: 420,
    responseTime: '< 2 hours',
    badges: ['Verified Creator', 'Fast Delivery'],
  };

  return (
    <div className={styles.root}>
      {/* Header Badges */}
      <div className={styles.header}>
        {project.category && <span className={clsx(styles.categoryBadge, 'p-xs')}>{project.category}</span>}
        {project.rating && (
          <span className={clsx(styles.ratingBadge, 'p-xs')}>
            ★ {project.rating} ({project.reviewCount || 34} reviews)
          </span>
        )}
        {project.salesCount && <span className={clsx(styles.salesBadge, 'p-xs')}>{project.salesCount} builders downloaded</span>}
      </div>

      <h3 className={clsx(styles.title, 'h3')}>{project.title}</h3>

      {project.tagline && <p className={clsx(styles.tagline, 'p-l')}>{project.tagline}</p>}

      {project.handwritingNote && (
        <div className={styles.handwritingNoteWrapper}>
          <span className={styles.handwritingSparkle}>✦</span>
          <span className={clsx(styles.handwritingNote, 'handwriting-md')}>“{project.handwritingNote}”</span>
        </div>
      )}

      <div className={styles.scrollableContent}>
        {/* Marketplace Pricing Box */}
        <div className={styles.pricingBox}>
          <div className={styles.priceHeaderRow}>
            <div className={styles.priceDisplay}>
              <span className={clsx(styles.currentPrice, 'h4')}>₹{project.price ? project.price.toLocaleString() : '2,999'}</span>
              {project.originalPrice && <span className={clsx(styles.originalPrice, 'p-l')}>₹{project.originalPrice.toLocaleString()}</span>}
            </div>
            {project.originalPrice && project.price && (
              <span className={clsx(styles.discountBadge, 'p-xs')}>{Math.round(((project.originalPrice - project.price) / project.originalPrice) * 100)}% OFF</span>
            )}
          </div>

          <p className={clsx(styles.licenseNote, 'p-xs')}>✓ Complete verified source code ownership • IEEE format documentation & PPT included • Instant secure download & perpetual license.</p>

          <div className={styles.primaryActionButtons}>
            {isPurchased ? (
              <Link href="/buyer/dashboard" className={styles.buyButton}>
                <span>✓ PURCHASED — OPEN DOWNLOADS</span>
              </Link>
            ) : (
              <Link href={`/checkout/${project.id}`} className={styles.buyButton}>
                <span>GET INSTANT ACCESS — ₹{project.price?.toLocaleString()}</span>
              </Link>
            )}

            {(project.liveDemoUrl || project.liveLink) && (
              <a
                href={project.liveDemoUrl || project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.demoLinkButton}
              >
                <span>🌐 LIVE DEMO ↗</span>
              </a>
            )}

            {project.demoVideoUrl && (
              <a
                href={project.demoVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.demoLinkButton}
              >
                <span>▶ DEMO VIDEO ↗</span>
              </a>
            )}

            <button type="button" className={styles.talkCreatorButton} onClick={() => setIsConversationOpen(true)}>
              <span>TALK TO CREATOR</span>
            </button>

            <button type="button" className={styles.talkCreatorButton} onClick={() => toggleWishlist(project.id)} style={{ width: 'auto', padding: '0.8vw 1.2vw' }} aria-label="Save to Wishlist">
              <span>{isWishlisted ? '♥ Saved' : '♡ Wishlist'}</span>
            </button>
          </div>

          <div className={styles.guaranteeRow}>
            <span>🛡️ 100% Working Code Guarantee</span>
            <span>⚡ Automated Delivery & Expiring Tokens</span>
            <span>💬 Direct Creator Support</span>
          </div>
        </div>

        {/* Creator Info Profile Card */}
        <div className={styles.creatorBox}>
          <div className={styles.creatorLeft}>
            <div className={styles.creatorAvatar} style={{ position: 'relative' }}>
              {creator.avatar ? <Image src={creator.avatar} fill alt={creator.name} style={{ objectFit: 'cover' }} /> : creator.name.charAt(0)}
            </div>
            <div className={styles.creatorMeta}>
              <div className={styles.creatorNameRow}>
                <span className="p-l">{creator.name}</span>
                <span className={styles.verifiedTick} title="Verified Creator">
                  ✓
                </span>
              </div>
              <span className={clsx(styles.creatorRole, 'p-xs')}>
                {creator.role} • {creator.handle}
              </span>
            </div>
          </div>

          <div className={styles.creatorStats}>
            <div className={styles.creatorStatItem}>
              <span className={clsx(styles.statVal, 'p-l')}>★ {creator.rating || 4.9}</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
            <div className={styles.creatorStatItem}>
              <span className={clsx(styles.statVal, 'p-l')}>{creator.sales || 240}+</span>
              <span className={styles.statLabel}>Sales</span>
            </div>
            <div className={styles.creatorStatItem}>
              <span className={clsx(styles.statVal, 'p-l')}>{creator.responseTime || '< 2h'}</span>
              <span className={styles.statLabel}>Response</span>
            </div>
          </div>
        </div>

        {/* Overview Desc */}
        <div className={styles.descSection}>
          <h6 className={clsx(styles.sectionSubtitle, 'h6')}>Project Architecture & Overview</h6>
          {project.desc?.map((des, index) => (
            <p className="p" key={`${project.id}-desc-${index}`}>
              {des}
            </p>
          ))}
        </div>

        {/* Deliverables & Files Package */}
        <div className={styles.deliverablesSection}>
          <h6 className={clsx(styles.sectionSubtitle, 'h6')}>What You Receive (Deliverables Package)</h6>
          <div className={styles.deliverableFilesList}>
            {project.deliverableFiles
              ? project.deliverableFiles.map((file, idx) => (
                  <div key={idx} className={styles.fileRow}>
                    <div className={styles.fileNameWithIcon}>
                      <span>📦</span>
                      <span className="p-xs">{file.name}</span>
                    </div>
                    <span className={clsx(styles.fileSizeBadge, 'p-xs')}>{file.size}</span>
                  </div>
                ))
              : project.deliverables?.map((deliv, idx) => (
                  <div key={idx} className={styles.fileRow}>
                    <div className={styles.fileNameWithIcon}>
                      <span>✓</span>
                      <span className="p-xs">{deliv}</span>
                    </div>
                    <span className={clsx(styles.fileSizeBadge, 'p-xs')}>Included</span>
                  </div>
                ))}
          </div>
        </div>

        {/* System & Hardware Requirements */}
        {project.requirements && (
          <div className={styles.requirementsSection}>
            <h6 className={clsx(styles.sectionSubtitle, 'h6')}>System Requirements & Prerequisites</h6>
            <div className={styles.requirementsGrid}>
              <div className={styles.reqCard}>
                <span className={clsx(styles.reqLabel, 'p-xs')}>Operating System</span>
                <span className={clsx(styles.reqValue, 'p-xs')}>{project.requirements.os}</span>
              </div>
              <div className={styles.reqCard}>
                <span className={clsx(styles.reqLabel, 'p-xs')}>Software / Runtimes</span>
                <span className={clsx(styles.reqValue, 'p-xs')}>{project.requirements.software}</span>
              </div>
              <div className={styles.reqCard}>
                <span className={clsx(styles.reqLabel, 'p-xs')}>Hardware Spec</span>
                <span className={clsx(styles.reqValue, 'p-xs')}>{project.requirements.hardware}</span>
              </div>
              <div className={styles.reqCard}>
                <span className={clsx(styles.reqLabel, 'p-xs')}>Core Dependencies</span>
                <span className={clsx(styles.reqValue, 'p-xs')}>{project.requirements.dependencies}</span>
              </div>
            </div>
          </div>
        )}

        {/* Why Homies Section */}
        {project.whyHomies && (
          <div className={styles.cardBox}>
            <div className={styles.cardHeader}>
              <span className={clsx(styles.cardLabel, 'handwriting-lg')}>Why Homies Studio?</span>
            </div>
            <ul className={styles.list}>
              {project.whyHomies.map((item, index) => (
                <li key={`${project.id}-why-${index}`} className={styles.listItem}>
                  <span className={styles.bullet}>▸</span>
                  <span className="p">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What Makes Us Special Section */}
        {project.whatMakesUsSpecial && (
          <div className={clsx(styles.cardBox, styles.specialBox)}>
            <div className={styles.cardHeader}>
              <span className={clsx(styles.cardLabel, 'handwriting-lg')}>What Makes This Project Special</span>
            </div>
            <ul className={styles.list}>
              {project.whatMakesUsSpecial.map((item, index) => (
                <li key={`${project.id}-special-${index}`} className={styles.listItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span className="p">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Chips */}
        {project.techStack && (
          <div className={styles.techStackSection}>
            <h6 className={clsx(styles.sectionSubtitle, 'h6')}>Core Technologies & Tools</h6>
            <div className={styles.chipsWrap}>
              {project.techStack.map((tech) => (
                <span key={tech} className={clsx(styles.chip, 'p-xs')}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Verified Reviews */}
        {project.reviews && project.reviews.length > 0 && (
          <div className={styles.reviewsSection}>
            <h6 className={clsx(styles.sectionSubtitle, 'h6')}>Verified Buyer Reviews & Feedback</h6>
            <div className={styles.reviewsList}>
              {project.reviews.map((rev) => (
                <div key={rev.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <span className="p-xs">{rev.user}</span>
                      <span className={styles.verifiedBuyerBadge}>✓ Verified Purchase</span>
                    </div>
                    <span className={clsx(styles.reviewDate, 'p-xs')}>{rev.date}</span>
                  </div>
                  <div className={styles.reviewStars}>{'★'.repeat(rev.rating)}</div>
                  <p className={clsx(styles.reviewComment, 'p-xs')}>{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
