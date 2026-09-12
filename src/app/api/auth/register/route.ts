import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'syntra_super_secret_jwt_key_2026';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Math.random().toString(36).substring(2, 9);

    const userSession = {
      id: userId,
      username,
      email,
      authProvider: 'manual' as const,
      createdAt: new Date().toISOString(),
    };

    const token = jwt.sign(userSession, JWT_SECRET, { expiresIn: '30d' });

    const response = NextResponse.json({
      success: true,
      user: userSession,
      token,
    });

    // Set HTTP-Only Cookie
    response.cookies.set('syntra_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
