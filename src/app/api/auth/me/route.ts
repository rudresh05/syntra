import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'syntra_super_secret_jwt_key_2026';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('syntra_session')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    // NEVER expose raw tokens/credentials to the frontend!
    const { githubToken, ...safeUser } = payload;

    return NextResponse.json({
      authenticated: true,
      user: {
        ...safeUser,
        hasGithubToken: Boolean(githubToken),
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
