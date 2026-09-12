import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS, EXTERNAL_SERVICES } from '@/config/api';

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID || '';
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}${API_ENDPOINTS.AUTH_GITHUB_CALLBACK}`;

  const authBaseUrl = EXTERNAL_SERVICES.GITHUB_OAUTH_AUTHORIZE_URL;
  const githubAuthUrl = `${authBaseUrl}?client_id=${clientId}&scope=user:email,repo&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  return NextResponse.json({ url: githubAuthUrl, clientIdConfigured: !!process.env.GITHUB_CLIENT_ID });
}
