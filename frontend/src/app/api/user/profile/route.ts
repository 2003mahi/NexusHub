import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession, getUserById, updateUserBasic } from '@/app/lib/auth';
import {
  getUserProfile,
  updateUserProfile,
  getUserDocuments,
  calculateProfileCompletion,
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

    const profile = getUserProfile(user.id);
    const docs = getUserDocuments(user.id);
    const completion = calculateProfileCompletion(user, profile, docs.length);

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      profile,
      completion,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to retrieve profile.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
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

    // Validation
    const errors: Record<string, string> = {};

    if (body.fullName !== undefined) {
      if (typeof body.fullName !== 'string' || body.fullName.trim().length < 2) {
        errors.fullName = 'Full name must be at least 2 characters.';
      } else if (body.fullName.length > 70) {
        errors.fullName = 'Full name cannot exceed 70 characters.';
      }
    }

    if (body.headline !== undefined && typeof body.headline === 'string' && body.headline.length > 120) {
      errors.headline = 'Headline cannot exceed 120 characters.';
    }

    if (body.bio !== undefined && typeof body.bio === 'string' && body.bio.length > 2000) {
      errors.bio = 'Bio cannot exceed 2000 characters.';
    }

    if (body.phone !== undefined && typeof body.phone === 'string' && body.phone.length > 30) {
      errors.phone = 'Phone number cannot exceed 30 characters.';
    }

    if (body.website !== undefined && typeof body.website === 'string' && body.website.trim().length > 0) {
      try {
        const url = new URL(body.website.startsWith('http') ? body.website : `https://${body.website}`);
        if (!['http:', 'https:'].includes(url.protocol)) {
          errors.website = 'Invalid URL protocol.';
        }
      } catch {
        errors.website = 'Invalid website URL format.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed.', details: errors }, { status: 400 });
    }

    // Update fullName in auth store if supplied
    let updatedFullName = user.fullName;
    if (body.fullName && body.fullName.trim() !== user.fullName) {
      const updatedAuthUser = updateUserBasic(user.id, { fullName: body.fullName.trim() });
      if (updatedAuthUser) {
        updatedFullName = updatedAuthUser.fullName;
      }
    }

    // Process skills cleanly
    let processedSkills: string[] | undefined = undefined;
    if (body.skills !== undefined) {
      if (Array.isArray(body.skills)) {
        processedSkills = body.skills
          .map((s: any) => String(s).trim())
          .filter((s: string) => s.length > 0 && s.length <= 30)
          .slice(0, 20); // max 20 skills
      } else if (typeof body.skills === 'string') {
        processedSkills = body.skills
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0 && s.length <= 30)
          .slice(0, 20);
      }
    }

    const updatedProfile = updateUserProfile(user.id, {
      ...(body.headline !== undefined ? { headline: body.headline.trim() } : {}),
      ...(body.bio !== undefined ? { bio: body.bio.trim() } : {}),
      ...(body.location !== undefined ? { location: body.location.trim() } : {}),
      ...(body.phone !== undefined ? { phone: body.phone.trim() } : {}),
      ...(body.website !== undefined ? { website: body.website.trim() } : {}),
      ...(body.github !== undefined ? { github: body.github.trim() } : {}),
      ...(body.linkedin !== undefined ? { linkedin: body.linkedin.trim() } : {}),
      ...(body.avatarUrl !== undefined ? { avatarUrl: body.avatarUrl.trim() } : {}),
      ...(processedSkills !== undefined ? { skills: processedSkills } : {}),
    });

    const docs = getUserDocuments(user.id);
    const completion = calculateProfileCompletion(
      { ...user, fullName: updatedFullName },
      updatedProfile,
      docs.length
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        fullName: updatedFullName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      profile: updatedProfile,
      completion,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}

export { PATCH as PUT };
