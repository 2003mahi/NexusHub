import { NextResponse } from 'next/server';
import { getSession, getUserById } from '@/app/lib/auth';
import { getRecruiterPostings } from '@/app/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user || !['founder', 'professional', 'admin'].includes(user.role)) {
      return NextResponse.json({
        error: 'Recruiter, Founder, or Administrator privileges required.'
      }, { status: 403 });
    }

    const postings = getRecruiterPostings(user.id, user.role);
    return NextResponse.json({ postings });
  } catch (err: any) {
    console.error('Recruiter postings GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve posted opportunities.' }, { status: 500 });
  }
}
