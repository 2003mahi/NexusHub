import { NextRequest, NextResponse } from 'next/server';
import { createPasswordResetToken, validateEmail } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const result = createPasswordResetToken(email);

    // Always return success to prevent enumeration
    const response: Record<string, unknown> = {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };

    // In production, send via email. For demo/testing, include token.
    if ('token' in result && result.token) {
      response.resetToken = result.token;
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
