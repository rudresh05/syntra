// ===================================================
// SYNTRA EXTENSION — CENTRAL CONFIGURATION
// All endpoints and external URLs are defined here
// ===================================================

const SYNTRA_CONFIG = {
  // Web Application & Backend API Base URL
  APP_URL: 'https://syntra.rudreshp.me',

  // GitHub Endpoints
  GITHUB_API_URL: 'https://api.github.com',
  GITHUB_WEB_URL: 'https://github.com',

  // LeetCode Base URL
  LEETCODE_BASE_URL: 'https://leetcode.com',

  // Defaults
  DEFAULT_REPO: 'leetcode-dsa-solutions',
  DEFAULT_BRANCH: 'main',
  DEFAULT_LANGUAGE: 'java',

  // Backend API Routes
  ENDPOINTS: {
    AUTH_ME: '/api/auth/me',
    GITHUB_SYNC: '/api/github',
  },
};

// Helper for generating LeetCode problem URL
function getExtensionLeetCodeUrl(slug) {
  return `${SYNTRA_CONFIG.LEETCODE_BASE_URL}/problems/${slug}/`;
}

// Expose globally for service worker, popup, and content scripts
if (typeof self !== 'undefined') {
  self.SYNTRA_CONFIG = SYNTRA_CONFIG;
  self.getExtensionLeetCodeUrl = getExtensionLeetCodeUrl;
}
if (typeof window !== 'undefined') {
  window.SYNTRA_CONFIG = SYNTRA_CONFIG;
  window.getExtensionLeetCodeUrl = getExtensionLeetCodeUrl;
}
