import { NextResponse } from 'next/server';
import { getSession, getUserById } from '@/app/lib/auth';
import { submitCareerApplication, fetchCareerDetail } from '@/app/lib/careers';
import { getUserProfile } from '@/app/lib/userData';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'You must be signed in to submit an application.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    const { id: careerId } = await params;
    const career = await fetchCareerDetail(careerId);
    if (!career) {
      return NextResponse.json({ error: 'The opportunity you are applying for does not exist.' }, { status: 404 });
    }

    const body = await req.json();
    const { coverLetter, portfolioUrl, resumeUrl, yearsOfExperience, skills } = body;

    if (!coverLetter || typeof coverLetter !== 'string' || coverLetter.trim().length < 20) {
      return NextResponse.json({
        error: 'Please provide a comprehensive cover letter or personal statement (minimum 20 characters).'
      }, { status: 400 });
    }

    if (coverLetter.length > 5000) {
      return NextResponse.json({ error: 'Cover letter cannot exceed 5000 characters.' }, { status: 400 });
    }

    // Get phone or extra details from profile if available
    const profile = getUserProfile(user.id);

    const result = await submitCareerApplication(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: profile?.phone
      },
      careerId,
      {
        coverLetter,
        portfolioUrl: portfolioUrl || profile?.website || profile?.github || profile?.linkedin,
        resumeUrl,
        yearsOfExperience: yearsOfExperience || '1-2 years',
        skills: Array.isArray(skills) && skills.length > 0 ? skills : profile?.skills
      }
    );

    if (!result.success) {
      const status = result.error?.includes('already submitted') ? 409 : 400;
      return NextResponse.json({ error: result.error || 'Failed to submit application.' }, { status });
    }

    return NextResponse.json({
      success: true,
      message: `Your application for "${career.title}" has been successfully delivered to ${career.organization}!`,
      application: result.application
    }, { status: 201 });
  } catch (err: any) {
    console.error('Application submit error:', err);
    return NextResponse.json({ error: 'Internal server error while processing your application.' }, { status: 500 });
  }
}
