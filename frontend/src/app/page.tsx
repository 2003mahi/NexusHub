'use client';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbfaf8] text-[#141413] overflow-hidden selection:bg-[#ea4e1b]/15 selection:text-[#ea4e1b]">

        {/* ========================================================================= */}
        {/* HERO SECTION: Exactly matching reference composition & luxury quality     */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Subtle warm ambient glow behind hero */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#fed7aa]/20 via-[#fde68a]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Headline, Description, CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">

              {/* Badge above Headline */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-200/90 bg-white/80 backdrop-blur-sm shadow-xs mb-8">
                <svg className="w-3.5 h-3.5 text-[#ea4e1b]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
                </svg>
                <span className="text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                  INDIA&apos;S VERIFIED STUDENT-TO-FOUNDER ECOSYSTEM
                </span>
              </div>

              {/* Impactful Headline with luxury italic serif accent */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-[-0.035em] text-[#141413] leading-[1.06] mb-7">
                From Students<br />
                to <span className="font-editorial-italic font-normal italic text-[#ea4e1b]">Founders</span>.
              </h1>

              {/* Subheadline / Description */}
              <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-xl mb-10">
                NexusHub is India&apos;s growing ecosystem connecting students, founders, professionals, recruiters, investors and innovators — through verified identities, meaningful opportunities, practical learning and real-world collaboration.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Link
                  href="/get-verified"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-base font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Get Verified</span>
                  <span className="text-lg font-bold">→</span>
                </Link>

                <Link
                  href="/ecosystem"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-base font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Initiatives
                </Link>
              </div>

              {/* Trust Subtext */}
              <p className="text-xs text-stone-500 font-medium tracking-tight">
                Free · Human-reviewed · One Nexus ID for life
              </p>
            </div>

            {/* Right Column: Member Identity Card with overlapping floating badges */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-[420px]">

                {/* Floating Badge 1 (Top-Right): Community Badge */}
                <div className="absolute -top-6 -right-3 sm:-right-6 z-20 bg-white/95 backdrop-blur-md border border-[#f0ede6] rounded-2xl px-4 py-3 luxury-badge-shadow flex items-center gap-3.5 animate-float-badge-1">
                  <div className="w-10 h-10 rounded-xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 leading-tight">Community</div>
                    <div className="text-[11px] text-stone-500 font-medium mt-0.5">20,000+ verified members</div>
                  </div>
                </div>

                {/* Primary Card: NexusHub Member Identity Card */}
                <div className="bg-white border border-[#f0ede6] rounded-[28px] p-6 sm:p-7 luxury-card-shadow relative z-10 transition-transform duration-500 hover:scale-[1.01]">

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#171717] border border-stone-800 p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                        <Image
                          src="/logo.jpg"
                          alt="NexusHub Logo"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-900 leading-none">
                          nexushub<span className="text-[#ea4e1b]">.</span>
                        </div>
                        <div className="text-[10px] font-semibold text-stone-400 tracking-wider uppercase mt-1">MEMBER ID</div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff5f0] border border-[#fed7aa] text-[11px] font-semibold text-[#ea4e1b]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ea4e1b] animate-pulse"></span>
                      Verified
                    </span>
                  </div>

                  {/* Card Body: Portrait + Details */}
                  <div className="py-6 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-stone-100 shadow-sm flex-shrink-0 bg-stone-100">
                      <Image
                        src="/founder_avatar.jpg"
                        alt="Mahidhar A - Founder NexusHub"
                        fill
                        sizes="80px"
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 leading-snug">
                        Mahidhar A
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        Founder, NexusHub
                      </p>
                      <div className="font-mono text-[11px] font-semibold text-stone-400 tracking-widest mt-2 uppercase">
                        NEX-000001
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Initiative Badges */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    <Link
                      href="/labs"
                      className="flex-1 text-center py-2 px-3 rounded-full bg-stone-50 hover:bg-[#fff5f0] border border-stone-200/80 hover:border-[#fed7aa] text-[11px] font-bold text-stone-700 hover:text-[#ea4e1b] tracking-wider transition-colors uppercase"
                    >
                      LABS
                    </Link>
                    <Link
                      href="/community"
                      className="flex-1 text-center py-2 px-3 rounded-full bg-stone-50 hover:bg-[#fff5f0] border border-stone-200/80 hover:border-[#fed7aa] text-[11px] font-bold text-stone-700 hover:text-[#ea4e1b] tracking-wider transition-colors uppercase"
                    >
                      COMMUNITY
                    </Link>
                    <Link
                      href="/careers"
                      className="flex-1 text-center py-2 px-3 rounded-full bg-stone-50 hover:bg-[#fff5f0] border border-stone-200/80 hover:border-[#fed7aa] text-[11px] font-bold text-stone-700 hover:text-[#ea4e1b] tracking-wider transition-colors uppercase"
                    >
                      CAREERS
                    </Link>
                  </div>
                </div>

                {/* Floating Badge 2 (Bottom-Left): New Opportunity Badge */}
                <div className="absolute -bottom-6 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md border border-[#f0ede6] rounded-2xl px-4 py-3 luxury-badge-shadow flex items-center gap-3.5 animate-float-badge-2">
                  <div className="w-10 h-10 rounded-xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 leading-tight">New Opportunity</div>
                    <div className="text-[11px] text-stone-500 font-medium mt-0.5">Product Intern · Bengaluru</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* STATS & IMPACT ROW: Minimalist editorial counters                          */}
        {/* ========================================================================= */}
        <section className="py-12 border-y border-[#f0ede6] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#141413]">20,000+</div>
                <div className="text-xs sm:text-sm font-medium text-stone-500 mt-1 uppercase tracking-wider">
                  Verified Builders
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#ea4e1b]">₹1.8 Cr+</div>
                <div className="text-xs sm:text-sm font-medium text-stone-500 mt-1 uppercase tracking-wider">
                  Grants & Seed Capital
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#141413]">350+</div>
                <div className="text-xs sm:text-sm font-medium text-stone-500 mt-1 uppercase tracking-wider">
                  Verified Startups
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#141413]">100%</div>
                <div className="text-xs sm:text-sm font-medium text-stone-500 mt-1 uppercase tracking-wider">
                  Human-Reviewed Creds
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WHO WE SERVE: A community that mirrors the real world                      */}
        {/* ========================================================================= */}
        <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea4e1b]">
              WHO WE SERVE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#141413] tracking-tight mt-4 leading-tight">
              A community that mirrors the<br className="hidden sm:inline" /> real world.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Students */}
            <div className="bg-white border border-[#ece9e2] rounded-[26px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#ea4e1b]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#fff5f0] border border-[#fed7aa]/50 flex items-center justify-center text-[#ea4e1b] mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13.18v4c0 2.21 3.13 4 7 4s7-1.79 7-4v-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Students</h3>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">
                  Discover, learn and launch your career.
                </p>
              </div>
            </div>

            {/* Card 2: Founders */}
            <div className="bg-white border border-[#ece9e2] rounded-[26px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#ea4e1b]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#fff5f0] border border-[#fed7aa]/50 flex items-center justify-center text-[#ea4e1b] mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-4.05 11a22.4 22.4 0 01-3.95 2h0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12H4s.5-3 3-4l2 2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15v5s3-.5 4-3l-2-2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Founders</h3>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">
                  Find teammates, talent and early support.
                </p>
              </div>
            </div>

            {/* Card 3: Working Professionals */}
            <div className="bg-white border border-[#ece9e2] rounded-[26px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#ea4e1b]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#fff5f0] border border-[#fed7aa]/50 flex items-center justify-center text-[#ea4e1b] mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="3" y="7" width="18" height="13" rx="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v2m-9-3h18" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Working Professionals</h3>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">
                  Mentor, hire and give back.
                </p>
              </div>
            </div>

            {/* Card 4: Recruiters */}
            <div className="bg-white border border-[#ece9e2] rounded-[26px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#ea4e1b]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#fff5f0] border border-[#fed7aa]/50 flex items-center justify-center text-[#ea4e1b] mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <circle cx="10" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 20a7 7 0 0111.46-5.46" />
                    <circle cx="17.5" cy="16.5" r="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 19l2.5 2.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Recruiters</h3>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">
                  Access verified student talent.
                </p>
              </div>
            </div>

            {/* Card 5: Investors */}
            <div className="bg-white border border-[#ece9e2] rounded-[26px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#ea4e1b]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#fff5f0] border border-[#fed7aa]/50 flex items-center justify-center text-[#ea4e1b] mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <circle cx="12" cy="5" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15h4l3.5 2.5a2 2 0 002 0l4.5-3.5H21a2 2 0 012 2v1a3 3 0 01-3 3H7a4 4 0 01-4-4v-1z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11v4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Investors</h3>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">
                  Discover promising student founders early.
                </p>
              </div>
            </div>

            {/* Card 6: Colleges */}
            <div className="bg-white border border-[#ece9e2] rounded-[26px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#ea4e1b]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#fff5f0] border border-[#fed7aa]/50 flex items-center justify-center text-[#ea4e1b] mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="4" y="3" width="16" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h1m4 0h1m-6 4h1m4 0h1m-5 9v-4h4v4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Colleges</h3>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">
                  Extend campus reach into the ecosystem.
                </p>
              </div>
            </div>

            {/* Card 7: Organizations */}
            <div className="bg-white border border-[#ece9e2] rounded-[26px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#ea4e1b]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#fff5f0] border border-[#fed7aa]/50 flex items-center justify-center text-[#ea4e1b] mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M12 3L2 8h20L12 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Organizations</h3>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">
                  Partner on programs and initiatives.
                </p>
              </div>
            </div>

            {/* Card 8: Innovators */}
            <div className="bg-white border border-[#ece9e2] rounded-[26px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#ea4e1b]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#fff5f0] border border-[#fed7aa]/50 flex items-center justify-center text-[#ea4e1b] mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l10 5 10-5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 17l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Innovators</h3>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">
                  Build alongside a curious, verified community.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b] bg-[#fff5f0] border border-[#fed7aa]/60 px-3.5 py-1.5 rounded-full">
              The Nexus Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#141413] tracking-tight mt-4">
              Everything high-impact builders need to <span className="font-editorial-italic font-normal italic text-[#ea4e1b]">scale</span>.
            </h2>
            <p className="text-stone-600 text-base sm:text-lg mt-4 leading-relaxed">
              From college prototypes to venture-funded startups, NexusHub creates verified pathways at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1: Nexus Labs */}
            <Link
              href="/labs"
              className="bg-white border border-[#f0ede6] rounded-3xl p-8 hover:border-[#ea4e1b]/40 luxury-card-shadow transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#ea4e1b] transition-colors">
                    Nexus Labs
                  </h3>
                  <span className="text-[11px] font-semibold text-[#ea4e1b] bg-[#fff5f0] px-2.5 py-1 rounded-full border border-[#fed7aa]/50">
                    Collaborate
                  </span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  Build production-grade projects alongside top student engineers, designers, and product leaders with industry code reviews.
                </p>
              </div>
              <div className="flex items-center text-sm font-semibold text-[#ea4e1b] gap-1 group-hover:gap-2 transition-all">
                <span>Explore Labs</span>
                <span>→</span>
              </div>
            </Link>

            {/* Card 2: Nexus Community */}
            <Link
              href="/community"
              className="bg-white border border-[#f0ede6] rounded-3xl p-8 hover:border-[#ea4e1b]/40 luxury-card-shadow transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#ea4e1b] transition-colors">
                    Nexus Community
                  </h3>
                  <span className="text-[11px] font-semibold text-[#ea4e1b] bg-[#fff5f0] px-2.5 py-1 rounded-full border border-[#fed7aa]/50">
                    20,000+ Members
                  </span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  Join verified builders, discuss ideas, find co-founders, and collaborate on cutting-edge engineering projects.
                </p>
              </div>
              <div className="flex items-center text-sm font-semibold text-[#ea4e1b] gap-1 group-hover:gap-2 transition-all">
                <span>Join Community</span>
                <span>→</span>
              </div>
            </Link>

            {/* Card 3: Careers & Opportunities */}
            <Link
              href="/careers"
              className="bg-white border border-[#f0ede6] rounded-3xl p-8 hover:border-[#ea4e1b]/40 luxury-card-shadow transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#ea4e1b] transition-colors">
                    Careers Marketplace
                  </h3>
                  <span className="text-[11px] font-semibold text-[#ea4e1b] bg-[#fff5f0] px-2.5 py-1 rounded-full border border-[#fed7aa]/50">
                    Hiring
                  </span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  Skip the noise. High-growth startups recruit directly from verified NexusHub builders with validated code and proof-of-work.
                </p>
              </div>
              <div className="flex items-center text-sm font-semibold text-[#ea4e1b] gap-1 group-hover:gap-2 transition-all">
                <span>View Open Roles</span>
                <span>→</span>
              </div>
            </Link>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS: 4 Steps to Your Verified Journey                             */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-t border-[#f0ede6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#141413] tracking-tight mt-3">
                Four steps to your verified<br className="hidden sm:inline" /> journey.
              </h2>
            </div>

            <div className="relative">
              {/* Subtle connecting horizontal line behind cards */}
              <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-[1.5px] bg-[#f8d7c4] -translate-y-1/2 z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {/* Step 01 */}
                <div className="bg-white border border-[#f0ede6] rounded-[28px] p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ea4e1b] font-mono">
                        STEP 01
                      </span>
                      <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200/80 flex items-center justify-center text-stone-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Get Verified</h3>
                    <p className="text-sm text-stone-500 font-normal leading-relaxed">
                      Create your verified professional identity in under two minutes.
                    </p>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="bg-white border border-[#f0ede6] rounded-[28px] p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ea4e1b] font-mono">
                        STEP 02
                      </span>
                      <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200/80 flex items-center justify-center text-stone-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <circle cx="12" cy="5" r="2.2" />
                          <circle cx="6" cy="19" r="2.2" />
                          <circle cx="18" cy="19" r="2.2" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.2v4.3m0 0H6v5m6-5h6v5" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Join the Ecosystem</h3>
                    <p className="text-sm text-stone-500 font-normal leading-relaxed">
                      Connect with students, founders, professionals and organizations.
                    </p>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="bg-white border border-[#f0ede6] rounded-[28px] p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ea4e1b] font-mono">
                        STEP 03
                      </span>
                      <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200/80 flex items-center justify-center text-stone-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <circle cx="12" cy="12" r="9" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 9.172l-1.414 4.242-4.242 1.414 1.414-4.242 4.242-1.414z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Discover Opportunities</h3>
                    <p className="text-sm text-stone-500 font-normal leading-relaxed">
                      Internships, jobs, events, collaborations and learning programs.
                    </p>
                  </div>
                </div>

                {/* Step 04 */}
                <div className="bg-white border border-[#f0ede6] rounded-[28px] p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ea4e1b] font-mono">
                        STEP 04
                      </span>
                      <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200/80 flex items-center justify-center text-stone-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.5 4.5L21.75 7.5M21.75 7.5H16.5m5.25 0v5.25" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Build Your Future</h3>
                    <p className="text-sm text-stone-500 font-normal leading-relaxed">
                      Learn, collaborate, gain experience and grow your career.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* EDITORIAL CALL TO ACTION: Clean luxury invitation                          */}
        {/* ========================================================================= */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-b from-white to-[#fbfaf8] border border-[#f0ede6] rounded-3xl p-10 sm:p-16 luxury-card-shadow">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#141413] tracking-tight mb-4">
              Step into India&apos;s most ambitious <br className="hidden sm:inline" />
              <span className="font-editorial-italic font-normal italic text-[#ea4e1b]">student-to-founder</span> network.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto mb-8 leading-relaxed">
              Join 20,000+ verified peers, co-founders, and tech innovators shaping the next decade of startups.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/verification"
                className="px-8 py-3.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-base font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Verified Now →
              </Link>
              <Link
                href="/about"
                className="px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-base font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Read Our Story
              </Link>
            </div>
            <div className="mt-6 text-xs text-stone-400">
              Free forever for students · Takes less than 2 minutes
            </div>
          </div>
        </section>

      </main>

      {/* Floating Nexus Navigator AI (matching the bottom-right badge from reference) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setAiModalOpen(true)}
          className="bg-gradient-to-r from-[#ea4e1b] to-[#f97316] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
          </svg>
          <span>Nexus Navigator AI</span>
        </button>
      </div>

      {/* Nexus Navigator AI Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 border border-[#f0ede6] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ea4e1b] text-white flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">Nexus Navigator AI</div>
                  <div className="text-[11px] text-stone-500">Instant ecosystem guide</div>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-stone-600">
                Welcome to NexusHub. How can I guide you today?
              </p>
              <div className="grid gap-2">
                <Link
                  href="/verification"
                  onClick={() => setAiModalOpen(false)}
                  className="text-left text-xs p-3 rounded-xl bg-stone-50 hover:bg-[#fff5f0] border border-stone-200/60 hover:border-[#ea4e1b]/40 transition-colors text-stone-800"
                >
                  🚀 How do I get verified and claim my Member ID?
                </Link>
                <Link
                  href="/community"
                  onClick={() => setAiModalOpen(false)}
                  className="text-left text-xs p-3 rounded-xl bg-stone-50 hover:bg-[#fff5f0] border border-stone-200/60 hover:border-[#ea4e1b]/40 transition-colors text-stone-800"
                >
                  🤝 How do I join the verified builder community?
                </Link>
                <Link
                  href="/careers"
                  onClick={() => setAiModalOpen(false)}
                  className="text-left text-xs p-3 rounded-xl bg-stone-50 hover:bg-[#fff5f0] border border-stone-200/60 hover:border-[#ea4e1b]/40 transition-colors text-stone-800"
                >
                  💼 What internship & builder roles are currently hiring?
                </Link>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[10px] text-stone-400">Powered by NexusHub Intelligence</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
