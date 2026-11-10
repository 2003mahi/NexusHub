import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/app/lib/auth';

/**
 * POST /api/verification/lookup
 * Accepts a JSON body { query: string } where query is a username or email.
 * Returns a simple verification status without exposing any private data.
 * This is a placeholder implementation – replace with real database lookup.
 */
export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    }
    // Basic sanitisation – allow only alphanumeric, @, ., _, -
    const safeQuery = query.trim().toLowerCase();
    if (!/^[a-z0-9@._-]+$/i.test(safeQuery)) {
      return NextResponse.json({ error: 'Invalid characters in query' }, { status: 400 });
    }

    // Check persistent database as well as fallback mocks
    const mockVerifiedUsers = new Set(['alice', 'bob@example.com']);
    const existingUser = getUserByEmail(safeQuery);
    const isVerified = (existingUser && existingUser.emailVerified) || mockVerifiedUsers.has(safeQuery);
    const status = isVerified ? 'Verified' : 'Not verified';
    // Never disclose existence of an account beyond status.
    return NextResponse.json({ status });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
