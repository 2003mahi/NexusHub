import { NextResponse } from 'next/server';
import { getSession, getUserById } from '@/app/lib/auth';
import {
  createSubmission, getUserSubmissions, getChallengeSubmissions,
  updateSubmission, updateSubmissionStatus, addFeedback, getSubmissionById
} from '@/app/lib/labs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');
    const submissionId = searchParams.get('submissionId');

    if (submissionId) {
      const sub = getSubmissionById(submissionId);
      if (!sub) return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
      // Privacy: only team members, challenge owner, or admin can view
      const user = getUserById(session.userId);
      const isMember = sub.leaderId === session.userId || sub.teamMembers.some((m) => m.userId === session.userId);
      if (!isMember && user?.role !== 'admin') {
        return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
      }
      return NextResponse.json({ submission: sub });
    }

    if (challengeId) {
      const user = getUserById(session.userId);
      if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      const result = getChallengeSubmissions(user.id, user.role, challengeId);
      if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
      return NextResponse.json({ submissions: result.submissions });
    }

    // Default: get user's own submissions
    const submissions = getUserSubmissions(session.userId);
    return NextResponse.json({ submissions });
  } catch (err) {
    console.error('Submissions GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve submissions.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const user = getUserById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    const body = await req.json();

    // Handle feedback submission
    if (body.action === 'feedback') {
      const result = addFeedback(
        { userId: user.id, name: user.fullName },
        body.submissionId,
        body.type || 'peer',
        body.comment,
        body.rating
      );
      if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
      return NextResponse.json({ success: true });
    }

    // Handle status update
    if (body.action === 'updateStatus') {
      const result = updateSubmissionStatus(user.id, user.role, body.submissionId, body.status);
      if (!result.success) return NextResponse.json({ error: result.error }, { status: result.error?.includes('Permission') ? 403 : 400 });
      return NextResponse.json({ success: true });
    }

    // Create submission
    if (!body.challengeId) return NextResponse.json({ error: 'Challenge ID is required.' }, { status: 400 });

    const result = createSubmission(
      { userId: user.id, name: user.fullName, email: user.email },
      body.challengeId,
      {
        teamName: body.teamName,
        teamMembers: body.teamMembers,
        title: body.title,
        summary: body.summary,
        description: body.description,
        repoUrl: body.repoUrl,
        demoUrl: body.demoUrl,
        presentationUrl: body.presentationUrl,
        technologies: body.technologies
      }
    );

    if (!result.success) {
      const code = result.error?.includes('already') ? 409 : 400;
      return NextResponse.json({ error: result.error }, { status: code });
    }
    return NextResponse.json({ success: true, submission: result.submission }, { status: 201 });
  } catch (err) {
    console.error('Submissions POST error:', err);
    return NextResponse.json({ error: 'Failed to process submission.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const body = await req.json();
    if (!body.submissionId) return NextResponse.json({ error: 'Submission ID required.' }, { status: 400 });

    const result = updateSubmission(session.userId, body.submissionId, body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error?.includes('Permission') ? 403 : 400 });
    }
    return NextResponse.json({ success: true, submission: result.submission });
  } catch (err) {
    console.error('Submissions PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update submission.' }, { status: 500 });
  }
}
