import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession, getUserById } from '@/app/lib/auth';
import {
  getUserApplications,
  applyToOpportunity,
  getUserActivities,
} from '@/app/lib/userData';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const apps = getUserApplications(session.userId);
    return NextResponse.json({ applications: apps });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to retrieve applications.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const body = await req.json();
    const { opportunityId, notes } = body;

    if (!opportunityId || typeof opportunityId !== 'string') {
      return NextResponse.json({ error: 'Opportunity ID is required.' }, { status: 400 });
    }

    if (notes && typeof notes === 'string' && notes.length > 1000) {
      return NextResponse.json({ error: 'Application note cannot exceed 1000 characters.' }, { status: 400 });
    }

    const res = applyToOpportunity(user.id, opportunityId, notes);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to submit application.' }, { status: 400 });
    }

    const apps = getUserApplications(user.id);
    const activities = getUserActivities(user.id, 10);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      application: res.application,
      applications: apps,
      activities,
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 });
  }
}
