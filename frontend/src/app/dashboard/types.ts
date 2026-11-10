export type DashboardTab =
  | 'overview'
  | 'profile'
  | 'verification'
  | 'opportunities'
  | 'applications'
  | 'documents'
  | 'notifications'
  | 'settings';

export interface UserAuthData {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'founder' | 'professional' | 'admin';
  emailVerified: boolean;
  createdAt: number;
}

export interface UserProfileData {
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

export interface UserSettingsData {
  userId: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  profileVisibility: 'public' | 'network' | 'private';
  twoFactorEnabled: boolean;
  themePreference: 'dark' | 'light' | 'system';
  updatedAt: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  fileType: string;
  size: number;
  category: 'resume' | 'id_verification' | 'portfolio' | 'certificate' | 'pitch_deck';
  fileData?: string;
  status: 'verified' | 'pending' | 'active';
  uploadedAt: number;
}

export interface SavedOpportunityItem {
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

export interface OpportunityItem {
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

export interface ApplicationItem {
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

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'security';
  read: boolean;
  createdAt: number;
  link?: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  type: 'profile' | 'document' | 'application' | 'opportunity' | 'security' | 'verification';
  title: string;
  description: string;
  timestamp: number;
}

export interface ChecklistItem {
  key: string;
  label: string;
  description: string;
  completed: boolean;
  weight: number;
}

export interface ProfileCompletionData {
  percentage: number;
  items: ChecklistItem[];
}

export interface DashboardMetrics {
  documentsCount: number;
  savedOpportunitiesCount: number;
  applicationsCount: number;
  unreadNotificationsCount: number;
  activitiesCount: number;
}

export interface DashboardState {
  user: UserAuthData;
  profile: UserProfileData;
  settings: UserSettingsData;
  completion: ProfileCompletionData;
  metrics: DashboardMetrics;
  documents: DocumentItem[];
  savedOpportunities: SavedOpportunityItem[];
  applications: ApplicationItem[];
  notifications: NotificationItem[];
  recentActivities: ActivityItem[];
  recommendedOpportunities: OpportunityItem[];
}
