/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */

import { useMemo, useRef, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { MARKETPLACE_CATEGORIES } from '@src/constants/marketplace';
import defaultProjects from '@src/constants/projects';
import styles from '@src/pages/projects/projects.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';

const seo = {
  title: 'HOMIES STUDIO - Project Marketplace & Discovery',
  description: 'Explore verified, ready-to-build digital projects, machine learning models, full-stack web applications, IoT systems, and VLSI silicon designs crafted by expert creators.',
  keywords: [
    'HOMIES STUDIO Marketplace',
    'Buy Code Projects',
    'AI ML Ready Projects',
    'Full Stack Web Projects',
    'IoT Hardware Prototypes',
    'VLSI Verilog Projects',
    'Python Projects with Source Code',
    'Final Year Projects',
    'Engineering Solutions',
    'Creator Economy',
    'HOMIES STUDIO',
  ],
};

function Page() {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const rootRef = useRef();
  const projectRefs = useRef([]);
  const [isLoading, creatorProjects] = useStore(useShallow((state) => [state.isLoading, state.creatorProjects]));

  const allProjects = creatorProjects && creatorProjects.length > 0 ? creatorProjects : defaultProjects;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [viewMode, setViewMode] = useState('stack'); // 'stack' | 'grid'

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...allProjects];

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.categorySlug === activeCategory || p.category?.toLowerCase().includes(activeCategory));
    }

    // Filter by search query (smart keyword matching)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.desc?.some((d) => d.toLowerCase().includes(q));
        const taglineMatch = p.tagline?.toLowerCase().includes(q);
        const categoryMatch = p.category?.toLowerCase().includes(q);
        const techMatch = p.techStack?.some((t) => t.toLowerCase().includes(q));
        const creatorMatch = p.creator?.name?.toLowerCase().includes(q);
        return titleMatch || descMatch || taglineMatch || categoryMatch || techMatch || creatorMatch;
      });
    }

    // Sorting
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
    return () => ctx.kill();
  }, [isLoading, windowSize.height, viewMode, filteredProjects.length]);

  return (
    <>
      <CustomHead {...seo} />
      <section className={clsx(styles.titleContainer, 'layout-block-inner')}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={clsx(styles.title, 'h1')}>Explore Projects</h1>
            <p className={clsx(styles.headerSubtitle, 'p-l')}>Discover verified, ready-to-build engineering solutions, full-stack applications, AI models, and hardware blueprints.</p>
          </div>
        </div>

        {/* Marketplace Search & Controls */}
        <div className={styles.marketplaceControls}>
          <div className={styles.searchAndSortRow}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search projects by technology, problem, category (e.g. Python, AI, ESP32, Next.js)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.sortAndToggle}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
                <option value="trending">Trending & Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="sales">Most Purchased</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <button type="button" onClick={() => setViewMode(viewMode === 'stack' ? 'grid' : 'stack')} className={styles.viewToggleButton}>
                {viewMode === 'stack' ? '⊞ Grid View' : '☰ Cinematic View'}
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className={styles.categoryTabs}>
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <button key={cat.id} type="button" onClick={() => setActiveCategory(cat.slug)} className={clsx(styles.categoryTab, activeCategory === cat.slug && styles.activeCategoryTab)}>
                {cat.icon ? `${cat.icon} ` : ''}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Listing View */}
      <section ref={rootRef} className={clsx(styles.root, 'layout-block-inner')}>
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className="h3">No projects matched your criteria</h3>
            <p className="p">Try adjusting your search terms or clearing selected category filters.</p>
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
        ) : viewMode === 'stack' ? (
          <div className={styles.innerContainer}>
            {filteredProjects.map((project, index) => (
              <Link aria-label={`Go ${project.title}`} id={project.id} key={project.id} scroll={false} href={project.link} className={clsx(styles.card)}>
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
                      <Image priority={index === 0} sizes="100%" src={project.img || '/project1/project1.webp'} fill alt={project.title} />
                    </div>
                  </div>
                </div>

                <div
                  ref={(el) => {
                    projectRefs.current[index] = el;
                  }}
                  className={styles.canvas}
                >
                  <Image
                    priority={index === 0}
                    sizes="100%"
                    className={index === 0 ? styles.firstCard : index === filteredProjects.length - 1 ? styles.lastCard : undefined}
                    src={project.img || '/project1/project1.webp'}
                    fill
                    alt={project.title}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Multi-column Grid View */
          <div className={styles.gridContainer}>
            {filteredProjects.map((project) => (
              <Link key={project.id} href={project.link} scroll={false} className={styles.gridCard}>
                <div className={styles.gridCardMedia}>
                  <Image src={project.img || '/project1/project1.webp'} fill alt={project.title} sizes="(max-width: 768px) 100vw, 33vw" />
                  {project.category && <span className={clsx(styles.gridCardBadge, 'p-xs')}>{project.category}</span>}
                </div>

                <div className={styles.gridCardBody}>
                  <div className={styles.gridCardHeader}>
                    <span className={clsx(styles.gridCategory, 'p-xs')}>{project.projectType || 'Full Project'}</span>
                    {project.rating && <span className={clsx(styles.gridRating, 'p-xs')}>★ {project.rating}</span>}
                  </div>

                  <h4 className={clsx(styles.gridCardTitle, 'h5')}>{project.title}</h4>
                  <p className={clsx(styles.gridCardTagline, 'p-xs')}>{project.tagline || project.desc?.[0]}</p>

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
        )}
      </section>
    </>
  );
}

export default Page;
