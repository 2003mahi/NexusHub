import fs from 'fs';
import path from 'path';
import { logUserActivity, addNotification } from './userData';
import { getLiveExternalJobs, LIVE_PARTNER_JOBS } from './jobService';

// ─── Types ──────────────────────────────────────────────────────────────────
export type CareerCategory = 'job' | 'internship' | 'fellowship' | 'contract';
export type EmploymentType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'fellowship';
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead';
export type ApplicationStatus = 'submitted' | 'under_review' | 'interviewing' | 'shortlisted' | 'accepted' | 'declined';

export interface CareerOpportunity {
  id: string;
  title: string;
  organization: string;
  department: string;
  category: CareerCategory;
  role: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  location: string;
  isRemote: boolean;
  salaryRange: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  targetRoles: ('student' | 'founder' | 'professional' | 'admin')[];
  postedBy: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: number;
  deadline: string;
  status: 'active' | 'closed';
  featured?: boolean;
  applicantCount: number;
  isExternal?: boolean;
  applyUrl?: string;
  source?: 'nexus' | 'jsearch' | 'remotive' | 'external' | string;
}

export interface JobApplication {
  id: string;
  careerId: string;
  careerTitle: string;
  organization: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantRole: string;
  applicantPhone?: string;
  coverLetter: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  yearsOfExperience: string;
  skills: string[];
  status: ApplicationStatus;
  appliedAt: number;
  reviewerNotes?: string;
}

export interface SavedCareer {
  id: string;
  userId: string;
  careerId: string;
  savedAt: number;
}

export interface CareersSearchResponse {
  items: CareerOpportunity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── Data Storage ───────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), '.data');
const CAREERS_FILE = path.join(DATA_DIR, 'careers.json');

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:4000';

interface CareersDataStore {
  careers: CareerOpportunity[];
  applications: JobApplication[];
  savedCareers: SavedCareer[];
}

export const INITIAL_CAREERS: CareerOpportunity[] = [
  {
    id: 'career-nexus-ai-intern',
    title: 'Autonomous Systems & Agentic AI Research Intern',
    organization: 'Nexus AI Research Labs',
    department: 'Applied Machine Learning',
    category: 'internship',
    role: 'AI / Machine Learning',
    employmentType: 'internship',
    experienceLevel: 'entry',
    location: 'San Francisco, CA / Remote',
    isRemote: true,
    salaryRange: '$48 - $65 / hr ($7,800/mo)',
    skills: ['Python', 'PyTorch', 'LLMs', 'Multi-Agent Systems', 'Vector DBs'],
    description: 'Join the pioneering team building next-generation agent coordination protocols, memory models, and autonomous code execution safety boundaries.',
    responsibilities: [
      'Implement and evaluate benchmark evaluations on distributed multi-agent workflows',
      'Optimize LLM context utilization, tool-calling pipelines, and embedding indexing',
      'Collaborate with staff scientists to co-author open-source research and whitepapers',
      'Deploy experimental agents to isolated sandboxed environments for safety validation'
    ],
    requirements: [
      'Pursuing or completed degree in CS, AI, Math, or equivalent self-taught engineering mastery',
      'Strong proficiency with Python and modern deep learning frameworks (PyTorch, JAX, or HuggingFace)',
      'Familiarity with transformer architectures, prompting strategies, and API tool calling',
      'Passion for autonomous systems, reliability testing, and open collaborative code'
    ],
    benefits: [
      'Comprehensive mentor matching with Principal Scientists',
      'Co-authorship on published research papers & open source tooling',
      'Flexible remote schedule with high-spec GPU compute cluster access',
      'Full-time return offer pathway with competitive venture equity pool'
    ],
    targetRoles: ['student', 'professional'],
    postedBy: {
      userId: 'system-founder',
      name: 'Dr. Elena Vance',
      email: 'recruiting@nexuslabs.ai',
      role: 'founder'
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    deadline: '2026-12-30',
    status: 'active',
    featured: true,
    applicantCount: 12
  },
  {
    id: 'career-senior-fullstack',
    title: 'Senior Full-Stack Engineer (Next.js & Distributed Systems)',
    organization: 'CloudScale Technologies',
    department: 'Core Platform Engineering',
    category: 'job',
    role: 'Software Engineering',
    employmentType: 'full-time',
    experienceLevel: 'senior',
    location: 'New York, NY / Hybrid',
    isRemote: true,
    salaryRange: '$155,000 - $190,000 / yr + Equity',
    skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    description: 'Lead architecture on customer-facing real-time collaboration dashboards, scalable API gateways, and microservices supporting tens of thousands of active teams.',
    responsibilities: [
      'Architect resilient Next.js App Router applications with server actions and streaming SSR',
      'Design RESTful and event-driven APIs with robust RBAC and cryptographic session security',
      'Conduct rigorous architectural code reviews and mentor junior & mid-level developers',
      'Optimize web performance, Core Web Vitals, and database query throughput'
    ],
    requirements: [
      '5+ years professional software engineering experience with modern TypeScript ecosystems',
      'Deep mastery of React 19 / Next.js, Node.js runtime internals, and relational schemas',
      'Demonstrated experience building responsive, accessible, high-traffic web applications',
      'Commitment to automated testing, clean architectural patterns, and type safety'
    ],
    benefits: [
      'Generous 0.25% - 0.75% equity grant with 4-year vesting schedule',
      'Comprehensive tier-1 health, dental, vision, and mental wellness coverage',
      '$3,500 annual home office setup and continuous learning conference budget',
      'Unlimited paid time off (minimum 4 weeks encouraged)'
    ],
    targetRoles: ['professional', 'founder'],
    postedBy: {
      userId: 'system-recruiter',
      name: 'Marcus Brody',
      email: 'talent@cloudscale.io',
      role: 'professional'
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    deadline: '2026-12-15',
    status: 'active',
    featured: true,
    applicantCount: 28
  },
  {
    id: 'career-product-designer',
    title: 'Lead Product & Design Systems Architect',
    organization: 'FinTech Nexus Studio',
    department: 'Product & UX',
    category: 'job',
    role: 'Product & Design',
    employmentType: 'full-time',
    experienceLevel: 'lead',
    location: 'Remote Worldwide',
    isRemote: true,
    salaryRange: '$140,000 - $175,000 / yr',
    skills: ['Figma', 'Design Systems', 'UI/UX', 'TailwindCSS', 'Micro-Interactions', 'Accessibility'],
    description: 'Spearhead our multi-brand design tokens, interactive component systems, and intuitive financial dashboard experiences across desktop and mobile.',
    responsibilities: [
      'Build and maintain universal design systems in Figma and synced Tailwind CSS token engines',
      'Create high-fidelity interactive prototypes, subtle 3D micro-animations, and user journey maps',
      'Run qualitative user research interviews, usability testing, and metric-backed redesigns',
      'Partner directly with frontend engineers to ensure pixel-perfect accessibility WCAG AAA compliance'
    ],
    requirements: [
      '4+ years product design experience crafting enterprise or complex consumer platforms',
      'Exceptional portfolio displaying design system craft, elegant typography, and UX flow',
      'Working knowledge of HTML, CSS/Tailwind, and how design components map into React',
      'Strong communication skills for presenting design decisions to leadership and community'
    ],
    benefits: [
      'Top-of-market base salary and performance bonus',
      'Remote-first asynchronous culture across US and European time zones',
      'State-of-the-art M3 Max MacBook Pro + 4K Studio Display gear stipend',
      'Annual global team retreats in Portugal and Japan'
    ],
    targetRoles: ['professional', 'founder'],
    postedBy: {
      userId: 'system-founder',
      name: 'Sofia Reyes',
      email: 'sofia@nexusstudio.design',
      role: 'founder'
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
    deadline: '2026-12-20',
    status: 'active',
    featured: false,
    applicantCount: 19
  },
  {
    id: 'career-devops-cloud-fellow',
    title: 'Cloud Infrastructure & SRE Engineering Fellow',
    organization: 'Global Infrastructure Alliance',
    department: 'Cloud Operations',
    category: 'fellowship',
    role: 'Cloud & DevOps',
    employmentType: 'contract',
    experienceLevel: 'mid',
    location: 'Berlin, Germany / Remote',
    isRemote: true,
    salaryRange: '€6,500 / mo + Certification Stipends',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Prometheus'],
    description: 'A 9-month paid fellowship working on automated multi-region deployment pipelines, zero-trust network policies, and observability meshes.',
    responsibilities: [
      'Maintain Kubernetes clusters and Terraform infrastructure as code configurations',
      'Implement automated GitHub Actions CI/CD canary deployments and test matrices',
      'Configure Prometheus, Grafana, and OpenTelemetry instrumentation dashboards',
      'Participate in simulated incident response drills and document chaos engineering postmortems'
    ],
    requirements: [
      'Practical hands-on knowledge with containerization, Linux systems, and cloud providers (AWS/GCP)',
      'Experience scripting with Bash, Python, or Go for operational automation',
      'Understanding of networking fundamentals: DNS, TLS certificates, load balancers, and VPCs',
      'Desire to become an elite SRE / DevOps leader'
    ],
    benefits: [
      'Paid sponsored CKA & AWS Solutions Architect certification exams',
      'Dedicated mentorship with AWS & CNCF ambassadors',
      'Flexible 30-hour work week allowing academic or startup exploration',
      'Direct pathway into permanent European Union tech placement'
    ],
    targetRoles: ['student', 'professional'],
    postedBy: {
      userId: 'system-recruiter',
      name: 'Hans Becker',
      email: 'recruiting@infra-alliance.eu',
      role: 'professional'
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
    deadline: '2026-12-10',
    status: 'active',
    featured: false,
    applicantCount: 15
  },
  {
    id: 'career-frontend-intern',
    title: 'Frontend React / Next.js Engineering Intern',
    organization: 'Nexus Ecosystem Ventures',
    department: 'Developer Experience',
    category: 'internship',
    role: 'Software Engineering',
    employmentType: 'internship',
    experienceLevel: 'entry',
    location: 'Remote',
    isRemote: true,
    salaryRange: '$35 - $45 / hr ($5,500/mo)',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Git'],
    description: 'Work with the product engineering group to create snappy, responsive user interfaces, developer portals, and interactive showcase widgets.',
    responsibilities: [
      'Build reusable React components adhering to our tokenized design system',
      'Implement client-side state handling, responsive mobile drawers, and fluid animations',
      'Write end-to-end user journey tests and fix browser cross-compatibility quirks',
      'Participate in daily engineering standups and sprint planning retrospectives'
    ],
    requirements: [
      'Strong grasp of JavaScript ES6+, TypeScript basics, HTML5 semantic elements, and modern CSS',
      'Hands-on experience creating at least two personal or collegiate React/Next.js projects',
      'Attention to detail in UI aesthetics, clean code formatting, and component modularity',
      'Proactive communicator eager to learn and receive constructive code feedback'
    ],
    benefits: [
      'High-impact production commits reaching thousands of weekly active users',
      'Weekly 1-on-1 career coaching and technical resume feedback sessions',
      'Intern alumni networking ring with former Google, Stripe, and Meta engineers',
      'Full equipment bundle provided during internship duration'
    ],
    targetRoles: ['student'],
    postedBy: {
      userId: 'system-founder',
      name: 'Alice Walker',
      email: 'alice@testnexus.io',
      role: 'founder'
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    deadline: '2027-01-15',
    status: 'active',
    featured: true,
    applicantCount: 34
  },
  {
    id: 'career-security-auditor',
    title: 'Application Security & Cryptography Engineer',
    organization: 'Nexus Trust & Safety Labs',
    department: 'Security & Compliance',
    category: 'job',
    role: 'Security',
    employmentType: 'full-time',
    experienceLevel: 'senior',
    location: 'Austin, TX / Remote',
    isRemote: true,
    salaryRange: '$165,000 - $205,000 / yr',
    skills: ['OAuth2', 'JWT', 'Zero-Trust', 'Penetration Testing', 'Node.js', 'Python'],
    description: 'Protect user identity vaults, cryptographic key management, and enforce strict isolation in multi-tenant API services across the Nexus ecosystem.',
    responsibilities: [
      'Conduct threat modeling, static/dynamic code audits, and penetration tests across microservices',
      'Harden authentication flows, password salting, JWT rotation, and RBAC permission checks',
      'Design automated vulnerability scanning inside pull requests and third-party dependency monitors',
      'Formulate incident containment policies and maintain SOC2 compliance readiness'
    ],
    requirements: [
      '4+ years in application security, penetration testing, or secure software engineering',
      'Deep understanding of web vulnerabilities (OWASP Top 10, SSRF, IDOR, XSS, CSRF)',
      'Proficiency auditing TypeScript/Node.js, Go, or Python web codebases',
      'Familiarity with public key cryptography, bcrypt/argon2 hashing, and JOSE/JWT standards'
    ],
    benefits: [
      'Top-tier competitive salary + meaningful equity package',
      'Annual $5,000 bug bounty & offensive security research budget',
      'Full health, 401(k) matching up to 5%, and commuter / remote stipends',
      'Paid speaking sponsorships at DEF CON, Black Hat, or OWASP conferences'
    ],
    targetRoles: ['professional', 'admin'],
    postedBy: {
      userId: 'system-recruiter',
      name: 'David Vance',
      email: 'security@nexustrust.org',
      role: 'admin'
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 144,
    deadline: '2027-01-31',
    status: 'active',
    featured: false,
    applicantCount: 8
  }
];

let localStore: CareersDataStore = {
  careers: [],
  applications: [],
  savedCareers: []
};

function loadLocalStore(): CareersDataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(CAREERS_FILE)) {
      const data = fs.readFileSync(CAREERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      localStore = {
        careers: Array.isArray(parsed.careers) && parsed.careers.length > 0 ? parsed.careers : INITIAL_CAREERS,
        applications: Array.isArray(parsed.applications) ? parsed.applications : [],
        savedCareers: Array.isArray(parsed.savedCareers) ? parsed.savedCareers : []
      };
    } else {
      localStore = {
        careers: INITIAL_CAREERS,
        applications: [],
        savedCareers: []
      };
      saveLocalStore();
    }
  } catch (err) {
    console.error('Error loading local careers file:', err);
    localStore = {
      careers: INITIAL_CAREERS,
      applications: [],
      savedCareers: []
    };
  }
  return localStore;
}

function saveLocalStore(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CAREERS_FILE, JSON.stringify(localStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local careers file:', err);
  }
}

// ─── Search and Filters ─────────────────────────────────────────────────────
export interface SearchFilterParams {
  q?: string;
  role?: string;
  skills?: string[];
  location?: string;
  experience?: string;
  employmentType?: string;
  category?: string;
  remoteOnly?: boolean;
  source?: 'all' | 'nexus' | 'external';
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'deadline' | 'applicants';
}

export async function fetchCareers(params: SearchFilterParams): Promise<CareersSearchResponse> {
  // Load local persistent store (Internal Nexus Roles)
  loadLocalStore();
  const internalRoles = [...localStore.careers].filter((c) => c.status === 'active').map((c) => ({
    ...c,
    isExternal: false,
    source: c.source || 'nexus'
  }));

  // Fetch live external partner opportunities (JSearch / Free Job API with verified fallback)
  let externalRoles: CareerOpportunity[] = [];
  if (params.source !== 'nexus') {
    try {
      externalRoles = await getLiveExternalJobs(params);
    } catch {
      externalRoles = LIVE_PARTNER_JOBS;
    }
  }

  // Combine datasets based on source selection
  let combined: CareerOpportunity[] = [];
  if (params.source === 'nexus') {
    combined = internalRoles;
  } else if (params.source === 'external') {
    combined = externalRoles;
  } else {
    // Interleave internal and live external partner roles for rich variety
    combined = [...externalRoles, ...internalRoles];
  }

  let results = combined;

  if (params.q && params.q.trim()) {
    const term = params.q.trim().toLowerCase();
    results = results.filter((c) =>
      c.title.toLowerCase().includes(term) ||
      c.organization.toLowerCase().includes(term) ||
      c.department.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term) ||
      c.skills.some((s) => s.toLowerCase().includes(term))
    );
  }

  if (params.role && params.role !== 'all') {
    const roleTerm = params.role.toLowerCase();
    results = results.filter((c) => c.role.toLowerCase().includes(roleTerm));
  }

  if (params.employmentType && params.employmentType !== 'all') {
    results = results.filter((c) => c.employmentType === params.employmentType);
  }

  if (params.experience && params.experience !== 'all') {
    results = results.filter((c) => c.experienceLevel === params.experience);
  }

  if (params.category && params.category !== 'all') {
    results = results.filter((c) => c.category === params.category);
  }

  if (params.location && params.location !== 'all') {
    const locTerm = params.location.toLowerCase();
    results = results.filter((c) => c.location.toLowerCase().includes(locTerm));
  }

  if (params.remoteOnly) {
    results = results.filter((c) => c.isRemote === true);
  }

  if (params.skills && params.skills.length > 0) {
    const requiredSkills = params.skills.map((s) => s.toLowerCase());
    results = results.filter((c) =>
      requiredSkills.some((reqSkill) =>
        c.skills.some((s) => s.toLowerCase().includes(reqSkill))
      )
    );
  }

  if (params.sortBy === 'deadline') {
    results.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } else if (params.sortBy === 'applicants') {
    results.sort((a, b) => b.applicantCount - a.applicantCount);
  } else {
    results.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.createdAt - a.createdAt;
    });
  }

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 9));
  const total = results.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedItems = results.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export async function fetchCareerDetail(id: string): Promise<CareerOpportunity | null> {
  // Check local store
  loadLocalStore();
  const local = localStore.careers.find((c) => c.id === id);
  if (local) {
    return { ...local, isExternal: false, source: local.source || 'nexus' };
  }

  // Check live partner fallback catalog
  const partner = LIVE_PARTNER_JOBS.find((c) => c.id === id);
  if (partner) {
    return partner;
  }

  // Try querying backend Express service if active
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${BACKEND_BASE_URL}/api/careers/${id}`, {
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return data.career || null;
    }
  } catch {
    // fallback
  }

  return null;
}

export async function submitCareerApplication(
  user: { id: string; fullName: string; email: string; role: string; phone?: string },
  careerId: string,
  details: {
    coverLetter: string;
    portfolioUrl?: string;
    resumeUrl?: string;
    yearsOfExperience?: string;
    skills?: string[];
  }
): Promise<{ success: boolean; application?: JobApplication; error?: string }> {
  // Validate input
  if (!details.coverLetter || details.coverLetter.trim().length < 20) {
    return { success: false, error: 'Please provide a cover letter or introductory statement (min 20 characters).' };
  }

  // Try submitting to backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${BACKEND_BASE_URL}/api/careers/${careerId}/apply`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id,
        'x-user-name': user.fullName,
        'x-user-email': user.email,
        'x-user-role': user.role
      },
      body: JSON.stringify(details)
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      // Sync activity & notifications in user profile
      logUserActivity(
        user.id,
        'application',
        `Applied for ${json.application?.careerTitle || 'Career Opportunity'}`,
        `Submitted application to ${json.application?.organization || 'the employer'}.`
      );
      addNotification(
        user.id,
        'Career Application Submitted',
        `Your application for "${json.application?.careerTitle}" has been received by ${json.application?.organization}.`,
        'success',
        '/careers/applications'
      );
      return { success: true, application: json.application };
    } else {
      const errJson = await res.json();
      return { success: false, error: errJson.error || 'Failed to submit application.' };
    }
  } catch {
    // fallback to local store
  }

  loadLocalStore();
  const career = localStore.careers.find((c) => c.id === careerId);
  if (!career) return { success: false, error: 'Opportunity not found.' };

  if (career.status === 'closed') {
    return { success: false, error: 'This opportunity is closed.' };
  }

  const alreadyApplied = localStore.applications.some(
    (a) => a.careerId === careerId && a.applicantId === user.id
  );
  if (alreadyApplied) {
    return { success: false, error: 'You have already submitted an application for this position.' };
  }

  const newApp: JobApplication = {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    careerId,
    careerTitle: career.title,
    organization: career.organization,
    applicantId: user.id,
    applicantName: user.fullName,
    applicantEmail: user.email,
    applicantRole: user.role,
    applicantPhone: user.phone,
    coverLetter: details.coverLetter.trim(),
    portfolioUrl: details.portfolioUrl?.trim(),
    resumeUrl: details.resumeUrl?.trim(),
    yearsOfExperience: details.yearsOfExperience || '1-2 years',
    skills: Array.isArray(details.skills) ? details.skills : [],
    status: 'submitted',
    appliedAt: Date.now()
  };

  localStore.applications.unshift(newApp);
  career.applicantCount = (career.applicantCount || 0) + 1;
  saveLocalStore();

  logUserActivity(
    user.id,
    'application',
    `Applied for ${career.title}`,
    `Submitted application to ${career.organization}.`
  );
  addNotification(
    user.id,
    'Career Application Submitted',
    `Your application for "${career.title}" has been received by ${career.organization}.`,
    'success',
    '/careers/applications'
  );

  return { success: true, application: newApp };
}

export function getUserApplications(userId: string): JobApplication[] {
  loadLocalStore();
  return localStore.applications.filter((a) => a.applicantId === userId);
}

export function toggleSave(userId: string, careerId: string): { success: boolean; saved: boolean } {
  loadLocalStore();
  const career = localStore.careers.find((c) => c.id === careerId);
  if (!career) return { success: false, saved: false };

  const idx = localStore.savedCareers.findIndex((s) => s.userId === userId && s.careerId === careerId);
  if (idx !== -1) {
    localStore.savedCareers.splice(idx, 1);
    saveLocalStore();
    logUserActivity(userId, 'opportunity', 'Removed Saved Career', `Unsaved "${career.title}".`);
    return { success: true, saved: false };
  } else {
    localStore.savedCareers.unshift({
      id: `saved-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      careerId,
      savedAt: Date.now()
    });
    saveLocalStore();
    logUserActivity(userId, 'opportunity', 'Saved Career Opportunity', `Bookmarked "${career.title}" to your career list.`);
    addNotification(userId, 'Opportunity Saved', `"${career.title}" has been saved.`, 'info', '/careers');
    return { success: true, saved: true };
  }
}

export function getSavedIds(userId: string): string[] {
  loadLocalStore();
  return localStore.savedCareers.filter((s) => s.userId === userId).map((s) => s.careerId);
}

export function getSavedCareers(userId: string): CareerOpportunity[] {
  loadLocalStore();
  const savedIds = new Set(getSavedIds(userId));
  return localStore.careers.filter((c) => savedIds.has(c.id));
}

export function postNewCareer(
  creator: { id: string; fullName: string; email: string; role: string },
  data: Partial<CareerOpportunity>
): { success: boolean; career?: CareerOpportunity; error?: string } {
  if (!['founder', 'professional', 'admin'].includes(creator.role)) {
    return {
      success: false,
      error: 'Permission denied. Recruiter privileges (Founder, Professional, or Admin role) are required to publish listings.'
    };
  }

  if (!data.title || data.title.trim().length < 5) {
    return { success: false, error: 'Title must be at least 5 characters long.' };
  }
  if (!data.organization || data.organization.trim().length < 2) {
    return { success: false, error: 'Organization name is required.' };
  }
  if (!data.description || data.description.trim().length < 30) {
    return { success: false, error: 'Description must be at least 30 characters long.' };
  }
  if (!data.deadline || isNaN(Date.parse(data.deadline))) {
    return { success: false, error: 'Valid future application deadline is required.' };
  }
  if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
    return { success: false, error: 'Please specify at least one required skill.' };
  }

  loadLocalStore();
  const newCareer: CareerOpportunity = {
    id: `career-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: data.title.trim(),
    organization: data.organization.trim(),
    department: data.department?.trim() || 'General Engineering',
    category: data.category || 'job',
    role: data.role || 'Software Engineering',
    employmentType: data.employmentType || 'full-time',
    experienceLevel: data.experienceLevel || 'entry',
    location: data.location?.trim() || 'Remote',
    isRemote: Boolean(data.isRemote),
    salaryRange: data.salaryRange?.trim() || 'Competitive Salary',
    skills: data.skills.map((s) => s.trim()).filter(Boolean),
    description: data.description.trim(),
    responsibilities: Array.isArray(data.responsibilities) && data.responsibilities.length > 0
      ? data.responsibilities.map((r) => r.trim()).filter(Boolean)
      : ['Contribute actively to system architecture and development milestones', 'Collaborate directly with cross-functional stakeholders'],
    requirements: Array.isArray(data.requirements) && data.requirements.length > 0
      ? data.requirements.map((r) => r.trim()).filter(Boolean)
      : ['Demonstrated proficiency in required technologies', 'Passion for quality and clear documentation'],
    benefits: Array.isArray(data.benefits) && data.benefits.length > 0
      ? data.benefits.map((b) => b.trim()).filter(Boolean)
      : ['Flexible working hours and remote flexibility', 'Mentorship and leadership opportunities'],
    targetRoles: Array.isArray(data.targetRoles) && data.targetRoles.length > 0
      ? data.targetRoles
      : ['student', 'professional'],
    postedBy: {
      userId: creator.id,
      name: creator.fullName,
      email: creator.email,
      role: creator.role
    },
    createdAt: Date.now(),
    deadline: data.deadline,
    status: 'active',
    featured: Boolean(data.featured),
    applicantCount: 0
  };

  localStore.careers.unshift(newCareer);
  saveLocalStore();

  logUserActivity(
    creator.id,
    'opportunity',
    `Published Opportunity: ${newCareer.title}`,
    `Live listing on NexusHub Careers for ${newCareer.organization}.`
  );
  addNotification(
    creator.id,
    'Opportunity Published',
    `Your listing for "${newCareer.title}" is now active and accepting applicant submissions.`,
    'success',
    `/careers/${newCareer.id}`
  );

  return { success: true, career: newCareer };
}

export function getRecruiterPostings(userId: string, role: string): CareerOpportunity[] {
  loadLocalStore();
  if (role === 'admin') {
    return localStore.careers;
  }
  return localStore.careers.filter((c) => c.postedBy.userId === userId);
}

export function getApplicantsForCareer(
  recruiterId: string,
  recruiterRole: string,
  careerId: string
): { success: boolean; applicants?: JobApplication[]; error?: string } {
  loadLocalStore();
  const career = localStore.careers.find((c) => c.id === careerId);
  if (!career) return { success: false, error: 'Opportunity not found.' };

  if (career.postedBy.userId !== recruiterId && recruiterRole !== 'admin') {
    return { success: false, error: 'Forbidden: You do not have permission to view applicants for this role.' };
  }

  const applicants = localStore.applications.filter((a) => a.careerId === careerId);
  return { success: true, applicants };
}

export function updateCandidateStatus(
  recruiterId: string,
  recruiterRole: string,
  applicationId: string,
  status: ApplicationStatus,
  notes?: string
): { success: boolean; error?: string } {
  loadLocalStore();
  const app = localStore.applications.find((a) => a.id === applicationId);
  if (!app) return { success: false, error: 'Application not found.' };

  const career = localStore.careers.find((c) => c.id === app.careerId);
  if (!career) return { success: false, error: 'Opportunity not found.' };

  if (career.postedBy.userId !== recruiterId && recruiterRole !== 'admin') {
    return { success: false, error: 'Forbidden: You cannot modify applicant status for this role.' };
  }

  app.status = status;
  if (notes !== undefined) {
    app.reviewerNotes = notes;
  }
  saveLocalStore();

  // Notify applicant of status update
  addNotification(
    app.applicantId,
    `Application Status Update: ${app.careerTitle}`,
    `Your application status for "${app.careerTitle}" at ${app.organization} has been updated to "${status.replace('_', ' ').toUpperCase()}".`,
    status === 'accepted' ? 'success' : status === 'declined' ? 'warning' : 'info',
    '/careers/applications'
  );

  return { success: true };
}
