/* eslint-disable */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import CustomHead from '@src/components/dom/CustomHead';
import Logo from '@src/components/ui/Logo';
import styles from './get-started.module.scss';

const seo = {
  title: 'Start Your Project or FYP Guidance | Homies Studio',
  description:
    'Tell us about your project requirements. Connect with Homies Studio for website development, AI software, or final year engineering guidance.',
  keywords: [
    'Homies Studio Inquiry',
    'Get Started Homies Studio',
    'Start Project Homies Studio',
    'Website Development Inquiry',
    'Final Year Project Onboarding',
  ],
  canonical: '/get-started',
};

const getStartedSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.homiesstudio.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Get Started',
          item: 'https://www.homiesstudio.com/get-started',
        },
      ],
    },
  ],
};

const SECTORS = [
  {
    id: '01 — Engineering Student',
    title: '01 — Engineering Student',
    subtext: 'B.Tech / M.Tech Final Year Projects',
  },
  {
    id: '02 — College or University',
    title: '02 — College or University',
    subtext: 'Institutional & Academic Tech',
  },
  {
    id: '03 — EdTech Institute',
    title: '03 — EdTech Institute',
    subtext: 'Training & LMS Platforms',
  },
  {
    id: '04 — Startup or Business',
    title: '04 — Startup or Business',
    subtext: 'MVPs, SaaS & AI Solutions',
  },
  {
    id: '05 — Other',
    title: '05 — Other',
    subtext: 'Custom Solutions & Enquiries',
  },
];

const INITIAL_FORM_STATE = {
  sector: '',
  name: '',
  email: '',
  phone: '',
  institutionName: '',
  designation: '',
  companyName: '',
  role: '',
  // Step 3 — Student
  branch: '',
  projectDomain: '',
  submissionTimeline: '',
  studentIdea: '',
  // Step 3 — College / EdTech
  requirementType: '',
  studentCount: '',
  institutionalTimeline: '',
  budgetRange: '',
  requirementDetails: '',
  // Step 3 — Startup
  productType: '',
  stage: '',
  startupBudget: '',
  startupTimeline: '',
  productDescription: '',
  // Step 3 — Other
  subject: '',
  message: '',
  agreed: false,
};

export default function GetStartedPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  // Hide the global site header/footer while on the dedicated get-started page
  useEffect(() => {
    document.body.classList.add('get-started-active');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      document.body.classList.remove('get-started-active');
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.sector) {
      const qSector = String(router.query.sector).toLowerCase();
      if (qSector === 'business' || qSector === 'startup' || qSector === 'website') {
        const prod = router.query.product === 'website' ? 'Website Development' : '';
        setFormData((prev) => ({
          ...prev,
          sector: '04 — Startup or Business',
          ...(prod ? { productType: prod } : {}),
        }));
      }
    }
  }, [router.isReady, router.query]);

  const isInstitutional =
    formData.sector === '02 — College or University' || formData.sector === '03 — EdTech Institute';
  const isStudent = formData.sector === '01 — Engineering Student';
  const isStartup = formData.sector === '04 — Startup or Business';
  const isOther = formData.sector === '05 — Other';

  const validateField = (field, value) => {
    let error = '';
    const val = typeof value === 'string' ? value.trim() : value;

    if (field === 'name') {
      if (!val || val.length < 2) error = 'Please enter your full name.';
    } else if (field === 'email') {
      if (!val) error = 'Please enter your email address.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Please enter a valid email address.';
    } else if (field === 'phone') {
      if (!val) error = 'Please enter your phone / WhatsApp number.';
      else if (val.length < 6) error = 'Please enter a valid phone number.';
    } else if (field === 'institutionName' && isInstitutional) {
      if (!val) error = 'Institution name is required.';
    } else if (field === 'branch' && isStudent) {
      if (!val) error = 'Please select your engineering branch.';
    } else if (field === 'projectDomain' && isStudent) {
      if (!val) error = 'Please select a project domain.';
    } else if (field === 'submissionTimeline' && isStudent) {
      if (!val) error = 'Please select your expected submission timeline.';
    } else if (field === 'requirementType' && isInstitutional) {
      if (!val) error = 'Please select a requirement type.';
    } else if (field === 'institutionalTimeline' && isInstitutional) {
      if (!val) error = 'Please select your expected timeline.';
    } else if (field === 'requirementDetails' && isInstitutional) {
      if (!val) error = 'Please provide details & objectives of your requirement.';
    } else if (field === 'productType' && isStartup) {
      if (!val) error = 'Please select what you want to build.';
    } else if (field === 'stage' && isStartup) {
      if (!val) error = 'Please select the current stage.';
    } else if (field === 'startupTimeline' && isStartup) {
      if (!val) error = 'Please select your expected timeline.';
    } else if (field === 'productDescription' && isStartup) {
      if (!val) error = 'Please describe your product or requirement.';
    } else if (field === 'subject' && isOther) {
      if (!val) error = 'Please enter a subject.';
    } else if (field === 'message' && isOther) {
      if (!val || val.length < 30) error = 'Message must be at least 30 characters.';
    }

    return error;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field] || errors[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    const newTouched = {};

    if (step === 1) {
      if (!formData.sector) {
        newErrors.sector = 'Please select an option to proceed.';
      }
    } else if (step === 2) {
      ['name', 'email', 'phone'].forEach((field) => {
        newTouched[field] = true;
        const err = validateField(field, formData[field]);
        if (err) newErrors[field] = err;
      });

      if (isInstitutional) {
        newTouched.institutionName = true;
        const instErr = validateField('institutionName', formData.institutionName);
        if (instErr) newErrors.institutionName = instErr;
      }
    } else if (step === 3) {
      if (isStudent) {
        ['branch', 'projectDomain', 'submissionTimeline'].forEach((field) => {
          newTouched[field] = true;
          const err = validateField(field, formData[field]);
          if (err) newErrors[field] = err;
        });
      } else if (isInstitutional) {
        ['requirementType', 'institutionalTimeline', 'requirementDetails'].forEach((field) => {
          newTouched[field] = true;
          const err = validateField(field, formData[field]);
          if (err) newErrors[field] = err;
        });
      } else if (isStartup) {
        ['productType', 'stage', 'startupTimeline', 'productDescription'].forEach((field) => {
          newTouched[field] = true;
          const err = validateField(field, formData[field]);
          if (err) newErrors[field] = err;
        });
      } else if (isOther) {
        ['subject', 'message'].forEach((field) => {
          newTouched[field] = true;
          const err = validateField(field, formData[field]);
          if (err) newErrors[field] = err;
        });
      }
    }

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setApiError(null);
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setApiError(null);
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!formData.agreed) {
      setErrors((prev) => ({
        ...prev,
        agreed: 'You must agree to the Privacy Policy and Terms of Use.',
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/get-started', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setApiError(json.error || 'Something went wrong. Please try WhatsApp directly.');
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setIsSubmittedSuccessfully(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setApiError('Something went wrong. Please try WhatsApp directly.');
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progressPercentage = ((currentStep - 1) / 3) * 100;

  return (
    <>
      <CustomHead {...seo} pageSchema={getStartedSchema} />

      <main className={styles.pageWrapper}>
        {/* Top Header Bar */}
        <header className={styles.topBar}>
          <Link href="/" className={styles.brandLink} aria-label="HOMIES STUDIO homepage">
            <Logo variant="dark" size="md" />
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.backTopButton}
            aria-label="Go to previous page"
          >
            ← Back
          </button>
        </header>

        {/* Success View */}
        {isSubmittedSuccessfully ? (
          <div className={styles.successWrapper} role="status">
            <div className={styles.successCheckmark}>✓</div>
            <h1 className={styles.successTitle}>We&apos;ve received your inquiry.</h1>
            <p className={styles.successSubtitle}>
              Our team will reach out within 24 hours on WhatsApp or email.
            </p>
            <div className={styles.successButtons}>
              <a
                href="https://wa.me/917416636417"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappSuccessBtn}
              >
                💬 Chat with us now on WhatsApp
              </a>
              <Link href="/" className={styles.homeSuccessBtn}>
                ← Back to Homies Studio
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.formContainer}>
            {/* Progress Section */}
            <div className={styles.progressSection}>
              <div className={styles.stepIndicatorRow}>
                <span className={styles.stepNumberText}>Step {currentStep} of 4</span>
                <span className={styles.stepPercentageText}>
                  {currentStep === 1
                    ? '25%'
                    : currentStep === 2
                    ? '50%'
                    : currentStep === 3
                    ? '75%'
                    : '100%'}
                </span>
              </div>
              <div
                className={styles.progressBarTrack}
                role="progressbar"
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={4}
                aria-label={`Step ${currentStep} of 4`}
              >
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${Math.max(progressPercentage, 10)}%` }}
                />
              </div>
            </div>

            {/* Error Banner */}
            {apiError && (
              <div className={styles.errorBanner} role="alert">
                {apiError}
                <a
                  href="https://wa.me/917416636417"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.errorBannerLink}
                >
                  Contact WhatsApp →
                </a>
              </div>
            )}

            {/* Step 1: Select Sector */}
            {currentStep === 1 && (
              <div className={styles.stepBlock}>
                <div className={styles.stepHeader}>
                  <h1 className={styles.stepHeading}>What can we help you with?</h1>
                  <p className={styles.stepSubtext}>Select the option that best describes you.</p>
                </div>

                <div className={styles.sectorGrid} role="radiogroup" aria-label="Select your sector">
                  {SECTORS.map((sector) => {
                    const isSelected = formData.sector === sector.id;
                    return (
                      <div
                        key={sector.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className={clsx(styles.sectorCard, isSelected && styles.activeSectorCard)}
                        onClick={() => {
                          handleChange('sector', sector.id);
                          setErrors((prev) => ({ ...prev, sector: '' }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleChange('sector', sector.id);
                            setErrors((prev) => ({ ...prev, sector: '' }));
                          }
                        }}
                      >
                        <div className={styles.cardTitle}>{sector.title}</div>
                        <div className={styles.cardSubtext}>{sector.subtext}</div>
                      </div>
                    );
                  })}
                </div>

                {errors.sector && (
                  <div className={styles.fieldErrorText} role="alert" style={{ marginBottom: '1.5rem' }}>
                    {errors.sector}
                  </div>
                )}

                {formData.sector && (
                  <div className={styles.actionsRow}>
                    <button type="button" onClick={handleNext} className={styles.primarySubmitBtn}>
                      Next →
                    </button>
                    <button type="button" onClick={handleBack} className={styles.backStepBtn}>
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Basic Details */}
            {currentStep === 2 && (
              <div className={styles.stepBlock}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.stepHeading}>Tell us about yourself.</h2>
                  <p className={styles.stepSubtext}>
                    Enter your contact information so we can get in touch.
                  </p>
                </div>

                <div className={styles.fieldsColumn}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="fullName" className={styles.fieldLabel}>
                      Full Name <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className={clsx(styles.textInput, errors.name && styles.hasError)}
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      required
                    />
                    {errors.name && (
                      <span className={styles.fieldErrorText} role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className={styles.twoColGrid}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="emailAddress" className={styles.fieldLabel}>
                        Email Address <span className={styles.requiredAsterisk}>*</span>
                      </label>
                      <input
                        id="emailAddress"
                        type="email"
                        className={clsx(styles.textInput, errors.email && styles.hasError)}
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        required
                      />
                      {errors.email && (
                        <span className={styles.fieldErrorText} role="alert">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="phoneNumber" className={styles.fieldLabel}>
                        Phone / WhatsApp <span className={styles.requiredAsterisk}>*</span>
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        className={clsx(styles.textInput, errors.phone && styles.hasError)}
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        required
                      />
                      {errors.phone && (
                        <span className={styles.fieldErrorText} role="alert">
                          {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Institutional extra fields */}
                  {isInstitutional && (
                    <>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="institutionName" className={styles.fieldLabel}>
                          Institution Name <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <input
                          id="institutionName"
                          type="text"
                          className={clsx(
                            styles.textInput,
                            errors.institutionName && styles.hasError
                          )}
                          placeholder="e.g. Oxford Engineering College"
                          value={formData.institutionName}
                          onChange={(e) => handleChange('institutionName', e.target.value)}
                          onBlur={() => handleBlur('institutionName')}
                          required
                        />
                        {errors.institutionName && (
                          <span className={styles.fieldErrorText} role="alert">
                            {errors.institutionName}
                          </span>
                        )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="designation" className={styles.fieldLabel}>
                          Designation / Role <span className={styles.optionalTag}>(Optional)</span>
                        </label>
                        <input
                          id="designation"
                          type="text"
                          className={styles.textInput}
                          placeholder="e.g. HOD Computer Science / Dean"
                          value={formData.designation}
                          onChange={(e) => handleChange('designation', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* Startup extra fields */}
                  {isStartup && (
                    <div className={styles.twoColGrid}>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="companyName" className={styles.fieldLabel}>
                          Company / Startup Name <span className={styles.optionalTag}>(Optional)</span>
                        </label>
                        <input
                          id="companyName"
                          type="text"
                          className={styles.textInput}
                          placeholder="e.g. Acme Tech Solutions"
                          value={formData.companyName}
                          onChange={(e) => handleChange('companyName', e.target.value)}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="role" className={styles.fieldLabel}>
                          Your Role <span className={styles.optionalTag}>(Optional)</span>
                        </label>
                        <input
                          id="role"
                          type="text"
                          className={styles.textInput}
                          placeholder="e.g. Founder / CTO"
                          value={formData.role}
                          onChange={(e) => handleChange('role', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.actionsRow}>
                  <button type="button" onClick={handleNext} className={styles.primarySubmitBtn}>
                    Next →
                  </button>
                  <button type="button" onClick={handleBack} className={styles.backStepBtn}>
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Project Details */}
            {currentStep === 3 && (
              <div className={styles.stepBlock}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.stepHeading}>What are you looking for?</h2>
                  <p className={styles.stepSubtext}>
                    Provide details about your project or organizational goals.
                  </p>
                </div>

                <div className={styles.fieldsColumn}>
                  {/* IF Engineering Student */}
                  {isStudent && (
                    <>
                      <div className={styles.twoColGrid}>
                        <div className={styles.fieldGroup}>
                          <label htmlFor="branch" className={styles.fieldLabel}>
                            Branch <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <select
                            id="branch"
                            className={clsx(styles.selectInput, errors.branch && styles.hasError)}
                            value={formData.branch}
                            onChange={(e) => handleChange('branch', e.target.value)}
                            onBlur={() => handleBlur('branch')}
                            required
                          >
                            <option value="">Select Branch</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="IT">IT</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.branch && (
                            <span className={styles.fieldErrorText} role="alert">
                              {errors.branch}
                            </span>
                          )}
                        </div>

                        <div className={styles.fieldGroup}>
                          <label htmlFor="projectDomain" className={styles.fieldLabel}>
                            Project Domain <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <select
                            id="projectDomain"
                            className={clsx(
                              styles.selectInput,
                              errors.projectDomain && styles.hasError
                            )}
                            value={formData.projectDomain}
                            onChange={(e) => handleChange('projectDomain', e.target.value)}
                            onBlur={() => handleBlur('projectDomain')}
                            required
                          >
                            <option value="">Select Domain</option>
                            <option value="IoT & Robotics">IoT &amp; Robotics</option>
                            <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                            <option value="Embedded Systems">Embedded Systems</option>
                            <option value="Full Stack Web">Full Stack Web</option>
                            <option value="Computer Vision">Computer Vision</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="Data Engineering">Data Engineering</option>
                            <option value="Not Sure Yet">Not Sure Yet</option>
                          </select>
                          {errors.projectDomain && (
                            <span className={styles.fieldErrorText} role="alert">
                              {errors.projectDomain}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="submissionTimeline" className={styles.fieldLabel}>
                          Expected Submission Timeline <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <select
                          id="submissionTimeline"
                          className={clsx(
                            styles.selectInput,
                            errors.submissionTimeline && styles.hasError
                          )}
                          value={formData.submissionTimeline}
                          onChange={(e) => handleChange('submissionTimeline', e.target.value)}
                          onBlur={() => handleBlur('submissionTimeline')}
                          required
                        >
                          <option value="">Select Timeline</option>
                          <option value="Less than 1 Month">Less than 1 Month</option>
                          <option value="1–2 Months">1–2 Months</option>
                          <option value="3+ Months">3+ Months</option>
                        </select>
                        {errors.submissionTimeline && (
                          <span className={styles.fieldErrorText} role="alert">
                            {errors.submissionTimeline}
                          </span>
                        )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="studentIdea" className={styles.fieldLabel}>
                          Tell us about your project idea{' '}
                          <span className={styles.optionalTag}>(Optional)</span>
                        </label>
                        <textarea
                          id="studentIdea"
                          className={styles.textareaInput}
                          placeholder="Describe your idea or paste your college requirements..."
                          value={formData.studentIdea}
                          onChange={(e) => handleChange('studentIdea', e.target.value)}
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {/* IF College or University / EdTech */}
                  {isInstitutional && (
                    <>
                      <div className={styles.twoColGrid}>
                        <div className={styles.fieldGroup}>
                          <label htmlFor="requirementType" className={styles.fieldLabel}>
                            Requirement Type <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <select
                            id="requirementType"
                            className={clsx(
                              styles.selectInput,
                              errors.requirementType && styles.hasError
                            )}
                            value={formData.requirementType}
                            onChange={(e) => handleChange('requirementType', e.target.value)}
                            onBlur={() => handleBlur('requirementType')}
                            required
                          >
                            <option value="">Select Requirement</option>
                            <option value="Student Project Programs">Student Project Programs</option>
                            <option value="Workshop & Bootcamp">Workshop &amp; Bootcamp</option>
                            <option value="LMS Platform">LMS Platform</option>
                            <option value="IoT Lab Setup">IoT Lab Setup</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.requirementType && (
                            <span className={styles.fieldErrorText} role="alert">
                              {errors.requirementType}
                            </span>
                          )}
                        </div>

                        <div className={styles.fieldGroup}>
                          <label htmlFor="studentCount" className={styles.fieldLabel}>
                            Number of Students <span className={styles.optionalTag}>(Optional)</span>
                          </label>
                          <select
                            id="studentCount"
                            className={styles.selectInput}
                            value={formData.studentCount}
                            onChange={(e) => handleChange('studentCount', e.target.value)}
                          >
                            <option value="">Select Cohort Size</option>
                            <option value="Under 50">Under 50</option>
                            <option value="50–200">50–200</option>
                            <option value="200–500">200–500</option>
                            <option value="500+">500+</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="institutionalTimeline" className={styles.fieldLabel}>
                          Expected Timeline <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <select
                          id="institutionalTimeline"
                          className={clsx(
                            styles.selectInput,
                            errors.institutionalTimeline && styles.hasError
                          )}
                          value={formData.institutionalTimeline}
                          onChange={(e) => handleChange('institutionalTimeline', e.target.value)}
                          onBlur={() => handleBlur('institutionalTimeline')}
                          required
                        >
                          <option value="">Select Timeline</option>
                          <option value="Immediate (<1 Month)">Immediate (&lt;1 Month)</option>
                          <option value="1–3 Months">1–3 Months</option>
                          <option value="Next Academic Year">Next Academic Year</option>
                        </select>
                        {errors.institutionalTimeline && (
                          <span className={styles.fieldErrorText} role="alert">
                            {errors.institutionalTimeline}
                          </span>
                        )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Budget Range <span className={styles.optionalTag}>(Optional)</span>
                        </label>
                        <div className={styles.buttonGroupRow}>
                          {[
                            'Below ₹50,000',
                            '₹50,000–₹1,00,000',
                            '₹1,00,000–₹3,00,000',
                            '₹3,00,000+',
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={clsx(
                                styles.budgetOptionBtn,
                                formData.budgetRange === opt && styles.activeBudgetBtn
                              )}
                              onClick={() => handleChange('budgetRange', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="requirementDetails" className={styles.fieldLabel}>
                          Requirement Details &amp; Objectives{' '}
                          <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <textarea
                          id="requirementDetails"
                          className={clsx(
                            styles.textareaInput,
                            errors.requirementDetails && styles.hasError
                          )}
                          placeholder="Describe specific project domains, student learning outcomes, or technical deliverables required..."
                          value={formData.requirementDetails}
                          onChange={(e) => handleChange('requirementDetails', e.target.value)}
                          onBlur={() => handleBlur('requirementDetails')}
                          rows={4}
                          required
                        />
                        {errors.requirementDetails && (
                          <span className={styles.fieldErrorText} role="alert">
                            {errors.requirementDetails}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {/* IF Startup or Business */}
                  {isStartup && (
                    <>
                      <div className={styles.twoColGrid}>
                        <div className={styles.fieldGroup}>
                          <label htmlFor="productType" className={styles.fieldLabel}>
                            What do you want to build? <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <select
                            id="productType"
                            className={clsx(
                              styles.selectInput,
                              errors.productType && styles.hasError
                            )}
                            value={formData.productType}
                            onChange={(e) => handleChange('productType', e.target.value)}
                            onBlur={() => handleBlur('productType')}
                            required
                          >
                            <option value="">Select Option</option>
                            <option value="Website Development">Website Development</option>
                            <option value="AI Agent">AI Agent</option>
                            <option value="SaaS Platform">SaaS Platform</option>
                            <option value="Web App">Web App</option>
                            <option value="Mobile App">Mobile App</option>
                            <option value="Automation System">Automation System</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.productType && (
                            <span className={styles.fieldErrorText} role="alert">
                              {errors.productType}
                            </span>
                          )}
                        </div>

                        <div className={styles.fieldGroup}>
                          <label htmlFor="stage" className={styles.fieldLabel}>
                            Stage <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <select
                            id="stage"
                            className={clsx(styles.selectInput, errors.stage && styles.hasError)}
                            value={formData.stage}
                            onChange={(e) => handleChange('stage', e.target.value)}
                            onBlur={() => handleBlur('stage')}
                            required
                          >
                            <option value="">Select Stage</option>
                            <option value="Idea">Idea</option>
                            <option value="MVP">MVP</option>
                            <option value="Scaling Existing Product">
                              Scaling Existing Product
                            </option>
                          </select>
                          {errors.stage && (
                            <span className={styles.fieldErrorText} role="alert">
                              {errors.stage}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Budget Range <span className={styles.optionalTag}>(Optional)</span>
                        </label>
                        <div className={styles.buttonGroupRow}>
                          {[
                            'Below ₹50,000',
                            '₹50,000–₹2,00,000',
                            '₹2,00,000–₹5,00,000',
                            '₹5,00,000+',
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={clsx(
                                styles.budgetOptionBtn,
                                formData.startupBudget === opt && styles.activeBudgetBtn
                              )}
                              onClick={() => handleChange('startupBudget', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="startupTimeline" className={styles.fieldLabel}>
                          Expected Timeline <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <select
                          id="startupTimeline"
                          className={clsx(
                            styles.selectInput,
                            errors.startupTimeline && styles.hasError
                          )}
                          value={formData.startupTimeline}
                          onChange={(e) => handleChange('startupTimeline', e.target.value)}
                          onBlur={() => handleBlur('startupTimeline')}
                          required
                        >
                          <option value="">Select Timeline</option>
                          <option value="ASAP">ASAP</option>
                          <option value="1 Month">1 Month</option>
                          <option value="2–3 Months">2–3 Months</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                        {errors.startupTimeline && (
                          <span className={styles.fieldErrorText} role="alert">
                            {errors.startupTimeline}
                          </span>
                        )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="productDescription" className={styles.fieldLabel}>
                          Describe your product or requirement{' '}
                          <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <textarea
                          id="productDescription"
                          className={clsx(
                            styles.textareaInput,
                            errors.productDescription && styles.hasError
                          )}
                          placeholder="Tell us about the key features, target users, or architectural requirements..."
                          value={formData.productDescription}
                          onChange={(e) => handleChange('productDescription', e.target.value)}
                          onBlur={() => handleBlur('productDescription')}
                          rows={4}
                          required
                        />
                        {errors.productDescription && (
                          <span className={styles.fieldErrorText} role="alert">
                            {errors.productDescription}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {/* IF Other */}
                  {isOther && (
                    <>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="subject" className={styles.fieldLabel}>
                          Subject <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <input
                          id="subject"
                          type="text"
                          className={clsx(styles.textInput, errors.subject && styles.hasError)}
                          placeholder="e.g. Partnership Enquiry / Custom Collaboration"
                          value={formData.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          onBlur={() => handleBlur('subject')}
                          required
                        />
                        {errors.subject && (
                          <span className={styles.fieldErrorText} role="alert">
                            {errors.subject}
                          </span>
                        )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="otherMessage" className={styles.fieldLabel}>
                          Message <span className={styles.requiredAsterisk}>*</span>{' '}
                          <span className={styles.optionalTag}>(Min 30 characters)</span>
                        </label>
                        <textarea
                          id="otherMessage"
                          className={clsx(styles.textareaInput, errors.message && styles.hasError)}
                          placeholder="Please provide comprehensive details about your inquiry or requirements..."
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          onBlur={() => handleBlur('message')}
                          rows={5}
                          required
                        />
                        {errors.message && (
                          <span className={styles.fieldErrorText} role="alert">
                            {errors.message}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.actionsRow}>
                  <button type="button" onClick={handleNext} className={styles.primarySubmitBtn}>
                    Next →
                  </button>
                  <button type="button" onClick={handleBack} className={styles.backStepBtn}>
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <form onSubmit={handleSubmit} className={styles.stepBlock}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.stepHeading}>Review your submission.</h2>
                  <p className={styles.stepSubtext}>
                    Double-check your information before sending your inquiry.
                  </p>
                </div>

                <div className={styles.reviewContainer}>
                  {/* Sector Summary */}
                  <div className={styles.reviewCard}>
                    <div className={styles.reviewCardHeader}>
                      <h3 className={styles.reviewCardTitle}>01. Sector Category</h3>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => setCurrentStep(1)}
                      >
                        Edit
                      </button>
                    </div>
                    <div className={styles.reviewGrid}>
                      <div className={clsx(styles.reviewItem, styles.fullWidthItem)}>
                        <span className={styles.itemLabel}>Selected Sector</span>
                        <span className={styles.itemValue}>{formData.sector}</span>
                      </div>
                    </div>
                  </div>

                  {/* Basic Details Summary */}
                  <div className={styles.reviewCard}>
                    <div className={styles.reviewCardHeader}>
                      <h3 className={styles.reviewCardTitle}>02. Basic Details</h3>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => setCurrentStep(2)}
                      >
                        Edit
                      </button>
                    </div>
                    <div className={styles.reviewGrid}>
                      <div className={styles.reviewItem}>
                        <span className={styles.itemLabel}>Full Name</span>
                        <span className={styles.itemValue}>{formData.name}</span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.itemLabel}>Email Address</span>
                        <span className={styles.itemValue}>{formData.email}</span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.itemLabel}>Phone / WhatsApp</span>
                        <span className={styles.itemValue}>{formData.phone}</span>
                      </div>
                      {formData.institutionName && (
                        <div className={styles.reviewItem}>
                          <span className={styles.itemLabel}>Institution</span>
                          <span className={styles.itemValue}>{formData.institutionName}</span>
                        </div>
                      )}
                      {formData.designation && (
                        <div className={styles.reviewItem}>
                          <span className={styles.itemLabel}>Designation</span>
                          <span className={styles.itemValue}>{formData.designation}</span>
                        </div>
                      )}
                      {formData.companyName && (
                        <div className={styles.reviewItem}>
                          <span className={styles.itemLabel}>Company</span>
                          <span className={styles.itemValue}>{formData.companyName}</span>
                        </div>
                      )}
                      {formData.role && (
                        <div className={styles.reviewItem}>
                          <span className={styles.itemLabel}>Role</span>
                          <span className={styles.itemValue}>{formData.role}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Details Summary */}
                  <div className={styles.reviewCard}>
                    <div className={styles.reviewCardHeader}>
                      <h3 className={styles.reviewCardTitle}>03. Project Details</h3>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => setCurrentStep(3)}
                      >
                        Edit
                      </button>
                    </div>
                    <div className={styles.reviewGrid}>
                      {isStudent && (
                        <>
                          <div className={styles.reviewItem}>
                            <span className={styles.itemLabel}>Branch</span>
                            <span className={styles.itemValue}>{formData.branch}</span>
                          </div>
                          <div className={styles.reviewItem}>
                            <span className={styles.itemLabel}>Project Domain</span>
                            <span className={styles.itemValue}>{formData.projectDomain}</span>
                          </div>
                          <div className={styles.reviewItem}>
                            <span className={styles.itemLabel}>Timeline</span>
                            <span className={styles.itemValue}>{formData.submissionTimeline}</span>
                          </div>
                          {formData.studentIdea && (
                            <div className={clsx(styles.reviewItem, styles.fullWidthItem)}>
                              <span className={styles.itemLabel}>Project Idea</span>
                              <span className={styles.itemValue}>{formData.studentIdea}</span>
                            </div>
                          )}
                        </>
                      )}

                      {isInstitutional && (
                        <>
                          <div className={styles.reviewItem}>
                            <span className={styles.itemLabel}>Requirement Type</span>
                            <span className={styles.itemValue}>{formData.requirementType}</span>
                          </div>
                          {formData.studentCount && (
                            <div className={styles.reviewItem}>
                              <span className={styles.itemLabel}>Students</span>
                              <span className={styles.itemValue}>{formData.studentCount}</span>
                            </div>
                          )}
                          <div className={styles.reviewItem}>
                            <span className={styles.itemLabel}>Timeline</span>
                            <span className={styles.itemValue}>
                              {formData.institutionalTimeline}
                            </span>
                          </div>
                          {formData.budgetRange && (
                            <div className={styles.reviewItem}>
                              <span className={styles.itemLabel}>Budget Range</span>
                              <span className={styles.itemValue}>{formData.budgetRange}</span>
                            </div>
                          )}
                          <div className={clsx(styles.reviewItem, styles.fullWidthItem)}>
                            <span className={styles.itemLabel}>Objectives &amp; Details</span>
                            <span className={styles.itemValue}>
                              {formData.requirementDetails}
                            </span>
                          </div>
                        </>
                      )}

                      {isStartup && (
                        <>
                          <div className={styles.reviewItem}>
                            <span className={styles.itemLabel}>Product Type</span>
                            <span className={styles.itemValue}>{formData.productType}</span>
                          </div>
                          <div className={styles.reviewItem}>
                            <span className={styles.itemLabel}>Stage</span>
                            <span className={styles.itemValue}>{formData.stage}</span>
                          </div>
                          <div className={styles.reviewItem}>
                            <span className={styles.itemLabel}>Timeline</span>
                            <span className={styles.itemValue}>{formData.startupTimeline}</span>
                          </div>
                          {formData.startupBudget && (
                            <div className={styles.reviewItem}>
                              <span className={styles.itemLabel}>Budget</span>
                              <span className={styles.itemValue}>{formData.startupBudget}</span>
                            </div>
                          )}
                          <div className={clsx(styles.reviewItem, styles.fullWidthItem)}>
                            <span className={styles.itemLabel}>Product Description</span>
                            <span className={styles.itemValue}>
                              {formData.productDescription}
                            </span>
                          </div>
                        </>
                      )}

                      {isOther && (
                        <>
                          <div className={clsx(styles.reviewItem, styles.fullWidthItem)}>
                            <span className={styles.itemLabel}>Subject</span>
                            <span className={styles.itemValue}>{formData.subject}</span>
                          </div>
                          <div className={clsx(styles.reviewItem, styles.fullWidthItem)}>
                            <span className={styles.itemLabel}>Message</span>
                            <span className={styles.itemValue}>{formData.message}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="agreeCheckbox"
                    checked={formData.agreed}
                    onChange={(e) => {
                      setFormData({ ...formData, agreed: e.target.checked });
                      if (e.target.checked) {
                        setErrors((prev) => ({ ...prev, agreed: '' }));
                      }
                    }}
                    className={styles.checkboxInput}
                  />
                  <label htmlFor="agreeCheckbox" className={styles.checkboxLabel}>
                    I agree to Homies Studio&apos;s{' '}
                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      Terms of Use
                    </a>
                    .
                  </label>
                </div>

                {(errors.agreed || formData.agreedError) && (
                  <p className={styles.checkboxError} role="alert">
                    You must agree to the Privacy Policy and Terms of Use.
                  </p>
                )}

                <div className={styles.actionsRow}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.primarySubmitBtn}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinner} /> Sending…
                      </>
                    ) : (
                      'Send Inquiry →'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className={styles.backStepBtn}
                  >
                    ← Back
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </>
  );
}
