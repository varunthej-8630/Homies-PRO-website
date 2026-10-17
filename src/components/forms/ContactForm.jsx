/* eslint-disable */
import React, { useState } from 'react';
import { WhatsAppIcon } from '@src/components/ui/Icons';
import styles from './contactForm.module.scss';

const INQUIRY_OPTIONS = ['Website Development', 'Student FYP Guidance', 'College Partnership', 'AI & SaaS Solutions', 'Become a Creator', 'General'];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value || !value.trim()) return 'Full Name is required.';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email Address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address.';
        }
        return '';
      case 'inquiryType':
        if (!value || !INQUIRY_OPTIONS.includes(value)) {
          return 'Please select an inquiry type.';
        }
        return '';
      case 'message':
        if (!value || !value.trim()) return 'Message is required.';
        if (value.trim().length < 20) {
          return `Message must be at least 20 characters (currently ${value.trim().length}).`;
        }
        return '';
      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(false);

    // Mark all as touched
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      inquiryType: true,
      message: true,
    });

    const isValid = validateAll();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(true);
      }
    } catch (err) {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className={styles.successCard} role="status" aria-live="polite">
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>Message received. We&apos;ll reply within 24 hours.</h3>
        <p className={styles.successSubtitle}>Need an immediate response? You can also connect with our engineering team directly on WhatsApp.</p>
        <a
          href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20just%20submitted%20a%20contact%20form%20inquiry."
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappFallbackButton}
        >
          <WhatsAppIcon size={18} /> Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {submitError && (
        <div className={styles.errorBanner} role="alert">
          <span>Something went wrong. Try </span>
          <a
            href="https://wa.me/917416636417?text=Hi%20Homies%20Studio%2C%20I%20encountered%20an%20issue%20with%20the%20contact%20form."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.errorBannerLink}
          >
            WhatsApp instead.
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className={styles.formElement}>
        <div className={styles.formGrid}>
          {/* Full Name */}
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-name" className={styles.fieldLabel}>
              Full Name <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Rahul Sharma"
              className={`${styles.fieldInput} ${touched.fullName && errors.fullName ? styles.inputError : ''}`}
              aria-invalid={Boolean(touched.fullName && errors.fullName)}
              aria-describedby={touched.fullName && errors.fullName ? 'contact-name-error' : undefined}
            />
            {touched.fullName && errors.fullName && (
              <span id="contact-name-error" className={styles.errorMessage} role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-email" className={styles.fieldLabel}>
              Email Address <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. rahul@example.com"
              className={`${styles.fieldInput} ${touched.email && errors.email ? styles.inputError : ''}`}
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? 'contact-email-error' : undefined}
            />
            {touched.email && errors.email && (
              <span id="contact-email-error" className={styles.errorMessage} role="alert">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formGrid}>
          {/* Phone Number */}
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-phone" className={styles.fieldLabel}>
              Phone Number <span className={styles.optionalLabel}>(optional)</span>
            </label>
            <input id="contact-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} placeholder="+91 XXXXX XXXXX" className={styles.fieldInput} />
          </div>

          {/* Inquiry Type */}
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-inquiryType" className={styles.fieldLabel}>
              Inquiry Type <span className={styles.requiredAsterisk}>*</span>
            </label>
            <select
              id="contact-inquiryType"
              name="inquiryType"
              required
              value={formData.inquiryType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.fieldSelect} ${touched.inquiryType && errors.inquiryType ? styles.inputError : ''}`}
              aria-invalid={Boolean(touched.inquiryType && errors.inquiryType)}
              aria-describedby={touched.inquiryType && errors.inquiryType ? 'contact-inquiryType-error' : undefined}
            >
              <option value="" disabled>
                Select an option…
              </option>
              {INQUIRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {touched.inquiryType && errors.inquiryType && (
              <span id="contact-inquiryType-error" className={styles.errorMessage} role="alert">
                {errors.inquiryType}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-message" className={styles.fieldLabel}>
            Message <span className={styles.requiredAsterisk}>*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tell us about your project requirements, branch, deadline, or idea (minimum 20 characters)..."
            className={`${styles.fieldTextarea} ${touched.message && errors.message ? styles.inputError : ''}`}
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={touched.message && errors.message ? 'contact-message-error' : undefined}
          />
          {touched.message && errors.message && (
            <span id="contact-message-error" className={styles.errorMessage} role="alert">
              {errors.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? (
            <span className={styles.loadingWrapper}>
              <span className={styles.spinner} aria-hidden="true" />
              Sending…
            </span>
          ) : (
            'Send Inquiry →'
          )}
        </button>
      </form>
    </div>
  );
}
