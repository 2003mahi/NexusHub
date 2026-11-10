'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobApplication, ApplicationStatus } from '@/app/lib/careers';
import { useAuth } from '@/app/context/AuthContext';

export default function ApplicationsTrackingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/careers/applications');
      if (res.status === 401) {
        router.push('/auth/login?redirect=/careers/applications');
        return;
      }
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/careers/applications');
    } else if (user) {
      fetchApplications();
    }
  }, [user, authLoading, router, fetchApplications]);

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  // Calculate summary counts
  const totalCount = applications.length;
  const inReviewCount = applications.filter((a) => a.status === 'under_review').length;
  const interviewingCount = applications.filter((a) => a.status === 'interviewing').length;
  const acceptedCount = applications.filter((a) => a.status === 'accepted' || a.status === 'shortlisted').length;

  // Status visual mapping
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'shortlisted':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30';
      case 'interviewing':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
      case 'under_review':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'declined':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getStepProgress = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return 1;
      case 'under_review':
        return 2;
      case 'interviewing':
        return 3;
      case 'shortlisted':
      case 'accepted':
      case 'declined':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link href="/careers" className="hover:text-indigo-600">Careers Marketplace</Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">My Applications</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
              Application Tracker
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time submission logs, recruiter review stages, and candidate status updates.
            </p>
          </div>

          <Link
            href="/careers"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            + Browse More Roles
          </Link>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-xs">
            <span className="text-xs font-medium text-gray-500">Total Submitted</span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
              {totalCount}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-xs">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Under Review</span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
              {inReviewCount}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-xs">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Interviewing</span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
              {interviewingCount}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-xs">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Offers & Accepted</span>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
              {acceptedCount}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4 text-xs">
          {[
            { id: 'all', label: 'All Applications' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'interviewing', label: 'Interviewing' },
            { id: 'shortlisted', label: 'Shortlisted' },
            { id: 'accepted', label: 'Accepted' },
            { id: 'declined', label: 'Declined' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterStatus(pill.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                filterStatus === pill.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold shadow-xs'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Applications List */}
        {!loading && filteredApps.length > 0 && (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const currentStep = getStepProgress(app.status);
              const isExpanded = expandedId === app.id;

              return (
                <div
                  key={app.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 shadow-xs transition-all hover:border-indigo-500/40"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-base font-bold text-gray-950 dark:text-white">
                          {app.careerTitle}
                        </h3>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {app.organization} • Submitted on {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/careers/${app.careerId}`}
                        className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        View Job Post
                      </Link>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {isExpanded ? 'Hide Details' : 'View Application'}
                      </button>
                    </div>
                  </div>

                  {/* Visual Status Stepper */}
                  <div className="py-3 px-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800/80 mb-3">
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-medium">
                      <div className={currentStep >= 1 ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-400'}>
                        <div className={`h-1.5 rounded-full mb-1.5 ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        1. Submitted
                      </div>
                      <div className={currentStep >= 2 ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-400'}>
                        <div className={`h-1.5 rounded-full mb-1.5 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        2. Under Review
                      </div>
                      <div className={currentStep >= 3 ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-400'}>
                        <div className={`h-1.5 rounded-full mb-1.5 ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        3. Interview
                      </div>
                      <div className={currentStep >= 4 ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-400'}>
                        <div className={`h-1.5 rounded-full mb-1.5 ${currentStep >= 4 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        4. Final Decision
                      </div>
                    </div>
                  </div>

                  {/* Recruiter Notes if any */}
                  {app.reviewerNotes && (
                    <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 mb-3">
                      <strong className="block font-semibold mb-0.5">Note from Hiring Lead:</strong>
                      <span>{app.reviewerNotes}</span>
                    </div>
                  )}

                  {/* Expandable Submission Details */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-xs space-y-3">
                      <div>
                        <strong className="block text-gray-500 mb-1">Your Cover Statement:</strong>
                        <p className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                          {app.coverLetter}
                        </p>
                      </div>

                      {app.portfolioUrl && (
                        <div>
                          <strong className="text-gray-500 mr-2">Portfolio / Profile:</strong>
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 underline"
                          >
                            {app.portfolioUrl}
                          </a>
                        </div>
                      )}

                      {app.skills && app.skills.length > 0 && (
                        <div>
                          <strong className="text-gray-500 block mb-1">Skills Highlighted:</strong>
                          <div className="flex flex-wrap gap-1.5">
                            {app.skills.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredApps.length === 0 && (
          <div className="text-center py-20 px-4 bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mx-auto mb-4">
              📄
            </div>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">
              No applications in this category
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
              You haven&apos;t submitted any applications under this filter. Browse our active marketplace to find and apply for top tech roles.
            </p>
            <Link
              href="/careers"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              Explore Opportunities
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
