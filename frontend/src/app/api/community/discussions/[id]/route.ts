import { NextResponse } from 'next/server';
import { getDiscussionById } from '@/app/lib/community';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = getDiscussionById(id);
    if (!res) {
      return NextResponse.json({ error: 'Discussion not found.' }, { status: 404 });
    }
    return NextResponse.json(res);
  } catch (err) {
    console.error('Discussion detail GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve discussion thread.' }, { status: 500 });
  }
}
