import { NextResponse } from 'next/server';
import { getSession, getUserById } from '@/app/lib/auth';
import { getChallengeById, updateChallenge, deleteChallenge, joinChallenge, getChallengeParticipants, getTeamSeekers } from '@/app/lib/labs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    // Sub-routes via query param
    if (searchParams.get('participants') === 'true') {
      const participants = getChallengeParticipants(id);
      return NextResponse.json({ participants });
    }
    if (searchParams.get('team-seekers') === 'true') {
      const seekers = getTeamSeekers(id);
      return NextResponse.json({ seekers });
    }

    const challenge = getChallengeById(id);
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found.' }, { status: 404 });
    }
    return NextResponse.json({ challenge });
  } catch (err) {
    console.error('Labs detail GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve challenge.' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const user = getUserById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    const body = await req.json();
    const result = updateChallenge(user.id, user.role, id, body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error?.includes('Permission') ? 403 : 400 });
    }
    return NextResponse.json({ success: true, challenge: result.challenge });
  } catch (err) {
    console.error('Labs PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update challenge.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const user = getUserById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    const result = deleteChallenge(user.id, user.role, id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error?.includes('Permission') ? 403 : 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Labs DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete challenge.' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const user = getUserById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    const body = await req.json();
    const result = joinChallenge(
      { userId: user.id, name: user.fullName, email: user.email, role: user.role },
      id,
      body.skills || [],
      body.lookingForTeam || false
    );

    if (!result.success) {
      const code = result.error?.includes('already') ? 409 : 400;
      return NextResponse.json({ error: result.error }, { status: code });
    }
    return NextResponse.json({ success: true, participant: result.participant }, { status: 201 });
  } catch (err) {
    console.error('Labs join POST error:', err);
    return NextResponse.json({ error: 'Failed to join challenge.' }, { status: 500 });
  }
}
