import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession } from '@/app/lib/auth';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      id: session.userId,
      email: session.email,
      role: session.role,
      fullName: session.fullName,
    },
  });
}
