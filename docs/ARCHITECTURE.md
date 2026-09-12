# 🏗️ SYNTRA — Complete System Architecture & Implementation Docs

Syntra is a full-stack platform for automated LeetCode solution syncing to GitHub and DSA roadmap progress tracking.

---

## 1. System Overview & Tech Stack

- **Frontend / Framework**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, Framer Motion.
- **Database & Auth**: Supabase (PostgreSQL), JWT Cookie Session (`syntra_session`), GitHub OAuth.
- **Browser Extension**: Chrome Extension Manifest V3 (Content Script + Background Service Worker).
- **APIs & Integrations**: GitHub REST API (Octokit/Contents API) + LeetCode GraphQL API.

---

## 2. API Endpoints Reference

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/me` | `GET` | Verifies and reads `syntra_session` cookie for active user session |
| `/api/auth/github-url` | `GET` | Generates GitHub OAuth authorization URL |
| `/api/auth/github-callback`| `GET` | Handles GitHub OAuth code exchange, fetches GitHub profile & sets session cookie |
| `/api/auth/github-pat` | `POST` | Validates GitHub PAT token & sets session cookie |
| `/api/auth/login` | `POST` | Manual user login with Username/Email & Password |
| `/api/auth/register` | `POST` | Manual user registration |
| `/api/auth/logout` | `POST` | Clears `syntra_session` cookie |
| `/api/leetcode/fetch` | `POST` | Interrogates LeetCode Public GraphQL API (`https://leetcode.com/graphql`) to fetch solved problems & stats |
| `/api/github` | `POST` | Commits `0001-two-sum/README.md` and `0001-two-sum/solution.cpp` to GitHub repository |

---

## 3. Chrome Extension Architecture (`/extension`)

The Manifest V3 extension intercepts LeetCode submissions:

1. **Content Script (`content.js`)**: Injected into `https://leetcode.com/problems/*`. Listens for "Accepted" status on code submission, extracts title, slug, code, language, runtime, memory, and description.
2. **Background Worker (`background.js`)**: Reads GitHub credentials from `chrome.storage.sync` and pushes code directly to GitHub repository via GitHub REST API.
3. **Popup Interface (`popup.html` / `popup.js`)**: Allows user to test GitHub token & view sync history.
