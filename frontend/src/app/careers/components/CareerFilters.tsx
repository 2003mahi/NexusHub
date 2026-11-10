'use client';

import React from 'react';

export interface FilterState {
  q: string;
  role: string;
  category: string;
  employmentType: string;
  experience: string;
  location: string;
  remoteOnly: boolean;
  sortBy: 'newest' | 'deadline' | 'applicants';
  source?: 'all' | 'nexus' | 'external';
}

interface CareerFiltersProps {
  filters: FilterState;
  onChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  activeCount: number;
}

const ROLES = [
  { value: 'all', label: 'All Domains' },
  { value: 'Software Engineering', label: 'Software Engineering' },
  { value: 'AI / Machine Learning', label: 'AI & Machine Learning' },
  { value: 'Product & Design', label: 'Product & Design' },
  { value: 'Cloud & DevOps', label: 'Cloud & DevOps' },
  { value: 'Security', label: 'Security & Trust' }
];

const EMPLOYMENT_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'full-time', label: 'Full-Time' },
  { value: 'internship', label: 'Internship' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'contract', label: 'Contract' }
];

const EXPERIENCE_LEVELS = [
  { value: 'all', label: 'All Experience' },
  { value: 'entry', label: 'Entry Level (0-1 yrs)' },
  { value: 'junior', label: 'Junior (1-3 yrs)' },
  { value: 'mid', label: 'Mid-Level (3-5 yrs)' },
  { value: 'senior', label: 'Senior (5+ yrs)' },
  { value: 'lead', label: 'Lead / Principal' }
];

export default function CareerFilters({
  filters,
  onChange,
  onReset,
  activeCount
}: CareerFiltersProps) {
  const currentSource = filters.source || 'all';

  return (
    <div className="bg-white border border-[#f0ede6] rounded-3xl p-6 luxury-card-shadow mb-8 transition-all">
      {/* Top search & sorting row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-5 border-b border-[#f0ede6]">
        {/* Search input with live update */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Search role, skills, company or location..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#fbfaf8] border border-stone-200/90 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 focus:border-[#ea4e1b] transition-all text-[#141413] placeholder-stone-400"
          />
          <svg
            className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {filters.q && (
            <button
              onClick={() => onChange({ q: '' })}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Source feed tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#fbfaf8] border border-stone-200/90 rounded-2xl">
          <button
            type="button"
            onClick={() => onChange({ source: 'all' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentSource === 'all'
                ? 'bg-white text-[#141413] shadow-xs border border-stone-200'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            All Roles
          </button>
          <button
            type="button"
            onClick={() => onChange({ source: 'external' })}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentSource === 'external'
                ? 'bg-white text-[#ea4e1b] shadow-xs border border-stone-200'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <span>⚡</span>
            <span>Live API Roles</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ source: 'nexus' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentSource === 'nexus'
                ? 'bg-white text-[#141413] shadow-xs border border-stone-200'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Nexus Direct
          </button>
        </div>

        {/* Sort and Reset controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-semibold whitespace-nowrap uppercase tracking-wider">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as any })}
              className="bg-[#fbfaf8] border border-stone-200/90 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#ea4e1b] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="deadline">Closing Soon</option>
              <option value="applicants">Most Popular</option>
            </select>
          </div>

          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#ea4e1b] hover:bg-[#ea4e1b]/10 rounded-full transition-colors border border-[#ea4e1b]/30 cursor-pointer"
            >
              <span>Reset Filters</span>
              <span className="w-4 h-4 rounded-full bg-[#ea4e1b] text-white text-[10px] flex items-center justify-center font-bold">
                {activeCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
        {/* Role Domain */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
            Role Domain
          </label>
          <select
            value={filters.role}
            onChange={(e) => onChange({ role: e.target.value })}
            className="w-full bg-[#fbfaf8] border border-stone-200/90 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 focus:border-[#ea4e1b] cursor-pointer"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
            Employment Type
          </label>
          <select
            value={filters.employmentType}
            onChange={(e) => onChange({ employmentType: e.target.value })}
            className="w-full bg-[#fbfaf8] border border-stone-200/90 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 focus:border-[#ea4e1b] cursor-pointer"
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
            Experience Level
          </label>
          <select
            value={filters.experience}
            onChange={(e) => onChange({ experience: e.target.value })}
            className="w-full bg-[#fbfaf8] border border-stone-200/90 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 focus:border-[#ea4e1b] cursor-pointer"
          >
            {EXPERIENCE_LEVELS.map((exp) => (
              <option key={exp.value} value={exp.value}>{exp.label}</option>
            ))}
          </select>
        </div>

        {/* Remote toggle & Location */}
        <div className="flex flex-col justify-end">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
            Work Preference
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ remoteOnly: !filters.remoteOnly })}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                filters.remoteOnly
                  ? 'bg-[#ea4e1b] text-white border-[#ea4e1b] shadow-sm'
                  : 'bg-[#fbfaf8] border-stone-200/90 text-stone-700 hover:border-stone-400'
              }`}
            >
              <span>🌐</span>
              <span>Remote / Distributed Only</span>
              {filters.remoteOnly && <span>✓</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
