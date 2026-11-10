import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getAllUsers, getUserById, User, UserRole } from './auth';
import { getUserProfile, UserProfile } from './userData';

export * from './communityTypes';
import {
  PublicMember,
  CommunityGroup,
  DiscussionReply,
  CommunityDiscussion,
  CommunityEvent,
  MemberConnection,
  CommunityAnnouncement,
  FOUNDER_INFO,
} from './communityTypes';

interface CommunityStore {
  groups: CommunityGroup[];
  discussions: CommunityDiscussion[];
  replies: Record<string, DiscussionReply[]>; // discussionId -> replies
  events: CommunityEvent[];
  connections: MemberConnection[];
  announcements: CommunityAnnouncement[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'community.json');

// Default Seed Data
const DEFAULT_GROUPS: CommunityGroup[] = [
  {
    id: 'grp-students',
    name: 'Student Builders & Innovators Guild',
    slug: 'student-builders',
    description: 'A vibrant collective for student developers, AI researchers, and hackathon competitors collaborating on live products.',
    category: 'student',
    icon: 'AcademicCap',
    memberCount: 142,
    memberIds: [],
    rules: [
      'Share original open-source projects and code.',
      'Constructive feedback and peer learning only.',
      'No spam or low-effort promotional links.',
    ],
    featured: true,
    createdAt: 1793000000000,
  },
  {
    id: 'grp-founders',
    name: 'Founders Circle & Venture Room',
    slug: 'founders-circle',
    description: 'High-signal space for early-stage founders discussing MVP validation, angel fundraising, pitch feedback, and hiring.',
    category: 'founder',
    icon: 'RocketLaunch',
    memberCount: 88,
    memberIds: [],
    rules: [
      'Maintain strict confidentiality on pre-launch pitch decks.',
      'Offer transparent metrics when asking for feedback.',
      'No cold pitching without context.',
    ],
    featured: true,
    createdAt: 1793000000000,
  },
  {
    id: 'grp-professionals',
    name: 'Professional & Tech Leaders Network',
    slug: 'tech-leaders',
    description: 'Connecting senior software engineers, system architects, and tech executives discussing engineering leadership and scaling.',
    category: 'professional',
    icon: 'Briefcase',
    memberCount: 115,
    memberIds: [],
    rules: [
      'Focus on real-world system architecture and engineering challenges.',
      'Mentor aspiring builders and emerging leaders.',
      'Respect professional boundaries and community code of conduct.',
    ],
    featured: true,
    createdAt: 1793000000000,
  },
  {
    id: 'grp-deeptech',
    name: 'AI, Cloud & Distributed Systems Collective',
    slug: 'deeptech-collective',
    description: 'Deep technical discussions exploring LLM orchestration, microservices, cloud infra, and modern distributed protocols.',
    category: 'tech',
    icon: 'CpuChip',
    memberCount: 96,
    memberIds: [],
    rules: [
      'Anchor discussions in technical papers, benchmarks, or reproducible code.',
      'Civil debates and high-quality technical critique.',
    ],
    featured: false,
    createdAt: 1793000000000,
  },
  {
    id: 'grp-announcements',
    name: 'NexusHub Official Townhalls & Updates',
    slug: 'official-announcements',
    description: 'Official announcements from founder Mahidhar and the core platform team regarding roadmap, features, and challenges.',
    category: 'general',
    icon: 'Megaphone',
    memberCount: 320,
    memberIds: [],
    rules: [
      'Official broadcast channel.',
      'Community discussion welcomed in reply threads.',
    ],
    featured: true,
    createdAt: 1793000000000,
  },
];

const DEFAULT_EVENTS: CommunityEvent[] = [
  {
    id: 'event-1',
    title: 'NexusHub Global Townhall: Roadmap 2026 with Founder Mahidhar',
    description: 'Join founder Mahidhar for an exclusive live session covering platform architecture, new Labs initiatives, and career pathways.',
    category: 'ama',
    date: 'Nov 12, 2026',
    time: '6:00 PM - 7:30 PM UTC',
    timestamp: 1794500000000,
    location: 'NexusHub Live Stage (Virtual)',
    isVirtual: true,
    meetingUrl: 'https://whatsapp.com/channel/0029VbBhwMJ0AgW4DyiKl40q',
    organizer: {
      name: 'Mahidhar',
      role: 'Founder & Lead Architect',
    },
    rsvps: ['admin-1', 'user-sample-1'],
    maxCapacity: 500,
    tags: ['Townhall', 'Roadmap', 'Keynote', 'Founder'],
  },
  {
    id: 'event-2',
    title: 'Student & Founder Synergy: Pitch & Code Review Night',
    description: 'Student engineers showcase working prototypes to venture founders seeking technical co-founders and early builders.',
    category: 'pitch',
    date: 'Nov 18, 2026',
    time: '5:00 PM - 7:00 PM UTC',
    timestamp: 1795000000000,
    location: 'Interactive Discord & Virtual Demo Room',
    isVirtual: true,
    meetingUrl: 'https://t.me/aMKEo1zdyzk1Njdl',
    organizer: {
      name: 'NexusHub Community Team',
      role: 'Ecosystem Team',
    },
    rsvps: ['sample-student-1', 'sample-founder-1'],
    maxCapacity: 120,
    tags: ['Pitch', 'Student', 'Founder', 'Showcase'],
  },
  {
    id: 'event-3',
    title: 'Executive Masterclass: Designing High-Throughput Microservices',
    description: 'Deep-dive session hosted by Senior Staff Engineers from leading scaleups on latency optimization and resilience.',
    category: 'workshop',
    date: 'Nov 24, 2026',
    time: '4:00 PM - 5:30 PM UTC',
    timestamp: 1795500000000,
    location: 'NexusHub Tech Theater (Virtual)',
    isVirtual: true,
    meetingUrl: 'https://topmate.io/mahidhar_07',
    organizer: {
      name: 'Carol Professional',
      role: 'Senior Staff Engineer',
    },
    rsvps: ['carol-pro-1'],
    maxCapacity: 150,
    tags: ['Architecture', 'System Design', 'Professional', 'Backend'],
  },
];

const DEFAULT_ANNOUNCEMENTS: CommunityAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Welcome to the NexusHub Community & Networking Ecosystem!',
    summary: 'Discover peers, connect with industry leaders, and engage directly with founder Mahidhar across official channels.',
    content: 'We are thrilled to launch the unified Community module on NexusHub. Whether you are a student building your first breakthrough app, a founder seeking co-founders, or a seasoned professional mentoring the next wave, this platform is designed to accelerate your connections.',
    category: 'official',
    date: 'Nov 03, 2026',
    timestamp: 1793700000000,
    author: 'Mahidhar (Founder)',
    pinned: true,
  },
  {
    id: 'ann-2',
    title: 'NexusHub Official WhatsApp & Telegram Channels are Live',
    summary: 'Never miss an event or sprint challenge. Join our verified broadcast channels for real-time announcements.',
    content: 'We have consolidated all real-time alerts into the official WhatsApp Channel and Telegram Group. External links are available in the dedicated Connect section below.',
    category: 'update',
    date: 'Nov 02, 2026',
    timestamp: 1793600000000,
    author: 'NexusHub Team',
    pinned: false,
  },
];

const DEFAULT_DISCUSSIONS: CommunityDiscussion[] = [
  {
    id: 'disc-1',
    groupId: 'grp-announcements',
    groupName: 'NexusHub Official Townhalls & Updates',
    track: 'all',
    title: 'Welcome to NexusHub Community! Introduce yourself and your current build',
    content: 'Hello creators! Drop a note with what you are building, your primary technical stack, and what type of connections you are seeking (collaborators, mentors, or early users). Mahidhar and the community team will be reviewing threads and highlighting top projects!',
    authorId: 'founder-mahidhar-id',
    authorName: 'Mahidhar',
    authorRole: 'founder',
    tags: ['Introductions', 'Welcome', 'Community', 'NexusHub'],
    likes: ['user-1', 'user-2', 'user-3'],
    repliesCount: 2,
    createdAt: 1793650000000,
    pinned: true,
  },
  {
    id: 'disc-2',
    groupId: 'grp-students',
    groupName: 'Student Builders & Innovators Guild',
    track: 'student',
    title: 'Best architectural patterns for deploying real-time AI Agents with Next.js & Express?',
    content: 'Hey everyone, our student team is building an autonomous code review agent. We are choosing between WebSockets vs Server-Sent Events for streaming step-by-step LLM traces to the client. Any suggestions or experiences from production?',
    authorId: 'student-builder-1',
    authorName: 'Bob Chen',
    authorRole: 'student',
    tags: ['Next.js', 'AI', 'Architecture', 'WebSockets'],
    likes: ['user-1', 'user-4'],
    repliesCount: 1,
    createdAt: 1793680000000,
  },
  {
    id: 'disc-3',
    groupId: 'grp-founders',
    groupName: 'Founders Circle & Venture Room',
    track: 'founder',
    title: 'How are early-stage B2B founders navigating initial user discovery in 2026?',
    content: 'We are validating an automated compliance scanner for developer workflows. Curious what distribution channels and direct outreach strategies have yielded the highest qualified demo conversion for fellow NexusHub founders.',
    authorId: 'founder-alice-1',
    authorName: 'Alice Walker',
    authorRole: 'founder',
    tags: ['Validation', 'B2B', 'GTM', 'Founder'],
    likes: ['user-2'],
    repliesCount: 0,
    createdAt: 1793690000000,
  },
];

const DEFAULT_REPLIES: Record<string, DiscussionReply[]> = {
  'disc-1': [
    {
      id: 'rep-1',
      discussionId: 'disc-1',
      authorId: 'user-carol',
      authorName: 'Carol Professional',
      authorRole: 'professional',
      content: 'Excited to be part of the NexusHub mentor circle! I am a Staff Distributed Systems Engineer and open to advising ambitious student projects and seed-stage startups.',
      createdAt: 1793655000000,
      likes: ['user-1'],
    },
    {
      id: 'rep-2',
      discussionId: 'disc-1',
      authorId: 'user-bob',
      authorName: 'Bob Chen',
      authorRole: 'student',
      content: 'Happy to connect! Currently hacking on generative AI workflows in Python & Next.js. Looking forward to the upcoming pitch night.',
      createdAt: 1793660000000,
      likes: [],
    },
  ],
  'disc-2': [
    {
      id: 'rep-3',
      discussionId: 'disc-2',
      authorId: 'user-carol',
      authorName: 'Carol Professional',
      authorRole: 'professional',
      content: 'SSE (Server-Sent Events) is generally significantly simpler to maintain, auto-reconnects natively over HTTP/2, and is ideal for unidirectional LLM output streaming. Only reach for WebSockets if you need low-latency bidirectional client signals.',
      createdAt: 1793685000000,
      likes: ['student-builder-1'],
    },
  ],
};

let store: CommunityStore = {
  groups: DEFAULT_GROUPS,
  discussions: DEFAULT_DISCUSSIONS,
  replies: DEFAULT_REPLIES,
  events: DEFAULT_EVENTS,
  connections: [],
  announcements: DEFAULT_ANNOUNCEMENTS,
};

function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      store = {
        groups: parsed.groups && parsed.groups.length > 0 ? parsed.groups : DEFAULT_GROUPS,
        discussions: parsed.discussions && parsed.discussions.length > 0 ? parsed.discussions : DEFAULT_DISCUSSIONS,
        replies: parsed.replies || DEFAULT_REPLIES,
        events: parsed.events && parsed.events.length > 0 ? parsed.events : DEFAULT_EVENTS,
        connections: parsed.connections || [],
        announcements: parsed.announcements && parsed.announcements.length > 0 ? parsed.announcements : DEFAULT_ANNOUNCEMENTS,
      };
    } else {
      saveStore();
    }
  } catch (err) {
    console.error('Failed to load community store:', err);
  }
}

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save community store:', err);
  }
}

loadStore();

// ─── Real Member Discovery ──────────────────────────────────────────────────
export function getDiscoveredMembers(options?: {
  role?: string;
  q?: string;
  page?: number;
  limit?: number;
}): { members: PublicMember[]; total: number; page: number; totalPages: number } {
  loadStore();
  const rawUsers = getAllUsers();
  
  // Transform real registered users with their profiles, excluding sensitive data
  let members: PublicMember[] = rawUsers.map((u) => {
    const profile = getUserProfile(u.id);
    return {
      id: u.id,
      fullName: u.fullName || 'Nexus Member',
      email: u.email,
      role: u.role,
      headline: profile.headline || (u.role === 'founder' ? 'Founder & Builder' : u.role === 'student' ? 'Student Technologist' : 'Industry Specialist'),
      bio: profile.bio || '',
      location: profile.location || 'Nexus Global',
      skills: profile.skills && profile.skills.length > 0 ? profile.skills : ['Innovation', 'Collaboration'],
      avatarUrl: profile.avatarUrl || '',
      verificationStatus: profile.verificationStatus || (u.emailVerified ? 'verified' : 'unverified'),
      identityVerified: profile.identityVerified || false,
      joinedAt: u.createdAt || Date.now(),
      website: profile.website,
      github: profile.github,
      linkedin: profile.linkedin,
    };
  });

  // Include Founder Mahidhar at top if not explicitly in rawUsers to guarantee founder connectivity
  const founderExists = members.some((m) => m.fullName.toLowerCase().includes('mahidhar'));
  if (!founderExists) {
    members.unshift({
      id: 'founder-mahidhar-id',
      fullName: 'Mahidhar',
      email: 'mahidhar@nexushub.io',
      role: 'founder',
      headline: 'Founder & Lead Architect at NexusHub',
      bio: 'Leading NexusHub ecosystem engineering. Open for mentoring student developers, reviewing early-stage ventures, and ecosystem collaboration.',
      location: 'Hyderabad / Global',
      skills: ['System Architecture', 'Venture Building', 'Full-Stack', 'Ecosystem Strategy'],
      avatarUrl: '',
      verificationStatus: 'verified',
      identityVerified: true,
      joinedAt: 1790000000000,
      linkedin: 'https://www.linkedin.com/in/mahidhar07/',
      website: 'https://topmate.io/mahidhar_07',
    });
  }

  // Filter by role
  if (options?.role && options.role !== 'all') {
    members = members.filter((m) => m.role.toLowerCase() === options.role?.toLowerCase());
  }

  // Search query filter
  if (options?.q && options.q.trim()) {
    const query = options.q.toLowerCase().trim();
    members = members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(query) ||
        m.headline.toLowerCase().includes(query) ||
        m.location.toLowerCase().includes(query) ||
        m.skills.some((s) => s.toLowerCase().includes(query))
    );
  }

  const total = members.length;
  const page = Math.max(1, options?.page || 1);
  const limit = Math.max(1, options?.limit || 12);
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = members.slice(startIndex, startIndex + limit);

  return { members: paginated, total, page, totalPages };
}

export function getPublicMemberById(id: string): PublicMember | null {
  loadStore();
  if (id === 'founder-mahidhar-id') {
    return {
      id: 'founder-mahidhar-id',
      fullName: 'Mahidhar',
      email: 'mahidhar@nexushub.io',
      role: 'founder',
      headline: 'Founder & Lead Architect at NexusHub',
      bio: 'Leading NexusHub ecosystem engineering. Open for mentoring student developers, reviewing early-stage ventures, and ecosystem collaboration.',
      location: 'Hyderabad / Global',
      skills: ['System Architecture', 'Venture Building', 'Full-Stack', 'Ecosystem Strategy'],
      avatarUrl: '',
      verificationStatus: 'verified',
      identityVerified: true,
      joinedAt: 1790000000000,
      linkedin: 'https://www.linkedin.com/in/mahidhar07/',
      website: 'https://topmate.io/mahidhar_07',
    };
  }

  const user = getUserById(id);
  if (!user) return null;

  const profile = getUserProfile(user.id);
  return {
    id: user.id,
    fullName: user.fullName || 'Nexus Member',
    email: user.email,
    role: user.role,
    headline: profile.headline || (user.role === 'founder' ? 'Founder & Builder' : user.role === 'student' ? 'Student Technologist' : 'Industry Specialist'),
    bio: profile.bio || '',
    location: profile.location || 'Nexus Global',
    skills: profile.skills && profile.skills.length > 0 ? profile.skills : ['Innovation', 'Collaboration'],
    avatarUrl: profile.avatarUrl || '',
    verificationStatus: profile.verificationStatus || (user.emailVerified ? 'verified' : 'unverified'),
    identityVerified: profile.identityVerified || false,
    joinedAt: user.createdAt || Date.now(),
    website: profile.website,
    github: profile.github,
    linkedin: profile.linkedin,
  };
}

// ─── Community Groups ───────────────────────────────────────────────────────
export function getCommunityGroups(): CommunityGroup[] {
  loadStore();
  return store.groups;
}

export function joinCommunityGroup(userId: string, groupId: string): { success: boolean; isMember: boolean; error?: string } {
  loadStore();
  const group = store.groups.find((g) => g.id === groupId);
  if (!group) return { success: false, isMember: false, error: 'Group not found.' };

  const index = group.memberIds.indexOf(userId);
  let isMember = false;
  if (index >= 0) {
    group.memberIds.splice(index, 1);
    group.memberCount = Math.max(0, group.memberCount - 1);
    isMember = false;
  } else {
    group.memberIds.push(userId);
    group.memberCount += 1;
    isMember = true;
  }
  saveStore();
  return { success: true, isMember };
}

// ─── Discussions & UGC ──────────────────────────────────────────────────────
export function getCommunityDiscussions(options?: {
  groupId?: string;
  track?: string;
  q?: string;
  page?: number;
  limit?: number;
}): { discussions: CommunityDiscussion[]; total: number } {
  loadStore();
  let list = [...store.discussions];

  if (options?.groupId && options.groupId !== 'all') {
    list = list.filter((d) => d.groupId === options.groupId);
  }

  if (options?.track && options.track !== 'all') {
    list = list.filter((d) => d.track === options.track || d.track === 'all');
  }

  if (options?.q && options.q.trim()) {
    const q = options.q.toLowerCase().trim();
    list = list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort pinned first, then newest
  list.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.createdAt - a.createdAt;
  });

  return { discussions: list, total: list.length };
}

export function getDiscussionById(id: string): { discussion: CommunityDiscussion; replies: DiscussionReply[] } | null {
  loadStore();
  const disc = store.discussions.find((d) => d.id === id);
  if (!disc) return null;
  const replies = store.replies[id] || [];
  return { discussion: disc, replies };
}

export function createDiscussion(
  user: { id: string; fullName: string; role: UserRole },
  data: {
    groupId: string;
    title: string;
    content: string;
    tags?: string[];
    track?: 'student' | 'founder' | 'professional' | 'all';
  }
): { success: boolean; discussion?: CommunityDiscussion; error?: string } {
  loadStore();

  // Spam prevention and validation
  const title = (data.title || '').trim();
  const content = (data.content || '').trim();

  if (title.length < 5) {
    return { success: false, error: 'Discussion title must be at least 5 characters.' };
  }
  if (title.length > 150) {
    return { success: false, error: 'Discussion title cannot exceed 150 characters.' };
  }
  if (content.length < 10) {
    return { success: false, error: 'Discussion content must be at least 10 characters.' };
  }
  if (content.length > 5000) {
    return { success: false, error: 'Discussion content cannot exceed 5000 characters.' };
  }

  const group = store.groups.find((g) => g.id === data.groupId) || store.groups[0];

  // Sanitized tags
  const tags = (data.tags || [])
    .map((t) => t.replace(/[^a-zA-Z0-9_-]/g, '').trim())
    .filter((t) => t.length > 0 && t.length <= 25)
    .slice(0, 5);

  const newDiscussion: CommunityDiscussion = {
    id: `disc-${uuidv4()}`,
    groupId: group.id,
    groupName: group.name,
    track: data.track || (user.role === 'student' ? 'student' : user.role === 'founder' ? 'founder' : user.role === 'professional' ? 'professional' : 'all'),
    title,
    content,
    authorId: user.id,
    authorName: user.fullName || 'Community Member',
    authorRole: user.role,
    tags: tags.length > 0 ? tags : ['General'],
    likes: [],
    repliesCount: 0,
    createdAt: Date.now(),
  };

  store.discussions.unshift(newDiscussion);
  store.replies[newDiscussion.id] = [];
  saveStore();

  return { success: true, discussion: newDiscussion };
}

export function addDiscussionReply(
  user: { id: string; fullName: string; role: UserRole },
  discussionId: string,
  content: string
): { success: boolean; reply?: DiscussionReply; error?: string } {
  loadStore();

  const disc = store.discussions.find((d) => d.id === discussionId);
  if (!disc) return { success: false, error: 'Discussion not found.' };

  const trimmed = (content || '').trim();
  if (trimmed.length < 3) {
    return { success: false, error: 'Reply must be at least 3 characters long.' };
  }
  if (trimmed.length > 2500) {
    return { success: false, error: 'Reply cannot exceed 2500 characters.' };
  }

  const newReply: DiscussionReply = {
    id: `rep-${uuidv4()}`,
    discussionId,
    authorId: user.id,
    authorName: user.fullName || 'Community Member',
    authorRole: user.role,
    content: trimmed,
    createdAt: Date.now(),
    likes: [],
  };

  if (!store.replies[discussionId]) {
    store.replies[discussionId] = [];
  }
  store.replies[discussionId].push(newReply);
  disc.repliesCount = store.replies[discussionId].length;

  saveStore();
  return { success: true, reply: newReply };
}

export function toggleLikeDiscussion(userId: string, discussionId: string): { success: boolean; likesCount: number; isLiked: boolean } {
  loadStore();
  const disc = store.discussions.find((d) => d.id === discussionId);
  if (!disc) return { success: false, likesCount: 0, isLiked: false };

  const idx = disc.likes.indexOf(userId);
  let isLiked = false;
  if (idx >= 0) {
    disc.likes.splice(idx, 1);
    isLiked = false;
  } else {
    disc.likes.push(userId);
    isLiked = true;
  }
  saveStore();
  return { success: true, likesCount: disc.likes.length, isLiked };
}

// ─── Events & Announcements ─────────────────────────────────────────────────
export function getCommunityEvents(options?: { category?: string }): CommunityEvent[] {
  loadStore();
  let events = [...store.events];
  if (options?.category && options.category !== 'all') {
    events = events.filter((e) => e.category === options.category);
  }
  return events.sort((a, b) => a.timestamp - b.timestamp);
}

export function toggleRsvpEvent(userId: string, eventId: string): { success: boolean; isRsvped: boolean; rsvpCount: number; error?: string } {
  loadStore();
  const ev = store.events.find((e) => e.id === eventId);
  if (!ev) return { success: false, isRsvped: false, rsvpCount: 0, error: 'Event not found.' };

  const idx = ev.rsvps.indexOf(userId);
  let isRsvped = false;
  if (idx >= 0) {
    ev.rsvps.splice(idx, 1);
    isRsvped = false;
  } else {
    if (ev.maxCapacity && ev.rsvps.length >= ev.maxCapacity) {
      return { success: false, isRsvped: false, rsvpCount: ev.rsvps.length, error: 'Event capacity reached.' };
    }
    ev.rsvps.push(userId);
    isRsvped = true;
  }
  saveStore();
  return { success: true, isRsvped, rsvpCount: ev.rsvps.length };
}

export function getAnnouncements(): CommunityAnnouncement[] {
  loadStore();
  return store.announcements.sort((a, b) => b.timestamp - a.timestamp);
}

// ─── Member Connections ─────────────────────────────────────────────────────
export function manageConnectionRequest(
  senderId: string,
  receiverId: string,
  message?: string
): { success: boolean; connection?: MemberConnection; status: string; error?: string } {
  loadStore();
  if (senderId === receiverId) {
    return { success: false, status: 'none', error: 'You cannot connect with yourself.' };
  }

  const existing = store.connections.find(
    (c) =>
      (c.senderId === senderId && c.receiverId === receiverId) ||
      (c.senderId === receiverId && c.receiverId === senderId)
  );

  const now = Date.now();
  if (existing) {
    if (existing.status === 'pending' && existing.receiverId === senderId) {
      // Receiver accepts the request
      existing.status = 'accepted';
      existing.updatedAt = now;
      saveStore();
      return { success: true, connection: existing, status: 'accepted' };
    }
    if (existing.status === 'pending' && existing.senderId === senderId) {
      // Sender cancels request
      store.connections = store.connections.filter((c) => c.id !== existing.id);
      saveStore();
      return { success: true, status: 'none' };
    }
    if (existing.status === 'accepted') {
      // Disconnect
      store.connections = store.connections.filter((c) => c.id !== existing.id);
      saveStore();
      return { success: true, status: 'none' };
    }
  }

  const newConn: MemberConnection = {
    id: `conn-${uuidv4()}`,
    senderId,
    receiverId,
    status: 'pending',
    message: message?.trim().slice(0, 200),
    createdAt: now,
    updatedAt: now,
  };

  store.connections.push(newConn);
  saveStore();
  return { success: true, connection: newConn, status: 'pending' };
}

export function getUserConnectionStatus(
  currentUserId: string,
  targetUserId: string
): { status: 'none' | 'pending_sent' | 'pending_received' | 'connected' } {
  loadStore();
  const conn = store.connections.find(
    (c) =>
      (c.senderId === currentUserId && c.receiverId === targetUserId) ||
      (c.senderId === targetUserId && c.receiverId === currentUserId)
  );

  if (!conn) return { status: 'none' };
  if (conn.status === 'accepted') return { status: 'connected' };
  if (conn.status === 'pending') {
    return conn.senderId === currentUserId ? { status: 'pending_sent' } : { status: 'pending_received' };
  }
  return { status: 'none' };
}

// ─── Community Analytics & Stats ────────────────────────────────────────────
export function getCommunityStats() {
  loadStore();
  const membersResult = getDiscoveredMembers({ limit: 1000 });
  const studentsCount = membersResult.members.filter((m) => m.role === 'student').length;
  const foundersCount = membersResult.members.filter((m) => m.role === 'founder').length;
  const professionalsCount = membersResult.members.filter((m) => m.role === 'professional').length;

  return {
    totalMembers: membersResult.total,
    studentsCount,
    foundersCount,
    professionalsCount,
    totalDiscussions: store.discussions.length,
    activeGroups: store.groups.length,
    upcomingEvents: store.events.length,
    totalConnections: store.connections.filter((c) => c.status === 'accepted').length,
  };
}
