/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import Image from 'next/image';
import RouteGuard from '@src/components/auth/RouteGuard';
import clsx from 'clsx';
import { supabase } from '@src/lib/supabase/client';
import { useAuth } from '@src/context/AuthContext';
import { useRouter } from 'next/router';
import styles from './submit.module.scss';

const STEPS = [
  { id: 1, label: '01 Details' },
  { id: 2, label: '02 Media' },
  { id: 3, label: '03 Files & Deliverables' },
  { id: 4, label: '04 Pricing' },
  { id: 5, label: '05 Requirements' },
  { id: 6, label: '06 Review & Submit' },
];

const AVAILABLE_DELIVERABLES = [
  'Source Code (.ZIP)',
  'IEEE Format Thesis Report (PDF)',
  'Defense Presentation Deck (PPTX)',
  'Model Architecture & Circuit Schematics',
  'Training Dataset & Pre-trained Weights',
  'Step-by-Step Installation & Setup Guide',
  'Full Video Demo & Code Walkthrough (MP4)',
  'Commercial Production License',
];

function generateSlug(text) {
  return (text || 'project')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function isValidUrl(string) {
  if (!string) return true;
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function SubmitProjectPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [categories, setCategories] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [creatorProfileId, setCreatorProfileId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveDraftLoading, setSaveDraftLoading] = useState(false);
  const [stepError, setStepError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Upload Progress States
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [sourceCodeUploading, setSourceCodeUploading] = useState(false);
  const [thesisUploading, setThesisUploading] = useState(false);
  const [diagramUploading, setDiagramUploading] = useState(false);
  const [presentationUploading, setPresentationUploading] = useState(false);

  // Hidden File Input Refs
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const sourceCodeInputRef = useRef(null);
  const thesisInputRef = useRef(null);
  const diagramInputRef = useRef(null);
  const presentationInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    desc: '',
    categoryId: '',
    projectType: 'Full-Stack Application',
    difficulty: 'Intermediate',
    platform: 'Web & Cloud Server',
    language: 'Python 3.10+ / Next.js',
    techStack: 'Python, PyTorch, FastAPI, Next.js',
    coverImageUrl: '',
    coverStoragePath: '',
    galleryImages: [], // Array of { id, url, path, name }
    liveDemoUrl: '',
    demoVideoUrl: '',
    deliverables: ['Source Code (.ZIP)', 'Step-by-Step Installation & Setup Guide'],
    sourceCodeFile: null, // { id, name, size, path }
    thesisFile: null,
    diagramFile: null,
    presentationFile: null,
    academicPrice: 2999,
    commercialPrice: 4999,
    originalPrice: 5999,
    os: 'Windows 10/11, macOS, Linux',
    software: 'Python 3.10+, VS Code, Git',
    hardware: '8 GB RAM minimum, 2 GB disk space',
    dependencies: 'Listed in requirements.txt / package.json',
    installInstructions: '1. Extract ZIP archive\n2. Install dependencies via pip or npm\n3. Set environment variables\n4. Run startup script',
    agreeTerms: true,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleChange = (field, value) => {
    setStepError('');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDeliverable = (item) => {
    setFormData((prev) => {
      const current = prev.deliverables || [];
      const exists = current.includes(item);
      const updated = exists ? current.filter((i) => i !== item) : [...current, item];
      return { ...prev, deliverables: updated };
    });
  };

  // 1. Load Categories & Initialize/Resume Project
  useEffect(() => {
    async function initialize() {
      if (!supabase || !user) return;
      try {
        setLoadingInitial(true);

        // Fetch Categories
        const { data: catData } = await supabase.from('categories').select('id, name, slug').order('sort_order', { ascending: true });

        if (catData && catData.length > 0) {
          setCategories(catData);
          setFormData((prev) => ({
            ...prev,
            categoryId: prev.categoryId || catData[0].id,
          }));
        }

        // Fetch or Create Creator Profile
        let { data: cProf } = await supabase.from('creator_profiles').select('id').eq('user_id', user.id).maybeSingle();

        if (!cProf) {
          const defaultHandle = (user.email || 'creator').split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
          const { data: newProf } = await supabase
            .from('creator_profiles')
            .insert({
              user_id: user.id,
              display_name: profile?.full_name || 'Verified Creator',
              handle: defaultHandle,
              bio: 'Verified technical builder on Homies Studio.',
              is_approved: true,
            })
            .select('id')
            .single();

          cProf = newProf;
        }

        if (cProf) {
          setCreatorProfileId(cProf.id);
        }

        // Resume Existing Project if query parameter present
        const queryProjectId = router.query.projectId;
        if (queryProjectId && typeof queryProjectId === 'string') {
          const { data: existingProject } = await supabase.from('projects').select('*').eq('id', queryProjectId).single();

          if (existingProject) {
            setProjectId(existingProject.id);

            // Fetch attached deliverables
            const { data: attachedFiles } = await supabase.from('project_files').select('*').eq('project_id', existingProject.id);

            let srcFile = null;
            let thFile = null;
            let diagFile = null;
            let pptFile = null;

            if (attachedFiles) {
              attachedFiles.forEach((f) => {
                const fileObj = {
                  id: f.id,
                  name: f.file_name,
                  size: (f.file_size_bytes / (1024 * 1024)).toFixed(1),
                  path: f.storage_path,
                };
                if (f.file_type === 'SOURCE_CODE_ZIP') srcFile = fileObj;
                else if (f.file_type === 'THESIS_REPORT_PDF') thFile = fileObj;
                else if (f.file_type === 'CIRCUIT_DIAGRAM') diagFile = fileObj;
                else if (f.file_type === 'PRESENTATION_PPTX') pptFile = fileObj;
              });
            }

            // Fetch attached gallery images
            const { data: attachedImages } = await supabase.from('project_images').select('*').eq('project_id', existingProject.id).eq('is_cover', false).order('sort_order', { ascending: true });

            const loadedGallery = attachedImages
              ? attachedImages.map((img) => ({
                  id: img.id,
                  url: img.image_url,
                  path: img.storage_path,
                  name: img.alt_text || 'Showcase Image',
                }))
              : [];

            const descText = Array.isArray(existingProject.description) ? existingProject.description.join('\n\n') : existingProject.description || '';

            setFormData({
              title: existingProject.title || '',
              tagline: existingProject.tagline || '',
              desc: descText,
              categoryId: existingProject.category_id || (catData && catData[0]?.id) || '',
              projectType: existingProject.project_type || 'Full-Stack Application',
              difficulty: existingProject.difficulty || 'Intermediate',
              platform: existingProject.platform || 'Web & Cloud Server',
              language: existingProject.language || 'Python 3.10+ / Next.js',
              techStack: Array.isArray(existingProject.tech_stack) ? existingProject.tech_stack.join(', ') : existingProject.tech_stack || '',
              coverImageUrl: existingProject.cover_image_url || '',
              coverStoragePath: '',
              galleryImages: loadedGallery,
              liveDemoUrl: existingProject.live_demo_url || '',
              demoVideoUrl: existingProject.demo_video_url || '',
              deliverables:
                Array.isArray(existingProject.requirements?.deliverables) && existingProject.requirements.deliverables.length > 0
                  ? existingProject.requirements.deliverables
                  : Array.isArray(existingProject.deliverables) && existingProject.deliverables.length > 0
                    ? existingProject.deliverables
                    : ['Source Code (.ZIP)', 'Step-by-Step Installation & Setup Guide'],
              sourceCodeFile: srcFile,
              thesisFile: thFile,
              diagramFile: diagFile,
              presentationFile: pptFile,
              academicPrice: Number(existingProject.academic_price) || 2999,
              commercialPrice: Number(existingProject.commercial_price) || 4999,
              originalPrice: Number(existingProject.original_price) || 5999,
              os: existingProject.requirements?.os || 'Windows 10/11, macOS, Linux',
              software: existingProject.requirements?.software || 'Python 3.10+, VS Code, Git',
              hardware: existingProject.requirements?.hardware || '8 GB RAM minimum, 2 GB disk space',
              dependencies: existingProject.requirements?.dependencies || 'Listed in requirements.txt',
              installInstructions:
                existingProject.requirements?.installationSteps?.join('\n') || '1. Extract ZIP archive\n2. Install dependencies via pip or npm\n3. Set environment variables\n4. Run startup script',
              agreeTerms: true,
            });
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[Submit Page Init Error]:', err);
        }
      } finally {
        setLoadingInitial(false);
      }
    }

    initialize();
  }, [user, router.query.projectId, profile]);

  // Helper: Save or Upsert Project to Supabase
  const persistProjectToDatabase = async (projectStatus = 'DRAFT') => {
    if (!supabase || !user) throw new Error('You must be signed in to save or submit projects.');
    if (!creatorProfileId) throw new Error('Creator profile is initializing. Please try again in a moment.');

    const targetId = projectId || crypto.randomUUID();
    const finalSlug = `${generateSlug(formData.title || 'project')}-${targetId.slice(0, 8)}`;
    const techStackArray = (formData.techStack || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const descriptionArray = formData.desc
      ? formData.desc.split('\n\n').filter(Boolean)
      : ['Comprehensive engineering solution engineered from concept through architecture to production validation.'];

    const projectPayload = {
      id: targetId,
      creator_id: creatorProfileId,
      category_id: formData.categoryId || categories[0]?.id,
      title: formData.title.trim() || (projectStatus === 'DRAFT' ? 'Untitled Draft Project' : 'New Creator Project'),
      slug: finalSlug,
      tagline: formData.tagline.trim() || 'Custom built digital solution crafted with excellence.',
      handwriting_note: 'Verified creator project ready for deployment.',
      description: descriptionArray,
      project_type: formData.projectType,
      difficulty: formData.difficulty,
      platform: formData.platform,
      language: formData.language,
      tech_stack: techStackArray,
      requirements: {
        os: formData.os,
        software: formData.software,
        hardware: formData.hardware,
        dependencies: formData.dependencies,
        installationSteps: formData.installInstructions.split('\n').filter(Boolean),
        deliverables: formData.deliverables || ['Source Code (.ZIP)'],
      },
      academic_price: Number(formData.academicPrice) || 2999,
      commercial_price: Number(formData.commercialPrice) || 4999,
      original_price: Number(formData.originalPrice) || 5999,
      status: projectStatus,
      cover_image_url: formData.coverImageUrl || '',
      live_demo_url: formData.liveDemoUrl.trim() || null,
      demo_video_url: formData.demoVideoUrl.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const { data: savedProject, error: projectError } = await supabase.from('projects').upsert(projectPayload).select().single();

    if (projectError) throw projectError;

    setProjectId(targetId);
    return savedProject;
  };

  // Helper: Upload Cover Image or Private Deliverables to Supabase Storage
  const handleFileUpload = async (file, fileType, bucketName, subfolder, progressSetter) => {
    if (!file || !user) return;
    setStepError('');

    // Validate size (10MB for images, 200MB for deliverables)
    const maxBytes = bucketName === 'project-media' ? 10 * 1024 * 1024 : 200 * 1024 * 1024;
    if (file.size > maxBytes) {
      setStepError(`File size exceeds maximum limit (${bucketName === 'project-media' ? '10MB' : '200MB'}).`);
      return;
    }

    try {
      progressSetter(true);

      const currentProj = await persistProjectToDatabase('DRAFT');
      const activeProjId = currentProj.id;

      const fileExt = file.name.split('.').pop().toLowerCase();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniquePath = `creators/${user.id}/projects/${activeProjId}/${subfolder}/${Date.now()}_${sanitizedName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (uploadError) throw uploadError;

      // 2. If Cover Image (Public Bucket)
      if (bucketName === 'project-media' && subfolder === 'cover') {
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(uniquePath);
        handleChange('coverImageUrl', urlData.publicUrl);
        handleChange('coverStoragePath', uniquePath);

        await supabase.from('projects').update({ cover_image_url: urlData.publicUrl }).eq('id', activeProjId);
        showToast('✓ Project cover image uploaded and saved!');
      } else {
        // 3. If Deliverable (Private Bucket), record in public.project_files
        await supabase.from('project_files').delete().eq('project_id', activeProjId).eq('file_type', fileType);

        const { data: fileRecord, error: fileDbError } = await supabase
          .from('project_files')
          .insert({
            project_id: activeProjId,
            file_type: fileType,
            file_name: file.name,
            storage_path: uniquePath,
            file_size_bytes: file.size,
            mime_type: file.type || `application/${fileExt}`,
          })
          .select()
          .single();

        if (fileDbError) throw fileDbError;

        const fileSummary = {
          id: fileRecord.id,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1),
          path: uniquePath,
        };

        if (fileType === 'SOURCE_CODE_ZIP') handleChange('sourceCodeFile', fileSummary);
        else if (fileType === 'THESIS_REPORT_PDF') handleChange('thesisFile', fileSummary);
        else if (fileType === 'CIRCUIT_DIAGRAM') handleChange('diagramFile', fileSummary);
        else if (fileType === 'PRESENTATION_PPTX') handleChange('presentationFile', fileSummary);

        showToast(`✓ ${file.name} uploaded successfully!`);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('[File Upload Error]:', err);
      }
      setStepError(err.message || 'Unable to upload this file. Please check the file type and try again.');
    } finally {
      progressSetter(false);
    }
  };

  // Helper: Upload Multiple Media/Screenshots
  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0 || !user) return;
    setStepError('');

    try {
      setGalleryUploading(true);
      const currentProj = await persistProjectToDatabase('DRAFT');
      const activeProjId = currentProj.id;

      const newGalleryItems = [];

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) continue;

        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const uniquePath = `creators/${user.id}/projects/${activeProjId}/gallery/${Date.now()}_${sanitizedName}`;

        const { error: upErr } = await supabase.storage.from('project-media').upload(uniquePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

        if (!upErr) {
          const { data: urlData } = supabase.storage.from('project-media').getPublicUrl(uniquePath);

          const { data: imgRow } = await supabase
            .from('project_images')
            .insert({
              project_id: activeProjId,
              image_url: urlData.publicUrl,
              storage_path: uniquePath,
              alt_text: file.name,
              is_cover: false,
              sort_order: formData.galleryImages.length + i + 1,
            })
            .select()
            .single();

          newGalleryItems.push({
            id: imgRow?.id || crypto.randomUUID(),
            url: urlData.publicUrl,
            path: uniquePath,
            name: file.name,
          });
        }
      }

      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...newGalleryItems],
      }));

      showToast(`✓ Uploaded ${newGalleryItems.length} project screenshot(s)!`);
    } catch (err) {
      setStepError(err.message || 'Failed to upload showcase images.');
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleRemoveGalleryImage = async (imgObj) => {
    try {
      if (imgObj.id && supabase) {
        await supabase.from('project_images').delete().eq('id', imgObj.id);
      }
      setFormData((prev) => ({
        ...prev,
        galleryImages: prev.galleryImages.filter((img) => img.path !== imgObj.path),
      }));
      showToast('Image removed from showcase gallery.');
    } catch {
      // Fallback
    }
  };

  // Step Validation & Navigation
  const validateStep = (step) => {
    setStepError('');
    if (step === 1) {
      if (!formData.title.trim()) {
        setStepError('Project title is required.');
        return false;
      }
      if (!formData.tagline.trim()) {
        setStepError('Project tagline is required.');
        return false;
      }
      if (!formData.desc.trim()) {
        setStepError('Detailed project description is required.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.coverImageUrl) {
        setStepError('Please upload a cover banner image for your project.');
        return false;
      }
      if (formData.liveDemoUrl && !isValidUrl(formData.liveDemoUrl)) {
        setStepError('Please provide a valid URL for Live Demo (e.g. https://myproject.com).');
        return false;
      }
      if (formData.demoVideoUrl && !isValidUrl(formData.demoVideoUrl)) {
        setStepError('Please provide a valid URL for Demo Video (e.g. https://youtube.com/...).');
        return false;
      }
    } else if (step === 3) {
      if (!formData.sourceCodeFile) {
        setStepError('Please upload the primary source code archive (.ZIP).');
        return false;
      }
      if (!formData.deliverables || formData.deliverables.length === 0) {
        setStepError('Please select at least one deliverable included in this package.');
        return false;
      }
    } else if (step === 4) {
      if (!formData.academicPrice || Number(formData.academicPrice) < 500) {
        setStepError('Please enter a valid price (minimum ₹500).');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    try {
      await persistProjectToDatabase('DRAFT');
    } catch {
      // Allow moving forward even if offline draft sync fails
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = async () => {
    try {
      setSaveDraftLoading(true);
      await persistProjectToDatabase('DRAFT');
      showToast('✓ Project draft saved! You can resume editing anytime.');
    } catch (err) {
      setStepError(err.message || 'Failed to save draft.');
    } finally {
      setSaveDraftLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      setStepError('Please complete all required fields and file uploads before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      await persistProjectToDatabase('SUBMITTED');
      showToast('✓ Project submitted for technical review!');

      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/creator/dashboard');
      }, 1500);
    } catch (err) {
      setStepError(err.message || 'Failed to submit project. Please try again.');
      setIsSubmitting(false);
    }
  };

  const platformFee = Math.round((Number(formData.academicPrice) || 0) * 0.2);
  const creatorEarnings = (Number(formData.academicPrice) || 0) - platformFee;

  return (
    <RouteGuard allowedRoles={['CREATOR', 'ADMIN']}>
      <CustomHead title="Submit Project" noindex />
      <div className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.header}>
          <h1 className={clsx(styles.pageTitle, 'h2')}>Project Submission Wizard</h1>
          <p className={clsx(styles.pageSubtitle, 'p')}>Package and submit your digital engineering build. Our technical moderation team verifies every submission within 24 hours.</p>
        </div>

        {/* Step Navigation Indicator */}
        <div className={styles.stepperContainer}>
          {STEPS.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                if (step.id < currentStep || validateStep(currentStep)) {
                  setCurrentStep(step.id);
                }
              }}
              className={clsx(styles.stepItem, currentStep === step.id && styles.stepItemActive, currentStep > step.id && styles.stepItemCompleted)}
            >
              <div className={styles.stepCircle}>{currentStep > step.id ? '✓' : step.id}</div>
              <span className={styles.stepLabel}>{step.label}</span>
            </button>
          ))}
        </div>

        {/* Step Error Notice */}
        {stepError && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '1rem 1.4rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            ⚠️ {stepError}
          </div>
        )}

        {loadingInitial ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#666' }}>Initializing project builder...</div>
        ) : (
          <div className={styles.formCard}>
            {/* STEP 1: DETAILS */}
            {currentStep === 1 && (
              <div>
                <h3 className={clsx(styles.stepHeading, 'h3')}>Step 1: General Project Information</h3>
                <p className={clsx(styles.stepInstructions, 'p-xs')}>Provide basic details, architecture summary, and categories for discovery.</p>

                <div className={styles.formGrid}>
                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label htmlFor="titleInput">
                      Project Title <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      id="titleInput"
                      type="text"
                      required
                      className={styles.inputField}
                      placeholder="e.g. Real-Time Autonomous Drone Flight Controller with Computer Vision"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                  </div>

                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label htmlFor="taglineInput">
                      One-Line Tagline <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      id="taglineInput"
                      type="text"
                      required
                      className={styles.inputField}
                      placeholder="e.g. Deep convolutional neural network for rapid X-ray anomaly detection."
                      value={formData.tagline}
                      onChange={(e) => handleChange('tagline', e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="categorySelect">Primary Category</label>
                    <select id="categorySelect" className={styles.selectField} value={formData.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)}>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="projectTypeSelect">Project Type</label>
                    <select id="projectTypeSelect" className={styles.selectField} value={formData.projectType} onChange={(e) => handleChange('projectType', e.target.value)}>
                      <option value="Full-Stack Application">Full-Stack Application</option>
                      <option value="AI/ML Model & Web Interface">AI/ML Model & Web Interface</option>
                      <option value="Hardware & Software Prototype">Hardware & Software Prototype</option>
                      <option value="Research & Academic Build">Research & Academic Build</option>
                      <option value="Automation Suite">Automation Suite</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="difficultySelect">Difficulty Level</label>
                    <select id="difficultySelect" className={styles.selectField} value={formData.difficulty} onChange={(e) => handleChange('difficulty', e.target.value)}>
                      <option value="Beginner Friendly">Beginner Friendly</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Industry Grade">Industry Grade</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="platformInput">Target Platform</label>
                    <input
                      id="platformInput"
                      type="text"
                      className={styles.inputField}
                      placeholder="e.g. Web & Cloud Server, ESP32, Docker"
                      value={formData.platform}
                      onChange={(e) => handleChange('platform', e.target.value)}
                    />
                  </div>

                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label htmlFor="techStackInput">Technology Stack (Comma separated)</label>
                    <input
                      id="techStackInput"
                      type="text"
                      className={styles.inputField}
                      placeholder="e.g. Python, PyTorch, OpenCV, FastAPI, Next.js, Docker"
                      value={formData.techStack}
                      onChange={(e) => handleChange('techStack', e.target.value)}
                    />
                  </div>

                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label htmlFor="descTextarea">
                      Detailed Architecture & Description <span className={styles.requiredStar}>*</span>
                    </label>
                    <textarea
                      id="descTextarea"
                      required
                      className={styles.textareaField}
                      placeholder="Explain what the project accomplishes, problem statement, key modules, and how it is structured..."
                      value={formData.desc}
                      onChange={(e) => handleChange('desc', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MEDIA & LIVE DEMOS */}
            {currentStep === 2 && (
              <div>
                <h3 className={clsx(styles.stepHeading, 'h3')}>Step 2: Media & Live Demos</h3>
                <p className={clsx(styles.stepInstructions, 'p-xs')}>Upload real project visuals and provide live demonstration links.</p>

                <div className={styles.formGrid}>
                  {/* Primary Cover Image */}
                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label>
                      Project Cover Image <span className={styles.requiredStar}>*</span> (JPG, PNG, WEBP — 1920x1080 Recommended)
                    </label>

                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'IMAGE', 'project-media', 'cover', setCoverUploading);
                      }}
                    />

                    {formData.coverImageUrl && (formData.coverImageUrl.startsWith('http') || formData.coverImageUrl.startsWith('/')) ? (
                      <div
                        style={{
                          border: '1px solid rgba(40,40,43,0.15)',
                          borderRadius: '12px',
                          padding: '1.2rem',
                          background: '#fafafa',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.5rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ position: 'relative', width: '160px', height: '90px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                          <Image src={formData.coverImageUrl} fill sizes="160px" style={{ objectFit: 'cover' }} alt="Project Cover Preview" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h5 className="h5" style={{ color: '#166534', marginBottom: '0.2rem' }}>
                            ✓ Cover Image Uploaded
                          </h5>
                          <p className="p-xs" style={{ color: '#666' }}>
                            Stored securely in Supabase project-media bucket.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                          <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            style={{ background: 'var(--black)', color: 'var(--white)', border: 'none', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Replace Image
                          </button>
                          <button
                            type="button"
                            onClick={() => handleChange('coverImageUrl', '')}
                            style={{
                              background: 'transparent',
                              color: '#dc2626',
                              border: '1px solid #dc2626',
                              padding: '0.5rem 1rem',
                              borderRadius: '9999px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" className={styles.fileUploadBox} onClick={() => coverInputRef.current?.click()} style={{ width: '100%' }}>
                        <div className={styles.uploadIcon}>{coverUploading ? '⏳' : '🖼️'}</div>
                        <h5 className="h5">{coverUploading ? 'Uploading to Supabase Storage...' : 'Click to Upload Project Cover Image'}</h5>
                        <p className="p-xs">Supports JPG, PNG, WEBP up to 10MB.</p>
                      </button>
                    )}
                  </div>

                  {/* Multiple Media / Showcase Screenshots */}
                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label>Additional Project Screenshots & Showcase Media (Optional)</label>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) handleGalleryUpload(files);
                      }}
                    />

                    {formData.galleryImages && formData.galleryImages.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
                        {formData.galleryImages.map((img) => (
                          <div key={img.path || img.url} style={{ position: 'relative', height: '85px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                            {img.url && (img.url.startsWith('http') || img.url.startsWith('/')) ? (
                              <Image src={img.url} fill sizes="130px" style={{ objectFit: 'cover' }} alt={img.name || 'Screenshot'} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', fontSize: '1.2rem' }}>🖼️</div>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(img)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(0,0,0,0.7)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      style={{ width: '100%', padding: '0.8rem', border: '1px dashed #bbb', background: '#fafafa', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem' }}
                    >
                      {galleryUploading ? 'Uploading Screenshots...' : '+ Upload Project Showcase Screenshots (Multiple)'}
                    </button>
                  </div>

                  {/* Live Demo Preview URL */}
                  <div className={styles.formGroup}>
                    <label htmlFor="liveLinkInput">Live Demo URL (Optional)</label>
                    <input
                      id="liveLinkInput"
                      type="url"
                      className={styles.inputField}
                      placeholder="https://myproject.com"
                      value={formData.liveDemoUrl}
                      onChange={(e) => handleChange('liveDemoUrl', e.target.value)}
                    />
                  </div>

                  {/* Demo Video URL */}
                  <div className={styles.formGroup}>
                    <label htmlFor="demoVideoUrlInput">Demo Video URL (YouTube / Shorts / Loom / Google Drive)</label>
                    <input
                      id="demoVideoUrlInput"
                      type="url"
                      className={styles.inputField}
                      placeholder="https://youtu.be/... or https://loom.com/..."
                      value={formData.demoVideoUrl}
                      onChange={(e) => handleChange('demoVideoUrl', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: FILES & DIGITAL DELIVERABLES */}
            {currentStep === 3 && (
              <div>
                <h3 className={clsx(styles.stepHeading, 'h3')}>Step 3: Project Files & Digital Deliverables</h3>
                <p className={clsx(styles.stepInstructions, 'p-xs')}>Upload real source code archives and select the deliverables included in your package.</p>

                <div className={styles.formGrid}>
                  {/* Source Code Archive (.ZIP) */}
                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label>
                      Complete Source Code Archive (.ZIP) <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      ref={sourceCodeInputRef}
                      type="file"
                      accept=".zip,application/zip,application/x-zip-compressed"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'SOURCE_CODE_ZIP', 'project-deliverables', 'source-code', setSourceCodeUploading);
                      }}
                    />

                    {formData.sourceCodeFile ? (
                      <div
                        style={{
                          border: '1px solid #86efac',
                          background: '#f0fdf4',
                          borderRadius: '10px',
                          padding: '1rem 1.4rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 750, color: '#166534' }}>✓ {formData.sourceCodeFile.name}</span>
                          <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.2rem' }}>Size: {formData.sourceCodeFile.size} MB • Private encrypted storage</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                          <button
                            type="button"
                            onClick={() => sourceCodeInputRef.current?.click()}
                            style={{ background: '#166534', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => handleChange('sourceCodeFile', null)}
                            style={{
                              background: 'transparent',
                              color: '#dc2626',
                              border: '1px solid #dc2626',
                              padding: '0.4rem 0.9rem',
                              borderRadius: '9999px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" className={styles.fileUploadBox} onClick={() => sourceCodeInputRef.current?.click()} style={{ width: '100%' }}>
                        <div className={styles.uploadIcon}>{sourceCodeUploading ? '⏳' : '📦'}</div>
                        <h5 className="h5">{sourceCodeUploading ? 'Uploading encrypted archive to Supabase...' : 'Click to Upload Source Code (.ZIP)'}</h5>
                        <p className="p-xs">Include full clean source code, requirements/package.json, and documentation.</p>
                      </button>
                    )}
                  </div>

                  {/* Deliverables Checklist */}
                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label>Select All Included Deliverables in Package *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.6rem', marginTop: '0.4rem' }}>
                      {AVAILABLE_DELIVERABLES.map((deliv) => {
                        const isChecked = formData.deliverables?.includes(deliv);
                        return (
                          <label
                            key={deliv}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              padding: '0.6rem 0.8rem',
                              background: isChecked ? '#f0fdf4' : '#fafafa',
                              border: `1px solid ${isChecked ? '#86efac' : '#e5e7eb'}`,
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: isChecked ? 650 : 450,
                            }}
                          >
                            <input type="checkbox" checked={isChecked} onChange={() => toggleDeliverable(deliv)} style={{ accentColor: '#166534' }} />
                            <span>{deliv}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional File Upload: IEEE Thesis / Report (PDF) */}
                  <div className={styles.formGroup}>
                    <label>Project Report / Thesis (PDF) [Optional]</label>
                    <input
                      ref={thesisInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'THESIS_REPORT_PDF', 'project-deliverables', 'thesis', setThesisUploading);
                      }}
                    />
                    {formData.thesisFile ? (
                      <div
                        style={{
                          border: '1px solid #86efac',
                          background: '#f0fdf4',
                          borderRadius: '8px',
                          padding: '0.8rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 650, color: '#166534' }}>✓ {formData.thesisFile.name}</span>
                        <button type="button" onClick={() => handleChange('thesisFile', null)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => thesisInputRef.current?.click()}
                        style={{ width: '100%', padding: '0.8rem', border: '1px dashed #bbb', background: '#fafafa', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem' }}
                      >
                        {thesisUploading ? 'Uploading PDF...' : '+ Upload Project Report (PDF)'}
                      </button>
                    )}
                  </div>

                  {/* Optional File Upload: Architecture / Circuit Diagrams */}
                  <div className={styles.formGroup}>
                    <label>Architecture & Schematics (PDF/PNG) [Optional]</label>
                    <input
                      ref={diagramInputRef}
                      type="file"
                      accept=".pdf,image/png,image/jpeg,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'CIRCUIT_DIAGRAM', 'project-deliverables', 'architecture', setDiagramUploading);
                      }}
                    />
                    {formData.diagramFile ? (
                      <div
                        style={{
                          border: '1px solid #86efac',
                          background: '#f0fdf4',
                          borderRadius: '8px',
                          padding: '0.8rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 650, color: '#166534' }}>✓ {formData.diagramFile.name}</span>
                        <button type="button" onClick={() => handleChange('diagramFile', null)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => diagramInputRef.current?.click()}
                        style={{ width: '100%', padding: '0.8rem', border: '1px dashed #bbb', background: '#fafafa', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem' }}
                      >
                        {diagramUploading ? 'Uploading Diagrams...' : '+ Upload Schematics / Diagrams'}
                      </button>
                    )}
                  </div>

                  {/* Optional File Upload: Presentation Deck (.PPTX) */}
                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label>Defense Presentation (.PPTX / PDF) [Optional]</label>
                    <input
                      ref={presentationInputRef}
                      type="file"
                      accept=".pptx,.ppt,.pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'PRESENTATION_PPTX', 'project-deliverables', 'presentation', setPresentationUploading);
                      }}
                    />
                    {formData.presentationFile ? (
                      <div
                        style={{
                          border: '1px solid #86efac',
                          background: '#f0fdf4',
                          borderRadius: '8px',
                          padding: '0.8rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 650, color: '#166534' }}>✓ {formData.presentationFile.name}</span>
                        <button type="button" onClick={() => handleChange('presentationFile', null)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => presentationInputRef.current?.click()}
                        style={{ width: '100%', padding: '0.8rem', border: '1px dashed #bbb', background: '#fafafa', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem' }}
                      >
                        {presentationUploading ? 'Uploading PPTX...' : '+ Upload Presentation Deck (.PPTX)'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PRICING */}
            {currentStep === 4 && (
              <div>
                <h3 className={clsx(styles.stepHeading, 'h3')}>Step 4: Pricing & Creator Royalties</h3>
                <p className={clsx(styles.stepInstructions, 'p-xs')}>Set your pricing tiers. You retain 80% net royalties on every sale.</p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="academicPriceInput">
                      Academic License Price (INR) <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      id="academicPriceInput"
                      type="number"
                      min="500"
                      max="50000"
                      className={styles.inputField}
                      value={formData.academicPrice}
                      onChange={(e) => handleChange('academicPrice', e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="commercialPriceInput">Commercial / Enterprise Price (INR)</label>
                    <input
                      id="commercialPriceInput"
                      type="number"
                      min="1000"
                      max="100000"
                      className={styles.inputField}
                      value={formData.commercialPrice}
                      onChange={(e) => handleChange('commercialPrice', e.target.value)}
                    />
                  </div>

                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <div className={styles.pricingBreakdownBox}>
                      <div className={styles.pricingRow}>
                        <span>Buyer Purchase Price:</span>
                        <span>₹{Number(formData.academicPrice || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className={styles.pricingRow}>
                        <span>Platform Quality & Hosting Fee (20%):</span>
                        <span>-₹{platformFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className={clsx(styles.pricingRow, styles.creatorShareRow)}>
                        <span>Your Net Creator Payout (80%):</span>
                        <span>₹{creatorEarnings.toLocaleString('en-IN')} / sale</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: REQUIREMENTS & INSTALLATION */}
            {currentStep === 5 && (
              <div>
                <h3 className={clsx(styles.stepHeading, 'h3')}>Step 5: System Requirements & Installation Steps</h3>
                <p className={clsx(styles.stepInstructions, 'p-xs')}>Guide buyers on the prerequisites and setup required to execute your build.</p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="osInput">Supported Operating Systems</label>
                    <input id="osInput" type="text" className={styles.inputField} value={formData.os} onChange={(e) => handleChange('os', e.target.value)} />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="softwareInput">Software & Runtime Dependencies</label>
                    <input id="softwareInput" type="text" className={styles.inputField} value={formData.software} onChange={(e) => handleChange('software', e.target.value)} />
                  </div>

                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label htmlFor="hardwareInput">Minimum Hardware Specifications</label>
                    <input id="hardwareInput" type="text" className={styles.inputField} value={formData.hardware} onChange={(e) => handleChange('hardware', e.target.value)} />
                  </div>

                  <div className={clsx(styles.formGroup, styles.fullWidth)}>
                    <label htmlFor="installInstructionsTextarea">Step-by-Step Installation Guide</label>
                    <textarea
                      id="installInstructionsTextarea"
                      className={styles.textareaField}
                      value={formData.installInstructions}
                      onChange={(e) => handleChange('installInstructions', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW & SUBMIT */}
            {currentStep === 6 && (
              <div>
                <h3 className={clsx(styles.stepHeading, 'h3')}>Step 6: Review & Final Submission</h3>
                <p className={clsx(styles.stepInstructions, 'p-xs')}>Verify your project details before submitting for moderation.</p>

                <div style={{ background: '#fafafa', border: '1px solid rgba(40,40,43,0.12)', borderRadius: '12px', padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <h4 className="h4">{formData.title || 'Untitled Project'}</h4>
                    <p className="p-xs" style={{ color: '#666', marginTop: '0.2rem' }}>
                      {formData.tagline}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <div>
                      <strong>Price:</strong> ₹{Number(formData.academicPrice).toLocaleString('en-IN')}
                    </div>
                    <div>
                      <strong>Net Royalty:</strong> ₹{creatorEarnings.toLocaleString('en-IN')} (80%)
                    </div>
                    <div>
                      <strong>Cover Image:</strong> {formData.coverImageUrl ? '✓ Uploaded' : '✕ Missing'}
                    </div>
                    <div>
                      <strong>Screenshots:</strong> {formData.galleryImages?.length || 0} image(s)
                    </div>
                    <div>
                      <strong>Source Code:</strong> {formData.sourceCodeFile ? `✓ ${formData.sourceCodeFile.name}` : '✕ Missing'}
                    </div>
                    {formData.liveDemoUrl && (
                      <div>
                        <strong>Live Demo:</strong> {formData.liveDemoUrl}
                      </div>
                    )}
                    {formData.demoVideoUrl && (
                      <div>
                        <strong>Demo Video:</strong> {formData.demoVideoUrl}
                      </div>
                    )}
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>Included Deliverables:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.3rem' }}>
                      {formData.deliverables?.map((d) => (
                        <span
                          key={d}
                          style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="p-xs" style={{ color: '#555', background: '#eff6ff', padding: '0.8rem', borderRadius: '8px' }}>
                    ✦ Upon clicking <strong>Submit for Moderation</strong>, your build will be reviewed by platform administrators within 24 hours and published to the Homies Studio Marketplace.
                  </p>
                </div>
              </div>
            )}

            {/* Step Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(40,40,43,0.1)' }}>
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    style={{ background: 'transparent', border: '1px solid rgba(40,40,43,0.2)', padding: '0.7vw 1.6vw', borderRadius: '9999px', cursor: 'pointer', fontWeight: 650 }}
                  >
                    ← Back
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saveDraftLoading}
                  style={{ background: 'transparent', border: '1px solid var(--black)', padding: '0.7vw 1.6vw', borderRadius: '9999px', cursor: 'pointer', fontWeight: 650 }}
                >
                  {saveDraftLoading ? 'Saving...' : 'Save Draft 💾'}
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    style={{ background: 'var(--black)', color: 'var(--white)', border: 'none', padding: '0.7vw 2vw', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Continue to Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    style={{ background: '#166534', color: '#ffffff', border: 'none', padding: '0.7vw 2vw', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Technical Review 🚀'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Global Toast */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: 'var(--black)',
              color: 'var(--white)',
              padding: '1rem 1.8rem',
              borderRadius: '10px',
              zIndex: 99999,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              fontWeight: 600,
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>
    </RouteGuard>
  );
}

export default SubmitProjectPage;
