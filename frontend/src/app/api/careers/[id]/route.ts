import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { fetchCareerDetail } from '@/app/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const career = await fetchCareerDetail(id);

    if (!career) {
      return NextResponse.json({ error: 'Career opportunity not found' }, { status: 404 });
    }

    return NextResponse.json({ career });
  } catch (err: any) {
    console.error('Career detail GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve opportunity details' }, { status: 500 });
  }
}
