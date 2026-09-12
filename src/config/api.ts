/**
 * Centralized API & Service Configuration
 * All URLs and endpoints are backend-controlled and driven by environment variables.
 */

// Internal Next.js App API Endpoints
export const API_ENDPOINTS = {
  AUTH_ME: '/api/auth/me',
  AUTH_GITHUB_URL: '/api/auth/github-url',
  AUTH_GITHUB_CALLBACK: '/api/auth/github-callback',
  AUTH_GITHUB_PAT: '/api/auth/github-pat',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout',
  GITHUB_SYNC: '/api/github',
  GITHUB_COMMITS: '/api/github/commits',
  GITHUB_PROFILE: '/api/github/profile',
  LEETCODE_FETCH: '/api/leetcode/fetch',
} as const;

// External API Endpoints & Service URLs (Configured via .env)
export const EXTERNAL_SERVICES = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  GITHUB_API_URL: process.env.GITHUB_API_URL || 'https://api.github.com',
  GITHUB_OAUTH_AUTHORIZE_URL:
    process.env.GITHUB_OAUTH_AUTHORIZE_URL || 'https://github.com/login/oauth/authorize',
  GITHUB_OAUTH_TOKEN_URL:
    process.env.GITHUB_OAUTH_TOKEN_URL || 'https://github.com/login/oauth/access_token',
  GITHUB_USER_API_URL: process.env.GITHUB_USER_API_URL || 'https://api.github.com/user',
  LEETCODE_GRAPHQL_URL: process.env.LEETCODE_GRAPHQL_URL || 'https://leetcode.com/graphql',
  LEETCODE_BASE_URL: process.env.NEXT_PUBLIC_LEETCODE_URL || 'https://leetcode.com',
  DEFAULT_GITHUB_REPO: process.env.DEFAULT_GITHUB_REPO || 'leetcode-dsa-solutions',
} as const;

/**
 * Generate problem link for LeetCode
 */
export function getLeetCodeProblemUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_LEETCODE_URL || 'https://leetcode.com';
  return `${base.replace(/\/$/, '')}/problems/${slug}/`;
}
