-- ====================================================================
-- ⚡ SYNTRA PRODUCTION SUPABASE DATABASE SCHEMA (IDEMPOTENT / SAFE)
-- ====================================================================

-- 1. Profiles Table (User settings, GitHub & LeetCode linked profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_username VARCHAR(255) UNIQUE NOT NULL,
    github_repo VARCHAR(255) DEFAULT 'leetcode-dsa-solutions',
    github_branch VARCHAR(50) DEFAULT 'main',
    github_token TEXT,
    leetcode_username VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Problem Submissions Table (Solved problems history, code & stats)
CREATE TABLE IF NOT EXISTS public.problem_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    problem_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_slug VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
    topics TEXT[] DEFAULT '{}',
    sheet_name VARCHAR(100) DEFAULT 'All',
    code TEXT,
    language VARCHAR(50) DEFAULT 'cpp',
    runtime VARCHAR(50),
    memory VARCHAR(50),
    notes TEXT,
    needs_revision BOOLEAN DEFAULT FALSE,
    github_url TEXT,
    solved_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ek user ek problem ko re-submit kare toh update ho sake
    CONSTRAINT unique_user_problem UNIQUE (user_id, title_slug)
);

-- ====================================================================
-- 🚀 HIGH-PERFORMANCE INDEXING
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_submissions_user_id 
    ON public.problem_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_submissions_solved_at 
    ON public.problem_submissions(solved_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_difficulty 
    ON public.problem_submissions(difficulty);

CREATE INDEX IF NOT EXISTS idx_submissions_revision 
    ON public.problem_submissions(user_id, needs_revision) 
    WHERE needs_revision = TRUE;

CREATE INDEX IF NOT EXISTS idx_submissions_topics 
    ON public.problem_submissions USING GIN(topics);

-- ====================================================================
-- 🛡️ ROW LEVEL SECURITY (RLS) POLICIES (SAFE DROP & RE-CREATE)
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they already exist
DROP POLICY IF EXISTS "Allow public select profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public update profiles" ON public.profiles;

DROP POLICY IF EXISTS "Allow public select submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Allow public insert submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Allow public update submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Allow public delete submissions" ON public.problem_submissions;

-- Create Policies
CREATE POLICY "Allow public select profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public select submissions" ON public.problem_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert submissions" ON public.problem_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update submissions" ON public.problem_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete submissions" ON public.problem_submissions FOR DELETE USING (true);
