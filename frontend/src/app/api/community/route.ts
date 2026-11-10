import { NextResponse } from 'next/server';
import { getCommunityStats, FOUNDER_INFO, getAnnouncements } from '@/app/lib/community';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = getCommunityStats();
    const announcements = getAnnouncements();
    return NextResponse.json({
      stats,
      founder: FOUNDER_INFO,
      announcements,
    });
  } catch (err) {
    console.error('Community overview GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve community data.' }, { status: 500 });
  }
}
