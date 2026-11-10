import React from 'react';
import Link from 'next/link';

export default function VerificationHero() {
  return (
    <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-200 bg-white shadow-xs mb-6">
        <svg className="w-3.5 h-3.5 text-[#ea4e1b]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
        <span className="text-[11px] font-bold tracking-wider text-stone-700 uppercase">
          NexusHub Member Verification
        </span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#141413] leading-[1.1] mb-6">
        One verified digital ID for your <br />
        <span className="font-editorial-italic font-normal italic text-[#ea4e1b]">entire builder journey</span>.
      </h1>

      <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
        NexusHub verification authenticates your skills, projects, and academic pedigree — giving you lifetime trust with recruiters, co-founders, and investors.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="#apply"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Begin Application</span>
          <span>→</span>
        </a>
        <a
          href="#lookup"
          className="px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-sm font-semibold shadow-xs transition-all hover:scale-[1.02]"
        >
          Lookup Existing ID
        </a>
      </div>

      <div className="mt-8 text-xs text-stone-500 font-medium">
        Free · Human-reviewed · Guaranteed within 48 hours
      </div>
    </section>
  );
}
