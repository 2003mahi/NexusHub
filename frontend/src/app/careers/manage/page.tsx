'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { CareerOpportunity, JobApplication, ApplicationStatus } from '@/app/lib/careers';

export default function RecruiterManagePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [postings, setPostings] = useState<CareerOpportunity[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerOpportunity | null>(null);
  const [applicants, setApplicants] = useState<JobApplication[]>([]);
  const [loadingPostings, setLoadingPostings] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [notesModalApp, setNotesModalApp] = useState<JobApplication | null>(null);
  const [reviewerNote, setReviewerNote] = useState('');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('under_review');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load recruiter's postings
  const fetchPostings = useCallback(async () => {
    try {
      setLoadingPostings(true);
      const res = await fetch('/api/careers/recruiter');
      if (res.status === 401) {
        router.push('/auth/login?redirect=/careers/manage');
        return;
      }
      if (res.status === 403) {
        // Not a recruiter
        return;
      }
      const data = await res.json();
      setPostings(data.postings || []);
      if (data.postings && data.postings.length > 0) {
        setSelectedCareer(data.postings[0]);
      }
    } catch (err) {
      console.error('Error fetching postings:', err);
    } finally {
      setLoadingPostings(false);
    }
  }, [router]);

  // Load applicants for selected career
  const fetchApplicants = useCallback(async (careerId: string) => {
    try {
      setLoadingApplicants(true);
      const res = await fetch(`/api/careers/${careerId}/applicants`);
      if (res.ok) {
        const data = await res.json();
        setApplicants(data.applicants || []);
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/careers/manage');
    } else if (user) {
      fetchPostings();
    }
  }, [user, authLoading, router, fetchPostings]);

  useEffect(() => {
    if (selectedCareer) {
      fetchApplicants(selectedCareer.id);
    }
  }, [selectedCareer, fetchApplicants]);

  const handleUpdateStatus = async () => {
    if (!notesModalApp || !selectedCareer) return;

    try {
      setStatusUpdating(notesModalApp.id);
      const res = await fetch(`/api/careers/${selectedCareer.id}/applicants`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: notesModalApp.id,
          status: newStatus,
          notes: reviewerNote.trim() || undefined
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update candidate status.');
      }

      setFeedbackMsg({ type: 'success', text: `Status updated to ${newStatus.replace('_', ' ')}` });
      setNotesModalApp(null);
      fetchApplicants(selectedCareer.id);
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error updating status' });
    } finally {
      setStatusUpdating(null);
    }
  };

  const isRecruiter = user && ['founder', 'professional', 'admin'].includes(user.role);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link href="/careers" className="hover:text-indigo-600">Careers Marketplace</Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">Recruiter Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
              Recruiter & Candidate Hub
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Review applicant submissions, protect candidate privacy, and manage recruitment funnels.
            </p>
          </div>

          <Link
            href="/careers/post"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <span>+ Create New Role</span>
          </Link>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div
            className={`p-4 mb-6 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <span>{feedbackMsg.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* If student: Gate check */}
        {!authLoading && user && !isRecruiter ? (
          <div className="p-8 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/60 rounded-3xl text-center my-10 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl mx-auto mb-4">
              🛡️
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Recruiter Access Only
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
              Only verified Founders, Professionals, and Administrators can manage candidate pools.
            </p>
            <Link
              href="/careers"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              Back to Careers Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Your Posted Roles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Your Posted Roles ({postings.length})
                </h3>
              </div>

              {loadingPostings ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl" />
                  ))}
                </div>
              ) : postings.length > 0 ? (
                <div className="space-y-2.5">
                  {postings.map((p) => {
                    const isSelected = selectedCareer?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedCareer(p)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500/80 shadow-xs'
                            : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-gray-950 dark:text-white truncate">
                            {p.title}
                          </h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 shrink-0">
                            {p.applicantCount} {p.applicantCount === 1 ? 'applicant' : 'applicants'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {p.organization} • {p.location}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center">
                  <p className="text-xs text-gray-500 mb-3">You haven&apos;t posted any positions yet.</p>
                  <Link
                    href="/careers/post"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Post your first role →
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column: Applicants for selected role */}
            <div className="lg:col-span-2">
              {selectedCareer ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
                    <div>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        Candidate Management
                      </span>
                      <h2 className="text-xl font-bold text-gray-950 dark:text-white mt-1">
                        {selectedCareer.title}
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {applicants.length} total applications submitted
                      </p>
                    </div>

                    <Link
                      href={`/careers/${selectedCareer.id}`}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Public Listing</span>
                      <span>↗</span>
                    </Link>
                  </div>

                  {/* Applicants List */}
                  {loadingApplicants ? (
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
                      ))}
                    </div>
                  ) : applicants.length > 0 ? (
                    <div className="space-y-4">
                      {applicants.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <h4 className="text-sm font-bold text-gray-950 dark:text-white">
                                  {candidate.applicantName}
                                </h4>
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize">
                                  {candidate.applicantRole}
                                </span>
                                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                  {candidate.status.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                ✉ {candidate.applicantEmail} • Applied {new Date(candidate.appliedAt).toLocaleDateString()}
                              </p>
                            </div>

                            {/* Status Change Button */}
                            <button
                              onClick={() => {
                                setNotesModalApp(candidate);
                                setNewStatus(candidate.status);
                                setReviewerNote(candidate.reviewerNotes || '');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shadow-2xs"
                            >
                              Update Status
                            </button>
                          </div>

                          {/* Candidate Cover Statement */}
                          <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                            {candidate.coverLetter}
                          </div>

                          {/* Skills and links */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                            <div className="flex flex-wrap gap-1.5">
                              {candidate.skills && candidate.skills.map((s) => (
                                <span key={s} className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-[11px] text-gray-700 dark:text-gray-300">
                                  {s}
                                </span>
                              ))}
                            </div>

                            {candidate.portfolioUrl && (
                              <a
                                href={candidate.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 font-medium underline"
                              >
                                Portfolio / GitHub Link ↗
                              </a>
                            )}
                          </div>

                          {candidate.reviewerNotes && (
                            <div className="text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-lg border border-indigo-200/60 dark:border-indigo-900/40">
                              <strong>Your Note:</strong> {candidate.reviewerNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl mx-auto mb-3">
                        👥
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                        No applications yet
                      </h4>
                      <p className="text-xs text-gray-500">
                        Applications submitted by candidates will appear here immediately with protected contact details.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center text-gray-500">
                  Select a posting from the left to view candidates.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Updater Modal */}
        {notesModalApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-base font-bold text-gray-950 dark:text-white mb-1">
                Update Candidate Status
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Evaluating candidate <strong>{notesModalApp.applicantName}</strong> for{' '}
                <strong>{notesModalApp.careerTitle}</strong>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Recruitment Stage
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="interviewing">Interview Scheduled</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted / Extended Offer</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Reviewer Note / Feedback for Candidate (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reviewerNote}
                    onChange={(e) => setReviewerNote(e.target.value)}
                    placeholder="e.g. Advancing to round 2 technical assessment on Thursday at 2pm..."
                    className="w-full p-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setNotesModalApp(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={statusUpdating !== null}
                    onClick={handleUpdateStatus}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                  >
                    {statusUpdating ? 'Saving...' : 'Update & Notify'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
