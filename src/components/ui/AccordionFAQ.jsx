import React, { useState } from 'react';
import styles from './accordionFaq.module.scss';

export default function AccordionFAQ({ items = [] }) {
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
    <div className={styles.faqAccordion} role="region" aria-label="Frequently Asked Questions">
      {items.map((item, index) => {
        const isOpen = openIndexes.has(index);
        const headingId = `faq-head-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={item.q} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
            <h3 style={{ margin: 0, padding: 0 }}>
              <button type="button" id={headingId} aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggleIndex(index)} className={styles.faqQuestionBtn}>
                <span className={styles.questionText}>{item.q}</span>
                <span className={styles.chevron} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={headingId} hidden={!isOpen} className={styles.faqAnswerWrapper}>
              <div className={styles.faqAnswerContent}>
                <p className={styles.faqAnswerText}>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
