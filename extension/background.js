// Background service worker for LeetCode to GitHub Chrome Extension
try {
  importScripts('config.js');
} catch (e) {
  console.log('Could not import config.js:', e);
}

const CONFIG = typeof SYNTRA_CONFIG !== 'undefined' ? SYNTRA_CONFIG : {
  APP_URL: 'https://syntra.rudreshp.me',
  GITHUB_API_URL: 'https://api.github.com',
  LEETCODE_BASE_URL: 'https://leetcode.com',
  DEFAULT_REPO: 'leetcode-dsa-solutions',
  DEFAULT_BRANCH: 'main',
  DEFAULT_LANGUAGE: 'java',
  ENDPOINTS: {
    AUTH_ME: '/api/auth/me',
    GITHUB_SYNC: '/api/github',
  },
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SYNC_CONFIG_FROM_WEB' && request.config) {
    chrome.storage.sync.set(request.config).then(() => {
      console.log('[Syntra Background] Saved config from web bridge:', request.config.githubOwner);
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.type === 'LEETCODE_SUBMISSION_ACCEPTED') {
    handleAcceptedSubmission(request.data)
      .then((res) => sendResponse({ success: true, data: res }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Keep message channel open for async response
  }
});

async function handleAcceptedSubmission(data) {
  const slug = data.problemSlug || (data.problemTitle || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // 0. Zero Duplicate Push Guarantee: Check if already pushed once
  const { pushedProblems = {} } = await chrome.storage.local.get(['pushedProblems']);
  if (pushedProblems[slug] && !data.forcePush) {
    const existing = pushedProblems[slug];
    console.log(`[Syntra] #${data.problemNumber} (${slug}) already pushed to GitHub on ${existing.pushedAt}. Skipping duplicate push.`);
    return {
      success: true,
      alreadyPushed: true,
      githubUrl: existing.githubUrl,
      message: `#${data.problemNumber} ${data.problemTitle} is already synced to GitHub!`,
    };
  }

  // Retrieve saved config
  const config = await chrome.storage.sync.get([
    'githubToken',
    'githubOwner',
    'githubRepo',
    'githubBranch',
    'preferredLanguage',
  ]);

  let token = config.githubToken;
  let owner = config.githubOwner;
  let repo = config.githubRepo;
  let branch = config.githubBranch || 'main';
  const preferredLang = config.preferredLanguage || 'java';

  // Ensure language is set, defaulting to user's preferred language (java)
  if (!data.language || data.language === 'unknown') {
    data.language = preferredLang;
  }

  // If config is missing, attempt auto-sync from local web app
  if (!owner || !repo) {
    try {
      const authRes = await fetch(`${CONFIG.APP_URL}${CONFIG.ENDPOINTS.AUTH_ME}`);
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.authenticated && authData.user) {
          owner = authData.user.githubOwner || owner;
          repo = authData.user.githubRepo || repo || CONFIG.DEFAULT_REPO;
          branch = 'main';
        }
      }
    } catch (e) {
      console.log('Backend auth fetch note:', e);
    }
  }

  try {
    let res = null;
    let pushedViaBackend = false;

    // 1. First attempt: Push through backend API (zero token leakage)
    try {
      const backendRes = await fetch(`${CONFIG.APP_URL}${CONFIG.ENDPOINTS.GITHUB_SYNC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          owner,
          repo: repo || CONFIG.DEFAULT_REPO,
          branch,
          problemNumber: data.problemNumber,
          problemTitle: data.problemTitle,
          problemSlug: data.problemSlug,
          difficulty: data.difficulty,
          topics: data.topics,
          code: data.code,
          language: data.language,
          runtime: data.runtime,
          memory: data.memory,
          description: data.description,
        }),
      });

      if (backendRes.ok) {
        res = await backendRes.json();
        pushedViaBackend = true;
      }
    } catch (backendErr) {
      console.log('Backend sync offline/fallback to direct GitHub:', backendErr);
    }

    // 2. Second attempt: Fallback to direct push if backend is offline and token exists
    if (!pushedViaBackend) {
      if (!token || !owner || !repo) {
        const msg = 'GitHub Token or Repository missing! Click the Syntra extension icon to connect GitHub.';
        showNotification('GitHub Configuration Missing', msg);
        savePendingSubmission(data);
        throw new Error(msg);
      }
      res = await pushToGitHub(data, token, owner, repo, branch);
    }
    
    // Save to persistent pushed registry to guarantee zero duplicate pushes
    pushedProblems[slug] = {
      problemNumber: data.problemNumber,
      problemTitle: data.problemTitle,
      pushedAt: new Date().toISOString(),
      githubUrl: res.githubUrl,
      language: data.language,
    };
    await chrome.storage.local.set({ pushedProblems });

    // Save to local solved list in extension storage
    await saveSolvedProblem({
      ...data,
      githubUrl: res.githubUrl,
      pushedToGithub: true,
    });

    showNotification(
      'Solution Pushed to GitHub',
      `Successfully pushed #${data.problemNumber} ${data.problemTitle} [${data.difficulty}] (${data.language}) to ${owner}/${repo || CONFIG.DEFAULT_REPO}`
    );

    return res;
  } catch (error) {
    console.error('Failed to push to GitHub:', error);
    savePendingSubmission(data);
    showNotification('GitHub Sync Error', error.message || 'Failed to push solution to GitHub.');
    throw error;
  }
}

function getFileExtension(language) {
  const map = {
    java: 'java',
    cpp: 'cpp',
    python: 'py',
    python3: 'py',
    javascript: 'js',
    typescript: 'ts',
    golang: 'go',
    rust: 'rs',
    csharp: 'cs',
    sql: 'sql',
  };
  return map[language] || 'java';
}

function padZero(num, size = 4) {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

async function ensureRepoExists(token, owner, repo) {
  const checkRes = await fetch(`${CONFIG.GITHUB_API_URL}/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Syntra-Extension',
    },
  });

  if (checkRes.ok) return true;

  if (checkRes.status === 404) {
    try {
      const createRes = await fetch(`${CONFIG.GITHUB_API_URL}/user/repos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Syntra-Extension',
        },
        body: JSON.stringify({
          name: repo,
          description: 'LeetCode DSA Solutions synced automatically with Syntra',
          private: false,
          auto_init: true,
        }),
      });

      if (createRes.ok) {
        await new Promise((r) => setTimeout(r, 1500));
        return true;
      }
    } catch (e) {}

    throw new Error(
      `GitHub repo "${owner}/${repo}" was not found! Please create the repository at https://github.com/new with name "${repo}" (check "Add a README file").`
    );
  }

  return true;
}

async function pushToGitHub(problem, token, owner, repo, branch) {
  await ensureRepoExists(token, owner, repo);

  const paddedNum = padZero(problem.problemNumber || 0);
  const dirName = `${paddedNum}-${problem.problemSlug}`;
  const ext = getFileExtension(problem.language);
  const solutionPath = `${dirName}/solution.${ext}`;
  const readmePath = `${dirName}/README.md`;

  const difficultyColor =
    problem.difficulty === 'Easy' ? 'green' : problem.difficulty === 'Medium' ? 'orange' : 'red';

  const problemUrl = typeof getExtensionLeetCodeUrl === 'function'
    ? getExtensionLeetCodeUrl(problem.problemSlug)
    : `${CONFIG.LEETCODE_BASE_URL}/problems/${problem.problemSlug}/`;

  const readmeContent = `# ${problem.problemNumber || ''}. ${problem.problemTitle}

![Difficulty: ${problem.difficulty}](https://img.shields.io/badge/Difficulty-${problem.difficulty}-${difficultyColor}?style=for-the-badge)
![Language: ${problem.language}](https://img.shields.io/badge/Language-${encodeURIComponent(problem.language)}-blue?style=for-the-badge)

## Problem Link
[LeetCode - ${problem.problemTitle}](${problemUrl})

## Topics
${(problem.topics || []).map((t) => `\`${t}\``).join(' ')}

${problem.runtime || problem.memory ? `## Performance Stats\n- **Runtime:** ${problem.runtime || 'N/A'}\n- **Memory:** ${problem.memory || 'N/A'}\n` : ''}

## Problem Statement
${problem.description || '*(Problem statement synced from LeetCode)*'}

---
*Auto-synced via [Syntra](https://github.com/)*
`;

  const solutionContent = `/*
 * Problem: ${problem.problemNumber || ''}. ${problem.problemTitle}
 * Link: ${problemUrl}
 * Difficulty: ${problem.difficulty}
 * Language: ${problem.language}
 * Runtime: ${problem.runtime || 'N/A'} | Memory: ${problem.memory || 'N/A'}
 */

${problem.code}
`;

  await createOrUpdateFile(token, owner, repo, branch, readmePath, readmeContent, `docs: add README for ${paddedNum}-${problem.problemSlug} [${problem.difficulty}]`);
  await createOrUpdateFile(token, owner, repo, branch, solutionPath, solutionContent, `feat: add ${problem.language} solution for ${paddedNum}-${problem.problemSlug}`);

  return {
    githubUrl: `https://github.com/${owner}/${repo}/tree/${branch}/${dirName}`,
  };
}

async function createOrUpdateFile(token, owner, repo, branch, path, content, commitMessage, retryCount = 0) {
  const url = `${CONFIG.GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store',
  };

  // Base64 encoding supporting UTF-8
  const bytes = new TextEncoder().encode(content);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Content = btoa(binary);

  let sha;
  try {
    // Cache buster to ensure latest commit SHA
    const existingFileRes = await fetch(`${url}?ref=${branch}&_t=${Date.now()}`, {
      headers: { ...headers, 'If-None-Match': '' },
    });
    if (existingFileRes.ok) {
      const data = await existingFileRes.json();
      sha = data.sha;

      // If content on GitHub is already identical, skip commit!
      const remoteBase64 = (data.content || '').replace(/\s+/g, '');
      const localCleanBase64 = base64Content.replace(/\s+/g, '');
      if (remoteBase64 && remoteBase64 === localCleanBase64) {
        console.log(`[Syntra] ${path} is already up to date on GitHub. Skipping duplicate commit.`);
        return { content: data, skipped: true };
      }
    }
  } catch (e) {
    // File doesn't exist
  }

  const body = {
    message: commitMessage,
    content: base64Content,
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json();
    const errMsg = (errorData.message || '').toLowerCase();

    // Auto-resolve SHA conflict: if sha mismatch or missing sha, retry with fresh SHA
    if (retryCount < 2 && (res.status === 409 || res.status === 422 || errMsg.includes('does not match') || errMsg.includes('sha'))) {
      console.log(`[Syntra] Retrying ${path} due to SHA mismatch (${errorData.message}). Attempt ${retryCount + 1}...`);
      await new Promise((r) => setTimeout(r, 600));
      return await createOrUpdateFile(token, owner, repo, branch, path, content, commitMessage, retryCount + 1);
    }

    throw new Error(errorData.message || `GitHub error updating ${path}`);
  }

  return await res.json();
}

async function saveSolvedProblem(problem) {
  const { solvedProblems = [] } = await chrome.storage.local.get(['solvedProblems']);
  const updated = [problem, ...solvedProblems.filter((p) => p.problemSlug !== problem.problemSlug)];
  await chrome.storage.local.set({ solvedProblems: updated });
}

async function savePendingSubmission(problem) {
  const { pendingSubmissions = [] } = await chrome.storage.local.get(['pendingSubmissions']);
  const updated = [problem, ...pendingSubmissions.filter((p) => p.problemSlug !== problem.problemSlug)];
  await chrome.storage.local.set({ pendingSubmissions: updated });
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title,
    message,
    priority: 2,
  });
}
