/* eslint-disable */

import { useEffect, useMemo, useRef, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Link from 'next/link';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { MARKETPLACE_CATEGORIES } from '@src/constants/marketplace';
import defaultProjects from '@src/constants/projects';
import styles from '@src/pages/projects/projects.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';
import ProjectImagePlaceholder from '@src/components/ui/ProjectImagePlaceholder';
import CategoryIcon from '@src/components/ui/CategoryIcon';

const seo = {
  title: 'Homies Mart – Buy & Sell Final Year Engineering Projects | Homies Studio',
  description: 'Browse and purchase ready-made final year projects in IoT, Robotics, AI/ML, and more. Creators can sell their engineering projects on Homies Mart.',
  keywords: [
    'Homies Mart',
    'HOMIES STUDIO Mart',
    'Engineering Projects Marketplace',
    'Buy Final Year Projects',
    'Sell Engineering Projects',
    'IoT Projects Store',
    'Robotics Project Blueprints',
    'AI ML Engineering Builds',
    'Embedded Systems Code',
    'B.Tech Final Year Projects',
  ],
  canonical: '/mart',
};

export default function HomiesMartPage() {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const rootRef = useRef();
  const projectRefs = useRef([]);
  const [lenis, isLoading, creatorProjects] = useStore(useShallow((state) => [state.lenis, state.isLoading, state.creatorProjects]));

  const allProjects = creatorProjects && creatorProjects.length > 0 ? creatorProjects : defaultProjects;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [viewMode, setViewMode] = useState('grid'); // Default to grid for clean Mart experience

  // Compute category item counts dynamically
  const categoryCounts = useMemo(() => {
    const counts = { all: allProjects.length };
    MARKETPLACE_CATEGORIES.forEach((cat) => {
      if (cat.slug === 'all') return;
      counts[cat.slug] = allProjects.filter(
        (p) =>
          p.categorySlug === cat.slug || p.category?.toLowerCase() === cat.name.toLowerCase() || p.category?.toLowerCase().includes(cat.slug) || p.category_id === cat.id || p.category_id === cat.slug,
      ).length;
    });
    return counts;
  }, [allProjects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...allProjects];

    // Filter by domain category
    if (activeCategory !== 'all') {
      const activeCatObj = MARKETPLACE_CATEGORIES.find((c) => c.slug === activeCategory);
      result = result.filter(
        (p) =>
          p.categorySlug === activeCategory ||
          p.category?.toLowerCase() === activeCatObj?.name.toLowerCase() ||
          p.category?.toLowerCase().includes(activeCategory) ||
          p.category_id === activeCatObj?.id ||
          p.category_id === activeCategory,
      );
    }

    // Filter by search query (smart keyword matching)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = Array.isArray(p.desc) ? p.desc.some((d) => d.toLowerCase().includes(q)) : typeof p.desc === 'string' ? p.desc.toLowerCase().includes(q) : false;
        const taglineMatch = p.tagline?.toLowerCase().includes(q);
        const categoryMatch = p.category?.toLowerCase().includes(q);
        const techMatch = p.techStack?.some((t) => t.toLowerCase().includes(q));
        const creatorMatch = p.creator?.name?.toLowerCase().includes(q);
        return titleMatch || descMatch || taglineMatch || categoryMatch || techMatch || creatorMatch;
      });
    }

    // Sorting logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'sales') {
      result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    return result;
  }, [allProjects, activeCategory, searchQuery, sortBy]);

  // Scroll fix: Ensure Lenis is started and recalculated on route mount & state updates
  useEffect(() => {
    if (lenis) {
      lenis.start();
      lenis.resize();
    }
    const timer = setTimeout(() => {
      if (lenis) {
        lenis.resize();
      }
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [lenis, activeCategory, searchQuery, sortBy, viewMode, filteredProjects.length]);

  const setupProjectAnimations = () => {
    const ctx = gsap.context(() => {
      if (!isLoading && viewMode === 'stack') {
        projectRefs.current.slice(0, -1).forEach((projectRef, index) => {
          if (!projectRef) return;
          gsap.set(projectRef, { yPercent: 0 });
          gsap
            .timeline({
              scrollTrigger: {
                id: `projectRef-${index}`,
                trigger: rootRef.current,
                start: `top+=${windowSize.height * index}`,
                end: () => `+=${Math.max(1, projectRefs.current.length - 2) * windowSize.height}`,
                scrub: true,
                scroller: document?.querySelector('main'),
                invalidateOnRefresh: true,
              },
            })
            .to(projectRef, {
              yPercent: 100,
              stagger: 1,
            });
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupProjectAnimations();
    return () => {
      ctx.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.id?.startsWith('projectRef-')) {
          t.kill();
        }
      });
    };
  }, [isLoading, windowSize.height, viewMode, filteredProjects.length]);

  return (
    <>
      <CustomHead {...seo} />
      <section className={clsx(styles.titleContainer, 'layout-block-inner')}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={clsx(styles.title, 'h1')}>Homies Mart</h1>
            <p className={clsx(styles.headerSubtitle, 'p-l')}>
              Discover verified, ready-to-build engineering solutions, full-stack applications, AI models, and hardware blueprints across 8 domain subsections.
            </p>
          </div>
        </div>

        {/* Mart Search & Controls */}
        <div className={styles.marketplaceControls}>
          <div className={styles.searchAndSortRow}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search Homies Mart by tech stack, problem, or domain (e.g. Next.js, PyTorch, ESP32, Verilog)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.sortAndToggle}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect} aria-label="Sort projects">
                <option value="trending">Trending & Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="sales">Most Purchased</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <button type="button" onClick={() => setViewMode(viewMode === 'grid' ? 'stack' : 'grid')} className={styles.viewToggleButton} aria-label="Toggle View Mode">
                {viewMode === 'grid' ? '☰ Cinematic View' : '⊞ Grid View'}
              </button>
            </div>
          </div>

          {/* Domain Subsections Category Tabs */}
          <div className={styles.categoryTabs} role="tablist">
            {MARKETPLACE_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.slug] ?? 0;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={clsx(styles.categoryTab, isActive && styles.activeCategoryTab)}
                >
                  <span className={styles.tabIcon}>
                    <CategoryIcon slug={cat.slug} />
                  </span>
                  <span>{cat.name}</span>
                  {count > 0 && <span style={{ opacity: 0.65, fontSize: '0.85em', marginLeft: '0.15rem' }}>({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Homies Mart Listing */}
      <section ref={rootRef} className={clsx(styles.root, 'layout-block-inner')}>
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className="h3">No projects found in this domain</h3>
            <p className="p">Try adjusting your search terms or selecting &quot;All Categories&quot; to explore other domains.</p>
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Multi-column Grid View with Image Placeholders */
          <div className={styles.gridContainer}>
            {filteredProjects.map((project) => (
              <Link key={project.id} href={project.link || `/projects/${project.id}`} scroll={false} className={styles.gridCard}>
                <div className={styles.gridCardMedia}>
                  {/* Change 3c & 4: Image Placeholder Slot */}
                  <ProjectImagePlaceholder aspectRatio="16/9" label="Project Image" sublabel="Add Image" />
                  {project.category && <span className={clsx(styles.gridCardBadge, 'p-xs')}>{project.category}</span>}
                </div>

                <div className={styles.gridCardBody}>
                  <div className={styles.gridCardHeader}>
                    <span className={clsx(styles.gridCategory, 'p-xs')}>{project.projectType || 'Full Project'}</span>
                    {project.rating && <span className={clsx(styles.gridRating, 'p-xs')}>★ {project.rating}</span>}
                  </div>

                  <h4 className={clsx(styles.gridCardTitle, 'h5')}>{project.title}</h4>
                  <p className={clsx(styles.gridCardTagline, 'p-xs')}>{project.tagline || (Array.isArray(project.desc) ? project.desc[0] : project.desc)}</p>

                  {project.techStack && (
                    <div className={styles.gridTechChips}>
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className={clsx(styles.gridTechChip, 'p-xs')}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.gridCardFooter}>
                    <div className={styles.priceBlock}>
                      <span className={clsx(styles.priceValue, 'p-l')}>₹{project.price?.toLocaleString()}</span>
                      {project.originalPrice && <span className={clsx(styles.originalPrice, 'p-xs')}>₹{project.originalPrice?.toLocaleString()}</span>}
                    </div>
                    <span className={clsx(styles.viewDetailsText, 'p-xs')}>View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Cinematic / Stack View with Image Placeholders */
          <div className={styles.innerContainer}>
            {filteredProjects.map((project, index) => (
              <Link aria-label={`Go ${project.title}`} id={project.id} key={project.id} scroll={false} href={project.link || `/projects/${project.id}`} className={clsx(styles.card)}>
                <div
                  style={
                    !isMobile
                      ? {
                          height: index === filteredProjects.length - 1 ? '200svh' : `${200 + 100 * index}svh`,
                          top: index === 0 ? '0px' : '-100svh',
                        }
                      : {
                          height: index === filteredProjects.length - 1 ? '100svh' : `${200 + 100 * index}svh`,
                          top: index === 0 ? '0px' : '-50svh',
                        }
                  }
                  className={styles.projectsWrap}
                >
                  <div className={clsx(styles.container, 'layout-grid-inner')}>
                    <div className={styles.projectsDetails}>
                      <div className={styles.marketplaceBadgesRow}>
                        <span className={clsx(styles.badgeTag, 'p-xs')}>{project.category}</span>
                        {project.price && <span className={clsx(styles.priceHighlight, 'p-xs')}>₹{project.price.toLocaleString()}</span>}
                        {project.rating && <span className={clsx(styles.badgeTag, 'p-xs')}>★ {project.rating}</span>}
                      </div>

                      <h3 className={clsx(styles.text, 'h3')}>{project.title}</h3>

                      {project.tagline && <h6 className={clsx(styles.text, 'p-l')}>{project.tagline}</h6>}

                      {project.techStack && (
                        <div className={styles.techPillsRow}>
                          {project.techStack.slice(0, 5).map((tech) => (
                            <span key={tech} className={clsx(styles.techPill, 'p-xs')}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.imageContainer}>
                      <ProjectImagePlaceholder aspectRatio="16/9" label="Project Image" sublabel="Add Image" />
                    </div>
                  </div>
                </div>

                <div
                  ref={(el) => {
                    projectRefs.current[index] = el;
                  }}
                  className={styles.canvas}
                >
                  <ProjectImagePlaceholder
                    aspectRatio="fill"
                    label="Project Image"
                    sublabel="Add Image"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius:
                        index === 0
                          ? 'var(--layout-columns-gap) var(--layout-columns-gap) 0 0'
                          : index === filteredProjects.length - 1
                            ? '0 0 var(--layout-columns-gap) var(--layout-columns-gap)'
                            : '0',
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
