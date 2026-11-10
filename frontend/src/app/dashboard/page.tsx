'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
  DashboardTab,
  DashboardState,
  OpportunityItem,
} from './types';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import ProfileTab from './components/ProfileTab';
import VerificationTab from './components/VerificationTab';
import OpportunitiesTab from './components/OpportunitiesTab';
import ApplicationsTab from './components/ApplicationsTab';
import DocumentsTab from './components/DocumentsTab';
import NotificationsTab from './components/NotificationsTab';
import SettingsTab from './components/SettingsTab';
import Toast, { ToastMessage } from './components/Toast';

export default function DashboardPage() {
  const { user: authSessionUser, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Active tab & mobile drawer state
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Core dashboard state
  const [dashboardData, setDashboardData] = useState<DashboardState | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Catalog of all opportunities for exploration
  const [catalog, setCatalog] = useState<OpportunityItem[]>([]);

  // Toast feedback state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch unified dashboard payload
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoadingData(true);
      setFetchError(null);

      const [dashRes, savedRes] = await Promise.all([
        fetch('/api/user/dashboard'),
        fetch('/api/user/saved-opportunities'),
      ]);

      if (!dashRes.ok) {
        if (dashRes.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to load dashboard data.');
      }

      const dashData = await dashRes.json();
      setDashboardData(dashData);

      if (savedRes.ok) {
        const savedData = await savedRes.json();
        if (savedData.catalog) {
          setCatalog(savedData.catalog);
        }
      }
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      setFetchError(err.message || 'Error connecting to server.');
    } finally {
      setLoadingData(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading && !authSessionUser) {
      router.push('/auth/login');
    } else if (authSessionUser) {
      fetchDashboardData();
    }
  }, [authLoading, authSessionUser, router, fetchDashboardData]);

  // Handlers for child tabs
  const handleUpdateProfile = async (updates: any) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                user: { ...prev.user, fullName: data.user.fullName },
                profile: data.profile,
                completion: data.completion,
              }
            : null
        );
        addToast('success', 'Profile updated successfully.');
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to update profile.' };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const handleUpdateSettings = async (updates: any) => {
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDashboardData((prev) =>
          prev ? { ...prev, settings: data.settings } : null
        );
        addToast('success', 'Account preferences updated.');
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to update settings.' };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast('success', 'Password updated successfully.');
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to change password.' };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const handleUploadDocument = async (doc: any) => {
    try {
      const res = await fetch('/api/user/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                documents: [data.document, ...prev.documents],
                metrics: {
                  ...prev.metrics,
                  documentsCount: prev.documents.length + 1,
                },
                completion: data.completion || prev.completion,
              }
            : null
        );
        addToast('success', `"${doc.name}" uploaded securely.`);
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to upload document.' };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/user/documents?id=${docId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                documents: prev.documents.filter((d) => d.id !== docId),
                metrics: {
                  ...prev.metrics,
                  documentsCount: Math.max(prev.documents.length - 1, 0),
                },
                completion: data.completion || prev.completion,
              }
            : null
        );
        addToast('info', 'Document removed from vault.');
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to delete document.' };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const handleSaveOpportunity = async (oppId: string) => {
    try {
      const res = await fetch('/api/user/saved-opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: oppId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                savedOpportunities: data.savedOpportunities,
                metrics: {
                  ...prev.metrics,
                  savedOpportunitiesCount: data.savedOpportunities.length,
                },
              }
            : null
        );
        addToast('success', 'Opportunity saved to your watchlist.');
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to save opportunity.' };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const handleRemoveSavedOpportunity = async (id: string) => {
    try {
      const res = await fetch(`/api/user/saved-opportunities?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                savedOpportunities: data.savedOpportunities,
                metrics: {
                  ...prev.metrics,
                  savedOpportunitiesCount: data.savedOpportunities.length,
                },
              }
            : null
        );
        addToast('info', 'Removed from watchlist.');
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to remove.' };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const handleApplyOpportunity = async (oppId: string, notes?: string) => {
    try {
      const res = await fetch('/api/user/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: oppId, notes }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                applications: data.applications,
                recentActivities: data.activities || prev.recentActivities,
                metrics: {
                  ...prev.metrics,
                  applicationsCount: data.applications.length,
                },
              }
            : null
        );
        addToast('success', 'Application submitted successfully!');
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to submit application.' };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const handleMarkNotificationsRead = async (id?: string) => {
    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const unreadCount = data.notifications.filter((n: any) => !n.read).length;
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                notifications: data.notifications,
                metrics: { ...prev.metrics, unreadNotificationsCount: unreadCount },
              }
            : null
        );
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/user/notifications?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const unreadCount = data.notifications.filter((n: any) => !n.read).length;
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                notifications: data.notifications,
                metrics: { ...prev.metrics, unreadNotificationsCount: unreadCount },
              }
            : null
        );
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  };

  const handleRequestVerification = async () => {
    try {
      const res = await fetch('/api/user/verification', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                profile: {
                  ...prev.profile,
                  verificationStatus: data.verificationStatus,
                },
              }
            : null
        );
        addToast('info', 'Verification request submitted for compliance review.');
        return { success: true };
      }
      return { success: false, error: data.error || 'Verification request failed.' };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  // Loading skeleton screen
  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-6 text-gray-400">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] animate-pulse">
            <div className="w-full h-full bg-[#080B14] rounded-[15px] flex items-center justify-center">
              <svg className="animate-spin w-6 h-6 text-indigo-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Authenticating Session...</h3>
            <p className="text-xs text-gray-500 mt-0.5">Decrypting user vault and workspace metrics</p>
          </div>
        </div>
      </div>
    );
  }

  // Error screen
  if (fetchError || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-6 text-gray-300">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0E1322] border border-white/[0.1] text-center shadow-2xl">
          <span className="text-4xl block mb-3">⚠️</span>
          <h2 className="text-lg font-bold text-white mb-2">Workspace Synchronization Failed</h2>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            {fetchError || 'Unable to establish secure connection to NexusHub database.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => fetchDashboardData()}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md"
            >
              Retry Connection
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/[0.04]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-foreground flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Main SaaS Layout: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          user={dashboardData.user}
          completion={dashboardData.completion}
          unreadCount={dashboardData.metrics.unreadNotificationsCount}
          savedCount={dashboardData.metrics.savedOpportunitiesCount}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
          {/* Top Header */}
          <Header
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            user={dashboardData.user}
            unreadCount={dashboardData.metrics.unreadNotificationsCount}
            notifications={dashboardData.notifications}
            onOpenMobile={() => setMobileOpen(true)}
          />

          {/* Dynamic Tab Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'overview' && (
              <OverviewTab
                user={dashboardData.user}
                profile={dashboardData.profile}
                completion={dashboardData.completion}
                metrics={dashboardData.metrics}
                recommendedOpportunities={dashboardData.recommendedOpportunities}
                applications={dashboardData.applications}
                recentActivities={dashboardData.recentActivities}
                onSelectTab={setCurrentTab}
                onSaveOpportunity={handleSaveOpportunity}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileTab
                user={dashboardData.user}
                profile={dashboardData.profile}
                completion={dashboardData.completion}
                onUpdateProfile={handleUpdateProfile}
                onGoToDocuments={() => setCurrentTab('documents')}
                onGoToVerification={() => setCurrentTab('verification')}
              />
            )}

            {currentTab === 'verification' && (
              <VerificationTab
                user={dashboardData.user}
                profile={dashboardData.profile}
                documents={dashboardData.documents}
                onRequestVerification={handleRequestVerification}
                onGoToDocuments={() => setCurrentTab('documents')}
              />
            )}

            {currentTab === 'opportunities' && (
              <OpportunitiesTab
                savedOpportunities={dashboardData.savedOpportunities}
                catalog={catalog.length > 0 ? catalog : dashboardData.recommendedOpportunities}
                applications={dashboardData.applications}
                onSaveOpportunity={handleSaveOpportunity}
                onRemoveSavedOpportunity={handleRemoveSavedOpportunity}
                onApplyOpportunity={handleApplyOpportunity}
              />
            )}

            {currentTab === 'applications' && (
              <ApplicationsTab
                applications={dashboardData.applications}
                activities={dashboardData.recentActivities}
                onGoToOpportunities={() => setCurrentTab('opportunities')}
              />
            )}

            {currentTab === 'documents' && (
              <DocumentsTab
                documents={dashboardData.documents}
                onUploadDocument={handleUploadDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            )}

            {currentTab === 'notifications' && (
              <NotificationsTab
                notifications={dashboardData.notifications}
                onMarkRead={handleMarkNotificationsRead}
                onDeleteNotification={handleDeleteNotification}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsTab
                user={dashboardData.user}
                settings={dashboardData.settings}
                onUpdateSettings={handleUpdateSettings}
                onChangePassword={handleChangePassword}
                onLogout={handleLogout}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
