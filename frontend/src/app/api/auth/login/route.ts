import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, validateEmail, createSession } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const result = await authenticateUser(email, password);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const token = await createSession({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      fullName: result.user.fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role,
        emailVerified: result.user.emailVerified,
      },
    });

    response.cookies.set('nexushub-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
