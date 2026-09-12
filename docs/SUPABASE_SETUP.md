# 🗄️ Supabase Database & Auth Setup Guide for SYNTRA

This guide explains how to set up **Supabase (PostgreSQL Database & Authentication)** for SYNTRA.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**, select your organization, and choose a name (e.g. `syntra-dsa-tracker`).
3. Choose a database password and select your region. Click **Create new project**.

---

## Step 2: Run SQL Schema in Supabase SQL Editor

Open **SQL Editor** in your Supabase dashboard, paste the following SQL script, and click **Run**:

```sql
-- ===================================================
-- SYNTRA POSTGRESQL DATABASE SCHEMA
-- ===================================================

-- 1. Create Users Profile Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    github_username VARCHAR(255),
    github_repo VARCHAR(255) DEFAULT 'leetcode-dsa-solutions',
    github_branch VARCHAR(50) DEFAULT 'main',
    github_token TEXT,
    leetcode_username VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Problem Submissions Table
CREATE TABLE IF NOT EXISTS public.problem_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    problem_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_slug VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
    topics TEXT[] DEFAULT '{}',
    code TEXT,
    language VARCHAR(50) DEFAULT 'cpp',
    runtime VARCHAR(50),
    memory VARCHAR(50),
    notes TEXT,
    needs_revision BOOLEAN DEFAULT FALSE,
    github_url TEXT,
    solved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_problem UNIQUE (user_id, title_slug)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_submissions ENABLE ROW LEVEL SECURITY;

-- 4. Safe Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "Allow public select profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public update profiles" ON public.profiles;

DROP POLICY IF EXISTS "Allow public select submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Allow public insert submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Allow public update submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Allow public delete submissions" ON public.problem_submissions;

-- 5. Create RLS Policies for Profiles
CREATE POLICY "Allow public select profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);

-- 6. Create RLS Policies for Problem Submissions
CREATE POLICY "Allow public select submissions" ON public.problem_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert submissions" ON public.problem_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update submissions" ON public.problem_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete submissions" ON public.problem_submissions FOR DELETE USING (true);
```

---

## Step 3: Enable GitHub Provider in Supabase Auth

1. In Supabase Dashboard, go to **Authentication** ➔ **Providers**.
2. Click **GitHub** and toggle it **Enabled**.
3. Paste your **GitHub Client ID** and **GitHub Client Secret** (obtained from GitHub OAuth App).
4. Copy the **Redirect URL** provided by Supabase and add it to your GitHub OAuth App settings!

---

## Step 4: Add Supabase Credentials to `.env.local`

In Supabase Dashboard, go to **Project Settings** ➔ **API** and copy:
- `URL` ➔ `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key ➔ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Add them to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI...
```
