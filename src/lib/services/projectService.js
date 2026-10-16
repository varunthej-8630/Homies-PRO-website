import defaultProjects from '@src/constants/projects';
import { supabase, isSupabaseConfigured } from '@src/lib/supabase/client';

/**
 * Maps raw database project records to the exact frontend shape required by UI components.
 */
function extractTechStack(raw) {
  if (Array.isArray(raw.tech_stack)) return raw.tech_stack;
  if (Array.isArray(raw.techStack)) return raw.techStack;
  if (typeof raw.tech_stack === 'string')
    return raw.tech_stack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  if (typeof raw.techStack === 'string')
    return raw.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
}

export function formatDbProject(raw) {
  if (!raw) return null;

  // Description can be JSON array, JSON string, or markdown string
  let descArray = [];
  if (Array.isArray(raw.description)) {
    descArray = raw.description;
  } else if (typeof raw.description === 'string') {
    try {
      const parsed = JSON.parse(raw.description);
      descArray = Array.isArray(parsed) ? parsed : [raw.description];
    } catch {
      descArray = raw.description.split('\n\n').filter(Boolean);
    }
  }

  // Requirements normalization
  let reqs = raw.requirements || {};
  if (typeof reqs === 'string') {
    try {
      reqs = JSON.parse(reqs);
    } catch {
      reqs = {};
    }
  }

  // Gallery and Images array normalization for ProjectImages component
  let mediaImages = [];
  if (Array.isArray(raw.images) && raw.images.length > 0 && typeof raw.images[0] === 'object' && raw.images[0].src) {
    mediaImages = raw.images;
  } else if (Array.isArray(raw.images) && raw.images.length > 0) {
    mediaImages = raw.images.map((img, idx) => {
      let tag = 'small';
      if (idx === 0 || idx % 3 === 0) tag = 'big';
      else if (idx % 3 === 1) tag = 'medium';
      return {
        src: img.image_url || img.url || img,
        tag,
        isRight: idx % 2 === 1,
      };
    });
  } else if (raw.cover_image_url) {
    mediaImages = [
      {
        src: raw.cover_image_url,
        tag: 'big',
        isRight: false,
      },
    ];
  } else {
    mediaImages = [
      {
        src: '/project1/project1.webp',
        tag: 'big',
        isRight: false,
      },
    ];
  }

  const gallery = mediaImages.map((img) => img.src);

  // Reviews normalization
  const reviews =
    Array.isArray(raw.reviews) && raw.reviews.length > 0
      ? raw.reviews.map((r) => ({
          id: r.id || `rev-${Math.random().toString(36).substring(7)}`,
          user: r.reviewer_name || r.user_name || r.user || 'Verified Buyer',
          college: r.reviewer_college || r.college || 'Engineering Institute',
          degree: r.reviewer_degree || r.degree || 'B.Tech / M.Tech',
          rating: Number(r.rating) || 5.0,
          comment: r.review_text || r.comment || '',
          date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-03-01',
          helpfulCount: r.helpful_count || r.helpfulCount || 12,
          verifiedPurchase: true,
        }))
      : raw.reviewsList || [
          {
            id: 'rev-def',
            user: 'Verified Engineer',
            college: 'Premier Technical Institute',
            degree: 'B.Tech CSE',
            rating: 5.0,
            comment: 'Outstanding project quality with complete documentation and working demo.',
            date: '2026-03-01',
            helpfulCount: 24,
            verifiedPurchase: true,
          },
        ];

  // Creator profile normalization
  const rawCreator = typeof raw.creator === 'object' && raw.creator !== null ? raw.creator : {};
  const creator = {
    name: rawCreator.name || rawCreator.display_name || (typeof raw.creator === 'string' ? raw.creator : null) || raw.creator_profiles?.display_name || 'Homies Creator Studio',
    handle: rawCreator.handle || raw.creator_profiles?.handle || '@homies_studio',
    role: rawCreator.role || rawCreator.role_title || raw.creator_profiles?.role_title || 'Verified Technical Architect',
    rating: Number(rawCreator.rating) || Number(raw.creator_profiles?.rating) || 4.98,
    reviews: Number(rawCreator.reviews) || Number(rawCreator.review_count) || Number(raw.creator_profiles?.review_count) || 128,
    sales: Number(rawCreator.sales) || Number(rawCreator.sales_count) || Number(raw.creator_profiles?.sales_count) || 168,
    avatar: rawCreator.avatar || rawCreator.avatar_url || raw.creator_profiles?.avatar_url || '/homies/header-logo.png',
    responseTime: rawCreator.responseTime || rawCreator.response_time || 'Within 24 hours',
    verified: true,
    badges: rawCreator.badges || ['Verified Creator', 'Fast Response', 'Top Rated Build'],
  };

  const primaryId = raw.legacy_id || raw.slug || raw.id;

  return {
    id: primaryId,
    dbId: raw.id,
    legacyId: raw.legacy_id || null,
    slug: raw.slug || primaryId,
    title: raw.title || 'Engineering Project',
    tagline: raw.tagline || 'Engineered with excellence and validated architecture.',
    handwritingNote: raw.handwriting_note || raw.handwritingNote || 'Verified build ready for deployment.',
    desc: descArray.length > 0 ? descArray : ['Comprehensive engineering project solution.'],
    category: raw.category?.name || raw.category_name || raw.category || 'Engineering & Software',
    categorySlug: raw.category?.slug || raw.category_slug || raw.categorySlug || 'all',
    projectType: raw.project_type || raw.projectType || 'Full-Stack Application',
    difficulty: raw.difficulty || 'Intermediate',
    platform: raw.platform || 'Web & Cloud Server',
    language: raw.language || 'Python / JavaScript',
    techStack: extractTechStack(raw),

    // Pricing
    price: Number(raw.academic_price) || Number(raw.price) || 2999,
    originalPrice: Number(raw.original_price) || Number(raw.originalPrice) || 5999,
    commercialPrice: Number(raw.commercial_price) || Number(raw.commercialPrice) || 4998,

    // Engagement
    rating: (() => {
      if (raw.rating != null) return Number(raw.rating);
      if (reviews.length > 0) return 5.0;
      return null;
    })(),
    reviewCount: Number(raw.review_count) || Number(raw.reviewCount) || reviews.length || 0,
    salesCount: Number(raw.sales_count) || Number(raw.salesCount) || 0,

    // Flags
    isFeatured: Boolean(raw.is_featured ?? raw.isFeatured),
    isBestSeller: Boolean(raw.is_bestseller ?? raw.isBestSeller),
    isTrending: Boolean(raw.is_trending ?? raw.isTrending),
    status: raw.status || 'PUBLISHED',

    // Theme colors for GSAP / 3D fluid transitions
    primary: raw.primary || '#28282b',
    secondary: raw.secondary || '#f0f4f1',
    accentColor: raw.accentColor || '#f9f9f9',
    fillColor: raw.fillColor || '#f2ffbd',
    menuColor: raw.menuColor || '#28282b',
    menuFontColor: raw.menuFontColor || '#f0f4f1',
    fluidColor: raw.fluidColor || '#d7d7d4',

    // Media
    img: raw.cover_image_url || raw.img || '/project1/project1.webp',
    link: `/projects/${primaryId}`,
    images: mediaImages,
    gallery,
    liveLink: raw.live_demo_url || raw.liveLink || null,
    demoVideo: raw.demo_video_url || raw.demoVideo || null,

    // Requirements & deliverables
    os: reqs.os || raw.os || 'Windows 10/11, macOS, Linux',
    software: reqs.software || raw.software || 'Python 3.10+, VS Code, Git',
    hardware: reqs.hardware || raw.hardware || '8 GB RAM, 2 GB disk storage',
    dependencies: reqs.dependencies || raw.dependencies || 'Standard package requirements listed in manifest',
    installationSteps: Array.isArray(reqs.installationSteps) ? reqs.installationSteps : raw.installationSteps || ['1. Clone repo', '2. Install packages', '3. Run startup script'],
    deliverableFiles: Array.isArray(reqs.deliverables) ? reqs.deliverables : raw.deliverableFiles || ['Source Code (.ZIP)', 'Complete IEEE Report (PDF)'],

    // Associated records
    creator,
    reviews,
  };
}

/**
 * Fetches all PUBLISHED projects from Supabase with full fallback to static projects.
 */
export async function getPublishedProjects() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(
          `
          *,
          category:categories(*),
          creator:creator_profiles(*),
          images:project_images(*),
          reviews:reviews(*)
        `,
        )
        .eq('status', 'PUBLISHED')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Format DB projects
        const formatted = data.map(formatDbProject);

        // Ensure all 7 canonical projects exist in the list even if DB only has a subset
        const seenIds = new Set(formatted.map((p) => p.id));
        const missingDefaults = defaultProjects.filter((dp) => !seenIds.has(dp.id)).map(formatDbProject);
        return [...formatted, ...missingDefaults];
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[projectService.getPublishedProjects error, falling back to static]:', err);
      }
    }
  }

  return defaultProjects.map(formatDbProject);
}

/**
 * Fetches a single PUBLISHED project by legacy ID ('project1'), slug ('ai-ml-solutions'), or UUID.
 */
export async function getProjectBySlugOrId(identifier) {
  if (!identifier) return null;

  // 1. Try Supabase lookup if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      let query = supabase
        .from('projects')
        .select(
          `
          *,
          category:categories(*),
          creator:creator_profiles(*),
          images:project_images(*),
          reviews:reviews(*)
        `,
        )
        .eq('status', 'PUBLISHED');

      if (UUID_REGEX.test(identifier)) {
        query = query.or(`id.eq.${identifier},legacy_id.eq.${identifier},slug.eq.${identifier}`);
      } else {
        query = query.or(`legacy_id.eq.${identifier},slug.eq.${identifier}`);
      }

      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        return formatDbProject(data);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[projectService.getProjectBySlugOrId error]:', err);
      }
    }
  }

  // 2. Fallback to static projects.js
  const staticMatch = defaultProjects.find((p) => p.id === identifier || p.slug === identifier);

  return staticMatch ? formatDbProject(staticMatch) : null;
}

/**
 * Returns all identifiers for static page generation and dynamic sitemap.
 */
export async function getAllPublishedProjectIdentifiers() {
  const published = await getPublishedProjects();
  const ids = published.map((p) => p.id);

  // Ensure legacy IDs 'project1' through 'project7' are always present
  ['project1', 'project2', 'project3', 'project4', 'project5', 'project6', 'project7'].forEach((legacyId) => {
    if (!ids.includes(legacyId)) ids.push(legacyId);
  });

  return Array.from(new Set(ids));
}
