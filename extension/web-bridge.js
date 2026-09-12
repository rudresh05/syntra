// Content script running on web app to bridge web app session with extension
console.log('[Syntra Extension Bridge] Initialized on web app.');

const endpoint = (typeof SYNTRA_CONFIG !== 'undefined' && SYNTRA_CONFIG.ENDPOINTS?.AUTH_ME) || '/api/auth/me';
const defaultRepo = (typeof SYNTRA_CONFIG !== 'undefined' && SYNTRA_CONFIG.DEFAULT_REPO) || 'leetcode-dsa-solutions';

async function syncWebAuthToExtension() {
  try {
    const res = await fetch(endpoint, { credentials: 'include' });
    if (!res.ok) return;

    const data = await res.json();
    if (data.authenticated && data.user) {
      const { githubOwner, githubRepo } = data.user;
      if (githubOwner) {
        chrome.runtime.sendMessage({
          type: 'SYNC_CONFIG_FROM_WEB',
          config: {
            githubOwner,
            githubRepo: githubRepo || defaultRepo,
            githubBranch: 'main',
            preferredLanguage: 'java',
          },
        }, (response) => {
          console.log('[Syntra Extension Bridge] Session synced to extension:', response);
        });
      }
    }
  } catch (err) {
    console.log('[Syntra Extension Bridge] Sync check error:', err);
  }
}

// Sync on page load and periodically
syncWebAuthToExtension();
setTimeout(syncWebAuthToExtension, 2000);
