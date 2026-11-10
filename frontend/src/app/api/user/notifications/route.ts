import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession, getUserById } from '@/app/lib/auth';
import {
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
} from '@/app/lib/userData';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const notifs = getUserNotifications(session.userId);
    return NextResponse.json({ notifications: notifs });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to retrieve notifications.' }, { status: 500 });
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

    const body = await req.json().catch(() => ({}));
    const { id } = body;

    markNotificationRead(user.id, id);
    const updated = getUserNotifications(user.id);

    return NextResponse.json({
      success: true,
      notifications: updated,
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Failed to update notifications.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Notification ID is required.' }, { status: 400 });
    }

    deleteNotification(user.id, id);
    const updated = getUserNotifications(user.id);

    return NextResponse.json({
      success: true,
      notifications: updated,
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification.' }, { status: 500 });
  }
}
