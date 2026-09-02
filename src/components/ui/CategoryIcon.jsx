/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

export default function CategoryIcon({ slug, size = 15, className = '' }) {
  switch (slug) {
    case 'all':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect width="7" height="7" x="3" y="3" rx="1.5" />
          <rect width="7" height="7" x="14" y="3" rx="1.5" />
          <rect width="7" height="7" x="14" y="14" rx="1.5" />
          <rect width="7" height="7" x="3" y="14" rx="1.5" />
        </svg>
      );
    case 'ai-ml':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 3 3v1a3 3 0 0 1 2 2.83 3 3 0 0 1-2 2.83V18a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3v-1.34A3 3 0 0 1 3 13.83 3 3 0 0 1 5 11V10a3 3 0 0 1 3-3V6a4 4 0 0 1 4-4z" />
          <path d="M12 2v20" />
        </svg>
      );
    case 'web-dev':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'iot-robotics':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect width="18" height="12" x="3" y="6" rx="2" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <path d="M12 2v4" />
          <path d="M8 18v3" />
          <path d="M16 18v3" />
        </svg>
      );
    case 'embedded-vlsi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect width="14" height="14" x="5" y="5" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 2v3" />
          <path d="M15 2v3" />
          <path d="M9 19v3" />
          <path d="M15 19v3" />
          <path d="M2 9h3" />
          <path d="M2 15h3" />
          <path d="M19 9h3" />
          <path d="M19 15h3" />
        </svg>
      );
    case 'automation-saas':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2v4" />
          <path d="m4.93 4.93 2.83 2.83" />
          <path d="M2 12h4" />
          <path d="m4.93 19.07 2.83-2.83" />
          <path d="M12 18v4" />
          <path d="m16.24 16.24 2.83 2.83" />
          <path d="M18 12h4" />
          <path d="m16.24 7.76 2.83-2.83" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'mobile-apps':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect width="14" height="20" x="5" y="2" rx="3" />
          <path d="M12 18h.01" />
        </svg>
      );
    case 'cybersecurity':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

CategoryIcon.propTypes = {
  slug: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
};
