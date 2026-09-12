import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseServer } from '@/lib/supabase';
import { EXTERNAL_SERVICES } from '@/config/api';

const JWT_SECRET = process.env.JWT_SECRET || 'syntra_super_secret_jwt_key_2026';
const GITHUB_API_URL = EXTERNAL_SERVICES.GITHUB_API_URL;
const DEFAULT_REPO = EXTERNAL_SERVICES.DEFAULT_GITHUB_REPO;

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('syntra_session')?.value;
    let authToken = '';
    let authOwner = '';
    let authRepo = '';

    // 1. Read from HttpOnly syntra_session cookie
    if (sessionCookie) {
      try {
        const sessionUser = jwt.verify(sessionCookie, JWT_SECRET) as any;
        if (sessionUser) {
          authToken = sessionUser.githubToken || '';
          authOwner = sessionUser.githubOwner || sessionUser.username || '';
          authRepo = sessionUser.githubRepo || DEFAULT_REPO;
        }
      } catch {}
    }

    // 2. If token missing, check Supabase profile using server role
    if (!authToken && authOwner) {
      try {
        const { data: profile } = await supabaseServer
          .from('profiles')
          .select('github_token, github_repo')
          .eq('github_username', authOwner)
          .single();

        if (profile?.github_token) {
          authToken = profile.github_token;
          authRepo = profile.github_repo || authRepo;
        }
      } catch (dbErr) {
        console.error('Supabase profile lookup error:', dbErr);
      }
    }

    // Check query params if provided
    const url = new URL(req.url);
    const queryOwner = url.searchParams.get('owner') || authOwner;
    const queryRepo = url.searchParams.get('repo') || authRepo || DEFAULT_REPO;

    if (!authToken || !queryOwner) {
      return NextResponse.json(
        {
          success: false,
          reason: 'not_authenticated',
          commitsByDate: {},
          totalCommits: 0,
        },
        { status: 200 }
      );
    }

    // 3. Fetch real commits from GitHub API
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${queryOwner}/${queryRepo}/commits?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Syntra-App',
        },
        next: { revalidate: 60 }, // cache for 60 seconds
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        reason: response.status === 404 ? 'repo_not_found' : 'github_api_error',
        commitsByDate: {},
        totalCommits: 0,
      });
    }

    const commitsData = await response.json();
    if (!Array.isArray(commitsData)) {
      return NextResponse.json({
        success: false,
        reason: 'invalid_response',
        commitsByDate: {},
        totalCommits: 0,
      });
    }

    const commitsByDate: Record<string, number> = {};
    const recentCommits: Array<{
      sha: string;
      message: string;
      date: string;
      url: string;
    }> = [];

    commitsData.forEach((c: any) => {
      const dateStr = c.commit?.author?.date || c.commit?.committer?.date;
      if (dateStr) {
        const dayKey = dateStr.split('T')[0]; // YYYY-MM-DD
        commitsByDate[dayKey] = (commitsByDate[dayKey] || 0) + 1;
      }
      if (recentCommits.length < 5) {
        recentCommits.push({
          sha: c.sha ? c.sha.substring(0, 7) : '',
          message: c.commit?.message?.split('\n')[0] || 'Solution commit',
          date: dateStr || '',
          url: c.html_url || '',
        });
      }
    });

    return NextResponse.json({
      success: true,
      commitsByDate,
      totalCommits: commitsData.length,
      recentCommits,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        commitsByDate: {},
        totalCommits: 0,
      },
      { status: 500 }
    );
  }
}
