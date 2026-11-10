'use client';

import React, { useState } from 'react';
import { ApplicationItem, ActivityItem } from '../types';

interface ApplicationsTabProps {
  applications: ApplicationItem[];
  activities: ActivityItem[];
  onGoToOpportunities: () => void;
}

const statusConfig: Record<
  ApplicationItem['status'],
  { label: string; badge: string; icon: string }
> = {
  submitted: {
    label: 'Submitted',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    icon: '📩',
  },
  under_review: {
    label: 'Under Review',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: '⏳',
  },
  shortlisted: {
    label: 'Shortlisted',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    icon: '🌟',
  },
  accepted: {
    label: 'Accepted',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: '🎉',
  },
  declined: {
    label: 'Declined',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    icon: '✕',
  },
};

export default function ApplicationsTab({
  applications,
  activities,
  onGoToOpportunities,
}: ApplicationsTabProps) {
  const [activeSection, setActiveSection] = useState<'applications' | 'audit'>('applications');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const filteredActivities = activities.filter((act) => {
    if (activityTypeFilter === 'all') return true;
    return act.type === activityTypeFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ── Tab Switcher ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
        <button
          onClick={() => setActiveSection('applications')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSection === 'applications'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]'
          }`}
        >
          Active Applications Track ({applications.length})
        </button>

        <button
          onClick={() => setActiveSection('audit')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeSection === 'audit'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]'
          }`}
        >
          Activity & Audit Log ({activities.length})
        </button>
      </div>

      {/* ── 1. Applications Section ───────────────────────────────────────── */}
      {activeSection === 'applications' && (
        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Application Pipeline</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time tracking of grant submissions, fellowship candidacies, and mentorship requests.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {['all', 'submitted', 'under_review', 'shortlisted', 'accepted'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-gray-400 hover:text-white bg-white/[0.02]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-white/[0.01] border border-dashed border-white/[0.08]">
              <span className="text-4xl block mb-2">📑</span>
              <h4 className="text-base font-semibold text-white">No applications found</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                You haven&apos;t submitted any initiative applications yet. Explore available partner programs now!
              </p>
              <button
                onClick={onGoToOpportunities}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
              >
                Browse Opportunities Catalog →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-gray-400 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 px-3 font-semibold">Initiative & Sponsor</th>
                    <th className="pb-3 px-3 font-semibold">Category</th>
                    <th className="pb-3 px-3 font-semibold">Submitted Date</th>
                    <th className="pb-3 px-3 font-semibold">Live Status</th>
                    <th className="pb-3 px-3 font-semibold">Applicant Statement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredApps.map((app) => {
                    const cfg = statusConfig[app.status] || {
                      label: app.status,
                      badge: 'bg-white/10 text-white',
                      icon: '•',
                    };
                    const dateStr = new Date(app.submittedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-3">
                          <p className="font-bold text-white text-sm">{app.opportunityTitle}</p>
                          <p className="text-indigo-400 font-medium text-xs mt-0.5">{app.organization}</p>
                        </td>
                        <td className="py-4 px-3 capitalize text-gray-300">
                          <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                            {app.category}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-gray-400 font-mono">{dateStr}</td>
                        <td className="py-4 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}
                          >
                            <span>{cfg.icon}</span>
                            <span>{cfg.label}</span>
                          </span>
                        </td>
                        <td className="py-4 px-3 text-gray-400 max-w-xs truncate">
                          {app.notes || 'Default credentials attached.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── 2. Audit Trail Section ────────────────────────────────────────── */}
      {activeSection === 'audit' && (
        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Ecosystem Activity Timeline</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Cryptographically isolated audit log of all account operations and interactions.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {['all', 'profile', 'document', 'application', 'opportunity', 'security', 'verification'].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setActivityTypeFilter(type)}
                    className={`text-xs px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                      activityTypeFilter === type
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-gray-400 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              No matching activity events recorded.
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l border-white/[0.08] space-y-6 my-4">
              {filteredActivities.map((act) => {
                const dateStr = new Date(act.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={act.id} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#090D16] border-2 border-indigo-500 group-hover:border-cyan-400 group-hover:scale-125 transition-all shadow-md shadow-indigo-500/50" />

                    <div className="p-4 rounded-2xl bg-white/[0.02] group-hover:bg-white/[0.04] border border-white/[0.06] transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                            {act.type}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white">{act.title}</h4>
                        </div>
                        <span className="text-[11px] text-gray-500 font-mono">{dateStr}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{act.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
