import { NextRequest, NextResponse } from 'next/server';
import { createUser, validateEmail, validatePassword, createSession, type UserRole } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, role } = body;

    // Validate inputs
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Validate role
    const allowedRoles: UserRole[] = ['student', 'founder', 'professional'];
    const userRole: UserRole = allowedRoles.includes(role) ? role : 'student';

    const result = await createUser(fullName, email, password, userRole);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    // Create session
    const token = await createSession({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      fullName: result.user.fullName,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully! Please verify your email.',
      user: {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role,
        emailVerified: result.user.emailVerified,
      },
      // In production, send this via email. Exposed here for demo/testing.
      verificationToken: result.verificationToken,
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
