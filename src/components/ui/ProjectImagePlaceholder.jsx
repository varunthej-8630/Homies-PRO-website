/* eslint-disable */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

export default function ProjectImagePlaceholder({ aspectRatio = '16/9', label = 'Project Image', sublabel = 'Add Image', className = '', style = {}, iconSize = 28, compact = false }) {
  return (
    <div
      className={clsx('project-image-placeholder', className)}
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: aspectRatio === 'fill' ? 'unset' : aspectRatio,
        background: '#e5e7eb',
        border: '1.5px dashed #9ca3af',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compact ? '0.5rem' : '1.2rem',
        color: '#4b5563',
        userSelect: 'none',
        transition: 'all 0.25s ease',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? '0.25rem' : '0.45rem',
          textAlign: 'center',
        }}
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.75 }}>
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>

        <span
          style={{
            fontSize: compact ? '0.72rem' : '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#374151',
            fontFamily: 'var(--font-primary), -apple-system, sans-serif',
          }}
        >
          {label}
        </span>

        {sublabel && !compact && (
          <span
            style={{
              fontSize: '0.68rem',
              color: '#6b7280',
              fontWeight: 500,
              letterSpacing: '0.02em',
              fontFamily: 'var(--font-primary), -apple-system, sans-serif',
            }}
          >
            ✦ {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

ProjectImagePlaceholder.propTypes = {
  aspectRatio: PropTypes.string,
  label: PropTypes.string,
  sublabel: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  iconSize: PropTypes.number,
  compact: PropTypes.bool,
};
