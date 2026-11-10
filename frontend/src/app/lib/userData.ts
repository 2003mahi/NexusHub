import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getUserById } from './auth';

export interface UserProfile {
  userId: string;
  headline: string;
  bio: string;
  location: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  skills: string[];
  avatarUrl: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  identityVerified: boolean;
  updatedAt: number;
}

export interface UserSettings {
  userId: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  profileVisibility: 'public' | 'network' | 'private';
  twoFactorEnabled: boolean;
  themePreference: 'dark' | 'light' | 'system';
  updatedAt: number;
}

export interface UserDocument {
  id: string;
  userId: string;
  name: string;
  fileType: string;
  size: number;
  category: 'resume' | 'id_verification' | 'portfolio' | 'certificate' | 'pitch_deck';
  fileData?: string; // base64 representation if applicable
  status: 'verified' | 'pending' | 'active';
  uploadedAt: number;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: 'grant' | 'internship' | 'accelerator' | 'mentorship' | 'project';
  location: string;
  deadline: string;
  description: string;
  tags: string[];
  targetRoles: ('student' | 'founder' | 'professional' | 'admin')[];
  reward?: string;
}

export interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  title: string;
  organization: string;
  category: string;
  location: string;
  deadline: string;
  description: string;
  tags: string[];
  savedAt: number;
}

export interface UserApplication {
  id: string;
  userId: string;
  opportunityId: string;
  opportunityTitle: string;
  organization: string;
  category: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'accepted' | 'declined';
  submittedAt: number;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'security';
  read: boolean;
  createdAt: number;
  link?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'profile' | 'document' | 'application' | 'opportunity' | 'security' | 'verification';
  title: string;
  description: string;
  timestamp: number;
}

// ─── Default Opportunities Catalog ──────────────────────────────────────────
export const CURATED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Nexus Innovation Fellowship 2026',
    organization: 'Nexus Global Foundation',
    category: 'grant',
    location: 'Remote / Hybrid',
    deadline: '2026-12-15',
    description: 'A 6-month equity-free grant program supporting student-led deep tech prototypes and open-source tooling.',
    tags: ['AI/ML', 'Open Source', 'Fellowship', 'Grant'],
    targetRoles: ['student', 'founder'],
    reward: '$15,000 Equity-free Grant',
  },
  {
    id: 'opp-2',
    title: 'Global Open Source Mentorship Track',
    organization: 'Linux & Cloud Tech Collective',
    category: 'mentorship',
    location: 'Worldwide Remote',
    deadline: '2026-11-30',
    description: 'Pair with elite engineering leads to contribute to production microservices and distributed consensus engines.',
    tags: ['Rust', 'Go', 'Distributed Systems', 'Mentorship'],
    targetRoles: ['student', 'professional'],
    reward: '1-on-1 Senior Executive Mentorship',
  },
  {
    id: 'opp-3',
    title: 'Nexus Seed Accelerator Cohort 4',
    organization: 'Nexus Ventures',
    category: 'accelerator',
    location: 'San Francisco & Virtual',
    deadline: '2026-12-01',
    description: 'Intensive 12-week venture builder with top seed angel investors, legal advisory, and cloud credits.',
    tags: ['Seed Round', 'Fundraising', 'B2B SaaS', 'Founder'],
    targetRoles: ['founder'],
    reward: '$120,000 Seed Allocation',
  },
  {
    id: 'opp-4',
    title: 'Senior Technical Advisory Circle',
    organization: 'Nexus Governance Council',
    category: 'mentorship',
    location: 'Flexible Hours',
    deadline: '2026-12-31',
    description: 'Review venture pitches, host bi-weekly architectural office hours, and evaluate student capstone cohorts.',
    tags: ['Advisory', 'Leadership', 'Architecture', 'Executive'],
    targetRoles: ['professional', 'admin'],
    reward: 'Council Honorarium & Equity Pool',
  },
  {
    id: 'opp-5',
    title: 'CleanTech & Climate Systems Grant',
    organization: 'GreenEarth Innovations',
    category: 'grant',
    location: 'Global Remote',
    deadline: '2026-11-25',
    description: 'Funding deployable carbon accounting algorithms, smart microgrid controllers, and environmental analytics.',
    tags: ['CleanTech', 'IoT', 'Sustainability'],
    targetRoles: ['student', 'founder', 'professional'],
    reward: '$25,000 Non-dilutive Grant',
  },
  {
    id: 'opp-6',
    title: 'Autonomous AI Agents Lab Internship',
    organization: 'Nexus Research Labs',
    category: 'internship',
    location: 'Boston / Remote',
    deadline: '2026-12-10',
    description: 'Work alongside senior scientists designing multi-agent communication protocols and reasoning benchmarks.',
    tags: ['GenAI', 'Multi-Agent', 'Python', 'LLMs'],
    targetRoles: ['student'],
    reward: 'Competitive Stipend + Co-authorship',
  },
  {
    id: 'opp-7',
    title: 'Enterprise Architecture Workshop Host',
    organization: 'Global Tech Summits',
    category: 'project',
    location: 'Virtual',
    deadline: '2026-12-20',
    description: 'Lead hands-on technical masterclasses for engineering directors and scaleup founders across Europe and US.',
    tags: ['Public Speaking', 'System Design', 'Workshops'],
    targetRoles: ['professional'],
    reward: 'Speaker Honorarium & Keynote Pass',
  },
  {
    id: 'opp-8',
    title: 'Platform Security & Compliance Audit Panel',
    organization: 'Nexus Trust & Safety',
    category: 'project',
    location: 'Remote',
    deadline: '2027-01-15',
    description: 'Help audit multi-tenant identity verification workflows, role-based boundary enforcement, and cryptographic standards.',
    tags: ['Cybersecurity', 'Zero-Trust', 'Compliance'],
    targetRoles: ['admin', 'professional'],
    reward: 'Governance Recognition & Bounty',
  },
];

// ─── Data Storage Structures ────────────────────────────────────────────────
interface StoreData {
  profiles: Record<string, UserProfile>;
  settings: Record<string, UserSettings>;
  documents: Record<string, UserDocument[]>;
  savedOpportunities: Record<string, SavedOpportunity[]>;
  applications: Record<string, UserApplication[]>;
  notifications: Record<string, Notification[]>;
  activities: Record<string, UserActivity[]>;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'user_data.json');

let store: StoreData = {
  profiles: {},
  settings: {},
  documents: {},
  savedOpportunities: {},
  applications: {},
  notifications: {},
  activities: {},
};

function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      store = {
        profiles: parsed.profiles || {},
        settings: parsed.settings || {},
        documents: parsed.documents || {},
        savedOpportunities: parsed.savedOpportunities || {},
        applications: parsed.applications || {},
        notifications: parsed.notifications || {},
        activities: parsed.activities || {},
      };
    }
  } catch (err) {
    console.error('Failed to load user_data store:', err);
  }
}

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save user_data store:', err);
  }
}

// Initial load
loadStore();

// ─── Initialization Helpers ─────────────────────────────────────────────────
export function initializeUserData(userId: string): {
  profile: UserProfile;
  settings: UserSettings;
} {
  const user = getUserById(userId);
  const now = Date.now();

  if (!store.profiles[userId]) {
    const defaultHeadline =
      user?.role === 'founder'
        ? 'Founder & Innovator'
        : user?.role === 'professional'
        ? 'Senior Industry Specialist'
        : user?.role === 'admin'
        ? 'NexusHub Governance Officer'
        : 'Student & Technology Explorer';

    store.profiles[userId] = {
      userId,
      headline: defaultHeadline,
      bio: '',
      location: '',
      phone: '',
      website: '',
      github: '',
      linkedin: '',
      skills: user?.role === 'student' ? ['JavaScript', 'React'] : ['Leadership', 'System Design'],
      avatarUrl: '',
      verificationStatus: user?.emailVerified ? 'verified' : 'unverified',
      identityVerified: false,
      updatedAt: now,
    };
  }

  if (!store.settings[userId]) {
    store.settings[userId] = {
      userId,
      emailNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
      profileVisibility: 'public',
      twoFactorEnabled: false,
      themePreference: 'system',
      updatedAt: now,
    };
  }

  if (!store.documents[userId]) {
    store.documents[userId] = [];
  }

  if (!store.savedOpportunities[userId]) {
    store.savedOpportunities[userId] = [];
  }

  if (!store.applications[userId]) {
    store.applications[userId] = [];
  }

  if (!store.notifications[userId] || store.notifications[userId].length === 0) {
    store.notifications[userId] = [
      {
        id: uuidv4(),
        userId,
        title: 'Welcome to NexusHub!',
        message: 'Your profile has been created. Complete your credentials to unlock full network opportunities.',
        type: 'info',
        read: false,
        createdAt: now,
        link: '/dashboard',
      },
    ];
  }

  if (!store.activities[userId] || store.activities[userId].length === 0) {
    store.activities[userId] = [
      {
        id: uuidv4(),
        userId,
        type: 'profile',
        title: 'Joined NexusHub Ecosystem',
        description: `Account initialized with ${user?.role || 'member'} access privileges.`,
        timestamp: user?.createdAt || now,
      },
    ];
  }

  saveStore();
  return {
    profile: store.profiles[userId],
    settings: store.settings[userId],
  };
}

// ─── Profile Management ─────────────────────────────────────────────────────
export function getUserProfile(userId: string): UserProfile {
  initializeUserData(userId);
  const user = getUserById(userId);
  const profile = store.profiles[userId];
  
  // Sync verification status if email is verified
  if (user?.emailVerified && profile.verificationStatus === 'unverified') {
    profile.verificationStatus = 'verified';
    saveStore();
  }
  return profile;
}

export function updateUserProfile(userId: string, data: Partial<UserProfile>): UserProfile {
  initializeUserData(userId);
  const current = store.profiles[userId];
  
  const updated: UserProfile = {
    ...current,
    ...data,
    userId, // prevent ID overwrite
    updatedAt: Date.now(),
  };

  store.profiles[userId] = updated;
  saveStore();

  logUserActivity(userId, 'profile', 'Updated Member Profile', 'Saved updated professional summary and contact links.');
  return updated;
}

// ─── Settings Management ────────────────────────────────────────────────────
export function getUserSettings(userId: string): UserSettings {
  initializeUserData(userId);
  return store.settings[userId];
}

export function updateUserSettings(userId: string, data: Partial<UserSettings>): UserSettings {
  initializeUserData(userId);
  const current = store.settings[userId];

  const updated: UserSettings = {
    ...current,
    ...data,
    userId,
    updatedAt: Date.now(),
  };

  store.settings[userId] = updated;
  saveStore();

  logUserActivity(userId, 'security', 'Updated Account Preferences', 'Modified notification preferences and privacy controls.');
  return updated;
}

// ─── Document Management ────────────────────────────────────────────────────
export function getUserDocuments(userId: string): UserDocument[] {
  initializeUserData(userId);
  return store.documents[userId] || [];
}

export function addUserDocument(
  userId: string,
  doc: {
    name: string;
    fileType: string;
    size: number;
    category: UserDocument['category'];
    fileData?: string;
  }
): UserDocument {
  initializeUserData(userId);
  const newDoc: UserDocument = {
    id: uuidv4(),
    userId,
    name: doc.name.trim(),
    fileType: doc.fileType,
    size: doc.size,
    category: doc.category,
    fileData: doc.fileData,
    status: doc.category === 'id_verification' ? 'pending' : 'active',
    uploadedAt: Date.now(),
  };

  store.documents[userId].unshift(newDoc);

  // If this is an ID verification document, update verification status
  if (doc.category === 'id_verification') {
    store.profiles[userId].verificationStatus = 'pending';
    addNotification(
      userId,
      'Identity Document Submitted',
      `Your document "${doc.name}" is pending automatic compliance review.`,
      'info'
    );
  }

  saveStore();

  logUserActivity(
    userId,
    'document',
    `Uploaded ${doc.category.toUpperCase().replace('_', ' ')} Document`,
    `Added "${doc.name}" (${(doc.size / 1024).toFixed(1)} KB) to your secure vault.`
  );

  return newDoc;
}

export function deleteUserDocument(userId: string, docId: string): boolean {
  initializeUserData(userId);
  const docs = store.documents[userId] || [];
  const index = docs.findIndex((d) => d.id === docId);
  if (index === -1) return false;

  const [removed] = docs.splice(index, 1);
  saveStore();

  logUserActivity(userId, 'document', 'Deleted Document', `Removed "${removed.name}" from your vault.`);
  return true;
}

// ─── Opportunities & Initiatives ───────────────────────────────────────────
export function getOpportunities(userRole?: string): Opportunity[] {
  if (!userRole) return CURATED_OPPORTUNITIES;
  return CURATED_OPPORTUNITIES.filter(
    (opp) => opp.targetRoles.includes(userRole as any)
  );
}

export function getSavedOpportunities(userId: string): SavedOpportunity[] {
  initializeUserData(userId);
  return store.savedOpportunities[userId] || [];
}

export function saveOpportunity(userId: string, opportunityId: string): { success: boolean; error?: string } {
  initializeUserData(userId);
  const opp = CURATED_OPPORTUNITIES.find((o) => o.id === opportunityId);
  if (!opp) return { success: false, error: 'Opportunity not found' };

  const existing = (store.savedOpportunities[userId] || []).some((s) => s.opportunityId === opportunityId);
  if (existing) {
    return { success: false, error: 'Opportunity is already saved' };
  }

  const saved: SavedOpportunity = {
    id: uuidv4(),
    userId,
    opportunityId: opp.id,
    title: opp.title,
    organization: opp.organization,
    category: opp.category,
    location: opp.location,
    deadline: opp.deadline,
    description: opp.description,
    tags: opp.tags,
    savedAt: Date.now(),
  };

  store.savedOpportunities[userId].unshift(saved);
  saveStore();

  logUserActivity(userId, 'opportunity', 'Bookmarked Opportunity', `Saved "${opp.title}" to your watchlist.`);
  addNotification(userId, 'Opportunity Saved', `"${opp.title}" has been saved to your dashboard.`, 'info');

  return { success: true };
}

export function removeSavedOpportunity(userId: string, savedIdOrOppId: string): boolean {
  initializeUserData(userId);
  const savedList = store.savedOpportunities[userId] || [];
  const index = savedList.findIndex((s) => s.id === savedIdOrOppId || s.opportunityId === savedIdOrOppId);
  if (index === -1) return false;

  const [removed] = savedList.splice(index, 1);
  saveStore();

  logUserActivity(userId, 'opportunity', 'Removed Bookmark', `Unsaved "${removed.title}".`);
  return true;
}

// ─── Applications ───────────────────────────────────────────────────────────
export function getUserApplications(userId: string): UserApplication[] {
  initializeUserData(userId);
  return store.applications[userId] || [];
}

export function applyToOpportunity(
  userId: string,
  opportunityId: string,
  notes?: string
): { success: boolean; application?: UserApplication; error?: string } {
  initializeUserData(userId);
  const opp = CURATED_OPPORTUNITIES.find((o) => o.id === opportunityId);
  if (!opp) return { success: false, error: 'Opportunity not found' };

  const existing = (store.applications[userId] || []).some((a) => a.opportunityId === opportunityId);
  if (existing) {
    return { success: false, error: 'You have already applied to this initiative' };
  }

  const app: UserApplication = {
    id: uuidv4(),
    userId,
    opportunityId: opp.id,
    opportunityTitle: opp.title,
    organization: opp.organization,
    category: opp.category,
    status: 'submitted',
    submittedAt: Date.now(),
    notes: notes?.trim(),
  };

  store.applications[userId].unshift(app);
  saveStore();

  logUserActivity(
    userId,
    'application',
    'Application Submitted',
    `Submitted application for "${opp.title}" to ${opp.organization}.`
  );

  addNotification(
    userId,
    'Application Received',
    `Your application for "${opp.title}" was submitted successfully. Our partners will review your profile.`,
    'success'
  );

  return { success: true, application: app };
}

// ─── Notifications ──────────────────────────────────────────────────────────
export function getUserNotifications(userId: string): Notification[] {
  initializeUserData(userId);
  return store.notifications[userId] || [];
}

export function addNotification(
  userId: string,
  title: string,
  message: string,
  type: Notification['type'] = 'info',
  link?: string
): Notification {
  initializeUserData(userId);
  const notif: Notification = {
    id: uuidv4(),
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: Date.now(),
    link,
  };

  store.notifications[userId].unshift(notif);
  saveStore();
  return notif;
}

export function markNotificationRead(userId: string, notificationId?: string): boolean {
  initializeUserData(userId);
  const list = store.notifications[userId] || [];

  if (notificationId) {
    const item = list.find((n) => n.id === notificationId);
    if (!item) return false;
    item.read = true;
  } else {
    // Mark all as read
    list.forEach((n) => (n.read = true));
  }

  saveStore();
  return true;
}

export function deleteNotification(userId: string, notificationId: string): boolean {
  initializeUserData(userId);
  const list = store.notifications[userId] || [];
  const index = list.findIndex((n) => n.id === notificationId);
  if (index === -1) return false;

  list.splice(index, 1);
  saveStore();
  return true;
}

// ─── Activities ─────────────────────────────────────────────────────────────
export function getUserActivities(userId: string, limit = 20): UserActivity[] {
  initializeUserData(userId);
  const all = store.activities[userId] || [];
  return all.slice(0, limit);
}

export function logUserActivity(
  userId: string,
  type: UserActivity['type'],
  title: string,
  description: string
): void {
  initializeUserData(userId);
  const act: UserActivity = {
    id: uuidv4(),
    userId,
    type,
    title,
    description,
    timestamp: Date.now(),
  };

  store.activities[userId].unshift(act);
  // Keep only the last 50 activities per user
  if (store.activities[userId].length > 50) {
    store.activities[userId] = store.activities[userId].slice(0, 50);
  }
  saveStore();
}

// ─── Verification & Completion Calculation ──────────────────────────────────
export interface CompletionChecklistItem {
  key: string;
  label: string;
  description: string;
  completed: boolean;
  weight: number;
}

export interface ProfileCompletion {
  percentage: number;
  items: CompletionChecklistItem[];
}

export function calculateProfileCompletion(
  user: { id: string; emailVerified: boolean; fullName: string },
  profile: UserProfile,
  documentsCount: number
): ProfileCompletion {
  const items: CompletionChecklistItem[] = [
    {
      key: 'account',
      label: 'Account Registration',
      description: 'Account created with designated role',
      completed: true,
      weight: 15,
    },
    {
      key: 'email',
      label: 'Email Verification',
      description: 'Confirm ownership of your registered email',
      completed: !!user.emailVerified,
      weight: 15,
    },
    {
      key: 'headline',
      label: 'Professional Headline',
      description: 'Add your current focus or specialization',
      completed: !!profile.headline && profile.headline.trim().length > 3,
      weight: 15,
    },
    {
      key: 'bio',
      label: 'Personal Bio',
      description: 'Write a comprehensive introduction (at least 20 chars)',
      completed: !!profile.bio && profile.bio.trim().length >= 20,
      weight: 15,
    },
    {
      key: 'contact',
      label: 'Contact & Location',
      description: 'Add your city or phone number for networking',
      completed: !!profile.location || !!profile.phone || !!profile.website,
      weight: 15,
    },
    {
      key: 'skills',
      label: 'Skill Matrix',
      description: 'List at least 2 relevant skills or domains',
      completed: Array.isArray(profile.skills) && profile.skills.length >= 2,
      weight: 15,
    },
    {
      key: 'document',
      label: 'Uploaded Credentials',
      description: 'Upload a resume, portfolio, or verification document',
      completed: documentsCount > 0,
      weight: 10,
    },
  ];

  const percentage = items.reduce((acc, curr) => (curr.completed ? acc + curr.weight : acc), 0);
  return { percentage, items };
}

export function requestIdentityVerification(userId: string): { success: boolean; error?: string } {
  initializeUserData(userId);
  const docs = store.documents[userId] || [];
  const hasIdDoc = docs.some((d) => d.category === 'id_verification');

  if (!hasIdDoc) {
    return {
      success: false,
      error: 'Please upload an ID verification document (Passport, National ID, or Student ID) first.',
    };
  }

  store.profiles[userId].verificationStatus = 'pending';
  saveStore();

  logUserActivity(userId, 'verification', 'Submitted Verification Request', 'Compliance review initiated.');
  addNotification(
    userId,
    'Verification Under Review',
    'Your identity documents have been submitted to the compliance team. Expect review within 24-48 hours.',
    'info'
  );

  return { success: true };
}
