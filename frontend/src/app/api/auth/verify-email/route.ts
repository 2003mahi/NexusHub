import { NextRequest, NextResponse } from 'next/server';
import { verifyEmail } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required.' }, { status: 400 });
    }

    const result = verifyEmail(token);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Email verified successfully!' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
