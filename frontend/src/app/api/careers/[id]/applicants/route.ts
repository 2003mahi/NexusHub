import { NextResponse } from 'next/server';
import { getSession, getUserById } from '@/app/lib/auth';
import { getApplicantsForCareer, updateCandidateStatus } from '@/app/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user || !['founder', 'professional', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Recruiter privileges required.' }, { status: 403 });
    }

    const { id: careerId } = await params;
    const result = getApplicantsForCareer(user.id, user.role, careerId);

    if (!result.success) {
      const status = result.error?.includes('Forbidden') ? 403 : 404;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ applicants: result.applicants });
  } catch (err: any) {
    console.error('Applicants GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve applicants.' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user || !['founder', 'professional', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Recruiter privileges required.' }, { status: 403 });
    }

    const body = await req.json();
    const { applicationId, status, notes } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'Application ID and status are required.' }, { status: 400 });
    }

    const result = updateCandidateStatus(user.id, user.role, applicationId, status, notes);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update candidate status.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Candidate status updated successfully.' });
  } catch (err: any) {
    console.error('Applicant status PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 });
  }
}
