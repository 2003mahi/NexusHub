import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession, getUserById } from '@/app/lib/auth';
import {
  getSavedOpportunities,
  saveOpportunity,
  removeSavedOpportunity,
  getOpportunities,
} from '@/app/lib/userData';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const saved = getSavedOpportunities(user.id);
    const catalog = getOpportunities(user.role);

    return NextResponse.json({
      savedOpportunities: saved,
      catalog,
    });
  } catch (error) {
    console.error('Error fetching saved opportunities:', error);
    return NextResponse.json({ error: 'Failed to retrieve saved opportunities.' }, { status: 500 });
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
    const { opportunityId } = body;

    if (!opportunityId || typeof opportunityId !== 'string') {
      return NextResponse.json({ error: 'Opportunity ID is required.' }, { status: 400 });
    }

    const result = saveOpportunity(user.id, opportunityId);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save opportunity.' }, { status: 400 });
    }

    const updatedSaved = getSavedOpportunities(user.id);
    return NextResponse.json({
      success: true,
      message: 'Opportunity saved to your watchlist.',
      savedOpportunities: updatedSaved,
    });
  } catch (error) {
    console.error('Error saving opportunity:', error);
    return NextResponse.json({ error: 'Failed to save opportunity.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Opportunity ID or Saved ID is required.' }, { status: 400 });
    }

    const success = removeSavedOpportunity(user.id, id);
    if (!success) {
      return NextResponse.json({ error: 'Saved opportunity not found or already removed.' }, { status: 404 });
    }

    const updatedSaved = getSavedOpportunities(user.id);
    return NextResponse.json({
      success: true,
      message: 'Removed from watchlist.',
      savedOpportunities: updatedSaved,
    });
  } catch (error) {
    console.error('Error removing saved opportunity:', error);
    return NextResponse.json({ error: 'Failed to remove saved opportunity.' }, { status: 500 });
  }
}
