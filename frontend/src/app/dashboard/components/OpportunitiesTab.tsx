'use client';

import React, { useState } from 'react';
import {
  SavedOpportunityItem,
  OpportunityItem,
  ApplicationItem,
} from '../types';

interface OpportunitiesTabProps {
  savedOpportunities: SavedOpportunityItem[];
  catalog: OpportunityItem[];
  applications: ApplicationItem[];
  onSaveOpportunity: (oppId: string) => Promise<{ success: boolean; error?: string }>;
  onRemoveSavedOpportunity: (id: string) => Promise<{ success: boolean; error?: string }>;
  onApplyOpportunity: (oppId: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
}

export default function OpportunitiesTab({
  savedOpportunities,
  catalog,
  applications,
  onSaveOpportunity,
  onRemoveSavedOpportunity,
  onApplyOpportunity,
}: OpportunitiesTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applyModalOpp, setApplyModalOpp] = useState<OpportunityItem | null>(null);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busyOppId, setBusyOppId] = useState<string | null>(null);

  // Check which opportunities the user has applied to
  const appliedOppIds = new Set(applications.map((a) => a.opportunityId));
  // Check which opportunities are saved
  const savedOppIds = new Set(savedOpportunities.map((s) => s.opportunityId));

  const categories = ['all', 'grant', 'mentorship', 'accelerator', 'internship', 'project'];

  // Filter catalog
  const filteredCatalog = catalog.filter((opp) => {
    const matchesCategory = activeCategory === 'all' || opp.category === activeCategory;
    const matchesQuery =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleToggleSave = async (oppId: string) => {
    setBusyOppId(oppId);
    setActionMsg(null);
    try {
      if (savedOppIds.has(oppId)) {
        const res = await onRemoveSavedOpportunity(oppId);
        if (res.success) {
          setActionMsg({ type: 'success', text: 'Removed from watchlist.' });
        } else {
          setActionMsg({ type: 'error', text: res.error || 'Failed to remove from watchlist.' });
        }
      } else {
        const res = await onSaveOpportunity(oppId);
        if (res.success) {
          setActionMsg({ type: 'success', text: 'Added to your watchlist!' });
        } else {
          setActionMsg({ type: 'error', text: res.error || 'Failed to save opportunity.' });
        }
      }
    } catch {
      setActionMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setBusyOppId(null);
    }
  };

  const handleOpenApplyModal = (opp: OpportunityItem) => {
    setApplyModalOpp(opp);
    setApplicationNotes('');
    setActionMsg(null);
  };

  const handleConfirmApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalOpp) return;

    setSubmittingApp(true);
    try {
      const res = await onApplyOpportunity(applyModalOpp.id, applicationNotes);
      if (res.success) {
        setActionMsg({
          type: 'success',
          text: `Application for "${applyModalOpp.title}" submitted successfully! Check your Activity & Applications tracker.`,
        });
        setApplyModalOpp(null);
      } else {
        setActionMsg({ type: 'error', text: res.error || 'Failed to submit application.' });
      }
    } catch {
      setActionMsg({ type: 'error', text: 'Network error submitting application.' });
    } finally {
      setSubmittingApp(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ── Header Notice ────────────────────────────────────────────────── */}
      {actionMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
            actionMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          }`}
        >
          <span>{actionMsg.type === 'success' ? '✓ ' : '⚠️ '}{actionMsg.text}</span>
          <button onClick={() => setActionMsg(null)} className="text-white/50 hover:text-white">✕</button>
        </div>
      )}

      {/* ── 1. Saved Watchlist Section ───────────────────────────────────── */}
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white">Saved Watchlist</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {savedOpportunities.length} Bookmarked
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Initiatives and funding deadlines saved to your personal tracking board.
            </p>
          </div>
        </div>

        {savedOpportunities.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white/[0.01] border border-dashed border-white/[0.08]">
            <span className="text-3xl block mb-2">⭐</span>
            <h4 className="text-sm font-semibold text-white">Your watchlist is empty</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
              Browse the curated catalog below and click the Bookmark icon on initiatives you want to track or apply for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedOpportunities.map((saved) => {
              const opp = catalog.find((c) => c.id === saved.opportunityId) || {
                id: saved.opportunityId,
                title: saved.title,
                organization: saved.organization,
                category: saved.category as any,
                location: saved.location,
                deadline: saved.deadline,
                description: saved.description,
                tags: saved.tags,
                targetRoles: [],
              };
              const isApplied = appliedOppIds.has(saved.opportunityId);

              return (
                <div
                  key={saved.id}
                  className="rounded-2xl bg-white/[0.02] border border-white/[0.07] p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {saved.category}
                      </span>
                      <button
                        onClick={() => handleToggleSave(saved.opportunityId)}
                        disabled={busyOppId === saved.opportunityId}
                        className="text-amber-400 hover:text-rose-400 text-xs transition-colors p-1"
                        title="Remove from watchlist"
                      >
                        ★ Saved
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {saved.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">{saved.organization}</p>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{saved.description}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-3">Deadline: {saved.deadline}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleSave(saved.opportunityId)}
                      className="text-xs text-gray-400 hover:text-rose-300"
                    >
                      Remove
                    </button>

                    {isApplied ? (
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        ✓ Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenApplyModal(opp)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md"
                      >
                        Apply Now →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 2. Curated Initiatives Catalog ─────────────────────────────────── */}
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Ecosystem Opportunities Catalog</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Verified partner grants, deep tech fellowships, mentorship circles, and capital programs.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full lg:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search initiatives, tags, sponsors..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/[0.03] hover:bg-white/[0.07] text-gray-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat === 'all' ? 'All Opportunities' : cat}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredCatalog.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-500 text-xs">
              No opportunities match your filter or search query.
            </div>
          ) : (
            filteredCatalog.map((opp) => {
              const isSaved = savedOppIds.has(opp.id);
              const isApplied = appliedOppIds.has(opp.id);

              return (
                <div
                  key={opp.id}
                  className="rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.14] p-5 sm:p-6 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                          {opp.category}
                        </span>
                        <span className="text-xs text-gray-400">📍 {opp.location}</span>
                      </div>

                      <button
                        onClick={() => handleToggleSave(opp.id)}
                        disabled={busyOppId === opp.id}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          isSaved
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove Bookmark' : 'Bookmark Opportunity'}
                      >
                        {isSaved ? '★ Saved' : '☆ Save'}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mt-1">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-indigo-400 font-medium mt-0.5">{opp.organization}</p>
                    <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">{opp.description}</p>

                    {/* Reward Badge */}
                    {opp.reward && (
                      <div className="mt-3.5 inline-block text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                        🎁 {opp.reward}
                      </div>
                    )}

                    {/* Tag Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {opp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/[0.04] text-gray-400 border border-white/[0.06]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-500 font-mono">Deadline: {opp.deadline}</span>

                    {isApplied ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                        ✓ Application Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenApplyModal(opp)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
                      >
                        Submit Application →
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Apply Modal ───────────────────────────────────────────────────── */}
      {applyModalOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1322] border border-white/[0.12] p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setApplyModalOpp(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white text-lg p-1"
            >
              ✕
            </button>

            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              {applyModalOpp.category} Application
            </span>

            <h3 className="text-lg font-bold text-white mt-2">{applyModalOpp.title}</h3>
            <p className="text-xs text-indigo-400 font-medium">{applyModalOpp.organization}</p>

            <form onSubmit={handleConfirmApplication} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Statement of Interest / Pitch Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Outline why you are the ideal applicant, relevant experience, or links to your work..."
                />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-gray-400 space-y-1">
                <p>• Your verified member profile credentials will be automatically attached.</p>
                <p>• The partner organization will receive your contact details and active documents.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpp(null)}
                  disabled={submittingApp}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  {submittingApp ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Confirm & Submit</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
