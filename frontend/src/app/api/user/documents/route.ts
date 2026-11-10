import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession, getUserById } from '@/app/lib/auth';
import {
  getUserDocuments,
  addUserDocument,
  deleteUserDocument,
  calculateProfileCompletion,
  getUserProfile,
} from '@/app/lib/userData';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const ALLOWED_CATEGORIES = ['resume', 'id_verification', 'portfolio', 'certificate', 'pitch_deck'] as const;

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const docs = getUserDocuments(session.userId);
    return NextResponse.json({ documents: docs });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to retrieve documents.' }, { status: 500 });
  }
}

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
    const { name, fileType, size, category, fileData } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Document name is required.' }, { status: 400 });
    }

    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    if (typeof size !== 'number' || size <= 0) {
      return NextResponse.json({ error: 'Invalid file size.' }, { status: 400 });
    }

    if (size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit. Please compress your document.' },
        { status: 400 }
      );
    }

    if (fileType && !ALLOWED_MIME_TYPES.includes(fileType.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unsupported file type. Allowed formats: PDF, PNG, JPG, WebP, DOCX, TXT.' },
        { status: 400 }
      );
    }

    const newDoc = addUserDocument(user.id, {
      name: name.slice(0, 100),
      fileType: fileType || 'application/octet-stream',
      size,
      category,
      fileData: typeof fileData === 'string' ? fileData.slice(0, 7000000) : undefined,
    });

    const profile = getUserProfile(user.id);
    const allDocs = getUserDocuments(user.id);
    const completion = calculateProfileCompletion(user, profile, allDocs.length);

    return NextResponse.json({
      success: true,
      message: 'Document uploaded securely.',
      document: newDoc,
      completion,
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json({ error: 'Failed to upload document.' }, { status: 500 });
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
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const docId = searchParams.get('id');

    if (!docId) {
      return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
    }

    const deleted = deleteUserDocument(user.id, docId);
    if (!deleted) {
      return NextResponse.json({ error: 'Document not found or access denied.' }, { status: 404 });
    }

    const profile = getUserProfile(user.id);
    const allDocs = getUserDocuments(user.id);
    const completion = calculateProfileCompletion(user, profile, allDocs.length);

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully.',
      completion,
    });
  } catch (error) {
    console.error('Document deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete document.' }, { status: 500 });
  }
}
