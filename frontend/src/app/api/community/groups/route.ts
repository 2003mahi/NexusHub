import { NextResponse } from 'next/server';
import { getCommunityGroups, joinCommunityGroup } from '@/app/lib/community';
import { getSession } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const groups = getCommunityGroups();
    return NextResponse.json({ groups });
  } catch (err) {
    console.error('Community groups GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve groups.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Authentication required to join community groups.' }, { status: 401 });
    }

    const body = await req.json();
    const { groupId } = body;
    if (!groupId) {
      return NextResponse.json({ error: 'Group ID is required.' }, { status: 400 });
    }

    const result = joinCommunityGroup(session.userId, groupId);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update group membership.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, isMember: result.isMember });
  } catch (err) {
    console.error('Community groups POST error:', err);
    return NextResponse.json({ error: 'Failed to join group.' }, { status: 500 });
  }
}
