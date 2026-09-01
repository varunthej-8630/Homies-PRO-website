/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { supabase } from '@src/lib/supabase/client';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import styles from './styles/conversationModal.module.scss';

const SECTORS = [
  { id: 'COLLEGE', label: '01 — Colleges & Universities', badge: 'Institutional & Academic Tech' },
  { id: 'EDTECH', label: '02 — EdTech Institutes', badge: 'Training & LMS Platforms' },
  { id: 'INDIVIDUAL', label: '03 — Individual Projects', badge: 'Capstone, AI/ML & Builds' },
  { id: 'BUSINESS', label: '04 — Businesses & Startups', badge: 'MVPs, SaaS & Automation' },
  { id: 'OTHER', label: '05 — Other', badge: 'Custom Solutions & Enquiries' },
];

const REQUIREMENT_TYPES_COLLEGE = [
  'Student Project Programs',
  'Academic Technology & LMS Portals',
  'Faculty & Student Technical Workshops',
  'Research & Advanced Labs Setup',
  'Campus Workflow Automation',
  'Institutional Partnership & Mou',
  'Other Institutional Solution',
];

const STUDENT_COUNTS_COLLEGE = ['Under 50 Students', '50 – 150 Students', '150 – 300 Students', '300 – 500 Students', '500+ Students Across Campus'];
const TIMELINES_COLLEGE = ['Immediate (< 1 Month)', 'Within 1–2 Months', 'Full Academic Semester', 'Flexible'];
const BUDGET_COLLEGE = ['Below ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹3,00,000', '₹3,00,000+'];

const SERVICES_EDTECH = [
  'Custom LMS & Learning Platform',
  'Student Management & Automation System',
  'Capstone Project Curriculum & Repositories',
  'AI Learning Assistant & Tutor Integration',
  'High-Converting Website & Mobile App',
  'Full-Stack Technical Program Delivery',
];
const LEARNERS_COUNT_EDTECH = ['Under 100 Learners', '100 – 500 Learners', '500 – 1,500 Learners', '1,500+ Learners'];
const TIMELINES_EDTECH = ['Immediate Launch', 'Within 1 Month', '1–3 Months', 'Flexible'];
const BUDGET_EDTECH = ['₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹2,50,000', '₹2,50,000+'];

const PROJECT_TYPES_INDIVIDUAL = [
  'Final-Year Engineering Capstone',
  'AI / ML & Deep Learning Model',
  'Full-Stack Web Application / SaaS',
  'Mobile Application (iOS / Android)',
  'IoT & Robotics Embedded System',
  'Research Paper & IEEE Build',
  'Custom Prototype / Other',
];
const ACADEMIC_LEVELS = ['B.Tech / BE Engineering', 'M.Tech / MS / Postgraduate', 'BCA / MCA / Computer Science', 'PhD / Academic Research', 'Independent Builder / Professional'];
const TIMELINES_INDIVIDUAL = ['Urgent (< 10 Days)', 'Within 2–3 Weeks', 'Within 1 Month', 'Flexible'];
const BUDGET_INDIVIDUAL = ['Below ₹3,000', '₹3,000 – ₹5,000', '₹5,000 – ₹10,000', '₹10,000+'];

const BUSINESS_TYPES = ['Early-Stage Startup', 'Funded Venture', 'Growth SME', 'Enterprise / Corporate', 'Agency / Studio Partner'];
const SERVICES_BUSINESS = [
  'Full-Stack MVP Development',
  'Custom AI & LLM Model Integration',
  'Workflow & Business Process Automation',
  'High-Performance Web App / SaaS',
  'Mobile Application Development',
  'Cloud Architecture & System Scaling',
];
const PROJECT_STAGES = ['Idea / Concept Stage', 'Wireframes / Architecture Ready', 'Prototype in Progress', 'Existing Product Overhaul / Scaling'];
const TIMELINES_BUSINESS = ['Urgent (< 3 Weeks)', '1–2 Months', '2–4 Months', 'Ongoing Technical Retainer'];
const BUDGET_BUSINESS = ['₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹3,00,000', '₹3,00,000+'];

const WHATSAPP_PHONE = '917416636417';

function generateWhatsAppUrl(sector, formData) {
  let text = `Hello Homies Studio,\n\nI would like to start a conversation.\n\n`;

  if (sector === 'COLLEGE') {
    text += `*Sector:* Colleges & Universities\n`;
    text += `*Institution:* ${formData.institutionName || 'Not specified'}\n`;
    text += `*Contact Person:* ${formData.contactPerson || 'Not specified'}\n`;
    if (formData.designation) text += `*Designation:* ${formData.designation}\n`;
    text += `*Email:* ${formData.email || 'Not specified'}\n`;
    text += `*Phone:* ${formData.phone || 'Not specified'}\n\n`;
    text += `*Requirement Type:* ${formData.requirementType || 'Not specified'}\n`;
    if (formData.studentCount) text += `*Student Count:* ${formData.studentCount}\n`;
    if (formData.timeline) text += `*Timeline:* ${formData.timeline}\n`;
    if (formData.budget) text += `*Budget Range:* ${formData.budget}\n\n`;
    text += `*Message / Scope:*\n${formData.message || 'We would like to discuss a collaboration with Homies Studio.'}\n`;
  } else if (sector === 'EDTECH') {
    text += `*Sector:* EdTech Institutes\n`;
    text += `*Institute Name:* ${formData.institutionName || 'Not specified'}\n`;
    text += `*Contact Person:* ${formData.contactPerson || 'Not specified'}\n`;
    text += `*Email:* ${formData.email || 'Not specified'}\n`;
    text += `*Phone:* ${formData.phone || 'Not specified'}\n\n`;
    text += `*Service Required:* ${formData.requirementType || 'Not specified'}\n`;
    if (formData.studentCount) text += `*Learners Count:* ${formData.studentCount}\n`;
    if (formData.timeline) text += `*Timeline:* ${formData.timeline}\n`;
    if (formData.budget) text += `*Budget Range:* ${formData.budget}\n\n`;
    text += `*Message / Scope:*\n${formData.message || 'Looking for EdTech software & project collaboration.'}\n`;
  } else if (sector === 'INDIVIDUAL') {
    text += `*Sector:* Individual Projects\n`;
    text += `*Name:* ${formData.contactPerson || 'Not specified'}\n`;
    text += `*Email:* ${formData.email || 'Not specified'}\n`;
    text += `*Phone / WhatsApp:* ${formData.phone || 'Not specified'}\n\n`;
    text += `*Project Type:* ${formData.requirementType || 'Not specified'}\n`;
    if (formData.technology) text += `*Tech Domain:* ${formData.technology}\n`;
    if (formData.academicLevel) text += `*Academic Level:* ${formData.academicLevel}\n`;
    if (formData.timeline) text += `*Deadline:* ${formData.timeline}\n`;
    if (formData.budget) text += `*Budget:* ${formData.budget}\n\n`;
    text += `*Project Description:*\n${formData.message || 'Requesting build and guidance.'}\n`;
  } else if (sector === 'BUSINESS') {
    text += `*Sector:* Businesses & Startups\n`;
    text += `*Company Name:* ${formData.institutionName || 'Not specified'}\n`;
    text += `*Contact Person:* ${formData.contactPerson || 'Not specified'}\n`;
    text += `*Email:* ${formData.email || 'Not specified'}\n`;
    text += `*Phone:* ${formData.phone || 'Not specified'}\n\n`;
    if (formData.businessType) text += `*Business Type:* ${formData.businessType}\n`;
    text += `*Service Required:* ${formData.requirementType || 'Not specified'}\n`;
    if (formData.projectStage) text += `*Stage:* ${formData.projectStage}\n`;
    if (formData.timeline) text += `*Timeline:* ${formData.timeline}\n`;
    if (formData.budget) text += `*Budget:* ${formData.budget}\n\n`;
    text += `*Requirement / Scope:*\n${formData.message || 'Looking to develop a custom solution.'}\n`;
  } else {
    text += `*Sector:* General Enquiry / Other\n`;
    text += `*Name:* ${formData.contactPerson || 'Not specified'}\n`;
    text += `*Email:* ${formData.email || 'Not specified'}\n`;
    text += `*Phone:* ${formData.phone || 'Not specified'}\n`;
    if (formData.subject) text += `*Subject:* ${formData.subject}\n\n`;
    text += `*Message:*\n${formData.message || 'Hello Homies Studio, I would like to get in touch.'}\n`;
  }

  text += `\nThank you.`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

function ConversationModal() {
  const [isConversationOpen, setIsConversationOpen, lenis] = useStore(useShallow((state) => [state.isConversationOpen, state.setIsConversationOpen, state.lenis]));

  const [sector, setSector] = useState('COLLEGE');
  const [formData, setFormData] = useState({
    institutionName: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    requirementType: REQUIREMENT_TYPES_COLLEGE[0],
    studentCount: STUDENT_COUNTS_COLLEGE[0],
    timeline: TIMELINES_COLLEGE[0],
    budget: BUDGET_COLLEGE[1],
    technology: 'Python / AI & Full-Stack',
    academicLevel: ACADEMIC_LEVELS[0],
    businessType: BUSINESS_TYPES[0],
    projectStage: PROJECT_STAGES[0],
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  // Update default requirement types when switching sector
  const handleSectorSelect = (newSector) => {
    setSector(newSector);
    setErrors({});
    if (newSector === 'COLLEGE') {
      setFormData((prev) => ({
        ...prev,
        requirementType: REQUIREMENT_TYPES_COLLEGE[0],
        studentCount: STUDENT_COUNTS_COLLEGE[0],
        timeline: TIMELINES_COLLEGE[0],
        budget: BUDGET_COLLEGE[1],
      }));
    } else if (newSector === 'EDTECH') {
      setFormData((prev) => ({
        ...prev,
        requirementType: SERVICES_EDTECH[0],
        studentCount: LEARNERS_COUNT_EDTECH[0],
        timeline: TIMELINES_EDTECH[0],
        budget: BUDGET_EDTECH[1],
      }));
    } else if (newSector === 'INDIVIDUAL') {
      setFormData((prev) => ({
        ...prev,
        requirementType: PROJECT_TYPES_INDIVIDUAL[0],
        academicLevel: ACADEMIC_LEVELS[0],
        timeline: TIMELINES_INDIVIDUAL[0],
        budget: BUDGET_INDIVIDUAL[1],
      }));
    } else if (newSector === 'BUSINESS') {
      setFormData((prev) => ({
        ...prev,
        requirementType: SERVICES_BUSINESS[0],
        businessType: BUSINESS_TYPES[0],
        projectStage: PROJECT_STAGES[0],
        timeline: TIMELINES_BUSINESS[0],
        budget: BUDGET_BUSINESS[1],
      }));
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errs = {};

    if (sector === 'COLLEGE') {
      if (!formData.institutionName.trim()) errs.institutionName = 'Institution name is required.';
      if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact person name is required.';
      if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required.';
      if (!formData.phone.trim()) errs.phone = 'Contact phone number is required.';
      if (!formData.message.trim()) errs.message = 'Please provide details of your requirement.';
    } else if (sector === 'EDTECH') {
      if (!formData.institutionName.trim()) errs.institutionName = 'Institute name is required.';
      if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact person name is required.';
      if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required.';
      if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
      if (!formData.message.trim()) errs.message = 'Please provide details of your requirements.';
    } else if (sector === 'INDIVIDUAL') {
      if (!formData.contactPerson.trim()) errs.contactPerson = 'Your name is required.';
      if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email address is required.';
      if (!formData.phone.trim()) errs.phone = 'WhatsApp / phone number is required.';
      if (!formData.message.trim()) errs.message = 'Please describe what you want to build.';
    } else if (sector === 'BUSINESS') {
      if (!formData.institutionName.trim()) errs.institutionName = 'Company name is required.';
      if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact person name is required.';
      if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Work email is required.';
      if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
      if (!formData.message.trim()) errs.message = 'Please describe your project scope and objectives.';
    } else {
      if (!formData.contactPerson.trim()) errs.contactPerson = 'Name is required.';
      if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required.';
      if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
      if (!formData.subject.trim()) errs.subject = 'Subject is required.';
      if (!formData.message.trim()) errs.message = 'Message is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const ref = `HOM-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const waUrl = generateWhatsAppUrl(sector, formData);

    try {
      // 1. Save Enquiry to Supabase `enquiries` table
      if (supabase) {
        await supabase
          .from('enquiries')
          .insert({
            reference_id: ref,
            name: formData.contactPerson.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            sector,
            service_type: formData.requirementType || null,
            institution_or_company: formData.institutionName?.trim() || null,
            contact_person: formData.contactPerson.trim(),
            designation: formData.designation?.trim() || null,
            student_count: formData.studentCount || null,
            budget_range: formData.budget || null,
            timeline: formData.timeline || null,
            project_type: formData.requirementType || null,
            technology: formData.technology || null,
            academic_level: formData.academicLevel || null,
            message: formData.message.trim(),
            metadata: {
              businessType: formData.businessType || null,
              projectStage: formData.projectStage || null,
              subject: formData.subject || null,
            },
            status: 'NEW',
          })
          .catch(() => {
            // Non-blocking fallback if RLS or offline
          });
      }

      // 2. Also record via internal API
      fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector,
          formData,
          referenceId: ref,
        }),
      }).catch(() => {});

      setReferenceId(ref);
      setGeneratedWhatsAppUrl(waUrl);
      setIsSubmitted(true);

      // 3. Automatically trigger WhatsApp in background/new tab
      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 700);
    } catch {
      setGeneratedWhatsAppUrl(waUrl);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setIsConversationOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setErrors({});
    }, 300);
  }, [setIsConversationOpen]);

  useEffect(() => {
    if (isConversationOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isConversationOpen, lenis]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isConversationOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConversationOpen, handleClose]);

  if (!isConversationOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.backdrop} onClick={handleClose} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClose()} />

      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <span className={styles.brandSubtitle}>HOMIES STUDIO · PARTNERSHIP & BUILDS</span>
            <h3 className={clsx(styles.modalTitle, 'h3')}>Start a Conversation</h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className={styles.successWrapper}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={clsx(styles.successTitle, 'h3')}>Enquiry Successfully Submitted</h3>
            <p className={clsx(styles.successText, 'p')}>
              Reference ID: <strong>{referenceId}</strong>
            </p>
            <p className={clsx(styles.successSubtitle, 'p-xs')}>Your enquiry has been logged into Homies Studio engineering records. You can now chat directly with our technical team on WhatsApp.</p>

            <div className={styles.successActions}>
              <a href={generatedWhatsAppUrl} target="_blank" rel="noopener noreferrer" className={styles.whatsappPrimaryBtn}>
                <span>Open WhatsApp Chat ↗</span>
              </a>
              <button type="button" onClick={handleClose} className={styles.secondaryBtn}>
                Done & Return to Site
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.modalBody}>
            {/* Sector Selector */}
            <div className={styles.sectionBlock}>
              <span className={styles.sectionLabel}>What can we help you with? (Select Sector)</span>
              <div className={styles.sectorGrid}>
                {SECTORS.map((s) => (
                  <button key={s.id} type="button" onClick={() => handleSectorSelect(s.id)} className={clsx(styles.sectorCard, sector === s.id && styles.sectorCardActive)}>
                    <span className={styles.sectorCardTitle}>{s.label}</span>
                    <span className={styles.sectorCardBadge}>{s.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SECTOR 1: COLLEGES & UNIVERSITIES */}
            {sector === 'COLLEGE' && (
              <div className={styles.fieldsGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="instName">Institution Name *</label>
                  <input
                    id="instName"
                    type="text"
                    className={clsx(styles.inputField, errors.institutionName && styles.inputError)}
                    placeholder="e.g. National Institute of Technology"
                    value={formData.institutionName}
                    onChange={(e) => handleFieldChange('institutionName', e.target.value)}
                  />
                  {errors.institutionName && <span className={styles.errorText}>{errors.institutionName}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contactP">Contact Person Name *</label>
                  <input
                    id="contactP"
                    type="text"
                    className={clsx(styles.inputField, errors.contactPerson && styles.inputError)}
                    placeholder="e.g. Dr. Rajesh Kumar / Prof. Anita"
                    value={formData.contactPerson}
                    onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                  />
                  {errors.contactPerson && <span className={styles.errorText}>{errors.contactPerson}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="designation">Designation / Role</label>
                  <input
                    id="designation"
                    type="text"
                    className={styles.inputField}
                    placeholder="e.g. HOD Computer Science / Dean"
                    value={formData.designation}
                    onChange={(e) => handleFieldChange('designation', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Official Email *</label>
                  <input
                    id="email"
                    type="email"
                    className={clsx(styles.inputField, errors.email && styles.inputError)}
                    placeholder="e.g. hod_cse@nit.edu.in"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone / WhatsApp *</label>
                  <input
                    id="phone"
                    type="tel"
                    className={clsx(styles.inputField, errors.phone && styles.inputError)}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reqType">Requirement Type *</label>
                  <select id="reqType" className={styles.inputField} value={formData.requirementType} onChange={(e) => handleFieldChange('requirementType', e.target.value)}>
                    {REQUIREMENT_TYPES_COLLEGE.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="studentCount">Number of Students</label>
                  <select id="studentCount" className={styles.inputField} value={formData.studentCount} onChange={(e) => handleFieldChange('studentCount', e.target.value)}>
                    {STUDENT_COUNTS_COLLEGE.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="timeline">Expected Timeline</label>
                  <select id="timeline" className={styles.inputField} value={formData.timeline} onChange={(e) => handleFieldChange('timeline', e.target.value)}>
                    {TIMELINES_COLLEGE.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={clsx(styles.formGroup, styles.fullWidth)}>
                  <label htmlFor="budget">Budget Range</label>
                  <div className={styles.chipsContainer}>
                    {BUDGET_COLLEGE.map((b) => (
                      <button key={b} type="button" onClick={() => handleFieldChange('budget', b)} className={clsx(styles.chip, formData.budget === b && styles.chipActive)}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={clsx(styles.formGroup, styles.fullWidth)}>
                  <label htmlFor="message">Requirement Details & Objectives *</label>
                  <textarea
                    id="message"
                    rows={3}
                    className={clsx(styles.inputField, errors.message && styles.inputError)}
                    placeholder="Describe specific project domains, student learning outcomes, or technical deliverables required..."
                    value={formData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                  />
                  {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                </div>
              </div>
            )}

            {/* SECTOR 2: EDTECH INSTITUTES */}
            {sector === 'EDTECH' && (
              <div className={styles.fieldsGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="instName">Institute Name *</label>
                  <input
                    id="instName"
                    type="text"
                    className={clsx(styles.inputField, errors.institutionName && styles.inputError)}
                    placeholder="e.g. Apex Tech Learning Academy"
                    value={formData.institutionName}
                    onChange={(e) => handleFieldChange('institutionName', e.target.value)}
                  />
                  {errors.institutionName && <span className={styles.errorText}>{errors.institutionName}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contactP">Contact Person Name *</label>
                  <input
                    id="contactP"
                    type="text"
                    className={clsx(styles.inputField, errors.contactPerson && styles.inputError)}
                    placeholder="e.g. Vikram Sharma"
                    value={formData.contactPerson}
                    onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                  />
                  {errors.contactPerson && <span className={styles.errorText}>{errors.contactPerson}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    className={clsx(styles.inputField, errors.email && styles.inputError)}
                    placeholder="contact@apexlearning.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone / WhatsApp *</label>
                  <input
                    id="phone"
                    type="tel"
                    className={clsx(styles.inputField, errors.phone && styles.inputError)}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reqType">Service Required *</label>
                  <select id="reqType" className={styles.inputField} value={formData.requirementType} onChange={(e) => handleFieldChange('requirementType', e.target.value)}>
                    {SERVICES_EDTECH.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="studentCount">Number of Active Learners</label>
                  <select id="studentCount" className={styles.inputField} value={formData.studentCount} onChange={(e) => handleFieldChange('studentCount', e.target.value)}>
                    {LEARNERS_COUNT_EDTECH.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="timeline">Launch Timeline</label>
                  <select id="timeline" className={styles.inputField} value={formData.timeline} onChange={(e) => handleFieldChange('timeline', e.target.value)}>
                    {TIMELINES_EDTECH.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="budget">Budget Range</label>
                  <select id="budget" className={styles.inputField} value={formData.budget} onChange={(e) => handleFieldChange('budget', e.target.value)}>
                    {BUDGET_EDTECH.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={clsx(styles.formGroup, styles.fullWidth)}>
                  <label htmlFor="message">Platform & Program Requirements *</label>
                  <textarea
                    id="message"
                    rows={3}
                    className={clsx(styles.inputField, errors.message && styles.inputError)}
                    placeholder="Specify target features, LMS integrations, project repositories or student assessment automation..."
                    value={formData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                  />
                  {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                </div>
              </div>
            )}

            {/* SECTOR 3: INDIVIDUAL PROJECTS */}
            {sector === 'INDIVIDUAL' && (
              <div className={styles.fieldsGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="contactP">Your Full Name *</label>
                  <input
                    id="contactP"
                    type="text"
                    className={clsx(styles.inputField, errors.contactPerson && styles.inputError)}
                    placeholder="e.g. Rahul Verma"
                    value={formData.contactPerson}
                    onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                  />
                  {errors.contactPerson && <span className={styles.errorText}>{errors.contactPerson}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    className={clsx(styles.inputField, errors.email && styles.inputError)}
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone / WhatsApp *</label>
                  <input
                    id="phone"
                    type="tel"
                    className={clsx(styles.inputField, errors.phone && styles.inputError)}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reqType">Project Type *</label>
                  <select id="reqType" className={styles.inputField} value={formData.requirementType} onChange={(e) => handleFieldChange('requirementType', e.target.value)}>
                    {PROJECT_TYPES_INDIVIDUAL.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="techDomain">Preferred Technology / Frameworks</label>
                  <input
                    id="techDomain"
                    type="text"
                    className={styles.inputField}
                    placeholder="e.g. Python, PyTorch, React, Flutter, ESP32"
                    value={formData.technology}
                    onChange={(e) => handleFieldChange('technology', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="acadLevel">Academic Level</label>
                  <select id="acadLevel" className={styles.inputField} value={formData.academicLevel} onChange={(e) => handleFieldChange('academicLevel', e.target.value)}>
                    {ACADEMIC_LEVELS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="timeline">Submission Deadline</label>
                  <select id="timeline" className={styles.inputField} value={formData.timeline} onChange={(e) => handleFieldChange('timeline', e.target.value)}>
                    {TIMELINES_INDIVIDUAL.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={clsx(styles.formGroup, styles.fullWidth)}>
                  <label htmlFor="budget">Budget Range</label>
                  <div className={styles.chipsContainer}>
                    {BUDGET_INDIVIDUAL.map((b) => (
                      <button key={b} type="button" onClick={() => handleFieldChange('budget', b)} className={clsx(styles.chip, formData.budget === b && styles.chipActive)}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={clsx(styles.formGroup, styles.fullWidth)}>
                  <label htmlFor="message">Project Description & Deliverables Needed *</label>
                  <textarea
                    id="message"
                    rows={3}
                    className={clsx(styles.inputField, errors.message && styles.inputError)}
                    placeholder="Describe problem statement, dataset, IEEE base paper title, hardware schematics, or specific features..."
                    value={formData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                  />
                  {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                </div>
              </div>
            )}

            {/* SECTOR 4: BUSINESSES & STARTUPS */}
            {sector === 'BUSINESS' && (
              <div className={styles.fieldsGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="companyName">Company / Startup Name *</label>
                  <input
                    id="companyName"
                    type="text"
                    className={clsx(styles.inputField, errors.institutionName && styles.inputError)}
                    placeholder="e.g. Nexus Dynamics Technologies"
                    value={formData.institutionName}
                    onChange={(e) => handleFieldChange('institutionName', e.target.value)}
                  />
                  {errors.institutionName && <span className={styles.errorText}>{errors.institutionName}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contactP">Contact Person *</label>
                  <input
                    id="contactP"
                    type="text"
                    className={clsx(styles.inputField, errors.contactPerson && styles.inputError)}
                    placeholder="e.g. Siddharth Jain"
                    value={formData.contactPerson}
                    onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                  />
                  {errors.contactPerson && <span className={styles.errorText}>{errors.contactPerson}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Work Email *</label>
                  <input
                    id="email"
                    type="email"
                    className={clsx(styles.inputField, errors.email && styles.inputError)}
                    placeholder="siddharth@nexus.io"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone / WhatsApp *</label>
                  <input
                    id="phone"
                    type="tel"
                    className={clsx(styles.inputField, errors.phone && styles.inputError)}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bizType">Business Type</label>
                  <select id="bizType" className={styles.inputField} value={formData.businessType} onChange={(e) => handleFieldChange('businessType', e.target.value)}>
                    {BUSINESS_TYPES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reqType">Service Required *</label>
                  <select id="reqType" className={styles.inputField} value={formData.requirementType} onChange={(e) => handleFieldChange('requirementType', e.target.value)}>
                    {SERVICES_BUSINESS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="stage">Project Stage</label>
                  <select id="stage" className={styles.inputField} value={formData.projectStage} onChange={(e) => handleFieldChange('projectStage', e.target.value)}>
                    {PROJECT_STAGES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="timeline">Launch Timeline</label>
                  <select id="timeline" className={styles.inputField} value={formData.timeline} onChange={(e) => handleFieldChange('timeline', e.target.value)}>
                    {TIMELINES_BUSINESS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={clsx(styles.formGroup, styles.fullWidth)}>
                  <label htmlFor="budget">Budget Range</label>
                  <div className={styles.chipsContainer}>
                    {BUDGET_BUSINESS.map((b) => (
                      <button key={b} type="button" onClick={() => handleFieldChange('budget', b)} className={clsx(styles.chip, formData.budget === b && styles.chipActive)}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={clsx(styles.formGroup, styles.fullWidth)}>
                  <label htmlFor="message">Project Scope & Technical Requirement *</label>
                  <textarea
                    id="message"
                    rows={3}
                    className={clsx(styles.inputField, errors.message && styles.inputError)}
                    placeholder="Describe your product architecture, user personas, API requirements, or automation workflows..."
                    value={formData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                  />
                  {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                </div>
              </div>
            )}

            {/* SECTOR 5: OTHER / CUSTOM ENQUIRY */}
            {sector === 'OTHER' && (
              <div className={styles.fieldsGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="contactP">Your Name *</label>
                  <input
                    id="contactP"
                    type="text"
                    className={clsx(styles.inputField, errors.contactPerson && styles.inputError)}
                    placeholder="e.g. John Doe"
                    value={formData.contactPerson}
                    onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                  />
                  {errors.contactPerson && <span className={styles.errorText}>{errors.contactPerson}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    className={clsx(styles.inputField, errors.email && styles.inputError)}
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone / WhatsApp *</label>
                  <input
                    id="phone"
                    type="tel"
                    className={clsx(styles.inputField, errors.phone && styles.inputError)}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject *</label>
                  <input
                    id="subject"
                    type="text"
                    className={clsx(styles.inputField, errors.subject && styles.inputError)}
                    placeholder="e.g. Custom Partnership / Consultation"
                    value={formData.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                  />
                  {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
                </div>

                <div className={clsx(styles.formGroup, styles.fullWidth)}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    rows={4}
                    className={clsx(styles.inputField, errors.message && styles.inputError)}
                    placeholder="How can Homies Studio assist you?"
                    value={formData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                  />
                  {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className={styles.modalFooter}>
              <button type="button" onClick={handleClose} className={styles.secondaryBtn}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className={styles.primarySubmitBtn}>
                {isSubmitting ? 'Processing...' : 'Send Enquiry & Open WhatsApp →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ConversationModal;
