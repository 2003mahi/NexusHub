'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '@/app/context/AuthContext';

interface FeedbackEntry {
  id: string;
  fromUserId: string;
  fromName: string;
  type: 'mentor' | 'peer' | 'system';
  rating?: number;
  comment: string;
  createdAt: number;
}

interface TeamMember {
  userId: string;
  name: string;
  role: string;
  skills: string[];
}

interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  teamName: string;
  teamMembers: TeamMember[];
  leaderId: string;
  leaderName: string;
  title: string;
  summary: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  presentationUrl?: string;
  technologies: string[];
  status: 'draft' | 'submitted' | 'under_review' | 'feedback_provided' | 'revision_requested' | 'accepted' | 'rejected';
  score?: number;
  feedback: FeedbackEntry[];
  submittedAt: number;
  updatedAt: number;
}

const statusBadgeStyles: Record<string, { label: string; style: string; icon: string }> = {
  draft: { label: 'Draft', style: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: '📝' },
  submitted: { label: 'Submitted', style: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '🚀' },
  under_review: { label: 'Under Review', style: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '⏳' },
  feedback_provided: { label: 'Feedback Ready', style: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '💬' },
  revision_requested: { label: 'Revision Needed', style: 'bg-orange-500/20 text-orange-300 border-orange-500/30', icon: '⚠️' },
  accepted: { label: 'Accepted / Winner', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: '🏆' },
  rejected: { label: 'Not Selected', style: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: '✖' },
};

export default function SubmissionsTrackingPage() {
  const { user, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  // Review & feedback modal / actions
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState<'mentor' | 'peer'>('mentor');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  // Status update
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('under_review');

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/labs/submissions');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to fetch submissions');
      }
      const data = await res.json();
      setSubmissions(data.submissions || []);
      if (selectedSub) {
        const updated = (data.submissions || []).find((s: Submission) => s.id === selectedSub.id);
        if (updated) setSelectedSub(updated);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading your submissions.');
    } finally {
      setLoading(false);
    }
  }, [user, selectedSub]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchSubmissions();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, fetchSubmissions]);

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !feedbackComment.trim()) return;

    setFeedbackLoading(true);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/labs/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'feedback',
          submissionId: selectedSub.id,
          comment: feedbackComment.trim(),
          rating: feedbackRating,
          type: feedbackType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');

      setFeedbackMsg({ type: 'success', text: 'Feedback added successfully!' });
      setFeedbackComment('');
      fetchSubmissions();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Feedback submission failed' });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedSub) return;
    setStatusUpdating(true);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/labs/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatus',
          submissionId: selectedSub.id,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      setFeedbackMsg({ type: 'success', text: `Status updated to ${status}` });
      fetchSubmissions();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Status update failed' });
    } finally {
      setStatusUpdating(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.challengeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const canManageStatus = user && ['founder', 'professional', 'admin'].includes(user.role);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 text-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-gray-800 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
                <Link href="/labs" className="hover:underline">Labs Marketplace</Link>
                <span>/</span>
                <span>Track Submissions</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Solution & Proposal Tracker
              </h1>
              <p className="text-gray-400 text-sm mt-1 max-w-2xl">
                Monitor review progress, view detailed mentor feedback, collaborate with team members, and check awards.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/labs"
                className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 text-sm font-medium transition-all"
              >
                ← Browse Challenges
              </Link>
              {canManageStatus && (
                <Link
                  href="/labs/create"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all"
                >
                  + Post New Challenge
                </Link>
              )}
            </div>
          </div>

          {/* Not signed in state */}
          {!authLoading && !user && (
            <div className="text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800/80 my-8">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                Please get verified with your Nexus ID to track project proposals and view personalized mentor feedback.
              </p>
              <Link
                href="/get-verified"
                className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-colors"
              >
                Get Verified
              </Link>
            </div>
          )}

          {/* Signed in dashboard */}
          {user && (
            <div className="mt-8">
              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
                <div className="flex-1 relative">
                  <span className="absolute left-3.5 top-3 text-gray-500">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by challenge, proposal title, or team..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/80 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Filter:</span>
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'submitted', label: 'Submitted' },
                    { value: 'under_review', label: 'Under Review' },
                    { value: 'feedback_provided', label: 'Feedback' },
                    { value: 'accepted', label: 'Accepted' },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setFilterStatus(tab.value)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        filterStatus === tab.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                  <p className="text-sm">Loading your submissions and review records...</p>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm mb-6 flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={fetchSubmissions} className="text-rose-400 underline text-xs ml-4">Retry</button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredSubmissions.length === 0 && (
                <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800/60">
                  <div className="text-5xl mb-4">📂</div>
                  <h3 className="text-lg font-bold text-white mb-2">No Submissions Found</h3>
                  <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                    {searchQuery || filterStatus !== 'all'
                      ? 'No submissions match your current filter criteria.'
                      : "You haven't submitted a solution to any NexusHub Labs challenge yet."}
                  </p>
                  <Link
                    href="/labs"
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Explore Active Challenges
                  </Link>
                </div>
              )}

              {/* Submissions Grid */}
              {!loading && !error && filteredSubmissions.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSubmissions.map((sub) => {
                    const badge = statusBadgeStyles[sub.status] || {
                      label: sub.status,
                      style: 'bg-gray-500/20 text-gray-300',
                      icon: '📦',
                    };

                    return (
                      <div
                        key={sub.id}
                        className="bg-gray-900/60 rounded-2xl border border-gray-800/80 p-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 shadow-md group"
                      >
                        <div>
                          {/* Status and Challenge Title */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.style}`}
                            >
                              <span>{badge.icon}</span>
                              {badge.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(sub.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <Link
                            href={`/labs/${sub.challengeId}`}
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium block truncate mb-1"
                          >
                            Challenge: {sub.challengeTitle}
                          </Link>

                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors mb-2 line-clamp-1">
                            {sub.title}
                          </h3>

                          <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                            {sub.summary}
                          </p>

                          {/* Tech stack */}
                          {sub.technologies && sub.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {sub.technologies.slice(0, 4).map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-gray-800/80 text-gray-300 text-[11px] border border-gray-700/50"
                                >
                                  {tech}
                                </span>
                              ))}
                              {sub.technologies.length > 4 && (
                                <span className="text-[10px] text-gray-500 self-center">
                                  +{sub.technologies.length - 4} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Feedback Count & Team */}
                          <div className="flex items-center justify-between text-xs text-gray-400 py-3 border-t border-gray-800/60 mb-4">
                            <div className="flex items-center gap-1.5">
                              <span>👥</span>
                              <span className="truncate max-w-[120px]">{sub.teamName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>💬</span>
                              <span>{sub.feedback ? sub.feedback.length : 0} reviews</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-800/40">
                          <button
                            onClick={() => setSelectedSub(sub)}
                            className="flex-1 py-2 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all text-center"
                          >
                            View Details & Feedback
                          </button>
                          <Link
                            href={`/labs/${sub.challengeId}`}
                            className="p-2 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl text-xs border border-gray-700/50 transition-all"
                            title="Go to challenge"
                          >
                            ↗
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Submission Detail Modal */}
          {selectedSub && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-3xl w-full p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedSub(null);
                    setFeedbackMsg({ type: '', text: '' });
                  }}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>

                {/* Modal Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        statusBadgeStyles[selectedSub.status]?.style || 'bg-gray-700'
                      }`}
                    >
                      {statusBadgeStyles[selectedSub.status]?.icon}{' '}
                      {statusBadgeStyles[selectedSub.status]?.label || selectedSub.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      Submitted on {new Date(selectedSub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedSub.title}</h2>
                  <Link
                    href={`/labs/${selectedSub.challengeId}`}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                  >
                    Challenge: {selectedSub.challengeTitle} →
                  </Link>
                </div>

                {/* Status manager for creator / admin / mentor */}
                {canManageStatus && (
                  <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 mb-6">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Reviewer / Admin Control
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-200 px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="under_review">Under Review</option>
                        <option value="feedback_provided">Feedback Provided</option>
                        <option value="revision_requested">Revision Requested</option>
                        <option value="accepted">Accepted / Winner</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => handleUpdateStatus(newStatus)}
                        disabled={statusUpdating}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        {statusUpdating ? 'Updating...' : 'Set Status'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary & Description */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Summary</h4>
                    <p className="text-sm text-gray-300 bg-gray-950/50 p-3 rounded-xl border border-gray-800/60">
                      {selectedSub.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Detailed Proposal & Implementation
                    </h4>
                    <p className="text-sm text-gray-300 bg-gray-950/50 p-4 rounded-xl border border-gray-800/60 whitespace-pre-line leading-relaxed">
                      {selectedSub.description}
                    </p>
                  </div>
                </div>

                {/* Resource Links */}
                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  {selectedSub.repoUrl ? (
                    <a
                      href={selectedSub.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-gray-950 border border-gray-800 hover:border-indigo-500/40 text-xs text-indigo-400 flex items-center justify-between transition-colors"
                    >
                      <span>Code Repository</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <div className="p-3 rounded-xl bg-gray-950/40 border border-gray-800/40 text-xs text-gray-600">
                      No code repo provided
                    </div>
                  )}

                  {selectedSub.demoUrl ? (
                    <a
                      href={selectedSub.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-gray-950 border border-gray-800 hover:border-emerald-500/40 text-xs text-emerald-400 flex items-center justify-between transition-colors"
                    >
                      <span>Live Demonstration</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <div className="p-3 rounded-xl bg-gray-950/40 border border-gray-800/40 text-xs text-gray-600">
                      No live demo provided
                    </div>
                  )}

                  {selectedSub.presentationUrl ? (
                    <a
                      href={selectedSub.presentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-gray-950 border border-gray-800 hover:border-purple-500/40 text-xs text-purple-400 flex items-center justify-between transition-colors"
                    >
                      <span>Slide Deck / Pitch</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <div className="p-3 rounded-xl bg-gray-950/40 border border-gray-800/40 text-xs text-gray-600">
                      No slides attached
                    </div>
                  )}
                </div>

                {/* Team Members */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Team Members</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSub.teamMembers?.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-gray-800 border border-gray-700/60 text-xs text-gray-200"
                      >
                        {m.name} {m.userId === selectedSub.leaderId ? '⭐ Leader' : ''} ({m.role})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mentorship & Feedback Section */}
                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>💬</span> Mentorship & Peer Feedback ({selectedSub.feedback?.length || 0})
                  </h3>

                  {feedbackMsg.text && (
                    <div
                      className={`p-3 rounded-xl text-xs mb-4 ${
                        feedbackMsg.type === 'success'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {feedbackMsg.text}
                    </div>
                  )}

                  {/* Feedback list */}
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {(!selectedSub.feedback || selectedSub.feedback.length === 0) && (
                      <p className="text-gray-500 text-xs italic">
                        No feedback recorded yet. Mentors and challenge evaluators will provide notes here.
                      </p>
                    )}
                    {selectedSub.feedback?.map((fb) => (
                      <div
                        key={fb.id}
                        className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                              {fb.type.toUpperCase()}
                            </span>
                            {fb.fromName}
                          </span>
                          <span className="text-gray-500 text-[11px]">
                            {fb.rating ? `⭐ ${fb.rating}/5 · ` : ''}
                            {new Date(fb.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="leading-relaxed text-gray-300 whitespace-pre-line">{fb.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Feedback Form */}
                  <form onSubmit={handleAddFeedback} className="space-y-3 bg-gray-950/60 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-xs font-semibold text-gray-300">Submit Constructive Feedback</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Feedback Role</label>
                        <select
                          value={feedbackType}
                          onChange={(e) => setFeedbackType(e.target.value as 'mentor' | 'peer')}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-200 px-3 py-2"
                        >
                          <option value="mentor">Mentor Evaluation</option>
                          <option value="peer">Peer Review</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Rating (1-5)</label>
                        <select
                          value={feedbackRating}
                          onChange={(e) => setFeedbackRating(Number(e.target.value))}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-200 px-3 py-2"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                          <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                          <option value={2}>⭐⭐ (2 - Needs Improvement)</option>
                          <option value={1}>⭐ (1 - Incomplete)</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Share actionable feedback, architecture insights, suggestions..."
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl text-xs text-gray-200 p-3 focus:outline-none focus:border-indigo-500 placeholder-gray-500"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={feedbackLoading || !feedbackComment.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        {feedbackLoading ? 'Posting...' : 'Post Feedback'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
