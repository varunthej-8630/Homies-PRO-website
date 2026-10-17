import React, { useState } from 'react';
import styles from './accordionFaq.module.scss';

export default function AccordionFAQ({ items = [], theme = 'light' }) {
  const [openIndexes, setOpenIndexes] = useState(new Set([0])); // First item open by default

  const toggleIndex = (index) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`${styles.faqAccordion} ${theme === 'dark' ? styles.themeDark : ''}`} role="region" aria-label="Frequently Asked Questions">
      {items.map((item, index) => {
        const isOpen = openIndexes.has(index);
        const headingId = `faq-head-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={item.q} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
            <h3 className={styles.faqHeading}>
              <button type="button" id={headingId} aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggleIndex(index)} className={styles.faqQuestionBtn}>
                <span className={styles.questionCol}>
                  <span className={styles.questionText}>{item.q}</span>
                </span>
                <span className={styles.chevronCol}>
                  <span className={styles.chevronBadge} aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={headingId} hidden={!isOpen} className={styles.faqAnswerWrapper}>
              <div className={styles.faqAnswerContent}>
                <div className={styles.faqAnswerDivider} aria-hidden="true" />
                <p className={styles.faqAnswerText}>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
