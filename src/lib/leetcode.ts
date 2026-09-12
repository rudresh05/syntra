import { Problem, Difficulty } from '@/types/dsa';
import { INITIAL_PROBLEMS } from '@/data/sheetsData';
import { EXTERNAL_SERVICES } from '@/config/api';

export interface LeetCodeProfileData {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  recentSubmissions: Array<{
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
  }>;
}

export async function fetchLeetCodeProfile(username: string): Promise<LeetCodeProfileData> {
  const query = `
    query getUserData($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      recentAcSubmissionList(username: $username, limit: 50) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  const leetcodeApiUrl = EXTERNAL_SERVICES.LEETCODE_GRAPHQL_URL;

  const response = await fetch(leetcodeApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': EXTERNAL_SERVICES.LEETCODE_BASE_URL,
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode API returned status ${response.status}`);
  }

  const data = await response.json();

  if (data.errors || !data.data?.matchedUser) {
    throw new Error(`LeetCode user "${username}" not found or profile is private.`);
  }

  const submitStats = data.data.matchedUser.submitStatsGlobal?.acSubmissionNum || [];
  let totalSolved = 0;
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;

  submitStats.forEach((stat: { difficulty: string; count: number }) => {
    if (stat.difficulty === 'All') totalSolved = stat.count;
    if (stat.difficulty === 'Easy') easySolved = stat.count;
    if (stat.difficulty === 'Medium') mediumSolved = stat.count;
    if (stat.difficulty === 'Hard') hardSolved = stat.count;
  });

  const recentSubmissions = (data.data.recentAcSubmissionList || []).map((sub: any) => ({
    id: sub.id,
    title: sub.title,
    titleSlug: sub.titleSlug,
    timestamp: new Date(parseInt(sub.timestamp, 10) * 1000).toISOString(),
  }));

  return {
    username,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    recentSubmissions,
  };
}

const KNOWN_PROBLEM_MAP: Record<string, { number: number; difficulty: Difficulty }> = {
  'two-sum': { number: 1, difficulty: 'Easy' },
  'palindrome-number': { number: 9, difficulty: 'Easy' },
  'roman-to-integer': { number: 13, difficulty: 'Easy' },
  'longest-common-prefix': { number: 14, difficulty: 'Easy' },
  'valid-parentheses': { number: 20, difficulty: 'Easy' },
  'merge-two-sorted-lists': { number: 21, difficulty: 'Easy' },
  'remove-duplicates-from-sorted-array': { number: 26, difficulty: 'Easy' },
  'remove-element': { number: 27, difficulty: 'Easy' },
  'search-insert-position': { number: 35, difficulty: 'Easy' },
  'climbing-stairs': { number: 70, difficulty: 'Easy' },
  'merge-sorted-array': { number: 88, difficulty: 'Easy' },
  'binary-tree-inorder-traversal': { number: 94, difficulty: 'Easy' },
  'same-tree': { number: 100, difficulty: 'Easy' },
  'symmetric-tree': { number: 101, difficulty: 'Easy' },
  'maximum-depth-of-binary-tree': { number: 104, difficulty: 'Easy' },
  'best-time-to-buy-and-sell-stock': { number: 121, difficulty: 'Easy' },
  'valid-palindrome': { number: 125, difficulty: 'Easy' },
  'single-number': { number: 136, difficulty: 'Easy' },
  'linked-list-cycle': { number: 141, difficulty: 'Easy' },
  'reverse-linked-list': { number: 206, difficulty: 'Easy' },
  'invert-binary-tree': { number: 226, difficulty: 'Easy' },
};

// Convert LeetCode submission to Syntra problem structure
export function formatLeetCodeSubmissionToProblem(
  sub: { id: string; title: string; titleSlug: string; timestamp: string },
  index: number
): Problem {
  // 1. Check against curated sheets (Blind 75 & NeetCode 150)
  const matchedCurated = INITIAL_PROBLEMS.find((p) => p.titleSlug === sub.titleSlug);
  if (matchedCurated) {
    return {
      ...matchedCurated,
      solved: true,
      solvedAt: sub.timestamp,
      sheetName: 'LeetCode Sync',
    };
  }

  // 2. Check known popular problems map
  const known = KNOWN_PROBLEM_MAP[sub.titleSlug];
  let number = known?.number || index + 1;
  let difficulty: Difficulty = known?.difficulty || 'Medium';

  // 3. Infer problem number if title starts with digits
  const titleMatch = sub.title.match(/^(\d+)\.\s*(.+)$/);
  let title = sub.title;
  if (titleMatch) {
    number = parseInt(titleMatch[1], 10);
    title = titleMatch[2];
  }

  return {
    id: sub.titleSlug || sub.id,
    number,
    title,
    titleSlug: sub.titleSlug,
    difficulty,
    topics: ['LeetCode Auto-Fetch'],
    solved: true,
    solvedAt: sub.timestamp,
    sheetName: 'LeetCode Sync',
  };
}
