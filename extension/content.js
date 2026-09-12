console.log('[Syntra — LeetCode to GitHub Tracker] Content script initialized on LeetCode.');

let isProcessing = false;
let lastProcessedKey = '';
let cachedCodeAtSubmit = '';

// On-screen Toast Notification inside LeetCode page (Modern SVG UI, zero emojis)
function showSyntraToast(message, type = 'info', duration = 6000) {
  let container = document.getElementById('syntra-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'syntra-toast-container';
    container.style.cssText =
      'position:fixed;bottom:24px;right:24px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(container);
  }

  const SVGS = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    brand: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="m16 18 6-6-6-6"></path><path d="m8 6-6 6 6 6"></path></svg>`,
  };

  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'rgba(30, 15, 15, 0.95)' : type === 'success' ? 'rgba(6, 30, 20, 0.95)' : 'rgba(15, 23, 42, 0.95)';
  const borderColor = type === 'error' ? 'rgba(239, 68, 68, 0.4)' : type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)';
  const iconSvg = SVGS[type] || SVGS.info;

  toast.style.cssText = `background:${bgColor};backdrop-filter:blur(8px);border:1px solid ${borderColor};color:#fff;padding:12px 18px;border-radius:12px;font-size:13px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,0.6);display:flex;align-items:center;gap:12px;pointer-events:auto;min-width:300px;max-width:440px;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);transform:translateY(10px);opacity:0;`;
  
  toast.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px;width:100%;">
      <div style="margin-top:2px;">${iconSvg}</div>
      <div style="display:flex;flex-direction:column;gap:3px;flex:1;">
        <div style="display:flex;align-items:center;gap:6px;">
          ${SVGS.brand}
          <span style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:#10b981;text-transform:uppercase;">SYNTRA</span>
          <span style="font-size:10px;color:#64748b;">•</span>
          <span style="font-size:11px;font-weight:500;color:#94a3b8;">GitHub Auto-Sync</span>
        </div>
        <div style="font-size:13px;font-weight:500;line-height:1.4;color:#f8fafc;">${message}</div>
      </div>
    </div>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Function to extract problem slug from URL
function getProblemSlug() {
  const match = window.location.pathname.match(/\/problems\/([^\/]+)/);
  return match ? match[1] : '';
}

// Function to detect programming language from DOM, code, and user preference
function detectLanguageFromDOM() {
  const knownLanguages = [
    { key: 'java', match: ['java'] },
    { key: 'cpp', match: ['c++', 'cpp'] },
    { key: 'python3', match: ['python3', 'python'] },
    { key: 'javascript', match: ['javascript'] },
    { key: 'typescript', match: ['typescript'] },
    { key: 'golang', match: ['go', 'golang'] },
    { key: 'rust', match: ['rust'] },
    { key: 'csharp', match: ['c#', 'csharp'] },
    { key: 'sql', match: ['sql'] },
  ];

  const candidates = document.querySelectorAll(
    'button[id*="headlessui-listbox-button"], [data-cy="lang-select"], div[class*="editor"] button, button'
  );

  for (const el of candidates) {
    const text = (el.textContent || '').trim().toLowerCase();
    if (!text || text.length > 20) continue;
    if (['run', 'submit', 'console', 'testcase', 'contribute', 'settings', 'next', 'prev', 'code'].includes(text)) continue;

    for (const item of knownLanguages) {
      for (const m of item.match) {
        if (text === m || text.startsWith(m + ' ') || text.startsWith(m + '\n')) {
          return item.key;
        }
      }
    }
  }
  return null;
}

function detectLanguageFromCode(code) {
  if (!code || code.length < 5) return null;

  // Java-specific signatures
  const javaSignatures = [
    'public class Solution',
    'class Solution',
    'public int',
    'public void',
    'public boolean',
    'public String',
    'public List',
    'public TreeNode',
    'public ListNode',
    'public int[]',
    'int[]',
    'String[]',
    'char[]',
    'System.out.println',
    'new int[',
    'new HashMap',
    'new ArrayList',
    'new HashSet',
    'import java.',
    'Map<',
    'HashMap<',
    'List<',
    'ArrayList<',
    'Integer.',
    'StringBuilder',
  ];

  // C++-specific signatures
  const cppSignatures = [
    '#include',
    'std::',
    'vector<',
    'unordered_map<',
    'unordered_set<',
    'cout <<',
    'cin >>',
    'nullptr',
    '->',
    'size_t',
    'public:',
    'private:',
  ];

  // Python-specific signatures
  const pySignatures = ['def ', 'self:', 'self,', 'class Solution:', 'elif '];

  let cppScore = 0;
  for (const sig of cppSignatures) {
    if (code.includes(sig)) cppScore++;
  }

  let javaScore = 0;
  for (const sig of javaSignatures) {
    if (code.includes(sig)) javaScore++;
  }

  let pyScore = 0;
  for (const sig of pySignatures) {
    if (code.includes(sig)) pyScore++;
  }

  if (cppScore > javaScore && cppScore > 0) return 'cpp';
  if (javaScore > 0) return 'java';
  if (pyScore > 0) return 'python3';

  return null;
}

function extractCode() {
  let code = '';

  // 1. Check Monaco DOM view lines
  const lines = document.querySelectorAll('.monaco-editor .view-line, .view-line');
  if (lines.length > 0) {
    code = Array.from(lines)
      .map((l) => (l.textContent || '').replace(/\u00a0/g, ' '))
      .join('\n');
  }

  // 2. Fallback to textarea / pre / code
  if (!code || code.trim().length === 0) {
    const codeEl = document.querySelector('textarea.inputarea, pre code, code');
    if (codeEl) {
      code = ((codeEl.value || codeEl.textContent) || '').replace(/\u00a0/g, ' ');
    }
  }

  // 3. Fallback to localStorage
  if (!code || code.trim().length === 0) {
    const slug = getProblemSlug();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(slug) && (key.includes('code') || key.includes('solution'))) {
        const val = localStorage.getItem(key);
        if (val && val.length > 10) {
          code = val;
          break;
        }
      }
    }
  }

  return code;
}

// Extract details from DOM
async function extractProblemData() {
  const slug = getProblemSlug();

  // Get user's preferred language from extension config (defaults to Java)
  let preferredLang = 'java';
  try {
    const config = await chrome.storage.sync.get(['preferredLanguage']);
    if (config.preferredLanguage) preferredLang = config.preferredLanguage;
  } catch (e) {}

  // Extract Title & Problem Number
  let problemNumber = 0;
  let title = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  // 1. Try document.title first (e.g. "1. Two Sum - LeetCode")
  const docTitleMatch = document.title.match(/^(\d+)\.\s*([^-|]+)/);
  if (docTitleMatch) {
    problemNumber = parseInt(docTitleMatch[1], 10);
    title = docTitleMatch[2].trim();
  }

  // 2. Try modern & legacy DOM selectors
  if (!problemNumber) {
    const selectors = [
      '[data-cy="question-title"]',
      'div[class*="text-title-large"]',
      'span[class*="text-title-large"]',
      'div[class*="text-title"]',
      'h4[class*="title"]',
      'a[href^="/problems/"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const text = el.textContent?.trim() || '';
        const match = text.match(/^(\d+)\.\s*(.+)$/);
        if (match) {
          problemNumber = parseInt(match[1], 10);
          title = match[2].trim();
          break;
        }
      }
    }
  }

  // 3. Fallback map for common popular problems if still 0
  if (!problemNumber) {
    const commonMap = {
      'two-sum': 1,
      'add-two-numbers': 2,
      'longest-substring-without-repeating-characters': 3,
      'median-of-two-sorted-arrays': 4,
      'longest-palindromic-substring': 5,
      'zigzag-conversion': 6,
      'reverse-integer': 7,
      'string-to-integer-atoi': 8,
      'palindrome-number': 9,
      'regular-expression-matching': 10,
      'container-with-most-water': 11,
      'integer-to-roman': 12,
      'roman-to-integer': 13,
      'longest-common-prefix': 14,
      '3sum': 15,
      'valid-parentheses': 20,
      'merge-two-sorted-lists': 21,
      'merge-k-sorted-lists': 23,
      'trapping-rain-water': 42,
      'climbing-stairs': 70,
      'best-time-to-buy-and-sell-stock': 121,
      'number-of-islands': 200,
      'reverse-linked-list': 206,
      'course-schedule': 207,
      'kth-largest-element-in-an-array': 215,
      'invert-binary-tree': 226,
    };
    if (commonMap[slug]) {
      problemNumber = commonMap[slug];
    }
  }

  // Extract Difficulty
  let difficulty = 'Medium';
  const diffEls = document.querySelectorAll(
    'div[class*="text-easy"], div[class*="text-medium"], div[class*="text-hard"], span[class*="text-easy"], span[class*="text-medium"], span[class*="text-hard"]'
  );
  if (diffEls.length > 0) {
    const text = diffEls[0].textContent?.trim() || '';
    if (text.toLowerCase().includes('easy')) difficulty = 'Easy';
    else if (text.toLowerCase().includes('hard')) difficulty = 'Hard';
    else if (text.toLowerCase().includes('medium')) difficulty = 'Medium';
  }

  // Extract Topic Tags
  const topics = [];
  const tagEls = document.querySelectorAll('a[href^="/tag/"]');
  tagEls.forEach((el) => {
    const tagText = el.textContent?.trim();
    if (tagText && !topics.includes(tagText)) {
      topics.push(tagText);
    }
  });

  // Extract Code (use cached code if editor emptied or switched)
  let code = extractCode();
  if ((!code || code.trim().length === 0) && cachedCodeAtSubmit) {
    code = cachedCodeAtSubmit;
  }

  // Detect Language: DOM -> Code Syntax -> User Preferred Language (defaults to Java)
  const language = detectLanguageFromDOM() || detectLanguageFromCode(code) || preferredLang || 'java';

  // Extract Runtime and Memory
  let runtime = '';
  let memory = '';
  const statsEls = document.querySelectorAll('span[class*="text-sd-"], div[class*="flex"] span, [class*="text-olive"]');
  statsEls.forEach((el) => {
    const text = el.textContent || '';
    if (text.includes('ms')) runtime = text.trim();
    if (text.includes('MB') || text.includes('KB')) memory = text.trim();
  });

  // Extract Description
  let description = '';
  const descEl = document.querySelector('div[data-track-load="description_content"], div[class*="content__"]');
  if (descEl) {
    description = descEl.innerText.trim();
  }

  return {
    problemNumber,
    problemTitle: title,
    problemSlug: slug,
    difficulty,
    topics: topics.length > 0 ? topics : ['DSA'],
    code: code || '// Solution code',
    language,
    runtime,
    memory,
    description,
    solvedAt: new Date().toISOString(),
  };
}

// Multi-layer check for "Accepted" state
function isAcceptedResultPresent() {
  // 1. Data-e2e locator
  const e2e = document.querySelector('[data-e2e-locator="submission-result"]');
  if (e2e && e2e.textContent?.toLowerCase().includes('accepted')) return true;

  // 2. Data state or status
  const stateEl = document.querySelector('[data-state="accepted"], [data-status="Accepted"]');
  if (stateEl) return true;

  // 3. Inspect elements for Accepted with green styling
  const elements = document.querySelectorAll('span, div, h4, h3, p');
  for (const el of elements) {
    const txt = el.textContent?.trim();
    if (txt === 'Accepted' || txt === 'Success') {
      const style = window.getComputedStyle(el);
      const pStyle = el.parentElement ? window.getComputedStyle(el.parentElement) : null;
      const classes = ((el.className || '') + ' ' + (el.parentElement?.className || '')).toLowerCase();

      const isGreen =
        classes.includes('green') ||
        classes.includes('success') ||
        classes.includes('sd-easy') ||
        classes.includes('olive') ||
        style.color.includes('44, 187, 93') ||
        style.color.includes('34, 197, 94') ||
        style.color.includes('16, 185, 129') ||
        style.color.includes('0, 184, 163') ||
        (pStyle && (
          pStyle.color.includes('44, 187, 93') ||
          pStyle.color.includes('34, 197, 94') ||
          pStyle.color.includes('16, 185, 129') ||
          pStyle.color.includes('0, 184, 163')
        ));

      if (isGreen) return true;
    }
  }

  return false;
}

let hasActiveSubmissionAttempt = false;

// Handle detected Accepted submission
async function handleSubmissionSuccess() {
  if (isProcessing) return;

  const slug = getProblemSlug();
  const currentKey = slug + '_' + Math.floor(Date.now() / 8000);
  if (lastProcessedKey === currentKey) return; // Prevent duplicate within 8s

  // Check if already pushed once to guarantee zero duplicate commits
  try {
    const { pushedProblems = {} } = await chrome.storage.local.get(['pushedProblems']);
    if (pushedProblems[slug]) {
      console.log(`[Syntra] Problem ${slug} is already pushed to GitHub. Skipping duplicate push.`);
      if (hasActiveSubmissionAttempt) {
        showSyntraToast(
          `Already synced to GitHub repository (${pushedProblems[slug].language || 'Java'}). Duplicate push skipped.`,
          'info',
          5000
        );
      }
      hasActiveSubmissionAttempt = false;
      return;
    }
  } catch (e) {}

  isProcessing = true;
  lastProcessedKey = currentKey;
  hasActiveSubmissionAttempt = false;

  showSyntraToast('Accepted! Extracting Java solution and syncing to GitHub...', 'info', 4000);

  setTimeout(async () => {
    try {
      const data = await extractProblemData();
      console.log('[Syntra] Pushing solution to background:', data);

      if (!chrome.runtime?.id) {
        showSyntraToast('Extension reloaded. Please refresh this tab (F5) to re-sync!', 'info', 6000);
        isProcessing = false;
        return;
      }

      try {
        chrome.runtime.sendMessage(
          {
            type: 'LEETCODE_SUBMISSION_ACCEPTED',
            data,
          },
          (response) => {
            isProcessing = false;
            if (chrome.runtime.lastError) {
              const errMsg = chrome.runtime.lastError.message || '';
              if (errMsg.includes('invalidated') || errMsg.includes('context')) {
                showSyntraToast('Extension updated. Please refresh this tab (F5)!', 'info', 6000);
              } else {
                console.error('[Syntra] Runtime error:', chrome.runtime.lastError);
                showSyntraToast('Extension connection error. Please refresh this page!', 'error', 7000);
              }
              return;
            }

            if (response && response.success) {
              if (response.data && response.data.alreadyPushed) {
                showSyntraToast(
                  `#${data.problemNumber} ${data.problemTitle} is already synced to your GitHub repo.`,
                  'info',
                  5000
                );
              } else {
                showSyntraToast(
                  `#${data.problemNumber} ${data.problemTitle} pushed to GitHub (${data.language})`,
                  'success',
                  7000
                );
              }
            } else {
              const err = response?.error || 'Failed to push to GitHub';
              showSyntraToast(err, 'error', 8000);
            }
          }
        );
      } catch (sendErr) {
        isProcessing = false;
        showSyntraToast('Extension reloaded. Please refresh this tab (F5)!', 'info', 6000);
      }
    } catch (err) {
      isProcessing = false;
      console.error('[Syntra] Extraction error:', err);
      showSyntraToast(err.message || 'Failed to extract problem code', 'error', 7000);
    }
  }, 1200);
}

// 1. Listen for user explicitly clicking the Submit button
document.addEventListener(
  'click',
  (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const text = (btn.textContent || '').trim().toLowerCase();
    const testId = (btn.getAttribute('data-e2e-locator') || '').toLowerCase();

    if (testId.includes('submit') || text === 'submit') {
      console.log('[Syntra] Submit button clicked! Monitoring for result...');
      cachedCodeAtSubmit = extractCode();
      hasActiveSubmissionAttempt = true;

      // Poll every 500ms for up to 30 seconds for Accepted result
      let attempts = 0;
      const pollInterval = setInterval(() => {
        attempts++;
        if (hasActiveSubmissionAttempt && isAcceptedResultPresent()) {
          clearInterval(pollInterval);
          handleSubmissionSuccess();
        } else if (attempts > 60 || !hasActiveSubmissionAttempt) {
          clearInterval(pollInterval);
        }
      }, 500);
    }
  },
  true
);

// 2. DOM MutationObserver: ONLY triggers if a user actually initiated a submission
const observer = new MutationObserver(() => {
  if (!hasActiveSubmissionAttempt || isProcessing) return;
  if (isAcceptedResultPresent()) {
    handleSubmissionSuccess();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
