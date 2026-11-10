export type CommunityUserRole = 'student' | 'founder' | 'professional' | 'admin';

export interface PublicMember {
  id: string;
  fullName: string;
  email: string;
  role: CommunityUserRole;
  headline: string;
  bio: string;
  location: string;
  skills: string[];
  avatarUrl: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  identityVerified: boolean;
  joinedAt: number;
  website?: string;
  github?: string;
  linkedin?: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'student' | 'founder' | 'professional' | 'tech' | 'general';
  icon: string;
  memberCount: number;
  memberIds: string[];
  rules: string[];
  featured: boolean;
  createdAt: number;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  authorId: string;
  authorName: string;
  authorRole: CommunityUserRole;
  content: string;
  createdAt: number;
  likes: string[];
}

export interface CommunityDiscussion {
  id: string;
  groupId: string;
  groupName: string;
  track: 'student' | 'founder' | 'professional' | 'all';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: CommunityUserRole;
  tags: string[];
  likes: string[];
  repliesCount: number;
  createdAt: number;
  pinned?: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  category: 'workshop' | 'ama' | 'networking' | 'pitch' | 'showcase';
  date: string;
  time: string;
  timestamp: number;
  location: string;
  isVirtual: boolean;
  meetingUrl?: string;
  organizer: {
    name: string;
    role: string;
  };
  rsvps: string[];
  maxCapacity: number;
  tags: string[];
}

export interface MemberConnection {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CommunityAnnouncement {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'official' | 'spotlight' | 'update';
  date: string;
  timestamp: number;
  author: string;
  pinned?: boolean;
}

export interface FounderConnectionHub {
  name: string;
  role: string;
  bio: string;
  vision: string;
  location: string;
  channels: {
    name: string;
    description: string;
    url: string;
    type: 'whatsapp' | 'telegram' | 'topmate' | 'linkedin';
    badge: string;
    actionLabel: string;
  }[];
}

export const FOUNDER_INFO: FounderConnectionHub = {
  name: 'Mahidhar',
  role: 'Founder & Lead Architect at NexusHub',
  bio: 'Building NexusHub as the unified global ecosystem uniting student innovators, venture founders, and high-impact industry professionals.',
  vision: 'Empowering ambitious creators with real-world project labs, peer networking, founder acceleration, and direct mentorship pathways.',
  location: 'Global / Virtual Hub',
  channels: [
    {
      name: 'NexusHub WhatsApp Channel',
      description: 'Instant announcements, project drops, community alerts, and official platform notifications directly on WhatsApp.',
      url: 'https://whatsapp.com/channel/0029VbBhwMJ0AgW4DyiKl40q',
      type: 'whatsapp',
      badge: 'Official Broadcast',
      actionLabel: 'Join WhatsApp Channel',
    },
    {
      name: 'NexusHub Telegram Space',
      description: 'Follow ecosystem updates, deep-dive technical insights, and access high-value community threads.',
      url: 'https://t.me/aMKEo1zdyzk1Njdl',
      type: 'telegram',
      badge: 'Follow & Read More',
      actionLabel: 'Open Telegram Channel',
    },
    {
      name: 'Topmate — Mahidhar',
      description: 'Book 1-on-1 mentorship sessions, startup advisory, tech architecture reviews, and personal career roadmaps.',
      url: 'https://topmate.io/mahidhar_07',
      type: 'topmate',
      badge: '1:1 Mentorship & Advisory',
      actionLabel: 'Book on Topmate',
    },
    {
      name: 'LinkedIn — Mahidhar',
      description: 'Connect directly on LinkedIn for ecosystem partnerships, executive outreach, and verified professional collaboration.',
      url: 'https://www.linkedin.com/in/mahidhar07/',
      type: 'linkedin',
      badge: 'Professional Network',
      actionLabel: 'Connect on LinkedIn',
    },
  ],
};
