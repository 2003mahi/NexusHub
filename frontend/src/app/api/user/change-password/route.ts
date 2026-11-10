import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession, getUserById, verifyPassword, hashPassword, validatePassword, updateUserPasswordById } from '@/app/lib/auth';
import { logUserActivity, addNotification } from '@/app/lib/userData';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new passwords are required.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New password confirmation does not match.' }, { status: 400 });
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    const valResult = validatePassword(newPassword);
    if (!valResult.valid) {
      return NextResponse.json({ error: valResult.message || 'Password does not meet security requirements.' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    const updated = updateUserPasswordById(user.id, newHash);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
    }

    logUserActivity(user.id, 'security', 'Password Changed', 'Account credentials were updated.');
    addNotification(
      user.id,
      'Security Alert: Password Updated',
      'Your account password was successfully updated. If you did not make this change, contact support immediately.',
      'security'
    );

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error while changing password.' }, { status: 500 });
  }
}
