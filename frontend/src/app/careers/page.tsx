'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CareersHero from './components/CareersHero';
import CareerFilters, { FilterState } from './components/CareerFilters';
import OpportunityCard from './components/OpportunityCard';
import Pagination from './components/Pagination';
import ApplyModal from './components/ApplyModal';
import { CareerOpportunity } from '@/app/lib/careers';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

export default function CareersPage() {
  const { user } = useAuth();
  const [, startTransition] = useTransition();

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    q: '',
    role: 'all',
    category: 'all',
    employmentType: 'all',
    experience: 'all',
    location: 'all',
    remoteOnly: false,
    sortBy: 'newest',
    source: 'all'
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  // Data & States
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1-Click Apply Modal State
  const [applyTarget, setApplyTarget] = useState<CareerOpportunity | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Active filters count
  const activeFiltersCount =
    (filters.q ? 1 : 0) +
    (filters.role !== 'all' ? 1 : 0) +
    (filters.category !== 'all' ? 1 : 0) +
    (filters.employmentType !== 'all' ? 1 : 0) +
    (filters.experience !== 'all' ? 1 : 0) +
    (filters.location !== 'all' ? 1 : 0) +
    (filters.source !== 'all' ? 1 : 0) +
    (filters.remoteOnly ? 1 : 0);

  // Fetch opportunities
  const loadCareers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.role !== 'all') params.set('role', filters.role);
      if (filters.category !== 'all') params.set('category', filters.category);
      if (filters.employmentType !== 'all') params.set('employmentType', filters.employmentType);
      if (filters.experience !== 'all') params.set('experience', filters.experience);
      if (filters.location !== 'all') params.set('location', filters.location);
      if (filters.remoteOnly) params.set('remoteOnly', 'true');
      if (filters.source && filters.source !== 'all') params.set('source', filters.source);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const res = await fetch(`/api/careers?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load career listings from API feed.');

      const data = await res.json();
      setOpportunities(data.items || []);
      setPagination(data.pagination || {
        page: 1,
        limit,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      });
    } catch (err: any) {
      console.error('Careers load error:', err);
      setError(err.message || 'Error connecting to live career feed.');
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  // Load saved opportunities for user
  const loadSavedOpportunities = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/careers/saved');
      if (res.ok) {
        const data = await res.json();
        setSavedIds(new Set(data.savedIds || []));
      }
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    loadCareers();
  }, [loadCareers]);

  useEffect(() => {
    loadSavedOpportunities();
  }, [loadSavedOpportunities]);

  // Handle filter changes (resets to page 1)
  const handleFilterChange = (updates: Partial<FilterState>) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, ...updates }));
      setPage(1);
    });
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      role: 'all',
      category: 'all',
      employmentType: 'all',
      experience: 'all',
      location: 'all',
      remoteOnly: false,
      sortBy: 'newest',
      source: 'all'
    });
    setPage(1);
  };

  // Toggle save
  const handleToggleSave = async (careerId: string) => {
    if (!user) {
      window.location.href = `/auth/login?redirect=/careers`;
      return;
    }

    // Optimistic UI update
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(careerId)) next.delete(careerId);
      else next.add(careerId);
      return next;
    });

    try {
      const res = await fetch(`/api/careers/${careerId}/save`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (data.saved) next.add(careerId);
        else next.delete(careerId);
        return next;
      });
    } catch {
      loadSavedOpportunities();
    }
  };

  const handleSkillClick = (skill: string) => {
    handleFilterChange({ q: skill });
  };

  const handleApplyClick = (career: CareerOpportunity) => {
    setApplyTarget(career);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#141413] selection:bg-[#ea4e1b]/15 selection:text-[#ea4e1b]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <CareersHero
          onSearchTag={(tag) => handleFilterChange({ q: tag })}
          userRole={user?.role}
        />

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Feed Live Status Header Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 px-1">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-stone-600">
                Live Opportunity Feed Active
              </span>
              <span className="text-[11px] text-stone-400 font-medium">
                • {pagination.total} positions available
              </span>
            </div>

            <div className="text-xs text-stone-500 font-medium">
              Verified roles from Nexus Ecosystem &amp; Frontier Tech Partners
            </div>
          </div>

          {/* Filters Bar */}
          <CareerFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            activeCount={activeFiltersCount}
          />

          {/* Error Banner with Retry */}
          {error && (
            <div className="p-6 mb-8 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-900 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-sm">Unable to sync live opportunities</h4>
                  <p className="text-xs text-amber-700 mt-0.5">{error}</p>
                </div>
              </div>
              <button
                onClick={loadCareers}
                className="px-5 py-2.5 bg-[#ea4e1b] hover:bg-[#d43b0c] text-white rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                Retry Feed Sync
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-[#f0ede6] rounded-[28px] p-6 sm:p-7 h-[420px] flex flex-col justify-between luxury-card-shadow"
                >
                  <div>
                    {/* Header skeleton */}
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-stone-200/70" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-stone-200/70 rounded-md w-3/5" />
                        <div className="h-3 bg-stone-200/50 rounded-md w-2/5" />
                      </div>
                    </div>
                    {/* Title skeleton */}
                    <div className="h-6 bg-stone-200/70 rounded-md w-4/5 mb-3" />
                    <div className="h-4 bg-stone-200/40 rounded-md w-2/3 mb-4" />
                    {/* Badge pills skeleton */}
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-16 bg-stone-200/60 rounded-full" />
                      <div className="h-6 w-20 bg-stone-200/60 rounded-full" />
                      <div className="h-6 w-28 bg-stone-200/60 rounded-full" />
                    </div>
                    {/* Description skeleton */}
                    <div className="space-y-2 mb-5">
                      <div className="h-3 bg-stone-200/50 rounded-md w-full" />
                      <div className="h-3 bg-stone-200/40 rounded-md w-4/5" />
                    </div>
                    {/* Skills pills skeleton */}
                    <div className="flex gap-1.5">
                      <div className="h-5 w-16 bg-stone-200/50 rounded-md" />
                      <div className="h-5 w-20 bg-stone-200/50 rounded-md" />
                      <div className="h-5 w-14 bg-stone-200/50 rounded-md" />
                    </div>
                  </div>
                  {/* Footer skeleton */}
                  <div className="pt-4 border-t border-[#f0ede6] flex items-center justify-between">
                    <div className="h-4 w-24 bg-stone-200/60 rounded-md" />
                    <div className="h-9 w-28 bg-stone-200/70 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Opportunity Grid */}
          {!loading && !error && opportunities.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((career) => (
                  <OpportunityCard
                    key={career.id}
                    career={career}
                    isSaved={savedIds.has(career.id)}
                    onToggleSave={handleToggleSave}
                    onSkillClick={handleSkillClick}
                    onApply={handleApplyClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
              />
            </>
          )}

          {/* Empty State */}
          {!loading && !error && opportunities.length === 0 && (
            <div className="text-center py-20 px-4 bg-white border border-[#f0ede6] rounded-[32px] luxury-card-shadow">
              <div className="w-16 h-16 rounded-2xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center text-3xl mx-auto mb-4 border border-[#ea4e1b]/20">
                🔍
              </div>
              <h3 className="text-xl font-bold text-[#141413] mb-2">
                No matching opportunities found
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
                We couldn&apos;t find any roles matching your current search criteria. Try loosening your filters or switch to All Roles to view partner feeds.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-[#ea4e1b] hover:bg-[#d43b0c] text-white rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Clear All Filters
                </button>
                <Link
                  href="/careers/post"
                  className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-full text-xs font-semibold transition-all"
                >
                  Post an Opportunity
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 1-Click Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setApplyTarget(null);
        }}
        career={applyTarget}
        user={user}
        onSuccess={() => {
          // Increment candidate counter or reload
          loadCareers();
        }}
      />

      <Footer />
    </div>
  );
}
