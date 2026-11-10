'use client';

import React from 'react';
import Link from 'next/link';
import { CareerOpportunity } from '@/app/lib/careers';

interface OpportunityCardProps {
  career: CareerOpportunity;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSkillClick?: (skill: string) => void;
  onApply?: (career: CareerOpportunity) => void;
}

export default function OpportunityCard({
  career,
  isSaved = false,
  onToggleSave,
  onSkillClick,
  onApply
}: OpportunityCardProps) {
  // Brand matched category badge styling
  const categoryColors: Record<string, string> = {
    internship: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    job: 'bg-[#ea4e1b]/10 text-[#ea4e1b] border-[#ea4e1b]/20',
    fellowship: 'bg-purple-50 text-purple-700 border-purple-200',
    contract: 'bg-amber-50 text-amber-700 border-amber-200'
  };

  const badgeStyle = categoryColors[career.category] || 'bg-stone-100 text-stone-700 border-stone-200';

  // Generate initials for organization avatar
  const initials = career.organization
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'NX';

  const formattedDate = new Date(career.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isExternal = Boolean(career.isExternal);

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-[#f0ede6] hover:border-[#ea4e1b]/50 rounded-[28px] p-6 sm:p-7 luxury-card-shadow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Featured Ribbon / Live Partner Badge */}
      {career.featured ? (
        <div className="absolute -top-3 left-6 px-3.5 py-0.5 bg-gradient-to-r from-[#ea4e1b] to-[#f97316] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-xs">
          ⭐ Featured Role
        </div>
      ) : isExternal ? (
        <div className="absolute -top-3 left-6 px-3 py-0.5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1">
          <span className="text-[#ea4e1b]">⚡</span>
          <span>Partner Role</span>
        </div>
      ) : null}

      {/* Top section */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center font-bold text-base border border-[#ea4e1b]/20 shadow-xs shrink-0">
              {initials}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#141413] group-hover:text-[#ea4e1b] transition-colors leading-tight">
                {career.organization}
              </h4>
              <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5 font-medium">
                <span>{career.department}</span>
                {isExternal && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded">
                    External
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSave?.(career.id);
            }}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-rose-50 text-rose-600 border-rose-300'
                : 'text-stone-400 hover:text-rose-500 border-stone-200 hover:border-rose-200'
            }`}
          >
            <svg
              className="w-4 h-4 fill-current transition-transform duration-200 active:scale-125"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isSaved ? 0 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Title */}
        <Link href={`/careers/${career.id}`} className="block">
          <h3 className="text-lg font-bold text-[#141413] line-clamp-2 mb-2.5 group-hover:text-[#ea4e1b] transition-colors leading-snug">
            {career.title}
          </h3>
        </Link>

        {/* Pills: Type, Remote, Salary */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs">
          <span className={`px-2.5 py-1 rounded-full font-semibold border ${badgeStyle} capitalize text-[11px]`}>
            {career.category}
          </span>
          <span className="px-2.5 py-1 rounded-full font-medium bg-stone-100 text-stone-700 border border-stone-200 capitalize text-[11px]">
            {career.employmentType.replace('-', ' ')}
          </span>
          {career.isRemote && (
            <span className="px-2.5 py-1 rounded-full font-medium bg-sky-50 text-sky-700 border border-sky-200 text-[11px]">
              Remote
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full font-semibold bg-[#ea4e1b]/5 text-[#ea4e1b] border border-[#ea4e1b]/20 font-mono text-[11px]">
            {career.salaryRange}
          </span>
        </div>

        {/* Location & Experience */}
        <div className="flex items-center gap-3 text-xs text-stone-500 mb-3.5 font-medium">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {career.location}
          </span>
          <span>•</span>
          <span className="capitalize">{career.experienceLevel} level</span>
        </div>

        {/* Brief description */}
        <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
          {career.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {career.skills.slice(0, 4).map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => onSkillClick?.(skill)}
              className="text-[11px] px-2.5 py-1 bg-[#fbfaf8] hover:bg-[#ea4e1b]/10 text-stone-600 hover:text-[#ea4e1b] rounded-lg border border-stone-200 hover:border-[#ea4e1b]/30 transition-colors font-medium cursor-pointer"
            >
              #{skill}
            </button>
          ))}
          {career.skills.length > 4 && (
            <span className="text-[11px] text-stone-400 px-1 py-1 font-medium">
              +{career.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer info & Dual Action CTA */}
      <div className="pt-4 border-t border-[#f0ede6] flex items-center justify-between text-xs gap-3">
        <div className="text-stone-500 min-w-0">
          <span className="truncate block">Deadline: <span className="text-stone-800 font-semibold">{formattedDate}</span></span>
          <span className="block text-[11px] text-stone-400 mt-0.5 font-medium">
            {career.applicantCount} {career.applicantCount === 1 ? 'applicant' : 'applicants'}
          </span>
        </div>

        {/* Dual Action Flow */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/careers/${career.id}`}
            className="px-2.5 py-2 text-stone-500 hover:text-[#141413] text-xs font-semibold transition-colors"
          >
            Details
          </Link>

          {isExternal ? (
            <a
              href={career.applyUrl || `https://www.google.com/search?q=${encodeURIComponent(career.title + ' ' + career.organization + ' jobs')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141413] hover:bg-[#ea4e1b] text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Apply externally on employer portal"
            >
              <span>Apply on Site</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onApply?.(career)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>1-Click Apply</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">Nexus ID</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
