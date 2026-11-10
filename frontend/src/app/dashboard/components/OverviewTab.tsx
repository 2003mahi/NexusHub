'use client';

import React from 'react';
import {
  DashboardTab,
  UserAuthData,
  UserProfileData,
  ProfileCompletionData,
  DashboardMetrics,
  OpportunityItem,
  ApplicationItem,
  ActivityItem,
} from '../types';

interface OverviewTabProps {
  user: UserAuthData;
  profile: UserProfileData;
  completion: ProfileCompletionData;
  metrics: DashboardMetrics;
  recommendedOpportunities: OpportunityItem[];
  applications: ApplicationItem[];
  recentActivities: ActivityItem[];
  onSelectTab: (tab: DashboardTab) => void;
  onSaveOpportunity: (oppId: string) => void;
  isSavingOppId?: string | null;
}

const roleBadgeColors: Record<string, string> = {
  student: 'from-blue-500 to-cyan-500',
  founder: 'from-amber-500 to-orange-500',
  professional: 'from-emerald-500 to-teal-500',
  admin: 'from-rose-500 to-purple-500',
};

const roleIcons: Record<string, string> = {
  student: '🎓',
  founder: '🚀',
  professional: '💼',
  admin: '🛡️',
};

export default function OverviewTab({
  user,
  profile,
  completion,
  metrics,
  recommendedOpportunities,
  applications,
  recentActivities,
  onSelectTab,
  onSaveOpportunity,
  isSavingOppId,
}: OverviewTabProps) {
  // Determine greeting based on local time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user.fullName.split(' ')[0] || user.fullName;

  // Unfinished completion tasks count
  const remainingTasks = completion.items.filter((item) => !item.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ── 1. Personalized Welcome Card ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12182B] via-[#0E1322] to-[#0A0D18] border border-white/[0.09] p-6 sm:p-8 shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                  roleBadgeColors[user.role] || 'from-gray-600 to-gray-700'
                } shadow-sm`}
              >
                <span>{roleIcons[user.role]}</span>
                <span className="capitalize">{user.role} Member</span>
              </span>

              {user.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Verified Credential
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Pending Verification
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting}, {firstName}!
            </h2>

            <p className="text-sm text-gray-400 max-w-xl">
              {profile.headline || 'Welcome to your unified NexusHub member hub.'} Manage your profile, applications, secure document vault, and ecosystem opportunities.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('profile')}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
            >
              Edit Profile
            </button>
            <button
              onClick={() => onSelectTab('documents')}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-all"
            >
              Upload Document
            </button>
            <button
              onClick={() => onSelectTab('opportunities')}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all"
            >
              Explore Initiatives
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Real Metrics Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Profile Completion */}
        <div
          onClick={() => onSelectTab('profile')}
          className="group relative overflow-hidden rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-indigo-500/30 p-5 transition-all duration-300 cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Profile Completion</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{completion.percentage}%</span>
            <span className="text-xs text-gray-400">
              {remainingTasks === 0 ? 'Optimal' : `${remainingTasks} tasks left`}
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
              style={{ width: `${completion.percentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Saved Watchlist */}
        <div
          onClick={() => onSelectTab('opportunities')}
          className="group relative overflow-hidden rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-purple-500/30 p-5 transition-all duration-300 cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Saved Watchlist</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{metrics.savedOpportunitiesCount}</span>
            <span className="text-xs text-gray-400">Bookmarked</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 group-hover:text-purple-300 transition-colors">
            Tap to review deadlines →
          </p>
        </div>

        {/* Metric 3: Active Applications */}
        <div
          onClick={() => onSelectTab('applications')}
          className="group relative overflow-hidden rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-cyan-500/30 p-5 transition-all duration-300 cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Active Applications</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{metrics.applicationsCount}</span>
            <span className="text-xs text-gray-400">Submitted</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 group-hover:text-cyan-300 transition-colors">
            Live review statuses →
          </p>
        </div>

        {/* Metric 4: Vault Documents */}
        <div
          onClick={() => onSelectTab('documents')}
          className="group relative overflow-hidden rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-emerald-500/30 p-5 transition-all duration-300 cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Vault Documents</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{metrics.documentsCount}</span>
            <span className="text-xs text-gray-400">Stored</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 group-hover:text-emerald-300 transition-colors">
            Manage & upload credentials →
          </p>
        </div>
      </div>

      {/* ── 3. Interactive Activity & Progress Analytics Section ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Distribution & SVG Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Ecosystem Action Distribution</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Real-time
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Audit trail across applications, profile updates, credentials, and watchlist.
              </p>
            </div>

            <button
              onClick={() => onSelectTab('applications')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline self-start sm:self-center"
            >
              View Full Timeline →
            </button>
          </div>

          {/* SVG Visual Chart */}
          <div className="h-44 w-full relative flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 pb-2 border-b border-white/[0.06]">
            {/* 4 Metric Columns */}
            {[
              {
                label: 'Profile',
                value: completion.percentage,
                maxValue: 100,
                color: 'from-indigo-500 to-purple-600',
                display: `${completion.percentage}%`,
              },
              {
                label: 'Watchlist',
                value: Math.max(metrics.savedOpportunitiesCount * 25, 10),
                maxValue: 100,
                color: 'from-purple-500 to-pink-500',
                display: `${metrics.savedOpportunitiesCount}`,
              },
              {
                label: 'Applications',
                value: Math.max(metrics.applicationsCount * 30, 10),
                maxValue: 100,
                color: 'from-cyan-500 to-blue-500',
                display: `${metrics.applicationsCount}`,
              },
              {
                label: 'Documents',
                value: Math.max(metrics.documentsCount * 33, 10),
                maxValue: 100,
                color: 'from-emerald-500 to-teal-500',
                display: `${metrics.documentsCount}`,
              },
              {
                label: 'Actions Logged',
                value: Math.min(Math.max(recentActivities.length * 15, 15), 100),
                maxValue: 100,
                color: 'from-amber-500 to-orange-500',
                display: `${recentActivities.length}`,
              },
            ].map((col) => {
              const heightPercent = Math.min(Math.max(col.value, 12), 100);
              return (
                <div key={col.label} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[11px] font-bold text-gray-300 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {col.display}
                  </span>
                  <div className="w-full max-w-[48px] bg-white/[0.04] rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-t-xl bg-gradient-to-t ${col.color} shadow-lg transition-all duration-700 ease-out group-hover:brightness-110`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 mt-2 truncate max-w-full text-center">
                    {col.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 mt-4 px-2">
            <span>Aggregated from persistent user data</span>
            <span className="text-gray-400 font-medium">100% verified server isolation</span>
          </div>
        </div>

        {/* Right 1 Col: Profile Completion Checklist Widget */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Profile Checklist</h3>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                {completion.percentage}% Complete
              </span>
            </div>

            <div className="space-y-2.5">
              {completion.items.slice(0, 4).map((item) => (
                <div
                  key={item.key}
                  onClick={() => onSelectTab('profile')}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    item.completed
                      ? 'bg-emerald-500/[0.04] border-emerald-500/20 text-emerald-200'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        item.completed
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {item.completed ? '✓' : '○'}
                    </span>
                    <span className="text-xs font-medium text-white">{item.label}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono">+{item.weight}%</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('profile')}
            className="w-full mt-4 py-2 text-center text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 rounded-xl transition-all"
          >
            Review All Checklist Items →
          </button>
        </div>
      </div>

      {/* ── 4. Role-Specific Opportunities Spotlight ──────────────────────── */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Recommended for {user.role.toUpperCase()} Members</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Curated
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Direct access to grants, accelerators, internships, and mentorship matching.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('opportunities')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline self-start sm:self-center"
          >
            Browse All Catalog →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {opp.category}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">Deadline: {opp.deadline}</span>
                </div>

                <h4 className="text-sm font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                  {opp.title}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">{opp.organization}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{opp.description}</p>

                {opp.reward && (
                  <div className="mt-3 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block">
                    🎁 {opp.reward}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <button
                  onClick={() => onSaveOpportunity(opp.id)}
                  disabled={isSavingOppId === opp.id}
                  className="text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  {isSavingOppId === opp.id ? 'Saving...' : 'Bookmark'}
                </button>

                <button
                  onClick={() => onSelectTab('opportunities')}
                  className="text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
                >
                  Apply Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Recent Activity Feed ────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Recent Activities</h3>
          <button
            onClick={() => onSelectTab('applications')}
            className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            Audit History →
          </button>
        </div>

        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No activity logged yet. Updates to your profile or documents will appear here.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {recentActivities.slice(0, 5).map((act) => {
              const dateStr = new Date(act.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={act.id} className="py-3 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {act.type === 'profile'
                      ? '👤'
                      : act.type === 'document'
                      ? '📁'
                      : act.type === 'application'
                      ? '📑'
                      : act.type === 'opportunity'
                      ? '⭐'
                      : act.type === 'verification'
                      ? '🛡️'
                      : '🔒'}
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white truncate">{act.title}</p>
                      <span className="text-[10px] text-gray-500 font-mono flex-shrink-0">{dateStr}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{act.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
