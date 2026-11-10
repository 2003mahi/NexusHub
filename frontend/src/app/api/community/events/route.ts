import { NextResponse } from 'next/server';
import { getCommunityEvents, toggleRsvpEvent, getAnnouncements } from '@/app/lib/community';
import { getSession } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    const events = getCommunityEvents({ category });
    const announcements = getAnnouncements();

    return NextResponse.json({ events, announcements });
  } catch (err) {
    console.error('Community events GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve events.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Authentication required to RSVP for events.' }, { status: 401 });
    }

    const body = await req.json();
    const { eventId } = body;
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
    }

    const result = toggleRsvpEvent(session.userId, eventId);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to RSVP.' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('Community event RSVP error:', err);
    return NextResponse.json({ error: 'Failed to process event RSVP.' }, { status: 500 });
  }
}
