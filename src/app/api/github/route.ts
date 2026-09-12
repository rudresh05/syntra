import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pushProblemToGitHub } from '@/lib/github';
import { supabaseServer } from '@/lib/supabase';
import { EXTERNAL_SERVICES } from '@/config/api';

const JWT_SECRET = process.env.JWT_SECRET || 'syntra_super_secret_jwt_key_2026';
const DEFAULT_REPO = EXTERNAL_SERVICES.DEFAULT_GITHUB_REPO;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      token,
      owner,
      repo,
      branch,
      problemNumber,
      problemTitle,
      problemSlug,
      difficulty,
      topics,
      code,
      language,
      runtime,
      memory,
      description,
    } = body;

    if (!problemTitle || !code || !language) {
      return NextResponse.json(
        { error: 'Problem title, code, and language are required' },
        { status: 400 }
      );
    }

    // Resolve credentials securely on the backend (zero token exposure to frontend)
    let authToken = token;
    let authOwner = owner;
    let authRepo = repo;
    let authBranch = branch || 'main';

    // 1. Read from HttpOnly syntra_session cookie
    const sessionCookie = req.cookies.get('syntra_session')?.value;
    let sessionUser: any = null;

    if (sessionCookie) {
      try {
        sessionUser = jwt.verify(sessionCookie, JWT_SECRET) as any;
        if (sessionUser) {
          authToken = authToken || sessionUser.githubToken;
          authOwner = authOwner || sessionUser.githubOwner || sessionUser.username;
          authRepo = authRepo || sessionUser.githubRepo;
        }
      } catch {}
    }

    // 2. If token is still missing, lookup user profile in Supabase using server role
    if (!authToken && authOwner) {
      try {
        const { data: profile } = await supabaseServer
          .from('profiles')
          .select('github_token, github_repo, github_branch')
          .eq('github_username', authOwner)
          .single();

        if (profile?.github_token) {
          authToken = profile.github_token;
          authRepo = authRepo || profile.github_repo;
          authBranch = authBranch || profile.github_branch || 'main';
        }
      } catch (dbErr) {
        console.error('Supabase profile lookup error:', dbErr);
      }
    }

    authRepo = authRepo || DEFAULT_REPO;

    if (!authToken || !authOwner) {
      return NextResponse.json(
        { error: 'GitHub authentication missing. Please connect your GitHub account.' },
        { status: 401 }
      );
    }

    const resolvedSlug = problemSlug || problemTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // 0. Check Supabase for existing push to prevent duplicate commits
    try {
      const { data: existingProfile } = await supabaseServer
        .from('profiles')
        .select('id')
        .eq('github_username', authOwner)
        .single();

      if (existingProfile?.id) {
        const { data: existingSub } = await supabaseServer
          .from('problem_submissions')
          .select('id, github_url, code')
          .eq('user_id', existingProfile.id)
          .eq('title_slug', resolvedSlug)
          .single();

        if (existingSub && existingSub.github_url && !body.forcePush) {
          // If already pushed and code hasn't changed, return without redundant commit!
          if (existingSub.code?.trim() === code.trim()) {
            return NextResponse.json({
              success: true,
              alreadyPushed: true,
              githubUrl: existingSub.github_url,
              message: `Problem #${problemNumber} ${problemTitle} is already synced to GitHub with identical code.`,
            });
          }
        }
      }
    } catch (checkErr) {
      console.log('Duplicate check note:', checkErr);
    }

    const result = await pushProblemToGitHub({
      token: authToken,
      owner: authOwner,
      repo: authRepo,
      branch: authBranch,
      problemNumber: Number(problemNumber) || 0,
      problemTitle,
      problemSlug: resolvedSlug,
      difficulty: difficulty || 'Medium',
      topics: topics || [],
      code,
      language,
      runtime,
      memory,
      description,
    });

    // Auto-record problem submission into Supabase Database via server role
    try {
      const { data: profile } = await supabaseServer
        .from('profiles')
        .select('id')
        .eq('github_username', authOwner)
        .single();

      if (profile?.id) {
        await supabaseServer.from('problem_submissions').upsert(
          {
            user_id: profile.id,
            problem_number: Number(problemNumber) || 0,
            title: problemTitle,
            title_slug: problemSlug || problemTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            difficulty: difficulty || 'Medium',
            topics: topics || [],
            code,
            language,
            runtime,
            memory,
            notes: description,
            github_url: result.githubUrl,
            solved_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,title_slug' }
        );
      }
    } catch (subErr) {
      console.error('Supabase submission save error:', subErr);
    }

    return NextResponse.json({
      success: true,
      githubUrl: result.githubUrl,
    });
  } catch (error: any) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to push to GitHub' },
      { status: 500 }
    );
  }
}
