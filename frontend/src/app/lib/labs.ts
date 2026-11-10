import fs from 'fs';
import path from 'path';

// ─── Types ──────────────────────────────────────────────────────────────────
export type ChallengeCategory = 'ai-ml' | 'web-dev' | 'mobile' | 'data-science' | 'cybersecurity' | 'blockchain' | 'iot' | 'cloud' | 'sustainability' | 'healthcare' | 'education' | 'fintech' | 'open-innovation';
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ChallengeStatus = 'open' | 'in-progress' | 'review' | 'completed' | 'archived';
export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'feedback_provided' | 'revision_requested' | 'accepted' | 'rejected';
export type FeedbackType = 'mentor' | 'peer' | 'system';

export interface Challenge {
  id: string;
  title: string;
  organization: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  description: string;
  problemStatement: string;
  objectives: string[];
  deliverables: string[];
  skills: string[];
  tags: string[];
  prizes: string[];
  timeline: string;
  deadline: string;
  maxTeamSize: number;
  minTeamSize: number;
  isPublic: boolean;
  featured: boolean;
  participantCount: number;
  submissionCount: number;
  createdBy: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  mentors: Mentor[];
  createdAt: number;
  updatedAt: number;
}

export interface Mentor {
  id: string;
  userId: string;
  name: string;
  email: string;
  expertise: string[];
  bio: string;
  assignedChallengeIds: string[];
  availableSlots: number;
}

export interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  teamName: string;
  teamMembers: TeamMember[];
  leaderId: string;
  leaderName: string;
  leaderEmail: string;
  title: string;
  summary: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  presentationUrl?: string;
  technologies: string[];
  status: SubmissionStatus;
  isPublic: boolean;
  feedback: FeedbackEntry[];
  submittedAt: number;
  updatedAt: number;
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: number;
}

export interface FeedbackEntry {
  id: string;
  fromUserId: string;
  fromName: string;
  type: FeedbackType;
  rating?: number;
  comment: string;
  createdAt: number;
}

export interface Participant {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  challengeId: string;
  skills: string[];
  lookingForTeam: boolean;
  joinedAt: number;
}

// ─── Data Store ─────────────────────────────────────────────────────────────
interface LabsDataStore {
  challenges: Challenge[];
  submissions: Submission[];
  participants: Participant[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const LABS_FILE = path.join(DATA_DIR, 'labs.json');

// ─── Initial Seed Data ──────────────────────────────────────────────────────
const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'lab-ai-climate',
    title: 'AI-Powered Climate Impact Predictor',
    organization: 'Nexus Environmental Research Lab',
    category: 'ai-ml',
    difficulty: 'advanced',
    status: 'open',
    description: 'Design and build a machine learning system that predicts the localized environmental impact of industrial activity using satellite imagery, sensor data, and publicly available emissions datasets.',
    problemStatement: 'Current climate models operate at macro scales and cannot provide actionable, localized predictions for communities and city planners. We need AI systems that can synthesize satellite, IoT sensor, and emissions data to deliver neighborhood-level impact forecasts in near real-time.',
    objectives: [
      'Build a multi-modal data ingestion pipeline for satellite imagery and sensor feeds',
      'Train a model to predict AQI, temperature anomalies, and flood risk at zip-code granularity',
      'Create an interactive map dashboard displaying predictions with confidence intervals',
      'Publish a reproducible methodology with open-source code and model weights'
    ],
    deliverables: [
      'Trained ML model with documented architecture and evaluation metrics',
      'Interactive web dashboard with geospatial visualizations',
      'API endpoint for third-party integration',
      'Technical whitepaper describing methodology and limitations'
    ],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'GIS', 'Remote Sensing', 'FastAPI', 'React'],
    tags: ['climate', 'AI', 'sustainability', 'geospatial', 'deep-learning'],
    prizes: ['$5,000 Grand Prize', 'Cloud compute credits ($2,000)', 'Mentorship from Google Earth team', 'Publication opportunity in Environmental AI Journal'],
    timeline: '12 weeks from launch',
    deadline: '2027-02-28',
    maxTeamSize: 5,
    minTeamSize: 2,
    isPublic: true,
    featured: true,
    participantCount: 24,
    submissionCount: 3,
    createdBy: {
      userId: 'system-founder',
      name: 'Dr. Elena Vance',
      email: 'elena@nexuslabs.ai',
      role: 'founder'
    },
    mentors: [
      {
        id: 'mentor-climate-1',
        userId: 'mentor-user-1',
        name: 'Dr. Priya Sharma',
        email: 'priya@nexuslabs.ai',
        expertise: ['Climate Science', 'Remote Sensing', 'Deep Learning'],
        bio: 'Senior research scientist at NOAA with 12 years of experience in atmospheric modeling and satellite data analysis.',
        assignedChallengeIds: ['lab-ai-climate'],
        availableSlots: 3
      }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'lab-fintech-inclusion',
    title: 'Financial Inclusion Platform for Underbanked Communities',
    organization: 'FinTech Nexus Studio',
    category: 'fintech',
    difficulty: 'intermediate',
    status: 'open',
    description: 'Build a mobile-first platform that provides accessible financial literacy tools, micro-savings instruments, and peer-to-peer lending capabilities for underbanked populations in emerging economies.',
    problemStatement: 'Over 1.7 billion adults globally lack access to basic financial services. Traditional banking infrastructure is too costly to extend to rural and low-income areas. We need innovative digital solutions that can operate on low-bandwidth networks with minimal smartphone capabilities.',
    objectives: [
      'Design a Progressive Web App that works offline and on 2G networks',
      'Implement gamified financial literacy modules in multiple languages',
      'Create a peer-to-peer micro-lending system with trust scoring',
      'Build savings goal tracking with SMS-based notifications'
    ],
    deliverables: [
      'Functional PWA with offline-first architecture',
      'Financial literacy curriculum with interactive modules',
      'Trust-scoring algorithm documentation',
      'User research findings from target demographic interviews'
    ],
    skills: ['React', 'Next.js', 'PWA', 'Node.js', 'PostgreSQL', 'Figma', 'UX Research'],
    tags: ['fintech', 'social-impact', 'mobile', 'accessibility', 'financial-literacy'],
    prizes: ['$3,500 Grand Prize', 'Pilot program funding ($10,000)', 'Mentorship from Stripe engineers', 'Feature in NexusHub Showcase'],
    timeline: '10 weeks from launch',
    deadline: '2027-02-15',
    maxTeamSize: 4,
    minTeamSize: 2,
    isPublic: true,
    featured: true,
    participantCount: 18,
    submissionCount: 1,
    createdBy: {
      userId: 'system-founder',
      name: 'Sofia Reyes',
      email: 'sofia@nexusstudio.design',
      role: 'founder'
    },
    mentors: [
      {
        id: 'mentor-fintech-1',
        userId: 'mentor-user-2',
        name: 'James Okoro',
        email: 'james@fintechnexus.io',
        expertise: ['Mobile Payments', 'UX Design', 'Microfinance'],
        bio: 'Former product lead at M-Pesa with deep experience in mobile money systems across sub-Saharan Africa.',
        assignedChallengeIds: ['lab-fintech-inclusion'],
        availableSlots: 4
      }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1
  },
  {
    id: 'lab-edu-adaptive',
    title: 'Adaptive Learning Engine for K-12 STEM Education',
    organization: 'Nexus Education Initiative',
    category: 'education',
    difficulty: 'intermediate',
    status: 'open',
    description: 'Create an adaptive learning platform that personalizes STEM curriculum for K-12 students based on their learning pace, style, and knowledge gaps identified through continuous assessment.',
    problemStatement: 'One-size-fits-all STEM curricula fail students who learn at different paces. Teachers in under-resourced schools lack tools to identify and address individual knowledge gaps. An adaptive engine could democratize personalized education at scale.',
    objectives: [
      'Build a knowledge graph of STEM concepts with prerequisite relationships',
      'Implement a spaced-repetition algorithm that adapts to individual mastery levels',
      'Create an engaging student-facing interface with gamification elements',
      'Design a teacher dashboard showing class-wide and individual progress analytics'
    ],
    deliverables: [
      'Working adaptive learning web application',
      'STEM knowledge graph with at least 200 concept nodes',
      'Teacher analytics dashboard',
      'Pedagogical methodology document with educational research backing'
    ],
    skills: ['React', 'TypeScript', 'Python', 'Graph Databases', 'D3.js', 'Gamification', 'EdTech'],
    tags: ['education', 'adaptive-learning', 'STEM', 'K-12', 'gamification', 'social-impact'],
    prizes: ['$4,000 Grand Prize', 'Pilot deployment in 3 partner schools', 'Educational technology conference sponsorship', 'NexusHub featured project spotlight'],
    timeline: '10 weeks from launch',
    deadline: '2027-02-01',
    maxTeamSize: 5,
    minTeamSize: 2,
    isPublic: true,
    featured: true,
    participantCount: 31,
    submissionCount: 2,
    createdBy: {
      userId: 'system-founder',
      name: 'Dr. Elena Vance',
      email: 'elena@nexuslabs.ai',
      role: 'founder'
    },
    mentors: [
      {
        id: 'mentor-edu-1',
        userId: 'mentor-user-4',
        name: 'Dr. Maria Santos',
        email: 'maria@nexusedu.org',
        expertise: ['Educational Psychology', 'Adaptive Learning', 'Curriculum Design'],
        bio: 'Former MIT Media Lab researcher focused on personalized learning technologies, now leading education innovation at NexusHub.',
        assignedChallengeIds: ['lab-edu-adaptive'],
        availableSlots: 5
      }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  },
  {
    id: 'lab-health-remote',
    title: 'Remote Patient Monitoring IoT Platform',
    organization: 'Nexus HealthTech Division',
    category: 'healthcare',
    difficulty: 'advanced',
    status: 'open',
    description: 'Design an end-to-end IoT platform for remote patient monitoring that collects vitals from wearable devices, detects anomalies using edge ML, and alerts healthcare providers in real-time.',
    problemStatement: 'Chronic disease patients require continuous monitoring, but frequent hospital visits are costly and impractical, especially in rural areas. Wearable devices can collect vital data, but current systems lack intelligent edge processing and reliable alert mechanisms for healthcare providers.',
    objectives: [
      'Design a device-agnostic data ingestion layer supporting BLE and WiFi wearable protocols',
      'Implement edge ML models for anomaly detection on vital signs (heart rate, SpO2, blood pressure)',
      'Build a provider-facing dashboard with patient risk stratification',
      'Create a patient mobile app for self-monitoring and medication reminders'
    ],
    deliverables: [
      'System architecture document with data flow diagrams',
      'Edge ML anomaly detection models with evaluation metrics',
      'Provider dashboard web application',
      'Patient-facing mobile application prototype',
      'HIPAA compliance assessment document'
    ],
    skills: ['IoT', 'Python', 'TensorFlow Lite', 'React Native', 'MQTT', 'AWS IoT', 'HL7 FHIR'],
    tags: ['healthcare', 'IoT', 'remote-monitoring', 'edge-computing', 'wearables'],
    prizes: ['$6,000 Grand Prize', 'AWS IoT credits ($3,000)', 'Partnership with regional hospital network', 'HealthTech accelerator acceptance'],
    timeline: '16 weeks from launch',
    deadline: '2027-03-30',
    maxTeamSize: 6,
    minTeamSize: 3,
    isPublic: true,
    featured: false,
    participantCount: 14,
    submissionCount: 0,
    createdBy: {
      userId: 'system-recruiter',
      name: 'Marcus Brody',
      email: 'marcus@nexushealthtech.io',
      role: 'professional'
    },
    mentors: [
      {
        id: 'mentor-health-1',
        userId: 'mentor-user-5',
        name: 'Dr. Robert Kim',
        email: 'robert@nexushealthtech.io',
        expertise: ['Biomedical Engineering', 'IoT', 'Edge Computing', 'HL7 FHIR'],
        bio: 'Biomedical engineer with 10 years at Philips Healthcare, expert in connected medical device systems and FDA regulatory pathways.',
        assignedChallengeIds: ['lab-health-remote'],
        availableSlots: 3
      }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1
  },
  {
    id: 'lab-web3-identity',
    title: 'Decentralized Identity Verification System',
    organization: 'Nexus Web3 Research Group',
    category: 'blockchain',
    difficulty: 'advanced',
    status: 'open',
    description: 'Build a self-sovereign identity (SSI) system using decentralized identifiers (DIDs) and verifiable credentials that allows users to control their own identity data without relying on centralized authorities.',
    problemStatement: 'Centralized identity systems create single points of failure, enable mass surveillance, and exclude billions who lack government-issued identification. Decentralized identity can empower individuals with portable, privacy-preserving credentials, but current implementations are fragmented and hard to use.',
    objectives: [
      'Implement a DID method compatible with W3C DID Core specification',
      'Build a verifiable credential issuance and verification flow',
      'Create a user-friendly identity wallet application',
      'Design interoperability bridges with existing OAuth2/OIDC systems'
    ],
    deliverables: [
      'DID method implementation with resolver',
      'Credential issuance and verification SDK',
      'Identity wallet web application',
      'Integration guide for OAuth2/OIDC migration',
      'Security audit report'
    ],
    skills: ['Solidity', 'Ethereum', 'DID', 'Verifiable Credentials', 'React', 'Node.js', 'Cryptography'],
    tags: ['blockchain', 'identity', 'privacy', 'Web3', 'decentralization', 'SSI'],
    prizes: ['$5,500 Grand Prize', 'Ethereum Foundation grant consideration', 'Web3 conference speaking slot', 'Nexus Incubator track admission'],
    timeline: '12 weeks from launch',
    deadline: '2027-03-01',
    maxTeamSize: 4,
    minTeamSize: 2,
    isPublic: true,
    featured: false,
    participantCount: 11,
    submissionCount: 1,
    createdBy: {
      userId: 'system-founder',
      name: 'Dr. Elena Vance',
      email: 'elena@nexuslabs.ai',
      role: 'founder'
    },
    mentors: [
      {
        id: 'mentor-web3-1',
        userId: 'mentor-user-6',
        name: 'Alex Rivera',
        email: 'alex@nexusweb3.io',
        expertise: ['Blockchain', 'Cryptography', 'SSI', 'Smart Contracts'],
        bio: 'Decentralized identity researcher and Ethereum core contributor, previously at ConsenSys and the W3C Credentials Community Group.',
        assignedChallengeIds: ['lab-web3-identity'],
        availableSlots: 3
      }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4
  }
];

let store: LabsDataStore = {
  challenges: [],
  submissions: [],
  participants: []
};

function loadStore(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(LABS_FILE)) {
      const data = fs.readFileSync(LABS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      store = {
        challenges: Array.isArray(parsed.challenges) && parsed.challenges.length > 0 ? parsed.challenges : INITIAL_CHALLENGES,
        submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
        participants: Array.isArray(parsed.participants) ? parsed.participants : []
      };
    } else {
      store = {
        challenges: INITIAL_CHALLENGES,
        submissions: [],
        participants: []
      };
      saveStore();
    }
  } catch (err) {
    console.error('Error loading labs store:', err);
    store = { challenges: INITIAL_CHALLENGES, submissions: [], participants: [] };
  }
}

function saveStore(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LABS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving labs store:', err);
  }
}

loadStore();

// ─── Search & Filter Engine ─────────────────────────────────────────────────
export interface LabsQueryParams {
  q?: string;
  category?: string;
  difficulty?: string;
  status?: string;
  skills?: string[];
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'deadline' | 'participants' | 'difficulty';
}

export function searchChallenges(params: LabsQueryParams) {
  loadStore();
  let results = [...store.challenges].filter((c) => c.isPublic);

  if (params.q && params.q.trim()) {
    const term = params.q.trim().toLowerCase();
    results = results.filter((c) =>
      c.title.toLowerCase().includes(term) ||
      c.organization.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term) ||
      c.problemStatement.toLowerCase().includes(term) ||
      c.skills.some((s) => s.toLowerCase().includes(term)) ||
      c.tags.some((t) => t.toLowerCase().includes(term))
    );
  }

  if (params.category && params.category !== 'all') {
    results = results.filter((c) => c.category === params.category);
  }

  if (params.difficulty && params.difficulty !== 'all') {
    results = results.filter((c) => c.difficulty === params.difficulty);
  }

  if (params.status && params.status !== 'all') {
    results = results.filter((c) => c.status === params.status);
  }

  if (params.skills && params.skills.length > 0) {
    const required = params.skills.map((s) => s.toLowerCase());
    results = results.filter((c) =>
      required.some((req) => c.skills.some((s) => s.toLowerCase().includes(req)))
    );
  }

  if (params.featured) {
    results = results.filter((c) => c.featured);
  }

  // Sorting
  const diffOrder: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
  if (params.sortBy === 'deadline') {
    results.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } else if (params.sortBy === 'participants') {
    results.sort((a, b) => b.participantCount - a.participantCount);
  } else if (params.sortBy === 'difficulty') {
    results.sort((a, b) => (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0));
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
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 }
  };
}

export function getChallengeById(id: string): Challenge | null {
  loadStore();
  const challenge = store.challenges.find((c) => c.id === id);
  if (!challenge) return null;
  if (!challenge.isPublic) return null; // protect unpublished
  return challenge;
}

export function getChallengeByIdInternal(id: string): Challenge | null {
  loadStore();
  return store.challenges.find((c) => c.id === id) || null;
}

// ─── Challenge CRUD ─────────────────────────────────────────────────────────
export function createChallenge(
  creator: { userId: string; name: string; email: string; role: string },
  data: Partial<Challenge>
): { success: boolean; challenge?: Challenge; error?: string } {
  if (!['founder', 'professional', 'admin'].includes(creator.role)) {
    return { success: false, error: 'Permission denied. Only Founders, Professionals, and Admins can create challenges.' };
  }
  if (!data.title || data.title.trim().length < 5) {
    return { success: false, error: 'Title must be at least 5 characters.' };
  }
  if (!data.description || data.description.trim().length < 30) {
    return { success: false, error: 'Description must be at least 30 characters.' };
  }
  if (!data.problemStatement || data.problemStatement.trim().length < 30) {
    return { success: false, error: 'Problem statement must be at least 30 characters.' };
  }
  if (!data.deadline || isNaN(Date.parse(data.deadline))) {
    return { success: false, error: 'Valid deadline is required.' };
  }
  if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
    return { success: false, error: 'At least one required skill must be specified.' };
  }

  loadStore();
  const newChallenge: Challenge = {
    id: `lab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: data.title.trim(),
    organization: data.organization?.trim() || 'NexusHub Labs',
    category: data.category || 'open-innovation',
    difficulty: data.difficulty || 'intermediate',
    status: 'open',
    description: data.description.trim(),
    problemStatement: data.problemStatement.trim(),
    objectives: Array.isArray(data.objectives) ? data.objectives.filter(Boolean) : ['Deliver a working prototype'],
    deliverables: Array.isArray(data.deliverables) ? data.deliverables.filter(Boolean) : ['Source code repository', 'Technical documentation'],
    skills: data.skills.map((s) => s.trim()).filter(Boolean),
    tags: Array.isArray(data.tags) ? data.tags.map((t) => t.trim()).filter(Boolean) : [],
    prizes: Array.isArray(data.prizes) ? data.prizes.filter(Boolean) : [],
    timeline: data.timeline?.trim() || '8 weeks',
    deadline: data.deadline,
    maxTeamSize: data.maxTeamSize || 5,
    minTeamSize: data.minTeamSize || 1,
    isPublic: data.isPublic !== false,
    featured: false,
    participantCount: 0,
    submissionCount: 0,
    createdBy: { userId: creator.userId, name: creator.name, email: creator.email, role: creator.role },
    mentors: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  store.challenges.unshift(newChallenge);
  saveStore();
  return { success: true, challenge: newChallenge };
}

export function updateChallenge(
  userId: string,
  userRole: string,
  challengeId: string,
  updates: Partial<Challenge>
): { success: boolean; challenge?: Challenge; error?: string } {
  loadStore();
  const challenge = store.challenges.find((c) => c.id === challengeId);
  if (!challenge) return { success: false, error: 'Challenge not found.' };
  if (challenge.createdBy.userId !== userId && userRole !== 'admin') {
    return { success: false, error: 'Permission denied. You can only modify your own challenges.' };
  }
  delete updates.id;
  delete updates.createdBy;
  delete updates.createdAt;
  delete updates.participantCount;
  delete updates.submissionCount;
  Object.assign(challenge, updates, { updatedAt: Date.now() });
  saveStore();
  return { success: true, challenge };
}

export function deleteChallenge(
  userId: string,
  userRole: string,
  challengeId: string
): { success: boolean; error?: string } {
  loadStore();
  const idx = store.challenges.findIndex((c) => c.id === challengeId);
  if (idx === -1) return { success: false, error: 'Challenge not found.' };
  const challenge = store.challenges[idx];
  if (challenge.createdBy.userId !== userId && userRole !== 'admin') {
    return { success: false, error: 'Permission denied.' };
  }
  store.challenges.splice(idx, 1);
  saveStore();
  return { success: true };
}

// ─── Participation ──────────────────────────────────────────────────────────
export function joinChallenge(
  user: { userId: string; name: string; email: string; role: string },
  challengeId: string,
  skills: string[] = [],
  lookingForTeam: boolean = false
): { success: boolean; participant?: Participant; error?: string } {
  loadStore();
  const challenge = store.challenges.find((c) => c.id === challengeId);
  if (!challenge) return { success: false, error: 'Challenge not found.' };
  if (challenge.status !== 'open') return { success: false, error: 'This challenge is not currently accepting participants.' };

  const alreadyJoined = store.participants.some(
    (p) => p.userId === user.userId && p.challengeId === challengeId
  );
  if (alreadyJoined) return { success: false, error: 'You have already joined this challenge.' };

  const participant: Participant = {
    id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: user.userId,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    challengeId,
    skills: skills.map((s) => s.trim()).filter(Boolean),
    lookingForTeam,
    joinedAt: Date.now()
  };

  store.participants.push(participant);
  challenge.participantCount = (challenge.participantCount || 0) + 1;
  saveStore();
  return { success: true, participant };
}

export function getChallengeParticipants(challengeId: string): Participant[] {
  loadStore();
  return store.participants.filter((p) => p.challengeId === challengeId);
}

export function getUserParticipations(userId: string): Participant[] {
  loadStore();
  return store.participants.filter((p) => p.userId === userId);
}

export function getTeamSeekers(challengeId: string): Participant[] {
  loadStore();
  return store.participants.filter((p) => p.challengeId === challengeId && p.lookingForTeam);
}

// ─── Submissions ────────────────────────────────────────────────────────────
export function createSubmission(
  leader: { userId: string; name: string; email: string },
  challengeId: string,
  data: {
    teamName: string;
    teamMembers?: TeamMember[];
    title: string;
    summary: string;
    description: string;
    repoUrl?: string;
    demoUrl?: string;
    presentationUrl?: string;
    technologies?: string[];
  }
): { success: boolean; submission?: Submission; error?: string } {
  loadStore();
  const challenge = store.challenges.find((c) => c.id === challengeId);
  if (!challenge) return { success: false, error: 'Challenge not found.' };
  if (challenge.status === 'archived' || challenge.status === 'completed') {
    return { success: false, error: 'This challenge is no longer accepting submissions.' };
  }

  // Prevent duplicate submission by same leader for same challenge
  const existingSub = store.submissions.find(
    (s) => s.challengeId === challengeId && s.leaderId === leader.userId
  );
  if (existingSub) {
    return { success: false, error: 'You already have a submission for this challenge. Please update your existing submission instead.' };
  }

  if (!data.title || data.title.trim().length < 3) {
    return { success: false, error: 'Submission title must be at least 3 characters.' };
  }
  if (!data.summary || data.summary.trim().length < 10) {
    return { success: false, error: 'Summary must be at least 10 characters.' };
  }
  if (!data.teamName || data.teamName.trim().length < 2) {
    return { success: false, error: 'Team name must be at least 2 characters.' };
  }

  // Validate URLs if provided
  if (data.repoUrl && data.repoUrl.trim() && !isValidUrl(data.repoUrl)) {
    return { success: false, error: 'Repository URL is not valid.' };
  }
  if (data.demoUrl && data.demoUrl.trim() && !isValidUrl(data.demoUrl)) {
    return { success: false, error: 'Demo URL is not valid.' };
  }

  const submission: Submission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    challengeId,
    challengeTitle: challenge.title,
    teamName: data.teamName.trim(),
    teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers : [
      { userId: leader.userId, name: leader.name, email: leader.email, role: 'Lead', joinedAt: Date.now() }
    ],
    leaderId: leader.userId,
    leaderName: leader.name,
    leaderEmail: leader.email,
    title: data.title.trim(),
    summary: data.summary.trim(),
    description: data.description?.trim() || '',
    repoUrl: data.repoUrl?.trim(),
    demoUrl: data.demoUrl?.trim(),
    presentationUrl: data.presentationUrl?.trim(),
    technologies: Array.isArray(data.technologies) ? data.technologies.filter(Boolean) : [],
    status: 'submitted',
    isPublic: false,
    feedback: [],
    submittedAt: Date.now(),
    updatedAt: Date.now()
  };

  store.submissions.unshift(submission);
  challenge.submissionCount = (challenge.submissionCount || 0) + 1;
  saveStore();
  return { success: true, submission };
}

export function updateSubmission(
  userId: string,
  submissionId: string,
  updates: Partial<Submission>
): { success: boolean; submission?: Submission; error?: string } {
  loadStore();
  const sub = store.submissions.find((s) => s.id === submissionId);
  if (!sub) return { success: false, error: 'Submission not found.' };
  if (sub.leaderId !== userId) {
    return { success: false, error: 'Permission denied. Only the team leader can update the submission.' };
  }
  if (sub.status === 'accepted' || sub.status === 'rejected') {
    return { success: false, error: 'This submission has been finalized and cannot be modified.' };
  }

  delete updates.id;
  delete updates.challengeId;
  delete updates.leaderId;
  delete updates.submittedAt;
  delete updates.feedback;
  Object.assign(sub, updates, { updatedAt: Date.now() });
  saveStore();
  return { success: true, submission: sub };
}

export function getUserSubmissions(userId: string): Submission[] {
  loadStore();
  return store.submissions.filter(
    (s) => s.leaderId === userId || s.teamMembers.some((m) => m.userId === userId)
  );
}

export function getChallengeSubmissions(
  userId: string,
  userRole: string,
  challengeId: string
): { success: boolean; submissions?: Submission[]; error?: string } {
  loadStore();
  const challenge = store.challenges.find((c) => c.id === challengeId);
  if (!challenge) return { success: false, error: 'Challenge not found.' };

  // Only challenge creator or admin can see all submissions
  if (challenge.createdBy.userId !== userId && userRole !== 'admin') {
    // Regular participants can only see their own submissions
    const own = store.submissions.filter(
      (s) => s.challengeId === challengeId &&
        (s.leaderId === userId || s.teamMembers.some((m) => m.userId === userId))
    );
    return { success: true, submissions: own };
  }

  const subs = store.submissions.filter((s) => s.challengeId === challengeId);
  return { success: true, submissions: subs };
}

export function getSubmissionById(id: string): Submission | null {
  loadStore();
  return store.submissions.find((s) => s.id === id) || null;
}

// ─── Feedback ───────────────────────────────────────────────────────────────
export function addFeedback(
  fromUser: { userId: string; name: string },
  submissionId: string,
  type: FeedbackType,
  comment: string,
  rating?: number
): { success: boolean; error?: string } {
  loadStore();
  const sub = store.submissions.find((s) => s.id === submissionId);
  if (!sub) return { success: false, error: 'Submission not found.' };

  if (!comment || comment.trim().length < 5) {
    return { success: false, error: 'Feedback comment must be at least 5 characters.' };
  }

  const entry: FeedbackEntry = {
    id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    fromUserId: fromUser.userId,
    fromName: fromUser.name,
    type,
    rating: rating ? Math.min(5, Math.max(1, rating)) : undefined,
    comment: comment.trim(),
    createdAt: Date.now()
  };

  sub.feedback.push(entry);
  if (type === 'mentor') {
    sub.status = 'feedback_provided';
  }
  sub.updatedAt = Date.now();
  saveStore();
  return { success: true };
}

export function updateSubmissionStatus(
  userId: string,
  userRole: string,
  submissionId: string,
  newStatus: SubmissionStatus
): { success: boolean; error?: string } {
  loadStore();
  const sub = store.submissions.find((s) => s.id === submissionId);
  if (!sub) return { success: false, error: 'Submission not found.' };

  const challenge = store.challenges.find((c) => c.id === sub.challengeId);
  if (!challenge) return { success: false, error: 'Challenge not found.' };

  // Only challenge owner or admin can change status
  if (challenge.createdBy.userId !== userId && userRole !== 'admin') {
    return { success: false, error: 'Permission denied.' };
  }

  sub.status = newStatus;
  sub.updatedAt = Date.now();
  saveStore();
  return { success: true };
}

// ─── Stats ──────────────────────────────────────────────────────────────────
export function getLabsStats() {
  loadStore();
  return {
    totalChallenges: store.challenges.filter((c) => c.isPublic).length,
    openChallenges: store.challenges.filter((c) => c.status === 'open' && c.isPublic).length,
    totalParticipants: store.participants.length,
    totalSubmissions: store.submissions.length,
    categories: [...new Set(store.challenges.map((c) => c.category))]
  };
}

// ─── Utility ────────────────────────────────────────────────────────────────
function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
