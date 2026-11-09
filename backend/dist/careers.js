"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_CAREERS = void 0;
exports.searchCareers = searchCareers;
exports.getCareerById = getCareerById;
exports.createCareerOpportunity = createCareerOpportunity;
exports.updateCareerOpportunity = updateCareerOpportunity;
exports.deleteCareerOpportunity = deleteCareerOpportunity;
exports.applyToCareer = applyToCareer;
exports.getUserCareerApplications = getUserCareerApplications;
exports.getCareerApplicants = getCareerApplicants;
exports.updateApplicationStatus = updateApplicationStatus;
exports.toggleSaveCareer = toggleSaveCareer;
exports.getUserSavedCareerIds = getUserSavedCareerIds;
exports.getUserSavedCareers = getUserSavedCareers;
exports.getRecruiterPostings = getRecruiterPostings;
exports.createCareersRouter = createCareersRouter;
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// ─── Persistence Layer ──────────────────────────────────────────────────────
// Check frontend/.data and root .data to ensure sharing across modules
const FRONTEND_DATA_DIR = path_1.default.resolve(__dirname, '../../frontend/.data');
const LOCAL_DATA_DIR = path_1.default.resolve(__dirname, '../.data');
const DATA_DIR = fs_1.default.existsSync(path_1.default.resolve(__dirname, '../../frontend'))
    ? FRONTEND_DATA_DIR
    : LOCAL_DATA_DIR;
const CAREERS_FILE = path_1.default.join(DATA_DIR, 'careers.json');
// Initial curated real-world tech opportunities
exports.INITIAL_CAREERS = [
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
let store = {
    careers: [],
    applications: [],
    savedCareers: []
};
function loadStore() {
    try {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (fs_1.default.existsSync(CAREERS_FILE)) {
            const data = fs_1.default.readFileSync(CAREERS_FILE, 'utf-8');
            const parsed = JSON.parse(data);
            store = {
                careers: Array.isArray(parsed.careers) && parsed.careers.length > 0 ? parsed.careers : exports.INITIAL_CAREERS,
                applications: Array.isArray(parsed.applications) ? parsed.applications : [],
                savedCareers: Array.isArray(parsed.savedCareers) ? parsed.savedCareers : []
            };
        }
        else {
            store = {
                careers: exports.INITIAL_CAREERS,
                applications: [],
                savedCareers: []
            };
            saveStore();
        }
    }
    catch (err) {
        console.error('Error loading careers store:', err);
        store = {
            careers: exports.INITIAL_CAREERS,
            applications: [],
            savedCareers: []
        };
    }
}
function saveStore() {
    try {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs_1.default.writeFileSync(CAREERS_FILE, JSON.stringify(store, null, 2), 'utf-8');
    }
    catch (err) {
        console.error('Error saving careers store:', err);
    }
}
// Initial load
loadStore();
function searchCareers(params) {
    loadStore();
    let results = [...store.careers].filter((c) => c.status === 'active');
    // Text search (Title, organization, description, skills, department)
    if (params.q && params.q.trim()) {
        const term = params.q.trim().toLowerCase();
        results = results.filter((c) => c.title.toLowerCase().includes(term) ||
            c.organization.toLowerCase().includes(term) ||
            c.department.toLowerCase().includes(term) ||
            c.description.toLowerCase().includes(term) ||
            c.skills.some((s) => s.toLowerCase().includes(term)));
    }
    // Filter: Role / Domain
    if (params.role && params.role !== 'all') {
        const roleTerm = params.role.toLowerCase();
        results = results.filter((c) => c.role.toLowerCase().includes(roleTerm));
    }
    // Filter: Employment Type
    if (params.employmentType && params.employmentType !== 'all') {
        results = results.filter((c) => c.employmentType === params.employmentType);
    }
    // Filter: Experience Level
    if (params.experience && params.experience !== 'all') {
        results = results.filter((c) => c.experienceLevel === params.experience);
    }
    // Filter: Category
    if (params.category && params.category !== 'all') {
        results = results.filter((c) => c.category === params.category);
    }
    // Filter: Location
    if (params.location && params.location !== 'all') {
        const locTerm = params.location.toLowerCase();
        results = results.filter((c) => c.location.toLowerCase().includes(locTerm));
    }
    // Filter: Remote
    if (params.remoteOnly) {
        results = results.filter((c) => c.isRemote === true);
    }
    // Filter: Skills (multi-match)
    if (params.skills && params.skills.length > 0) {
        const requiredSkills = params.skills.map((s) => s.toLowerCase());
        results = results.filter((c) => requiredSkills.some((reqSkill) => c.skills.some((s) => s.toLowerCase().includes(reqSkill))));
    }
    // Sorting
    if (params.sortBy === 'deadline') {
        results.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }
    else if (params.sortBy === 'applicants') {
        results.sort((a, b) => b.applicantCount - a.applicantCount);
    }
    else {
        // default: newest first, with featured boosted
        results.sort((a, b) => {
            if (a.featured && !b.featured)
                return -1;
            if (!a.featured && b.featured)
                return 1;
            return b.createdAt - a.createdAt;
        });
    }
    // Pagination
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
function getCareerById(id) {
    loadStore();
    return store.careers.find((c) => c.id === id) || null;
}
function createCareerOpportunity(creator, data) {
    // Enforce role-based permission: only recruiter roles (founder, professional, admin)
    if (!['founder', 'professional', 'admin'].includes(creator.role)) {
        return {
            success: false,
            error: 'Permission denied. Only Founders, Professionals, and Administrators can post opportunities.'
        };
    }
    // Server-side validation
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
        return { success: false, error: 'Valid future deadline is required.' };
    }
    if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
        return { success: false, error: 'Please provide at least one required skill.' };
    }
    loadStore();
    const newCareer = {
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
        salaryRange: data.salaryRange?.trim() || 'Competitive / Dependent on Experience',
        skills: data.skills.map((s) => s.trim()).filter(Boolean),
        description: data.description.trim(),
        responsibilities: Array.isArray(data.responsibilities) && data.responsibilities.length > 0
            ? data.responsibilities.map((r) => r.trim()).filter(Boolean)
            : ['Contribute to product architecture and development milestones', 'Collaborate actively with teammates and mentors'],
        requirements: Array.isArray(data.requirements) && data.requirements.length > 0
            ? data.requirements.map((r) => r.trim()).filter(Boolean)
            : ['Demonstrated proficiency in required technologies', 'Strong communication and problem solving'],
        benefits: Array.isArray(data.benefits) && data.benefits.length > 0
            ? data.benefits.map((b) => b.trim()).filter(Boolean)
            : ['Flexible working hours', 'Mentorship and career advancement support'],
        targetRoles: Array.isArray(data.targetRoles) && data.targetRoles.length > 0
            ? data.targetRoles
            : ['student', 'professional'],
        postedBy: creator,
        createdAt: Date.now(),
        deadline: data.deadline,
        status: 'active',
        featured: Boolean(data.featured),
        applicantCount: 0
    };
    store.careers.unshift(newCareer);
    saveStore();
    return { success: true, career: newCareer };
}
function updateCareerOpportunity(userId, userRole, careerId, updates) {
    loadStore();
    const career = store.careers.find((c) => c.id === careerId);
    if (!career)
        return { success: false, error: 'Opportunity not found.' };
    // Only the creator or an admin can edit
    if (career.postedBy.userId !== userId && userRole !== 'admin') {
        return { success: false, error: 'Permission denied. You can only modify your own postings.' };
    }
    // Prevent modifying immutable fields
    delete updates.id;
    delete updates.postedBy;
    delete updates.createdAt;
    delete updates.applicantCount;
    Object.assign(career, updates);
    saveStore();
    return { success: true, career };
}
function deleteCareerOpportunity(userId, userRole, careerId) {
    loadStore();
    const index = store.careers.findIndex((c) => c.id === careerId);
    if (index === -1)
        return { success: false, error: 'Opportunity not found.' };
    const career = store.careers[index];
    if (career.postedBy.userId !== userId && userRole !== 'admin') {
        return { success: false, error: 'Permission denied. You can only delete your own postings.' };
    }
    store.careers.splice(index, 1);
    saveStore();
    return { success: true };
}
// ─── Applications Management & Privacy Protection ───────────────────────────
function applyToCareer(applicant, careerId, data) {
    loadStore();
    const career = store.careers.find((c) => c.id === careerId);
    if (!career)
        return { success: false, error: 'Opportunity not found.' };
    if (career.status === 'closed') {
        return { success: false, error: 'This opportunity is no longer accepting applications.' };
    }
    // Prevent duplicate application submission
    const alreadyApplied = store.applications.some((a) => a.careerId === careerId && a.applicantId === applicant.userId);
    if (alreadyApplied) {
        return { success: false, error: 'You have already submitted an application for this position.' };
    }
    // Validation
    if (!data.coverLetter || data.coverLetter.trim().length < 20) {
        return { success: false, error: 'Please provide a cover letter or introductory statement (min 20 characters).' };
    }
    const newApplication = {
        id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        careerId,
        careerTitle: career.title,
        organization: career.organization,
        applicantId: applicant.userId,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
        applicantRole: applicant.role,
        applicantPhone: applicant.phone,
        coverLetter: data.coverLetter.trim(),
        portfolioUrl: data.portfolioUrl?.trim(),
        resumeUrl: data.resumeUrl?.trim(),
        yearsOfExperience: data.yearsOfExperience || '1-2 years',
        skills: Array.isArray(data.skills) ? data.skills : [],
        status: 'submitted',
        appliedAt: Date.now()
    };
    store.applications.unshift(newApplication);
    career.applicantCount = (career.applicantCount || 0) + 1;
    saveStore();
    return { success: true, application: newApplication };
}
function getUserCareerApplications(userId) {
    loadStore();
    // Applicants can ONLY see their own applications!
    return store.applications.filter((a) => a.applicantId === userId);
}
function getCareerApplicants(recruiterId, recruiterRole, careerId) {
    loadStore();
    const career = store.careers.find((c) => c.id === careerId);
    if (!career)
        return { success: false, error: 'Opportunity not found.' };
    // Strict privacy authorization: only the recruiter who posted it or an admin can view applicants
    if (career.postedBy.userId !== recruiterId && recruiterRole !== 'admin') {
        return { success: false, error: 'Forbidden: You do not have permission to view applicants for this role.' };
    }
    const applicants = store.applications.filter((a) => a.careerId === careerId);
    return { success: true, applicants };
}
function updateApplicationStatus(recruiterId, recruiterRole, applicationId, newStatus, reviewerNotes) {
    loadStore();
    const app = store.applications.find((a) => a.id === applicationId);
    if (!app)
        return { success: false, error: 'Application not found.' };
    const career = store.careers.find((c) => c.id === app.careerId);
    if (!career)
        return { success: false, error: 'Opportunity not found.' };
    if (career.postedBy.userId !== recruiterId && recruiterRole !== 'admin') {
        return { success: false, error: 'Forbidden: You cannot modify applicant status for this role.' };
    }
    app.status = newStatus;
    if (reviewerNotes !== undefined) {
        app.reviewerNotes = reviewerNotes;
    }
    saveStore();
    return { success: true };
}
// ─── Saved Careers ──────────────────────────────────────────────────────────
function toggleSaveCareer(userId, careerId) {
    loadStore();
    const career = store.careers.find((c) => c.id === careerId);
    if (!career)
        return { success: false, saved: false, error: 'Opportunity not found.' };
    const existingIndex = store.savedCareers.findIndex((s) => s.userId === userId && s.careerId === careerId);
    if (existingIndex !== -1) {
        store.savedCareers.splice(existingIndex, 1);
        saveStore();
        return { success: true, saved: false };
    }
    else {
        store.savedCareers.unshift({
            id: `saved-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            userId,
            careerId,
            savedAt: Date.now()
        });
        saveStore();
        return { success: true, saved: true };
    }
}
function getUserSavedCareerIds(userId) {
    loadStore();
    return store.savedCareers
        .filter((s) => s.userId === userId)
        .map((s) => s.careerId);
}
function getUserSavedCareers(userId) {
    loadStore();
    const savedIds = new Set(getUserSavedCareerIds(userId));
    return store.careers.filter((c) => savedIds.has(c.id));
}
// ─── Recruiter Posted Jobs ──────────────────────────────────────────────────
function getRecruiterPostings(userId, role) {
    loadStore();
    if (role === 'admin') {
        return store.careers;
    }
    return store.careers.filter((c) => c.postedBy.userId === userId);
}
// ─── Express Router ─────────────────────────────────────────────────────────
function createCareersRouter() {
    const router = (0, express_1.Router)();
    // Helper to extract authenticated user from headers (set by proxy/token)
    const getUserFromReq = (req) => {
        const userId = req.headers['x-user-id'] || '';
        const userRole = req.headers['x-user-role'] || 'student';
        const userName = req.headers['x-user-name'] || 'Nexus Member';
        const userEmail = req.headers['x-user-email'] || '';
        return { userId, role: userRole, name: userName, email: userEmail };
    };
    // GET /api/careers - Search, filter, pagination
    router.get('/', (req, res) => {
        try {
            const { q, role, skills, location, experience, employmentType, category, remoteOnly, page, limit, sortBy } = req.query;
            const skillsArray = skills
                ? Array.isArray(skills)
                    ? skills
                    : skills.split(',').map((s) => s.trim())
                : undefined;
            const results = searchCareers({
                q: q,
                role: role,
                skills: skillsArray,
                location: location,
                experience: experience,
                employmentType: employmentType,
                category: category,
                remoteOnly: remoteOnly === 'true' || remoteOnly === '1',
                page: page ? parseInt(page, 10) : 1,
                limit: limit ? parseInt(limit, 10) : 9,
                sortBy: sortBy
            });
            return res.status(200).json(results);
        }
        catch (err) {
            console.error('Error fetching careers:', err);
            return res.status(500).json({ error: 'Failed to retrieve opportunities.' });
        }
    });
    // GET /api/careers/:id - Single opportunity details
    router.get('/:id', (req, res) => {
        try {
            const career = getCareerById(req.params.id);
            if (!career) {
                return res.status(404).json({ error: 'Career opportunity not found.' });
            }
            return res.status(200).json({ career });
        }
        catch (err) {
            console.error('Error fetching career detail:', err);
            return res.status(500).json({ error: 'Failed to retrieve opportunity details.' });
        }
    });
    // POST /api/careers - Create opportunity (Recruiter/Employer role required)
    router.post('/', (req, res) => {
        try {
            const user = getUserFromReq(req);
            if (!user.userId) {
                return res.status(401).json({ error: 'Authentication required to post opportunities.' });
            }
            const result = createCareerOpportunity(user, req.body);
            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }
            return res.status(201).json({ success: true, career: result.career });
        }
        catch (err) {
            console.error('Error creating career posting:', err);
            return res.status(500).json({ error: 'Failed to create career opportunity.' });
        }
    });
    // PATCH /api/careers/:id - Update opportunity
    router.patch('/:id', (req, res) => {
        try {
            const user = getUserFromReq(req);
            if (!user.userId) {
                return res.status(401).json({ error: 'Authentication required.' });
            }
            const result = updateCareerOpportunity(user.userId, user.role, req.params.id, req.body);
            if (!result.success) {
                return res.status(result.error?.includes('Permission') ? 403 : 400).json({ error: result.error });
            }
            return res.status(200).json({ success: true, career: result.career });
        }
        catch (err) {
            console.error('Error updating career posting:', err);
            return res.status(500).json({ error: 'Failed to update opportunity.' });
        }
    });
    // DELETE /api/careers/:id - Remove opportunity
    router.delete('/:id', (req, res) => {
        try {
            const user = getUserFromReq(req);
            if (!user.userId) {
                return res.status(401).json({ error: 'Authentication required.' });
            }
            const result = deleteCareerOpportunity(user.userId, user.role, req.params.id);
            if (!result.success) {
                return res.status(result.error?.includes('Permission') ? 403 : 400).json({ error: result.error });
            }
            return res.status(200).json({ success: true, message: 'Opportunity deleted successfully.' });
        }
        catch (err) {
            console.error('Error deleting career:', err);
            return res.status(500).json({ error: 'Failed to delete opportunity.' });
        }
    });
    // POST /api/careers/:id/apply - Apply with duplicate prevention
    router.post('/:id/apply', (req, res) => {
        try {
            const user = getUserFromReq(req);
            if (!user.userId) {
                return res.status(401).json({ error: 'Authentication required to apply.' });
            }
            const result = applyToCareer(user, req.params.id, req.body);
            if (!result.success) {
                const statusCode = result.error?.includes('already submitted') ? 409 : 400;
                return res.status(statusCode).json({ error: result.error });
            }
            return res.status(201).json({ success: true, application: result.application });
        }
        catch (err) {
            console.error('Error applying to career:', err);
            return res.status(500).json({ error: 'Failed to submit application.' });
        }
    });
    // GET /api/careers/:id/applicants - View applicants (Recruiter/Admin protected)
    router.get('/:id/applicants', (req, res) => {
        try {
            const user = getUserFromReq(req);
            if (!user.userId) {
                return res.status(401).json({ error: 'Authentication required.' });
            }
            const result = getCareerApplicants(user.userId, user.role, req.params.id);
            if (!result.success) {
                return res.status(result.error?.includes('Forbidden') ? 403 : 400).json({ error: result.error });
            }
            return res.status(200).json({ applicants: result.applicants });
        }
        catch (err) {
            console.error('Error fetching applicants:', err);
            return res.status(500).json({ error: 'Failed to fetch applicants.' });
        }
    });
    // PATCH /api/careers/applications/:applicationId - Update candidate status
    router.patch('/applications/:applicationId', (req, res) => {
        try {
            const user = getUserFromReq(req);
            if (!user.userId) {
                return res.status(401).json({ error: 'Authentication required.' });
            }
            const { status, notes } = req.body;
            const result = updateApplicationStatus(user.userId, user.role, req.params.applicationId, status, notes);
            if (!result.success) {
                return res.status(result.error?.includes('Forbidden') ? 403 : 400).json({ error: result.error });
            }
            return res.status(200).json({ success: true, message: 'Application status updated.' });
        }
        catch (err) {
            console.error('Error updating application status:', err);
            return res.status(500).json({ error: 'Failed to update candidate status.' });
        }
    });
    // POST /api/careers/:id/save - Toggle save/bookmark
    router.post('/:id/save', (req, res) => {
        try {
            const user = getUserFromReq(req);
            if (!user.userId) {
                return res.status(401).json({ error: 'Authentication required to save opportunities.' });
            }
            const result = toggleSaveCareer(user.userId, req.params.id);
            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }
            return res.status(200).json({ success: true, saved: result.saved });
        }
        catch (err) {
            console.error('Error saving career:', err);
            return res.status(500).json({ error: 'Failed to toggle save opportunity.' });
        }
    });
    return router;
}
