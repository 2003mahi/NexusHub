import { NextResponse } from 'next/server';
import { toggleLikeDiscussion } from '@/app/lib/community';
import { getSession } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Authentication required to like discussions.' }, { status: 401 });
    }

    const { id } = await params;
    const result = toggleLikeDiscussion(session.userId, id);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Discussion like POST error:', err);
    return NextResponse.json({ error: 'Failed to toggle like.' }, { status: 500 });
  }
}
