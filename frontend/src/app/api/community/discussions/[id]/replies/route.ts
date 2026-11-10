import { NextResponse } from 'next/server';
import { addDiscussionReply } from '@/app/lib/community';
import { getSession, getUserById } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Authentication required to post a reply.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    const { id } = await params;
    const body = await req.json();
    const { content } = body;

    const result = addDiscussionReply(
      { id: user.id, fullName: user.fullName, role: user.role },
      id,
      content
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, reply: result.reply }, { status: 201 });
  } catch (err) {
    console.error('Discussion reply POST error:', err);
    return NextResponse.json({ error: 'Failed to post reply.' }, { status: 500 });
  }
}
