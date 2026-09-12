import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'syntra_super_secret_jwt_key_2026';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Username/Email and password are required' },
        { status: 400 }
      );
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 9);
    const username = identifier.includes('@') ? identifier.split('@')[0] : identifier;

    const userSession = {
      id: userId,
      username,
      email: identifier.includes('@') ? identifier : `${username}@syntra.io`,
      authProvider: 'manual' as const,
      createdAt: new Date().toISOString(),
    };

    const token = jwt.sign(userSession, JWT_SECRET, { expiresIn: '30d' });

    const response = NextResponse.json({
      success: true,
      user: userSession,
      token,
    });

    response.cookies.set('syntra_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
