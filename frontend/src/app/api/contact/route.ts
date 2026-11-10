import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  message: string;
  createdAt: number;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'contact.json');

function saveSubmissionLocally(submission: ContactSubmission) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let store = { submissions: [] as ContactSubmission[] };
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      store.submissions = Array.isArray(parsed.submissions) ? parsed.submissions : [];
    }
    store.submissions.unshift(submission);
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving contact submission locally:', err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, category, subject, message, organization, hp } = body;

    // Honeypot spam protection
    if (hp && typeof hp === 'string' && hp.trim().length > 0) {
      return NextResponse.json({ success: true, message: 'Your message has been received.' });
    }

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Name is required (minimum 2 characters).' }, { status: 400 });
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'Subject is required.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 20) {
      return NextResponse.json({ success: false, error: 'Message must be at least 20 characters.' }, { status: 400 });
    }

    const categoryMap: Record<string, string> = {
      'general': 'general',
      'partnership': 'partnership',
      'startup': 'startup',
      'recruitment': 'recruitment',
      'institution': 'institution',
      'general enquiry': 'general',
      'general inquiry': 'general',
      'partnership & collaboration': 'partnership',
      'event collaboration': 'partnership',
      'startup support': 'startup',
      'startup enquiry': 'startup',
      'hiring': 'recruitment',
      'internship': 'recruitment',
      'recruitment & talent': 'recruitment',
      'institutional & university': 'institution',
      'feedback': 'general',
      'media & press': 'general',
      'technical support': 'general',
    };

    const targetKey = String(category || subject || '').toLowerCase();
    const normalizedCategory = categoryMap[targetKey] || 'general';

    const submissionPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? String(phone).trim() : undefined,
      organization: organization ? String(organization).trim() : undefined,
      category: normalizedCategory,
      subject: subject.trim(),
      message: message.trim(),
      hp: hp || ''
    };

    // Forward to backend if available
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        return NextResponse.json(backendData);
      }
    } catch {
      // Backend unavailable; fallback to local persistence
    }

    const localSubmission: ContactSubmission = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...submissionPayload,
      createdAt: Date.now()
    };
    saveSubmissionLocally(localSubmission);

    return NextResponse.json({ success: true, message: 'Your message has been received successfully.' });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json({ success: false, error: 'Failed to process inquiry.' }, { status: 500 });
  }
}
