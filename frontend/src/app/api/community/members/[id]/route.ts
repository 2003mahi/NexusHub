import { NextResponse } from 'next/server';
import { getPublicMemberById, getUserConnectionStatus } from '@/app/lib/community';
import { getSession } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = getPublicMemberById(id);
    if (!member) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    const session = await getSession();
    let connectionStatus = 'none';
    if (session && session.userId) {
      const res = getUserConnectionStatus(session.userId, id);
      connectionStatus = res.status;
    }

    return NextResponse.json({ member, connectionStatus });
  } catch (err) {
    console.error('Community member by ID error:', err);
    return NextResponse.json({ error: 'Failed to retrieve member profile.' }, { status: 500 });
  }
}
