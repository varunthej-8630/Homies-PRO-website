/**
 * Utility to capture and preserve incoming UTM parameters non-invasively
 * Respects user privacy and stores only in browser sessionStorage.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref'];

export function captureUTMParameters() {
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const existing = JSON.parse(sessionStorage.getItem('hs_utm_params') || '{}');
    let hasNew = false;

    UTM_KEYS.forEach((key) => {
      const val = urlParams.get(key);
      if (val && !existing[key]) {
        existing[key] = val;
        hasNew = true;
      }
    });

    if (hasNew) {
      sessionStorage.setItem('hs_utm_params', JSON.stringify(existing));
    }
  } catch (e) {
    // Graceful fallback if storage disabled
  }
}

export function getStoredUTM() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem('hs_utm_params') || '{}');
  } catch (e) {
    return {};
  }
}
