# 🔑 GitHub OAuth App Setup Guide for SYNTRA

To enable 1-Click **"Continue with GitHub"** login on SYNTRA, follow these steps to register a GitHub OAuth Application.

---

## Step 1: Register GitHub OAuth App

1. Log in to [GitHub](https://github.com).
2. Click your profile picture top right ➔ **Settings**.
3. Scroll down left sidebar ➔ **Developer settings** ➔ **OAuth Apps**.
4. Click **New OAuth App** button (or [click here](https://github.com/settings/applications/new)).

---

## Step 2: Fill Application Form

Fill out the form fields with the following values:

| Field | Value |
| :--- | :--- |
| **Application name** | `Syntra DSA Tracker` |
| **Homepage URL** | `http://localhost:3000` |
| **Application description** | `Automated LeetCode to GitHub Auto-Sync & DSA Roadmap Tracker` |
| **Authorization callback URL** | `http://localhost:3000/api/auth/github-callback` |

Click **Register application**.

---

## Step 3: Copy Client ID & Client Secret

1. Copy the generated **Client ID**.
2. Click **Generate a new client secret** and copy the secret key immediately.

---

## Step 4: Update `.env.local`

Paste the credentials into `.env.local`:

```bash
GITHUB_CLIENT_ID=your_copied_client_id
GITHUB_CLIENT_SECRET=your_copied_client_secret
```

Restart Next.js dev server:
```bash
npm run dev
```

Now clicking **"Continue with GitHub"** will authenticate users with 1 click!
