import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession, getUserById } from '@/app/lib/auth';
import {
  getUserProfile,
  getUserSettings,
  getUserDocuments,
  getSavedOpportunities,
  getUserApplications,
  getUserNotifications,
  getUserActivities,
  getOpportunities,
  calculateProfileCompletion,
} from '@/app/lib/userData';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }

    const profile = getUserProfile(user.id);
    const settings = getUserSettings(user.id);
    const documents = getUserDocuments(user.id);
    const savedOpportunities = getSavedOpportunities(user.id);
    const applications = getUserApplications(user.id);
    const notifications = getUserNotifications(user.id);
    const activities = getUserActivities(user.id, 10);
    const roleOpportunities = getOpportunities(user.role);
    const completion = calculateProfileCompletion(user, profile, documents.length);

    const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      profile,
      settings,
      completion,
      metrics: {
        documentsCount: documents.length,
        savedOpportunitiesCount: savedOpportunities.length,
        applicationsCount: applications.length,
        unreadNotificationsCount,
        activitiesCount: activities.length,
      },
      documents: documents.map((d) => ({
        id: d.id,
        name: d.name,
        fileType: d.fileType,
        size: d.size,
        category: d.category,
        status: d.status,
        uploadedAt: d.uploadedAt,
      })),
      savedOpportunities,
      applications,
      notifications,
      recentActivities: activities,
      recommendedOpportunities: roleOpportunities.slice(0, 4),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data.' }, { status: 500 });
  }
}
