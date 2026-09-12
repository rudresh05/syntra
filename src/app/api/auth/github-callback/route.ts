import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { EXTERNAL_SERVICES } from '@/config/api';

const JWT_SECRET = process.env.JWT_SECRET || 'syntra_super_secret_jwt_key_2026';
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const DEFAULT_REPO = EXTERNAL_SERVICES.DEFAULT_GITHUB_REPO;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const origin = req.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}?auth_error=No+authorization+code+provided`);
  }

  try {
    const tokenRes = await fetch(EXTERNAL_SERVICES.GITHUB_OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      return NextResponse.redirect(
        `${origin}?auth_error=${encodeURIComponent(tokenData.error_description || 'GitHub OAuth failed')}`
      );
    }

    const accessToken = tokenData.access_token;

    const userRes = await fetch(EXTERNAL_SERVICES.GITHUB_USER_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Syntra-App',
      },
    });

    const ghUser = await userRes.json();

    const userSession = {
      id: 'gh_' + ghUser.id,
      username: ghUser.login,
      email: ghUser.email || `${ghUser.login}@users.noreply.github.com`,
      avatarUrl: ghUser.avatar_url,
      authProvider: 'github' as const,
      githubToken: accessToken,
      githubOwner: ghUser.login,
      githubRepo: DEFAULT_REPO,
      createdAt: new Date().toISOString(),
    };

    // Auto-save/upsert user profile into Supabase Database using server role
    try {
      const { supabaseServer } = await import('@/lib/supabase');
      await supabaseServer.from('profiles').upsert(
        {
          github_username: ghUser.login,
          github_repo: DEFAULT_REPO,
          github_branch: 'main',
          github_token: accessToken,
          avatar_url: ghUser.avatar_url,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'github_username' }
      );
    } catch (dbErr) {
      console.error('Supabase profile sync note:', dbErr);
    }

    const jwtToken = jwt.sign(userSession, JWT_SECRET, { expiresIn: '30d' });

    // Clean server-side redirect with HttpOnly cookie (zero token leakage to frontend HTML/JS)
    const redirectUrl = new URL('/?auth_success=true', origin);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('syntra_session', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.redirect(`${origin}?auth_error=${encodeURIComponent(error.message)}`);
  }
}
