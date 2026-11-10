import { NextResponse } from 'next/server';
import { getDiscoveredMembers } from '@/app/lib/community';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || undefined;
    const q = searchParams.get('q') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 12;

    const data = getDiscoveredMembers({ role, q, page, limit });
    return NextResponse.json(data);
  } catch (err) {
    console.error('Community members GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve community members.' }, { status: 500 });
  }
}
