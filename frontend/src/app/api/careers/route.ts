import { NextResponse } from 'next/server';
import { getSession, getUserById } from '@/app/lib/auth';
import { fetchCareers, postNewCareer } from '@/app/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const role = searchParams.get('role') || undefined;
    const location = searchParams.get('location') || undefined;
    const experience = searchParams.get('experience') || undefined;
    const employmentType = searchParams.get('employmentType') || undefined;
    const category = searchParams.get('category') || undefined;
    const remoteOnly = searchParams.get('remoteOnly') === 'true';
    const source = (searchParams.get('source') as any) || undefined;
    const skillsParam = searchParams.get('skills');
    const skills = skillsParam ? skillsParam.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 9;
    const sortBy = (searchParams.get('sortBy') as any) || 'newest';

    const results = await fetchCareers({
      q,
      role,
      location,
      experience,
      employmentType,
      category,
      remoteOnly,
      source,
      skills,
      page,
      limit,
      sortBy
    });

    return NextResponse.json(results);
  } catch (err: any) {
    console.error('Careers GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve opportunities' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required to post an opportunity.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    // Role-based authorization
    if (!['founder', 'professional', 'admin'].includes(user.role)) {
      return NextResponse.json({
        error: 'Recruiter or Founder privileges required. Students cannot create public career listings.'
      }, { status: 403 });
    }

    const body = await req.json();
    const result = postNewCareer(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      body
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to create opportunity.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, career: result.career }, { status: 201 });
  } catch (err: any) {
    console.error('Careers POST error:', err);
    return NextResponse.json({ error: 'Internal server error while publishing opportunity.' }, { status: 500 });
  }
}
