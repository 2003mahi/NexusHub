import { NextResponse } from 'next/server';
import { getCommunityDiscussions, createDiscussion } from '@/app/lib/community';
import { getSession, getUserById } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId') || undefined;
    const track = searchParams.get('track') || undefined;
    const q = searchParams.get('q') || undefined;

    const data = getCommunityDiscussions({ groupId, track, q });
    return NextResponse.json(data);
  } catch (err) {
    console.error('Community discussions GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve discussions.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Authentication required to post a discussion.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    const body = await req.json();
    const result = createDiscussion(
      { id: user.id, fullName: user.fullName, role: user.role },
      body
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, discussion: result.discussion }, { status: 201 });
  } catch (err) {
    console.error('Community discussions POST error:', err);
    return NextResponse.json({ error: 'Failed to create discussion thread.' }, { status: 500 });
  }
}
