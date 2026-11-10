import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export interface VerificationApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  role: string;
  institution?: string;
  college?: string;
  degree?: string;
  currentYear?: string;
  department?: string;
  gradYear?: string;
  collegeEmail?: string;
  linkedin?: string;
  instagram?: string;
  resumeLink?: string;
  initiatives?: string[];
  profilePhoto?: string;
  declaration: boolean;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
  submittedAt: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'verifications.json');

function saveVerificationApplication(application: VerificationApplication) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let store = { applications: [] as VerificationApplication[] };
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      store.applications = Array.isArray(parsed.applications) ? parsed.applications : [];
    }
    store.applications.unshift(application);
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving verification application:', err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const applicationId = `NEX-${Math.floor(100000 + Math.random() * 900000)}`;

    const newApplication: VerificationApplication = {
      id: applicationId,
      fullName: body.fullName || '',
      phone: body.phone || '',
      email: body.email || '',
      city: body.city || '',
      state: body.state || '',
      role: body.role || 'Student',
      institution: body.institution || body.college || '',
      college: body.college || '',
      degree: body.degree || '',
      currentYear: body.currentYear || '',
      department: body.department || '',
      gradYear: body.gradYear || '',
      collegeEmail: body.collegeEmail || '',
      linkedin: body.linkedin || '',
      instagram: body.instagram || '',
      resumeLink: body.resumeLink || '',
      initiatives: Array.isArray(body.initiatives) ? body.initiatives : [],
      profilePhoto: body.profilePhoto || '',
      declaration: Boolean(body.declaration),
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
    };

    saveVerificationApplication(newApplication);

    return NextResponse.json({
      success: true,
      id: applicationId,
      message: 'Verification application submitted successfully.',
      application: newApplication,
    });
  } catch (error) {
    console.error('Error handling verification submission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process verification application.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ applications: [] });
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return NextResponse.json({ applications: parsed.applications || [] });
  } catch {
    return NextResponse.json({ applications: [] });
  }
}

