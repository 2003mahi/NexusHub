import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession, getUserById } from '@/app/lib/auth';
import { getUserSettings, updateUserSettings } from '@/app/lib/userData';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const settings = getUserSettings(session.userId);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to retrieve settings.' }, { status: 500 });
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

    const allowedVisibility = ['public', 'network', 'private'];
    const allowedThemes = ['dark', 'light', 'system'];

    if (body.profileVisibility !== undefined && !allowedVisibility.includes(body.profileVisibility)) {
      return NextResponse.json({ error: 'Invalid profile visibility value.' }, { status: 400 });
    }

    if (body.themePreference !== undefined && !allowedThemes.includes(body.themePreference)) {
      return NextResponse.json({ error: 'Invalid theme preference value.' }, { status: 400 });
    }

    const updated = updateUserSettings(user.id, {
      ...(typeof body.emailNotifications === 'boolean' ? { emailNotifications: body.emailNotifications } : {}),
      ...(typeof body.marketingEmails === 'boolean' ? { marketingEmails: body.marketingEmails } : {}),
      ...(typeof body.securityAlerts === 'boolean' ? { securityAlerts: body.securityAlerts } : {}),
      ...(body.profileVisibility ? { profileVisibility: body.profileVisibility } : {}),
      ...(typeof body.twoFactorEnabled === 'boolean' ? { twoFactorEnabled: body.twoFactorEnabled } : {}),
      ...(body.themePreference ? { themePreference: body.themePreference } : {}),
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully.',
      settings: updated,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}

export { PATCH as PUT };
