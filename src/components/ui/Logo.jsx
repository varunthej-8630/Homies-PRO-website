/* eslint-disable */
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './logo.module.scss';

/**
 * HOMIES STUDIO — Adaptive Brand Logo Wordmark
 *
 * Variants:
 *  - 'light': Deep charcoal lettering with champagne-gold (#c5a359) emphasis on 'OM' (for light surfaces)
 *  - 'dark': Crisp warm-white lettering with champagne-gold (#c5a359) emphasis on 'OM' (for dark surfaces)
 *  - 'image' / 'overlay': Crisp white with protective backing/shadow for busy backgrounds/canvases
 *  - 'solid': High-contrast fallback wordmark
 *
 * Sizes:
 *  - 'sm' | 'md' (default) | 'lg' | 'xl' | 'hero' | 'footer' | 'inherit'
 */
const Logo = forwardRef(function Logo(
  {
    variant = 'light',
    size = 'md',
    as: Component = 'span',
    className,
    style,
    id,
    withLink = false,
    ...rest
  },
  ref
) {
  const effectiveVariant = variant === 'auto' ? 'light' : variant;

  return (
    <Component
      ref={ref}
      id={id}
      className={clsx(
        styles.logo,
        styles[`variant_${effectiveVariant}`] || styles.variant_light,
        size !== 'inherit' && styles[`size_${size}`],
        className
      )}
      style={style}
      aria-label="HOMIES STUDIO"
      role="img"
      {...rest}
    >
      <span className={styles.wordmark}>
        <span className={styles.baseChar}>H</span>
        <span className={styles.goldChar}>OM</span>
        <span className={styles.baseChar}>IES</span>
        <span className={styles.space}>&nbsp;</span>
        <span className={styles.baseChar}>STUDIO</span>
      </span>
    </Component>
  );
});

export default Logo;
