document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('configForm');
  const tokenInput = document.getElementById('githubToken');
  const ownerInput = document.getElementById('githubOwner');
  const repoInput = document.getElementById('githubRepo');
  const branchInput = document.getElementById('githubBranch');
  const langSelect = document.getElementById('preferredLanguage');
  const statusBadge = document.getElementById('statusBadge');
  const statusMsg = document.getElementById('statusMsg');
  const openTrackerBtn = document.getElementById('openTrackerBtn');
  const recentProblemsEl = document.getElementById('recentProblems');

  // Load existing config
  const config = await chrome.storage.sync.get([
    'githubToken',
    'githubOwner',
    'githubRepo',
    'githubBranch',
    'preferredLanguage',
  ]);
  if (config.githubToken) tokenInput.value = config.githubToken;
  if (config.githubOwner) ownerInput.value = config.githubOwner;
  if (config.githubRepo) repoInput.value = config.githubRepo;
  if (config.githubBranch) branchInput.value = config.githubBranch;
  if (config.preferredLanguage && langSelect) langSelect.value = config.preferredLanguage;

  if (config.githubToken && config.githubOwner && config.githubRepo) {
    statusBadge.textContent = 'Connected';
    statusBadge.className = 'badge badge-connected';
  }

  // Load recent solved problems
  loadRecentProblems();

  // Save config
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = tokenInput.value.trim();
    const owner = ownerInput.value.trim();
    const repo = repoInput.value.trim();
    const branch = branchInput.value.trim() || 'main';
    const preferredLanguage = langSelect ? langSelect.value : 'java';

    statusMsg.style.color = '#a1a1aa';
    statusMsg.textContent = 'Testing GitHub Connection...';

    try {
      // Test token and repo access using centralized config
      const ghApiBase = (typeof SYNTRA_CONFIG !== 'undefined' && SYNTRA_CONFIG.GITHUB_API_URL) || 'https://api.github.com';
      const res = await fetch(`${ghApiBase}/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        throw new Error('Repository not found or Token invalid. Check permissions!');
      }

      await chrome.storage.sync.set({
        githubToken: token,
        githubOwner: owner,
        githubRepo: repo,
        githubBranch: branch,
        preferredLanguage,
      });

      statusBadge.textContent = 'Connected';
      statusBadge.className = 'badge badge-connected';
      statusMsg.style.color = '#34d399';
      statusMsg.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Connected successfully to GitHub</span>`;
    } catch (err) {
      statusBadge.textContent = 'Error';
      statusBadge.className = 'badge badge-disconnected';
      statusMsg.style.color = '#f87171';
      statusMsg.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> ${err.message}</span>`;
    }
  });

  openTrackerBtn.addEventListener('click', () => {
    const appUrl = (typeof SYNTRA_CONFIG !== 'undefined' && SYNTRA_CONFIG.APP_URL) || 'http://localhost:3000';
    chrome.tabs.create({ url: appUrl });
  });

  async function loadRecentProblems() {
    const { solvedProblems = [] } = await chrome.storage.local.get(['solvedProblems']);
    if (solvedProblems.length === 0) return;

    recentProblemsEl.innerHTML = solvedProblems
      .slice(0, 5)
      .map(
        (p) => `
      <div class="recent-item">
        <span>#${p.problemNumber} ${p.problemTitle}</span>
        ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;">GitHub <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : '<span style="color:#a1a1aa">Synced</span>'}
      </div>
    `
      )
      .join('');
  }
});
