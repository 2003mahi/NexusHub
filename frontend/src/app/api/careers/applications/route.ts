import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { getUserApplications } from '@/app/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const applications = getUserApplications(session.userId);
    return NextResponse.json({ applications });
  } catch (err: any) {
    console.error('Applications GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve applications.' }, { status: 500 });
  }
}
