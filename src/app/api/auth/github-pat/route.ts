import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'syntra_super_secret_jwt_key_2026';

export async function POST(req: NextRequest) {
  try {
    const { token, owner, repo } = await req.json();

    if (!token || !owner || !repo) {
      return NextResponse.json(
        { error: 'GitHub Personal Access Token, Username, and Repo are required' },
        { status: 400 }
      );
    }

    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!ghRes.ok) {
      return NextResponse.json(
        { error: 'Could not access GitHub repo. Check token permissions and repo name!' },
        { status: 401 }
      );
    }

    // Fetch real user profile from GitHub API
    let avatarUrl = `https://github.com/${owner}.png`;
    let name = owner;
    let bio = '';
    let publicRepos = 0;
    let followers = 0;

    try {
      const userGhRes = await fetch(`https://api.github.com/users/${owner}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Syntra-App',
        },
      });
      if (userGhRes.ok) {
        const uData = await userGhRes.json();
        avatarUrl = uData.avatar_url || avatarUrl;
        name = uData.name || owner;
        bio = uData.bio || '';
        publicRepos = uData.public_repos || 0;
        followers = uData.followers || 0;
      }
    } catch (err) {
      console.error('Error fetching user GitHub profile:', err);
    }

    const userId = 'usr_gh_' + owner;
    const userSession = {
      id: userId,
      username: owner,
      name,
      email: `${owner}@users.noreply.github.com`,
      avatarUrl,
      bio,
      publicRepos,
      followers,
      htmlUrl: `https://github.com/${owner}`,
      authProvider: 'github' as const,
      githubToken: token,
      githubOwner: owner,
      githubRepo: repo,
      createdAt: new Date().toISOString(),
    };

    // Auto-save/upsert user profile into Supabase Database using backend service client
    try {
      const { supabaseServer } = await import('@/lib/supabase');
      await supabaseServer.from('profiles').upsert(
        {
          github_username: owner,
          github_repo: repo,
          github_branch: 'main',
          github_token: token,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'github_username' }
      );
    } catch (dbErr) {
      console.error('Supabase PAT profile sync error:', dbErr);
    }

    const jwtToken = jwt.sign(userSession, JWT_SECRET, { expiresIn: '30d' });

    // Sanitize user: NEVER send raw tokens back in JSON to the frontend
    const { githubToken, ...safeUser } = userSession;

    const response = NextResponse.json({
      success: true,
      user: {
        ...safeUser,
        hasGithubToken: true,
      },
    });

    // Set secure HTTP-Only Cookie (inaccessible to browser JS/XSS)
    response.cookies.set('syntra_session', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'GitHub auth failed' }, { status: 500 });
  }
}
