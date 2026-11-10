import { NextResponse } from 'next/server';
import { manageConnectionRequest, getUserConnectionStatus } from '@/app/lib/community';
import { getSession } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Authentication required to connect with members.' }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId, message } = body;
    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required.' }, { status: 400 });
    }

    const result = manageConnectionRequest(session.userId, targetUserId, message);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Connection action failed.' }, { status: 400 });
    }

    const statusCheck = getUserConnectionStatus(session.userId, targetUserId);
    return NextResponse.json({ success: true, status: statusCheck.status });
  } catch (err) {
    console.error('Community connect POST error:', err);
    return NextResponse.json({ error: 'Failed to process connection request.' }, { status: 500 });
  }
}
