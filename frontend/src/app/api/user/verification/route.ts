import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession, getUserById } from '@/app/lib/auth';
import { requestIdentityVerification, getUserProfile } from '@/app/lib/userData';

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const res = requestIdentityVerification(user.id);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Verification request failed.' }, { status: 400 });
    }

    const profile = getUserProfile(user.id);

    return NextResponse.json({
      success: true,
      message: 'Verification request submitted successfully.',
      verificationStatus: profile.verificationStatus,
    });
  } catch (error) {
    console.error('Verification request error:', error);
    return NextResponse.json({ error: 'Failed to submit verification request.' }, { status: 500 });
  }
}
