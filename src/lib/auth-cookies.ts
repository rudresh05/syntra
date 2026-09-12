import Cookies from 'js-cookie';

const COOKIE_NAME = 'syntra_session';

export interface UserSession {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  publicRepos?: number;
  followers?: number;
  following?: number;
  company?: string;
  location?: string;
  htmlUrl?: string;
  authProvider: 'github' | 'manual';
  leetcodeUsername?: string;
  githubToken?: string;
  hasGithubToken?: boolean;
  githubOwner?: string;
  githubRepo?: string;
}

// Decode JWT payload on browser without Node.js crypto / jsonwebtoken dependency
function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Set session in cookie
export function setSessionCookie(token: string) {
  Cookies.set(COOKIE_NAME, token, {
    expires: 30,
    sameSite: 'lax',
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  });
}

// Get session from cookie
export function getSessionCookie(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const token = Cookies.get(COOKIE_NAME);
  if (!token) return null;
  return decodeJwtPayload(token) as UserSession | null;
}

// Clear session cookie (Logout)
export function removeSessionCookie() {
  Cookies.remove(COOKIE_NAME);
}
