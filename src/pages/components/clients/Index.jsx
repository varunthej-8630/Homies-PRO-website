import AppearByWords from '@src/components/animationComponents/appearByWords/Index';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import Badge from '@src/pages/components/clients/components/Badge';
import clsx from 'clsx';
import { gsap } from 'gsap';
import styles from '@src/pages/components/clients/styles/clients.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import { useWindowSize } from '@darkroom.engineering/hamo';

function Clients() {
  const isMobile = useIsMobile();
  const textRefs = useRef([]);
  const badgeRefs = useRef([]);
  const rootRef = useRef();
  const windowSize = useWindowSize();

  const setupScrollAnimation = () => {
    const ctx = gsap.context(() => {
      if (!isMobile) {
        const vw = (coef) => windowSize.height * (coef / 100);
        textRefs.current.forEach((textRef, index) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: rootRef.current,
                start: index === 0 ? `top-=${vw(35)}` : `top+=${vw(35 + 5.5555556 * index)}`,
                end: index === 0 ? `bottom-=${vw(35 + 5.5555556 * index)}` : `bottom+=${vw(25)}`,
                toggleActions: 'play none reverse none',
                scrub: true,
                scroller: document?.querySelector('main'),
                invalidateOnRefresh: true,
              },
            })
            .to(textRef, {
              top: `${10 + 30 * index + 5.5555556 * index}vw`,
            });
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupScrollAnimation();
    return () => ctx.kill();
  }, [isMobile, windowSize.height]);

  return (
    <section ref={rootRef} className={clsx(styles.root, 'layout-grid-inner')}>
      <h2 className={clsx(styles.sectionTitle, 'h1')}>
        <AppearByWords>Built For Different Needs</AppearByWords>
      </h2>

      {/* 1. STUDENTS & DEVELOPERS */}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>STUDENTS & DEVELOPERS</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[0] = el;
        }}
        className={styles.first}
      >
        <Badge name="company1" />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>Discover & Build</h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">
              Find verified, ready-to-build projects with complete source code, IEEE-standard documentation, circuit schematics, and working demos. Accelerate your academic builds, portfolio, and
              engineering skills.
            </div>
          </AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <>
          <div className={styles.firstEmpty} />
          <div
            ref={(el) => {
              textRefs.current[0] = el;
            }}
            className={styles.firstText}
          >
            <AppearTitle>
              <h6 className="h6">STUDENTS & DEVELOPERS</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>Discover & Build</h4>
            </AppearTitle>
            <AppearTitle>
              <div className="p-l">Find verified, ready-to-build projects with complete</div>
              <div className="p-l">source code, IEEE-standard documentation, circuit</div>
              <div className="p-l">schematics, and working demos. Accelerate your academic</div>
              <div className="p-l">builds, portfolio, and engineering skills.</div>
            </AppearTitle>
          </div>
        </>
      ) : null}

      {/* 2. CREATORS & BUILDERS */}
      {!isMobile ? <div className={styles.secondEmpty} /> : null}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>CREATORS & BUILDERS</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[1] = el;
        }}
        className={styles.second}
      >
        <Badge name="company2" />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>Monetize & Publish</h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">
              Turn your finished engineering projects, ML models, and reusable software into recurring income. Publish to buyers with automated licensing, transparent 80% earnings, and instant
              payouts.
            </div>
          </AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <>
          <div
            ref={(el) => {
              textRefs.current[1] = el;
            }}
            className={styles.secondText}
          >
            <AppearTitle>
              <h6 className="h6">CREATORS & BUILDERS</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>Monetize & Publish</h4>
            </AppearTitle>
            <AppearTitle>
              <div className="p-l">Turn your finished engineering projects, ML models,</div>
              <div className="p-l">and reusable software into recurring income. Publish</div>
              <div className="p-l">to buyers with automated licensing, transparent 80%</div>
              <div className="p-l">earnings, and instant payouts.</div>
            </AppearTitle>
          </div>
          <div className={styles.fourthEmpty} />
        </>
      ) : null}

      {/* 3. COLLEGES & INSTITUTES */}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>COLLEGES & INSTITUTES</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[2] = el;
        }}
        className={styles.third}
      >
        <Badge name="company3" />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>Partner & Expand</h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">
              Curated project repositories, hands-on faculty workshops, technical mentorship programs, and domain-specific engineering support delivered across campus departments.
            </div>
          </AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <>
          <div className={styles.fifthEmpty} />
          <div
            ref={(el) => {
              textRefs.current[2] = el;
            }}
            className={styles.thirdText}
          >
            <AppearTitle>
              <h6 className="h6">COLLEGES & INSTITUTES</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>Partner & Expand</h4>
            </AppearTitle>
            <AppearTitle>
              <div className="p-l">Curated project repositories, hands-on faculty</div>
              <div className="p-l">workshops, technical mentorship programs, and</div>
              <div className="p-l">domain-specific engineering support delivered across</div>
              <div className="p-l">campus departments at scale.</div>
            </AppearTitle>
          </div>
        </>
      ) : null}

      {/* 4. STARTUPS & CLIENTS */}
      {!isMobile ? <div className={styles.sixthEmpty} /> : null}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>STARTUPS & ENTERPRISES</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[3] = el;
        }}
        className={styles.fourth}
      >
        <Badge name="company4" />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>Bespoke Tech Solutions</h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">
              Source production-ready digital architectures, custom AI systems, automation suites, and full-stack software built to industrial standards with full intellectual property ownership.
            </div>
          </AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <div
          ref={(el) => {
            textRefs.current[3] = el;
          }}
          className={styles.fourthText}
        >
          <AppearTitle>
            <h6 className="h6">STARTUPS & ENTERPRISES</h6>
          </AppearTitle>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold', styles.title)}>Bespoke Tech Solutions</h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">Source production-ready digital architectures, custom AI</div>
            <div className="p-l">systems, automation suites, and full-stack software</div>
            <div className="p-l">built to industrial standards with full intellectual</div>
            <div className="p-l">property ownership.</div>
          </AppearTitle>
        </div>
      ) : null}
    </section>
  );
}

export default Clients;
