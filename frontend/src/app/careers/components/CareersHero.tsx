'use client';

import React from 'react';
import Link from 'next/link';

interface CareersHeroProps {
  onSearchTag?: (tag: string) => void;
  userRole?: string;
}

export default function CareersHero({ onSearchTag, userRole }: CareersHeroProps) {
  const isRecruiter = ['founder', 'professional', 'admin'].includes(userRole || '');

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-[#f0ede6] bg-[#fbfaf8]">
      {/* Subtle warm ambient glow matching homepage */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#fed7aa]/35 via-[#fde68a]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top announcement badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200/90 bg-white/80 backdrop-blur-sm shadow-xs mb-8">
          <svg className="w-3.5 h-3.5 text-[#ea4e1b]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
          </svg>
          <span className="text-[11px] font-bold tracking-wider text-stone-700 uppercase">
            NEXUSHUB VERIFIED CAREERS &amp; INTERNSHIPS • 2026 SEASON
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-extrabold tracking-[-0.035em] text-[#141413] leading-[1.08] mb-6 max-w-4xl mx-auto">
          Accelerate Your Tech Journey with <br className="hidden sm:inline" />
          <span className="font-editorial-italic font-normal italic text-[#ea4e1b]">High-Impact Opportunities</span>.
        </h1>

        <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
          Discover vetted engineering roles, AI research fellowships, design positions, and funded startup internships. Direct recruiter access with zero ghosting for verified NexusHub members.
        </p>

        {/* Fast CTA & navigation row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <Link
            href="/careers/applications"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>📋</span>
            <span>Track My Applications</span>
          </Link>

          {isRecruiter ? (
            <Link
              href="/careers/post"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>+ Post Opportunity</span>
            </Link>
          ) : (
            <Link
              href="/careers/post"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>💼 For Recruiters / Founders</span>
              <span className="text-base font-bold">→</span>
            </Link>
          )}

          {isRecruiter && (
            <Link
              href="/careers/manage"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>👥 Manage Candidates</span>
            </Link>
          )}
        </div>

        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-9">
          <div className="bg-white/90 border border-[#f0ede6] rounded-2xl px-3.5 py-2.5 luxury-badge-shadow flex items-center justify-center gap-2 text-xs font-semibold text-stone-800">
            <span className="text-base text-[#ea4e1b]">⚡</span>
            <span>Direct Recruiter Review</span>
          </div>
          <div className="bg-white/90 border border-[#f0ede6] rounded-2xl px-3.5 py-2.5 luxury-badge-shadow flex items-center justify-center gap-2 text-xs font-semibold text-stone-800">
            <span className="text-base text-[#ea4e1b]">🛡️</span>
            <span>100% Verified Positions</span>
          </div>
          <div className="bg-white/90 border border-[#f0ede6] rounded-2xl px-3.5 py-2.5 luxury-badge-shadow flex items-center justify-center gap-2 text-xs font-semibold text-stone-800">
            <span className="text-base text-[#ea4e1b]">🚀</span>
            <span>Zero Ghosting Guarantee</span>
          </div>
          <div className="bg-white/90 border border-[#f0ede6] rounded-2xl px-3.5 py-2.5 luxury-badge-shadow flex items-center justify-center gap-2 text-xs font-semibold text-stone-800">
            <span className="text-base text-[#ea4e1b]">🎓</span>
            <span>Student-to-Founder Track</span>
          </div>
        </div>

        {/* Quick popular tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Trending searches:</span>
          {['Next.js', 'PyTorch', 'Agentic AI', 'Figma', 'TypeScript', 'Remote Internship', 'Bengaluru'].map((tag) => (
            <button
              key={tag}
              onClick={() => onSearchTag?.(tag)}
              className="px-3 py-1 rounded-full bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#ea4e1b] text-stone-700 hover:text-[#ea4e1b] transition-all shadow-2xs font-medium cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
