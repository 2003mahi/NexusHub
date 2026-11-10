import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { getSavedCareers, getSavedIds } from '@/app/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ savedIds: [], savedCareers: [] });
    }

    const savedIds = getSavedIds(session.userId);
    const savedCareers = getSavedCareers(session.userId);

    return NextResponse.json({ savedIds, savedCareers });
  } catch (err: any) {
    console.error('Saved careers GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve saved opportunities.' }, { status: 500 });
  }
}
