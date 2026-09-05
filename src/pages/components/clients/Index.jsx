import AppearByWords from '@src/components/animationComponents/appearByWords/Index';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import Badge from '@src/pages/components/clients/components/Badge';
import Link from 'next/link';
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
              autoAlpha: 1,
              stagger: 1,
            });
        });

        badgeRefs.current.forEach((badgeRef, index) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: rootRef.current,
                start: index === 0 ? `top-=${vw(30)}` : `top+=${vw(30 + 5.5555556 * index)}`,
                end: index === 0 ? `bottom-=${vw(30 + 5.5555556 * index)}` : `bottom+=${vw(25)}`,
                toggleActions: 'play none reverse none',
                scrub: true,
                scroller: document?.querySelector('main'),
                invalidateOnRefresh: true,
              },
            })
            .to(badgeRef, {
              yPercent: -100,
              stagger: 1,
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
          <AppearTitle>STUDENTS &amp; DEVELOPERS</AppearTitle>
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
            <h4 className={clsx('h4', 'bold')}>
              <Link href="/final-year-projects" style={{ color: 'inherit', textDecoration: 'none' }}>
                Discover &amp; Build &rarr;
              </Link>
            </h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">
              Find verified, ready-to-build projects with complete source code, IEEE-standard documentation, circuit schematics, and working demos. Accelerate your academic builds, portfolio, and
              engineering skills with{' '}
              <Link href="/final-year-projects" style={{ textDecoration: 'underline', color: 'inherit' }}>
                Final Year Project Guidance
              </Link>
              .
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
              <h6 className="h6">STUDENTS &amp; DEVELOPERS</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>
                <Link href="/final-year-projects" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Discover &amp; Build &rarr;
                </Link>
              </h4>
            </AppearTitle>
            <AppearTitle>
              <div className="p-l">Find verified, ready-to-build projects with complete</div>
              <div className="p-l">source code, IEEE-standard documentation, circuit</div>
              <div className="p-l">schematics, and working demos. Accelerate your academic</div>
              <div className="p-l">
                builds with{' '}
                <Link href="/final-year-projects" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Final Year Projects
                </Link>
                .
              </div>
            </AppearTitle>
          </div>
        </>
      ) : null}

      {/* 2. CREATORS & BUILDERS */}
      {!isMobile ? <div className={styles.secondEmpty} /> : null}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>CREATORS &amp; BUILDERS</AppearTitle>
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
            <h4 className={clsx('h4', 'bold')}>
              <Link href="/become-a-creator" style={{ color: 'inherit', textDecoration: 'none' }}>
                Monetize &amp; Publish &rarr;
              </Link>
            </h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">
              Turn your finished engineering projects, ML models, and reusable software into recurring income. Publish to buyers on{' '}
              <Link href="/mart" style={{ textDecoration: 'underline', color: 'inherit' }}>
                Homies Mart
              </Link>{' '}
              with automated licensing, transparent 80% earnings, and instant payouts. Join as a{' '}
              <Link href="/become-a-creator" style={{ textDecoration: 'underline', color: 'inherit' }}>
                Homies Creator
              </Link>
              .
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
              <h6 className="h6">CREATORS &amp; BUILDERS</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>
                <Link href="/become-a-creator" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Monetize &amp; Publish &rarr;
                </Link>
              </h4>
            </AppearTitle>
            <AppearTitle>
              <div className="p-l">Turn your finished engineering projects, ML models,</div>
              <div className="p-l">
                and reusable software into income on{' '}
                <Link href="/mart" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Homies Mart
                </Link>
                .
              </div>
              <div className="p-l">
                Publish to buyers with automated licensing as a{' '}
                <Link href="/become-a-creator" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  Homies Creator
                </Link>
                .
              </div>
            </AppearTitle>
          </div>
          <div className={styles.fourthEmpty} />
        </>
      ) : null}

      {/* 3. COLLEGES & INSTITUTES */}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>COLLEGES &amp; INSTITUTES</AppearTitle>
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
            <h4 className={clsx('h4', 'bold')}>
              <Link href="/for-colleges" style={{ color: 'inherit', textDecoration: 'none' }}>
                Partner &amp; Expand &rarr;
              </Link>
            </h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">
              Curated project repositories, hands-on faculty workshops, technical mentorship programs, and domain-specific engineering support delivered across campus departments with our{' '}
              <Link href="/for-colleges" style={{ textDecoration: 'underline', color: 'inherit' }}>
                College Partnership Program
              </Link>
              .
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
              <h6 className="h6">COLLEGES &amp; INSTITUTES</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>
                <Link href="/for-colleges" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Partner &amp; Expand &rarr;
                </Link>
              </h4>
            </AppearTitle>
            <AppearTitle>
              <div className="p-l">Curated project repositories, hands-on faculty</div>
              <div className="p-l">workshops, and technical mentorship delivered</div>
              <div className="p-l">
                through our{' '}
                <Link href="/for-colleges" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  College Partnerships
                </Link>
                .
              </div>
            </AppearTitle>
          </div>
        </>
      ) : null}

      {/* 4. STARTUPS & ENTERPRISES */}
      {!isMobile ? <div className={styles.sixthEmpty} /> : null}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>STARTUPS &amp; ENTERPRISES</AppearTitle>
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
            <h4 className={clsx('h4', 'bold')}>
              <Link href="/ai-solutions" style={{ color: 'inherit', textDecoration: 'none' }}>
                Bespoke Tech Solutions &rarr;
              </Link>
            </h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">
              Source production-ready digital architectures, custom AI systems, automation suites, and full-stack software built to industrial standards with full intellectual property ownership.
              Explore{' '}
              <Link href="/ai-solutions" style={{ textDecoration: 'underline', color: 'inherit' }}>
                AI Solutions
              </Link>
              .
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
            <h6 className="h6">STARTUPS &amp; ENTERPRISES</h6>
          </AppearTitle>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold', styles.title)}>
              <Link href="/ai-solutions" style={{ color: 'inherit', textDecoration: 'none' }}>
                Bespoke Tech Solutions &rarr;
              </Link>
            </h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">Source production-ready digital architectures, custom AI</div>
            <div className="p-l">systems, automation suites, and full-stack software.</div>
            <div className="p-l">
              Discover our{' '}
              <Link href="/ai-solutions" style={{ textDecoration: 'underline', color: 'inherit' }}>
                AI Solutions for Startups
              </Link>
              .
            </div>
          </AppearTitle>
        </div>
      ) : null}
    </section>
  );
}

export default Clients;
