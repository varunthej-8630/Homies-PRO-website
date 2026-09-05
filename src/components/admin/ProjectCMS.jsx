/* eslint-disable */
/* eslint-disable react/no-array-index-key */
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import clsx from 'clsx';
import { supabase } from '@src/lib/supabase/client';
import { MARKETPLACE_CATEGORIES } from '@src/constants/marketplace';
import defaultProjects from '@src/constants/projects';
import styles from './styles/projectCMS.module.scss';

const AVAILABLE_DELIVERABLES = [
  'Source Code (.ZIP)',
  'IEEE Format Thesis Report (PDF)',
  'Project Presentation Slides (.PPTX)',
  'Setup & Installation Video (.MP4)',
  'Hardware Circuit Schematics & PCB Gerbers',
  'Pre-trained Model Weights & Datasets',
  'Software Architecture & API Documentation',
  '1-on-1 Deployment Support',
];

function generateSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProjectCMS({ onProjectUpdated }) {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savingMode, setSavingMode] = useState(null); // 'DRAFT' | 'PUBLISHED'
  const [editorError, setEditorError] = useState('');

  // Action Button Interactive Feedback
  const [activeAction, setActiveAction] = useState({ id: null, type: null, label: null });

  // Delete Confirmation Modal State
  const [deleteModalProject, setDeleteModalProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Change Notes Modal
  const [statusModalProject, setStatusModalProject] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Form State
  const initialFormState = {
    title: '',
    slug: '',
    legacyId: '',
    tagline: '',
    handwritingNote: 'Verified build ready for deployment.',
    description: '',
    categoryId: '',
    projectType: 'Full-Stack Application',
    difficulty: 'Intermediate',
    platform: 'Web & Cloud Server',
    language: 'Python 3.10+ / Next.js',
    techStack: '',
    academicPrice: 2999,
    commercialPrice: 4998,
    originalPrice: 5999,
    isFeatured: false,
    isBestSeller: false,
    isTrending: false,
    status: 'DRAFT',
    coverImageUrl: '/project1/project1.webp',
    galleryUrls: '',
    liveDemoUrl: '',
    demoVideoUrl: '',
    os: 'Windows 10/11, macOS, Linux',
    software: 'Python 3.10+, VS Code, Git',
    hardware: '8 GB RAM, 2 GB disk storage',
    dependencies: 'Listed in package manifest',
    installationSteps: '1. Extract repository files\n2. Install dependencies via npm/pip\n3. Run development / start command',
    selectedDeliverables: ['Source Code (.ZIP)', 'IEEE Format Thesis Report (PDF)'],
    seoTitle: '',
    seoDescription: '',
    ogImageUrl: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe Background Scroll Locking
  useEffect(() => {
    if (!isMounted) return;
    const isAnyModalOpen = Boolean(isEditorOpen || deleteModalProject || statusModalProject);

    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      if (typeof window !== 'undefined' && window.lenis) {
        window.lenis.stop();
      }

      return () => {
        document.body.style.overflow = originalOverflow || '';
        document.body.style.paddingRight = originalPaddingRight || '';
        if (typeof window !== 'undefined' && window.lenis) {
          window.lenis.start();
        }
      };
    }
  }, [isMounted, isEditorOpen, deleteModalProject, statusModalProject]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isEditorOpen && !isSaving) setIsEditorOpen(false);
        if (deleteModalProject && !isDeleting) setDeleteModalProject(null);
        if (statusModalProject) setStatusModalProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditorOpen, isSaving, deleteModalProject, isDeleting, statusModalProject]);

  const fetchProjectsData = async () => {
    try {
      setLoading(true);

      // Fetch Categories
      if (supabase) {
        const { data: catData } = await supabase.from('categories').select('*').order('name');
        if (catData && catData.length > 0) {
          setCategories(catData);
        } else {
          setCategories(
            MARKETPLACE_CATEGORIES.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
            })),
          );
        }

        // Fetch Projects
        const { data: projData, error } = await supabase.from('projects').select('*, creator_profiles(display_name, handle), categories(name, slug)').order('created_at', { ascending: false });

        if (!error && projData && projData.length > 0) {
          setProjects(projData);
        } else {
          // Fallback to in-memory default projects
          setProjects(
            defaultProjects.map((p, i) => ({
              id: p.id,
              legacy_id: p.id.startsWith('project') ? p.id : `project${i + 1}`,
              title: p.name || p.title,
              slug: p.slug || generateSlug(p.name || p.title),
              category_name: p.category,
              academic_price: p.price || 2999,
              commercial_price: p.commercialPrice || 4998,
              status: 'PUBLISHED',
              cover_image_url: p.image || `/project${i + 1}/project${i + 1}.webp`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              creator_profiles: {
                display_name: p.creator?.name || 'Homies Studio',
                handle: p.creator?.handle || 'homies_studio',
              },
            })),
          );
        }
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, []);

  // Filtered list based on Search, Category & Status
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.legacy_id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'ALL' || p.category_id === selectedCategory || p.categories?.slug === selectedCategory || p.category_name?.toLowerCase() === selectedCategory.toLowerCase();

      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

      return matchSearch && matchCat && matchStatus;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus]);

  // Open Editor for Creating New Project
  const handleOpenCreate = () => {
    setActiveAction({ id: 'create', type: 'create', label: 'Opening...' });
    setEditingProjectId(null);
    setFormData({
      ...initialFormState,
      categoryId: categories[0]?.id || '',
    });
    setEditorError('');
    setIsEditorOpen(true);
    setTimeout(() => setActiveAction({ id: null, type: null, label: null }), 300);
  };

  // Open Editor for Existing Project
  const handleOpenEdit = (p) => {
    setActiveAction({ id: p.id, type: 'edit', label: 'Opening...' });
    setEditingProjectId(p.id);

    let parsedDesc = '';
    if (Array.isArray(p.description)) {
      parsedDesc = p.description.join('\n\n');
    } else if (typeof p.description === 'string') {
      try {
        const arr = JSON.parse(p.description);
        parsedDesc = Array.isArray(arr) ? arr.join('\n\n') : p.description;
      } catch {
        parsedDesc = p.description;
      }
    }

    let reqs = p.requirements || {};
    if (typeof reqs === 'string') {
      try {
        reqs = JSON.parse(reqs);
      } catch {
        reqs = {};
      }
    }

    setFormData({
      title: p.title || '',
      slug: p.slug || '',
      legacyId: p.legacy_id || '',
      tagline: p.tagline || '',
      handwritingNote: p.handwriting_note || 'Verified build ready for deployment.',
      description: parsedDesc,
      categoryId: p.category_id || categories[0]?.id || '',
      projectType: p.project_type || 'Full-Stack Application',
      difficulty: p.difficulty || 'Intermediate',
      platform: p.platform || 'Web & Cloud Server',
      language: p.language || 'Python 3.10+ / Next.js',
      techStack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : '',
      academicPrice: p.academic_price || 2999,
      commercialPrice: p.commercial_price || 4998,
      originalPrice: p.original_price || 5999,
      isFeatured: Boolean(p.is_featured),
      isBestSeller: Boolean(p.is_bestseller),
      isTrending: Boolean(p.is_trending),
      status: p.status || 'DRAFT',
      coverImageUrl: p.cover_image_url || '/project1/project1.webp',
      galleryUrls: Array.isArray(p.gallery_urls) ? p.gallery_urls.join('\n') : '',
      liveDemoUrl: p.live_demo_url || '',
      demoVideoUrl: p.demo_video_url || '',
      os: reqs.os || 'Windows 10/11, macOS, Linux',
      software: reqs.software || 'Python 3.10+, VS Code, Git',
      hardware: reqs.hardware || '8 GB RAM, 2 GB disk storage',
      dependencies: reqs.dependencies || 'Listed in package manifest',
      installationSteps: Array.isArray(reqs.installationSteps) ? reqs.installationSteps.join('\n') : '1. Extract repository files\n2. Install dependencies via npm/pip\n3. Run start command',
      selectedDeliverables: Array.isArray(reqs.deliverables) && reqs.deliverables.length > 0 ? reqs.deliverables : ['Source Code (.ZIP)', 'IEEE Format Thesis Report (PDF)'],
      seoTitle: p.seo_title || `${p.title || ''} — Homies Studio Project`,
      seoDescription: p.seo_description || p.tagline || '',
      ogImageUrl: p.og_image_url || p.cover_image_url || '',
    });

    setEditorError('');
    setIsEditorOpen(true);
    setTimeout(() => setActiveAction({ id: null, type: null, label: null }), 300);
  };

  // Revalidate ISR on-demand
  const triggerRevalidation = async (targetSlug) => {
    try {
      const paths = ['/', '/mart', `/projects/${targetSlug}`];
      if (formData.legacyId) {
        paths.push(`/projects/${formData.legacyId}`);
      }
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths }),
      });
    } catch {
      // Non-blocking revalidation attempt
    }
  };

  // Save Project Form
  const handleSave = async (desiredStatus) => {
    if (!formData.title.trim()) {
      setEditorError('Project Title is required.');
      return;
    }

    const finalSlug = formData.slug.trim() || generateSlug(formData.title);
    if (!finalSlug) {
      setEditorError('A valid URL slug is required.');
      return;
    }

    // Slug collision validation
    const duplicate = projects.find((p) => p.slug === finalSlug && p.id !== editingProjectId);
    if (duplicate) {
      setEditorError(`Slug "${finalSlug}" is already in use by "${duplicate.title}". Please choose a unique slug.`);
      return;
    }

    try {
      setIsSaving(true);
      setSavingMode(desiredStatus);
      setEditorError('');

      const descArray = formData.description
        .split('\n\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const techStackArray = formData.techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const installStepsArray = formData.installationSteps
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const requirementsObj = {
        os: formData.os,
        software: formData.software,
        hardware: formData.hardware,
        dependencies: formData.dependencies,
        installationSteps: installStepsArray,
        deliverables: formData.selectedDeliverables,
      };

      const payload = {
        title: formData.title.trim(),
        slug: finalSlug,
        tagline: formData.tagline.trim(),
        handwriting_note: formData.handwritingNote.trim(),
        description: descArray.length > 0 ? descArray : [formData.tagline || formData.title],
        category_id: formData.categoryId || null,
        project_type: formData.projectType,
        difficulty: formData.difficulty,
        platform: formData.platform,
        language: formData.language,
        tech_stack: techStackArray,
        academic_price: Number(formData.academicPrice) || 2999,
        commercial_price: Number(formData.commercialPrice) || 4998,
        original_price: Number(formData.originalPrice) || 5999,
        is_featured: formData.isFeatured,
        is_bestseller: formData.isBestSeller,
        is_trending: formData.isTrending,
        status: desiredStatus || formData.status,
        cover_image_url: formData.coverImageUrl || '/project1/project1.webp',
        live_demo_url: formData.liveDemoUrl.trim() || null,
        demo_video_url: formData.demoVideoUrl.trim() || null,
        requirements: requirementsObj,
        published_at: desiredStatus === 'PUBLISHED' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      // If existing legacy project, preserve legacy_id
      if (formData.legacyId) {
        payload.legacy_id = formData.legacyId;
      }

      if (editingProjectId) {
        // Update
        if (supabase) {
          const { error } = await supabase.from('projects').update(payload).eq('id', editingProjectId);
          if (error) throw error;
        }
        showToast(`✓ Project "${payload.title}" updated successfully (${desiredStatus}).`);
      } else {
        // Insert
        if (supabase) {
          const { error } = await supabase.from('projects').insert([payload]);
          if (error) throw error;
        }
        showToast(`✓ New project "${payload.title}" created successfully (${desiredStatus}).`);
      }

      await triggerRevalidation(finalSlug);
      setIsEditorOpen(false);
      fetchProjectsData();
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      console.error('Error saving project:', err);
      setEditorError(err.message || 'Failed to save project. Please check fields and try again.');
    } finally {
      setIsSaving(false);
      setSavingMode(null);
    }
  };

  // Toggle Publish / Unpublish directly from Table
  const handleTogglePublish = async (p) => {
    const isCurrentlyPublished = p.status === 'PUBLISHED';
    const nextStatus = isCurrentlyPublished ? 'DRAFT' : 'PUBLISHED';
    const actionKey = `${isCurrentlyPublished ? 'unpublish' : 'publish'}-${p.id}`;

    try {
      setActiveAction({ id: p.id, type: nextStatus, label: isCurrentlyPublished ? 'Unpublishing...' : 'Publishing...' });
      if (supabase) {
        const { error } = await supabase
          .from('projects')
          .update({
            status: nextStatus,
            published_at: nextStatus === 'PUBLISHED' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', p.id);

        if (error) throw error;
      }

      await triggerRevalidation(p.legacy_id || p.slug);
      showToast(`✓ Project "${p.title}" is now ${nextStatus}.`);
      fetchProjectsData();
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      showToast(`✕ Error updating status: ${err.message}`);
    } finally {
      setActiveAction({ id: null, type: null, label: null });
    }
  };

  // Delete project confirmation
  const handleConfirmDelete = async () => {
    if (!deleteModalProject) return;
    try {
      setIsDeleting(true);
      if (supabase) {
        const { error } = await supabase.from('projects').delete().eq('id', deleteModalProject.id);
        if (error) throw error;
      }
      await triggerRevalidation(deleteModalProject.legacy_id || deleteModalProject.slug);
      showToast(`✓ Project "${deleteModalProject.title}" deleted.`);
      setDeleteModalProject(null);
      fetchProjectsData();
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      showToast(`✕ Failed to delete project: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Status with notes submission
  const handleSaveStatusWithNotes = async () => {
    if (!statusModalProject) return;
    try {
      if (supabase) {
        const { error } = await supabase
          .from('projects')
          .update({
            status: targetStatus,
            admin_notes: adminNotes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', statusModalProject.id);

        if (error) throw error;
      }
      showToast(`✓ Status updated to ${targetStatus} with feedback notes.`);
      setStatusModalProject(null);
      fetchProjectsData();
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      showToast(`✕ Error: ${err.message}`);
    }
  };

  const getStatusColor = (st) => {
    switch (st) {
      case 'PUBLISHED':
        return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
      case 'DRAFT':
        return { background: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb' };
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
      case 'CHANGES_REQUESTED':
        return { background: '#ffedd5', color: '#c2410c', border: '1px solid #fed7aa' };
      case 'APPROVED':
        return { background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' };
      case 'REJECTED':
        return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
      default:
        return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
    }
  };

  const isLegacy = Boolean(formData.legacyId);
  const previewSlug = formData.legacyId || formData.slug || 'project-slug';

  return (
    <div className={styles.cmsRoot}>
      {/* ACTION BAR: Search, Filters & Add Project */}
      <div className={styles.actionBar}>
        <div className={styles.searchAndFilters}>
          <input type="text" placeholder="Search projects by title, slug, or legacy ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={styles.filterSelect}>
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={styles.filterSelect}>
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
            <option value="SUBMITTED">Submitted / In Review</option>
            <option value="CHANGES_REQUESTED">Changes Requested</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <button type="button" onClick={handleOpenCreate} className={styles.addBtn} disabled={activeAction.type === 'create'}>
          <span>+</span>
          <span>{activeAction.type === 'create' ? 'Opening...' : 'Add Project'}</span>
        </button>
      </div>

      {/* PROJECTS TABLE */}
      <div className={styles.tableCard}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Loading projects catalog from database...</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>No matching projects found</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing filters or add a new project.</p>
          </div>
        ) : (
          <table className={styles.projectTable}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Status</th>
                <th>Pricing</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => {
                const isItemActionActive = activeAction.id === p.id;
                const isEditingThis = isItemActionActive && activeAction.type === 'edit';
                const isPublishingThis = isItemActionActive && (activeAction.type === 'PUBLISHED' || activeAction.type === 'DRAFT');

                return (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.projectInfoCell}>
                        <img src={p.cover_image_url || '/project1/project1.webp'} alt={p.title} className={styles.thumb} />
                        <div className={styles.titleBlock}>
                          <div className={styles.projectTitle}>
                            {p.title}
                            {p.legacy_id && (
                              <span
                                style={{
                                  marginLeft: '0.5rem',
                                  fontSize: '0.65rem',
                                  background: '#e0e7ff',
                                  color: '#3730a3',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '4px',
                                  fontWeight: 700,
                                }}
                              >
                                LEGACY ({p.legacy_id})
                              </span>
                            )}
                          </div>
                          <span className={styles.projectSlug}>/projects/{p.legacy_id || p.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.categories?.name || p.category_name || 'Engineering'}</span>
                    </td>

                    <td>
                      <span className={styles.statusPill} style={getStatusColor(p.status)}>
                        {p.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        <strong>₹{Number(p.academic_price || 2999).toLocaleString('en-IN')}</strong>
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem', marginLeft: '0.3rem' }}>(₹{Number(p.commercial_price || 4998).toLocaleString('en-IN')})</span>
                      </div>
                    </td>

                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {new Date(p.updated_at || p.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td>
                      <div className={styles.actionButtonGroup} style={{ justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => handleOpenEdit(p)} className={clsx(styles.btnSmall, isEditingThis && styles.btnActive)} disabled={isItemActionActive}>
                          {isEditingThis ? 'Opening...' : 'Edit'}
                        </button>

                        <Link href={`/projects/${p.legacy_id || p.slug}`} target="_blank" className={styles.btnSmall} title="Preview live or draft project page">
                          Preview ↗
                        </Link>

                        {p.status === 'PUBLISHED' ? (
                          <button type="button" onClick={() => handleTogglePublish(p)} className={clsx(styles.btnSmall, styles.btnUnpublish)} disabled={isItemActionActive}>
                            {isPublishingThis ? activeAction.label : 'Unpublish'}
                          </button>
                        ) : (
                          <button type="button" onClick={() => handleTogglePublish(p)} className={clsx(styles.btnSmall, styles.btnPublish)} disabled={isItemActionActive}>
                            {isPublishingThis ? activeAction.label : 'Publish'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setStatusModalProject(p);
                            setTargetStatus(p.status);
                            setAdminNotes(p.admin_notes || '');
                          }}
                          className={styles.btnSmall}
                          title="Change moderation status & add notes"
                        >
                          Status
                        </button>

                        <button type="button" onClick={() => setDeleteModalProject(p)} className={clsx(styles.btnSmall, styles.btnDelete)} disabled={isItemActionActive}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ==============================================================================
          PROJECT EDITOR MODAL (Structured 6 Sections, Fixed Header/Footer, Full Scroll)
         ============================================================================== */}
      {isMounted &&
        isEditorOpen &&
        createPortal(
          <div
            className={styles.modalBackdrop}
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSaving) {
                setIsEditorOpen(false);
              }
            }}
          >
            <div className={styles.editorModal}>
              {/* FIXED MODAL HEADER */}
              <div className={styles.modalHeader}>
                <div className={styles.headerTitleGroup}>
                  <h3>{editingProjectId ? `Edit Project — ${formData.title || 'Untitled'}` : 'Create New Engineering Project'}</h3>
                  {isLegacy && (
                    <span style={{ fontSize: '0.7rem', background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }}>
                      LOCKED ROUTE (/projects/{formData.legacyId})
                    </span>
                  )}
                </div>
                <button type="button" onClick={() => setIsEditorOpen(false)} className={styles.closeBtn} title="Close editor (Esc)" aria-label="Close modal" disabled={isSaving}>
                  ✕
                </button>
              </div>

              {/* SCROLLABLE MODAL CONTENT (Sections A through F) */}
              <div className={styles.modalBody}>
                {editorError && (
                  <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '0.85rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {editorError}
                  </div>
                )}

                {/* SECTION A: Basic Info */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>Section A — Basic Information</div>
                  <div className={styles.formGrid}>
                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                      <label htmlFor="proj_title">Project Title *</label>
                      <input
                        id="proj_title"
                        type="text"
                        placeholder="e.g. Autonomous Edge-AI Drone Vision System"
                        value={formData.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            title: newTitle,
                            slug: prev.legacyId ? prev.slug : prev.slug === generateSlug(prev.title) ? generateSlug(newTitle) : prev.slug,
                            seoTitle: `${newTitle} — Homies Studio Project`,
                          }));
                        }}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="proj_slug">URL Slug * (Unique routing key)</label>
                      <input
                        id="proj_slug"
                        type="text"
                        placeholder="e.g. edge-ai-drone-vision"
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))}
                      />
                      <span className={styles.fieldNote}>{isLegacy ? `Canonical URL remains locked to /projects/${formData.legacyId}` : `Public URL: /projects/${formData.slug || 'slug'}`}</span>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="proj_cat">Category *</label>
                      <select id="proj_cat" value={formData.categoryId} onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                      <label htmlFor="proj_tagline">Tagline / Short Description</label>
                      <input
                        id="proj_tagline"
                        type="text"
                        placeholder="Brief 1-sentence value proposition shown on cards"
                        value={formData.tagline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                      />
                    </div>

                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                      <label htmlFor="proj_desc">Full Technical Description (Paragraphs separated by blank lines)</label>
                      <textarea
                        id="proj_desc"
                        rows={5}
                        placeholder="Comprehensive project description explaining architecture, problem statement, and engineering methodology..."
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="proj_type">Project Type</label>
                      <input
                        id="proj_type"
                        type="text"
                        placeholder="e.g. Edge AI & Computer Vision"
                        value={formData.projectType}
                        onChange={(e) => setFormData((prev) => ({ ...prev, projectType: e.target.value }))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="proj_diff">Difficulty Level</label>
                      <select id="proj_diff" value={formData.difficulty} onChange={(e) => setFormData((prev) => ({ ...prev, difficulty: e.target.value }))}>
                        <option value="Beginner Friendly">Beginner Friendly</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Industry Grade">Industry Grade</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="proj_plat">Platform / Hardware</label>
                      <input
                        id="proj_plat"
                        type="text"
                        placeholder="e.g. Linux / Jetson / Raspberry Pi / Web"
                        value={formData.platform}
                        onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="proj_lang">Primary Language</label>
                      <input
                        id="proj_lang"
                        type="text"
                        placeholder="e.g. Python 3.10+ / C++"
                        value={formData.language}
                        onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
                      />
                    </div>

                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                      <label htmlFor="proj_tech">Tech Stack (Comma separated tags)</label>
                      <input
                        id="proj_tech"
                        type="text"
                        placeholder="PyTorch, OpenCV, TensorRT, FastAPI, Docker, ROS 2"
                        value={formData.techStack}
                        onChange={(e) => setFormData((prev) => ({ ...prev, techStack: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION B: Technical & System Requirements */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>Section B — Technical &amp; System Requirements</div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="req_os">Operating System</label>
                      <input
                        id="req_os"
                        type="text"
                        placeholder="Windows 10/11, Ubuntu 22.04 LTS, macOS"
                        value={formData.os}
                        onChange={(e) => setFormData((prev) => ({ ...prev, os: e.target.value }))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="req_soft">Required Software / Tools</label>
                      <input
                        id="req_soft"
                        type="text"
                        placeholder="Python 3.10+, VS Code, Docker Desktop"
                        value={formData.software}
                        onChange={(e) => setFormData((prev) => ({ ...prev, software: e.target.value }))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="req_hard">Hardware Prerequisites</label>
                      <input
                        id="req_hard"
                        type="text"
                        placeholder="8 GB RAM, 2 GB disk storage, Optional GPU"
                        value={formData.hardware}
                        onChange={(e) => setFormData((prev) => ({ ...prev, hardware: e.target.value }))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="req_dep">Dependencies</label>
                      <input
                        id="req_dep"
                        type="text"
                        placeholder="Standard package requirements listed in requirements.txt"
                        value={formData.dependencies}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dependencies: e.target.value }))}
                      />
                    </div>

                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                      <label htmlFor="req_inst">Installation Steps (1 per line)</label>
                      <textarea
                        id="req_inst"
                        rows={4}
                        placeholder="1. Clone repository\n2. Run pip install -r requirements.txt\n3. Start local API server"
                        value={formData.installationSteps}
                        onChange={(e) => setFormData((prev) => ({ ...prev, installationSteps: e.target.value }))}
                      />
                    </div>

                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                      <label>Package Deliverables Checklist</label>
                      <div className={styles.checkboxGrid}>
                        {AVAILABLE_DELIVERABLES.map((item) => {
                          const isChecked = formData.selectedDeliverables.includes(item);
                          return (
                            <label key={item} className={styles.checkLabel}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      selectedDeliverables: [...prev.selectedDeliverables, item],
                                    }));
                                  } else {
                                    setFormData((prev) => ({
                                      ...prev,
                                      selectedDeliverables: prev.selectedDeliverables.filter((d) => d !== item),
                                    }));
                                  }
                                }}
                              />
                              <span>{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION C: Pricing & Merchandising */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>Section C — Pricing &amp; Merchandising</div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="price_acad">Academic Base Price (₹ INR) *</label>
                      <input id="price_acad" type="number" value={formData.academicPrice} onChange={(e) => setFormData((prev) => ({ ...prev, academicPrice: Number(e.target.value) }))} />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="price_comm">Commercial Enterprise Price (₹ INR) *</label>
                      <input id="price_comm" type="number" value={formData.commercialPrice} onChange={(e) => setFormData((prev) => ({ ...prev, commercialPrice: Number(e.target.value) }))} />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="price_orig">Original / Strikethrough Price (₹ INR)</label>
                      <input id="price_orig" type="number" value={formData.originalPrice} onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: Number(e.target.value) }))} />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Merchandising Highlight Badges</label>
                      <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                        <label className={styles.checkLabel}>
                          <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))} />
                          <span>Featured</span>
                        </label>

                        <label className={styles.checkLabel}>
                          <input type="checkbox" checked={formData.isBestSeller} onChange={(e) => setFormData((prev) => ({ ...prev, isBestSeller: e.target.checked }))} />
                          <span>Best Seller</span>
                        </label>

                        <label className={styles.checkLabel}>
                          <input type="checkbox" checked={formData.isTrending} onChange={(e) => setFormData((prev) => ({ ...prev, isTrending: e.target.checked }))} />
                          <span>Trending</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION D: Media & Deliverables */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>Section D — Media &amp; Visual Assets</div>
                  <div className={styles.formGrid}>
                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                      <label htmlFor="media_cover">Cover Image URL / Path *</label>
                      <input
                        id="media_cover"
                        type="text"
                        placeholder="/project1/project1.webp or Supabase Storage URL"
                        value={formData.coverImageUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, coverImageUrl: e.target.value }))}
                      />
                    </div>

                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                      <label htmlFor="media_gallery">Gallery Images (1 URL per line)</label>
                      <textarea
                        id="media_gallery"
                        rows={3}
                        placeholder="/project1/project1.webp\n/project2/project2.webp"
                        value={formData.galleryUrls}
                        onChange={(e) => setFormData((prev) => ({ ...prev, galleryUrls: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION E: Demos & External Links */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>Section E — Demos &amp; External Links</div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="link_demo">Live Demo URL</label>
                      <input
                        id="link_demo"
                        type="url"
                        placeholder="https://demo-ai.homiesstudio.com"
                        value={formData.liveDemoUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, liveDemoUrl: e.target.value }))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="link_video">Demo Video URL (YouTube / Loom / Drive)</label>
                      <input
                        id="link_video"
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.demoVideoUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, demoVideoUrl: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION F: SEO & Search Preview */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>Section F — SEO &amp; Google Search Snippet Preview</div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="seo_title">SEO Meta Title</label>
                      <input id="seo_title" type="text" value={formData.seoTitle} onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))} />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="seo_desc">SEO Meta Description</label>
                      <input id="seo_desc" type="text" value={formData.seoDescription} onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))} />
                    </div>

                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                      <label>Google Search Result Snippet Mockup</label>
                      <div className={styles.googlePreviewMockup}>
                        <div className={styles.mockupUrl}>
                          <span>https://www.homiesstudio.com</span>
                          <span>›</span>
                          <span>projects</span>
                          <span>›</span>
                          <span>{previewSlug}</span>
                        </div>
                        <div className={styles.mockupTitle}>{formData.seoTitle || `${formData.title || 'Project Title'} — Homies Studio`}</div>
                        <div className={styles.mockupDesc}>
                          {formData.seoDescription || formData.tagline || 'Explore technical engineering details, interactive models, and deliverables crafted by Homies Studio.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FIXED MODAL FOOTER */}
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsEditorOpen(false)} className={styles.btnSmall} disabled={isSaving}>
                  Cancel
                </button>

                <button type="button" onClick={() => handleSave('DRAFT')} className={styles.btnSmall} disabled={isSaving}>
                  {isSaving && savingMode === 'DRAFT' ? 'Saving Draft...' : 'Save Draft'}
                </button>

                <button type="button" onClick={() => handleSave('PUBLISHED')} className={clsx(styles.btnSmall, styles.btnPublish)} disabled={isSaving}>
                  {isSaving && savingMode === 'PUBLISHED' ? 'Publishing to Live Site...' : 'Publish to Live Site'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ==============================================================================
          DELETE CONFIRMATION MODAL
         ============================================================================== */}
      {isMounted &&
        deleteModalProject &&
        createPortal(
          <div
            className={styles.modalBackdrop}
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isDeleting) {
                setDeleteModalProject(null);
              }
            }}
          >
            <div className={styles.editorModal} style={{ maxWidth: '480px', height: 'auto', maxHeight: '90vh' }}>
              <div className={styles.modalHeader}>
                <h3 style={{ color: '#b91c1c' }}>Confirm Project Deletion</h3>
                <button type="button" onClick={() => setDeleteModalProject(null)} className={styles.closeBtn} disabled={isDeleting} aria-label="Close modal">
                  ✕
                </button>
              </div>

              <div className={styles.modalBody} style={{ paddingBottom: '1.5rem' }}>
                <p style={{ lineHeight: 1.5, margin: 0 }}>
                  Are you sure you want to delete <strong>&ldquo;{deleteModalProject.title}&rdquo;</strong>?
                </p>
                {deleteModalProject.legacy_id && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#991b1b', marginTop: '0.75rem' }}>
                    ⚠️ Warning: This is a canonical legacy project (/projects/{deleteModalProject.legacy_id}). Deleting it will remove the public route.
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setDeleteModalProject(null)} className={styles.btnSmall} disabled={isDeleting}>
                  Cancel
                </button>
                <button type="button" onClick={handleConfirmDelete} className={clsx(styles.btnSmall, styles.btnDelete)} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ==============================================================================
          STATUS & FEEDBACK MODAL
         ============================================================================== */}
      {isMounted &&
        statusModalProject &&
        createPortal(
          <div
            className={styles.modalBackdrop}
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setStatusModalProject(null);
              }
            }}
          >
            <div className={styles.editorModal} style={{ maxWidth: '520px', height: 'auto', maxHeight: '90vh' }}>
              <div className={styles.modalHeader}>
                <h3>Update Status &amp; Notes</h3>
                <button type="button" onClick={() => setStatusModalProject(null)} className={styles.closeBtn} aria-label="Close modal">
                  ✕
                </button>
              </div>

              <div className={styles.modalBody} style={{ paddingBottom: '1.5rem' }}>
                <div className={styles.formGroup}>
                  <label htmlFor="status_select">Project: {statusModalProject.title}</label>
                  <select id="status_select" value={targetStatus} onChange={(e) => setTargetStatus(e.target.value)} className={styles.filterSelect}>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="SUBMITTED">SUBMITTED (Pending Moderation)</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="CHANGES_REQUESTED">CHANGES_REQUESTED</option>
                    <option value="APPROVED">APPROVED (Ready for Publish)</option>
                    <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                    <option value="REJECTED">REJECTED (Hidden)</option>
                  </select>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <label htmlFor="status_notes">Admin Feedback / Change Notes</label>
                  <textarea id="status_notes" rows={4} placeholder="Notes explaining requested changes or approval conditions..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setStatusModalProject(null)} className={styles.btnSmall}>
                  Cancel
                </button>
                <button type="button" onClick={handleSaveStatusWithNotes} className={clsx(styles.btnSmall, styles.btnPublish)}>
                  Save Status
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--black)',
            color: 'var(--white)',
            padding: '0.85rem 1.4rem',
            borderRadius: '8px',
            zIndex: 100002,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            fontSize: '0.85rem',
            fontWeight: 650,
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
