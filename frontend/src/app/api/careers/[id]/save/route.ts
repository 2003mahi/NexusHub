import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { toggleSave } from '@/app/lib/careers';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'You must be signed in to save opportunities.' }, { status: 401 });
    }

    const { id: careerId } = await params;
    const result = toggleSave(session.userId, careerId);

    if (!result.success) {
      return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      saved: result.saved,
      message: result.saved ? 'Opportunity saved to your watchlist.' : 'Opportunity removed from your saved list.'
    });
  } catch (err: any) {
    console.error('Toggle save error:', err);
    return NextResponse.json({ error: 'Failed to update saved status.' }, { status: 500 });
  }
}
