import { NextResponse } from 'next/server';
import { getSession, getUserById } from '@/app/lib/auth';
import { searchChallenges, createChallenge, getLabsStats } from '@/app/lib/labs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Stats endpoint
    if (searchParams.get('stats') === 'true') {
      const stats = getLabsStats();
      return NextResponse.json(stats);
    }

    const q = searchParams.get('q') || undefined;
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const status = searchParams.get('status') || undefined;
    const skillsParam = searchParams.get('skills');
    const skills = skillsParam ? skillsParam.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 9;
    const sortBy = (searchParams.get('sortBy') as 'newest' | 'deadline' | 'participants' | 'difficulty') || 'newest';

    const results = searchChallenges({ q, category, difficulty, status, skills, featured, page, limit, sortBy });
    return NextResponse.json(results);
  } catch (err) {
    console.error('Labs GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve challenges.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    if (!['founder', 'professional', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Only Founders, Professionals, and Admins can create challenges.' }, { status: 403 });
    }

    const body = await req.json();
    const result = createChallenge(
      { userId: user.id, name: user.fullName, email: user.email, role: user.role },
      body
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, challenge: result.challenge }, { status: 201 });
  } catch (err) {
    console.error('Labs POST error:', err);
    return NextResponse.json({ error: 'Failed to create challenge.' }, { status: 500 });
  }
}
