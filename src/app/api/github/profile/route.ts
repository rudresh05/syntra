import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { EXTERNAL_SERVICES } from '@/config/api';

const JWT_SECRET = process.env.JWT_SECRET || 'syntra_super_secret_jwt_key_2026';
const GITHUB_API_URL = EXTERNAL_SERVICES.GITHUB_API_URL;

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('syntra_session')?.value;
    let authToken = '';
    let authOwner = '';

    if (sessionCookie) {
      try {
        const sessionUser = jwt.verify(sessionCookie, JWT_SECRET) as any;
        if (sessionUser) {
          authToken = sessionUser.githubToken || '';
          authOwner = sessionUser.githubOwner || sessionUser.username || '';
        }
      } catch {}
    }

    const url = new URL(req.url);
    const targetUsername = url.searchParams.get('username') || authOwner;

    if (!targetUsername) {
      return NextResponse.json(
        { success: false, error: 'No GitHub username provided or found in session' },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Syntra-App',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${GITHUB_API_URL}/users/${targetUsername}`, {
      headers,
      next: { revalidate: 300 }, // Cache profile for 5 mins
    });

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: `GitHub user "${targetUsername}" not found`,
      });
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      profile: {
        login: data.login,
        name: data.name || data.login,
        avatar_url: data.avatar_url || `https://github.com/${data.login}.png`,
        html_url: data.html_url || `https://github.com/${data.login}`,
        bio: data.bio || '',
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        company: data.company || '',
        location: data.location || '',
        created_at: data.created_at || '',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
