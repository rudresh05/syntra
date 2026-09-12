import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Public client for browser / read operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Backend-only secure client using Service Role Key (bypasses RLS, full backend control)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface SupabaseUserProfile {
  id: string;
  github_username: string;
  github_repo: string;
  github_token?: string;
  leetcode_username?: string;
  created_at: string;
}

export interface SupabaseProblemSubmission {
  id?: string;
  user_id: string;
  problem_number: number;
  title: string;
  title_slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  code?: string;
  language?: string;
  runtime?: string;
  memory?: string;
  notes?: string;
  github_url?: string;
  solved_at: string;
}
