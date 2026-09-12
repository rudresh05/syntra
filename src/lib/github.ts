import { Difficulty, ProgrammingLanguage } from '@/types/dsa';
import { EXTERNAL_SERVICES, getLeetCodeProblemUrl } from '@/config/api';

export interface PushToGitHubPayload {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
  problemNumber: number;
  problemTitle: string;
  problemSlug: string;
  difficulty: Difficulty;
  topics: string[];
  code: string;
  language: ProgrammingLanguage;
  runtime?: string;
  memory?: string;
  description?: string;
}

export const getFileExtension = (language: ProgrammingLanguage): string => {
  const map: Record<ProgrammingLanguage, string> = {
    cpp: 'cpp',
    java: 'java',
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
};

const padZero = (num: number, size = 4): string => {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
};

const GITHUB_API_URL = EXTERNAL_SERVICES.GITHUB_API_URL;

// Check if repo exists, if not auto-create with auto_init: true
async function ensureRepoExists(token: string, owner: string, repo: string) {
  const checkRes = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Syntra-App',
    },
  });

  if (checkRes.ok) {
    return true;
  }

  if (checkRes.status === 404) {
    // Try to auto-create the repository on GitHub
    try {
      const createRes = await fetch(`${GITHUB_API_URL}/user/repos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Syntra-App',
        },
        body: JSON.stringify({
          name: repo,
          description: 'LeetCode DSA Solutions synced automatically with Syntra',
          private: false,
          auto_init: true, // Creates default branch 'main' with an initial README
        }),
      });

      if (createRes.ok) {
        // Wait 1.5s for GitHub git backend to initialize
        await new Promise((r) => setTimeout(r, 1500));
        return true;
      }
    } catch (e) {
      // Fall through to error
    }

    throw new Error(
      `GitHub repo "${owner}/${repo}" was not found! Please create the repository at https://github.com/new with name "${repo}" (check "Add a README file"), or verify your GitHub Token has "repo" scope.`
    );
  }

  return true;
}

export async function pushProblemToGitHub(payload: PushToGitHubPayload) {
  const {
    token,
    owner,
    repo,
    branch = 'main',
    problemNumber,
    problemTitle,
    problemSlug,
    difficulty,
    topics,
    code,
    language,
    runtime,
    memory,
    description = '',
  } = payload;

  // 1. Verify/auto-create repository first
  await ensureRepoExists(token, owner, repo);

  const paddedNum = padZero(problemNumber);
  const dirName = `${paddedNum}-${problemSlug}`;
  const ext = getFileExtension(language);
  const solutionPath = `${dirName}/solution.${ext}`;
  const readmePath = `${dirName}/README.md`;

  const difficultyColor =
    difficulty === 'Easy' ? 'green' : difficulty === 'Medium' ? 'orange' : 'red';

  const problemUrl = getLeetCodeProblemUrl(problemSlug);

  const readmeContent = `# ${problemNumber}. ${problemTitle}

![Difficulty: ${difficulty}](https://img.shields.io/badge/Difficulty-${difficulty}-${difficultyColor}?style=for-the-badge)
![Language: ${language}](https://img.shields.io/badge/Language-${encodeURIComponent(language)}-blue?style=for-the-badge)

## Problem Link
[LeetCode - ${problemTitle}](${problemUrl})

## Topics
${topics.map((t) => `\`${t}\``).join(' ')}

${runtime || memory ? `## Performance Stats\n- **Runtime:** ${runtime || 'N/A'}\n- **Memory:** ${memory || 'N/A'}\n` : ''}

## Problem Statement
${description || '*(Problem description automatically synced from LeetCode)*'}

---
*Auto-synced via [SYNTRA - LeetCode to GitHub Tracker](https://github.com/)*
`;

  const solutionContent = `/*
 * Problem: ${problemNumber}. ${problemTitle}
 * Link: ${problemUrl}
 * Difficulty: ${difficulty}
 * Language: ${language}
 * Runtime: ${runtime || 'N/A'} | Memory: ${memory || 'N/A'}
 */

${code}
`;

  // Push README.md
  await createOrUpdateFile({
    token,
    owner,
    repo,
    branch,
    path: readmePath,
    content: readmeContent,
    commitMessage: `docs: add README for ${paddedNum}-${problemSlug} [${difficulty}]`,
  });

  // Push Solution File
  await createOrUpdateFile({
    token,
    owner,
    repo,
    branch,
    path: solutionPath,
    content: solutionContent,
    commitMessage: `feat: add ${language} solution for ${paddedNum}-${problemSlug}`,
  });

  return {
    success: true,
    solutionPath,
    readmePath,
    githubUrl: `https://github.com/${owner}/${repo}/tree/${branch}/${dirName}`,
  };
}

async function createOrUpdateFile({
  token,
  owner,
  repo,
  branch,
  path,
  content,
  commitMessage,
  retryCount = 0,
}: {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  commitMessage: string;
  retryCount?: number;
}) {
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'Syntra-App',
    'Cache-Control': 'no-cache, no-store',
  };

  // Convert content to Base64 (supporting Unicode)
  const base64Content = Buffer.from(content, 'utf-8').toString('base64');

  // Check if file exists to get SHA and verify if content is already identical
  let sha: string | undefined = undefined;
  try {
    const existingFileRes = await fetch(`${url}?ref=${branch}&_t=${Date.now()}`, {
      headers: { ...headers, 'If-None-Match': '' },
    });
    if (existingFileRes.ok) {
      const data = await existingFileRes.json();
      sha = data.sha;
      const remoteBase64 = (data.content || '').replace(/\s+/g, '');
      const localCleanBase64 = base64Content.replace(/\s+/g, '');
      if (remoteBase64 && remoteBase64 === localCleanBase64) {
        // Content on GitHub is already identical, no new commit needed!
        return { content: data, skipped: true };
      }
    }
  } catch {
    // File doesn't exist yet
  }

  const body: {
    message: string;
    content: string;
    branch: string;
    sha?: string;
  } = {
    message: commitMessage,
    content: base64Content,
    branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errMsg = (errorData.message || '').toLowerCase();

    // Auto-resolve SHA conflict: if sha mismatch or missing sha, retry with fresh SHA
    if (retryCount < 2 && (response.status === 409 || response.status === 422 || errMsg.includes('does not match') || errMsg.includes('sha'))) {
      console.log(`[Syntra] Retrying ${path} due to SHA conflict (${errorData.message}). Attempt ${retryCount + 1}...`);
      await new Promise((r) => setTimeout(r, 600));
      return await createOrUpdateFile({
        token,
        owner,
        repo,
        branch,
        path,
        content,
        commitMessage,
        retryCount: retryCount + 1,
      });
    }

    throw new Error(errorData.message || `Failed to push ${path} to GitHub`);
  }

  return await response.json();
}
