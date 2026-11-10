'use client';

import React, { useState } from 'react';
import { FOUNDER_INFO } from '@/app/lib/communityTypes';

export default function FounderConnectSection() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <section id="founder-connect" className="relative my-12 overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-gray-900/95 via-gray-950 to-black p-6 sm:p-10 text-white shadow-2xl backdrop-blur-xl">
      {/* Decorative ambient gradient glows */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-800/80 pb-8 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Official Ecosystem Nexus
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-indigo-200 bg-clip-text text-transparent">
              Connect With NexusHub & Its Founder
            </h2>
            <p className="mt-2 text-gray-400 text-sm sm:text-base leading-relaxed">
              Engage directly with NexusHub founder <span className="text-indigo-300 font-semibold">Mahidhar</span> and join our verified official communication channels to stay ahead with real-time updates, advisory sessions, and collaboration tracks.
            </p>
          </div>

          {/* Founder Identity Card Summary */}
          <div className="flex items-center gap-4 bg-gray-800/40 border border-gray-700/60 p-4 rounded-2xl backdrop-blur-md shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25">
                M
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-[10px]" title="Verified Founder">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">{FOUNDER_INFO.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-medium">
                  Founder
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{FOUNDER_INFO.role}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active in Community
              </div>
            </div>
          </div>
        </div>

        {/* 4 Official Connection Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. WhatsApp Channel */}
          <div className="group relative rounded-2xl border border-gray-800 bg-gray-900/60 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-gray-800/50 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {/* WhatsApp SVG Icon */}
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 2C6.516 2 2.031 6.484 2.031 12c0 1.944.555 3.766 1.517 5.309L2 22l4.839-1.503c1.488.85 3.2 1.328 5.192 1.328 5.516 0 10-4.484 10-10s-4.484-10-10-10zm0 18.25c-1.688 0-3.252-.469-4.594-1.281l-.328-.203-3.031.944.961-2.953-.219-.344a8.216 8.216 0 01-1.32-4.406c0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25 0 4.55-3.7 8.25-8.25 8.25zm4.516-6.172c-.25-.125-1.469-.727-1.695-.812-.227-.086-.391-.125-.555.125-.164.25-.641.812-.789.977-.148.164-.297.188-.547.062s-1.055-.387-2.016-1.242c-.742-.664-1.242-1.484-1.391-1.734-.148-.25-.016-.383.109-.508.113-.113.25-.297.375-.445.125-.148.164-.25.25-.414.086-.164.043-.312-.02-.438-.063-.125-.555-1.336-.762-1.828-.2-.484-.406-.414-.555-.422-.145-.008-.312-.008-.48-.008-.168 0-.441.063-.672.312-.23.25-.883.863-.883 2.102 0 1.238.902 2.438 1.027 2.602.125.164 1.773 2.707 4.297 3.797.6.258 1.066.414 1.43.531.602.195 1.15.168 1.586.102.484-.074 1.469-.602 1.68-1.18.211-.578.211-1.07.148-1.18-.063-.109-.227-.172-.477-.297z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Official Broadcast
                  </span>
                  <button
                    onClick={(e) => handleCopy('https://whatsapp.com/channel/0029VbBhwMJ0AgW4DyiKl40q', e)}
                    className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors text-xs"
                    title="Copy Link"
                  >
                    {copiedUrl === 'https://whatsapp.com/channel/0029VbBhwMJ0AgW4DyiKl40q' ? '✓ Copied' : '⎘ Copy'}
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                NexusHub WhatsApp Channel
              </h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Stay updated with immediate broadcast alerts, sprint announcements, platform releases, and daily curated ecosystem opportunities on WhatsApp.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">whatsapp.com/channel/...</span>
              <a
                href="https://whatsapp.com/channel/0029VbBhwMJ0AgW4DyiKl40q"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/25 transition-all transform active:scale-95"
              >
                Join Channel
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* 2. Telegram Space */}
          <div className="group relative rounded-2xl border border-gray-800 bg-gray-900/60 p-6 transition-all duration-300 hover:border-sky-500/50 hover:bg-gray-800/50 hover:shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {/* Telegram SVG Icon */}
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    Follow & Read More
                  </span>
                  <button
                    onClick={(e) => handleCopy('https://t.me/aMKEo1zdyzk1Njdl', e)}
                    className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors text-xs"
                    title="Copy Link"
                  >
                    {copiedUrl === 'https://t.me/aMKEo1zdyzk1Njdl' ? '✓ Copied' : '⎘ Copy'}
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                Telegram — Follow & Read More
              </h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Join our Telegram channel for developer logs, architectural deep dives, open community discussions, and direct commentary from the core NexusHub builders.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">t.me/aMKEo1zdyzk1...</span>
              <a
                href="https://t.me/aMKEo1zdyzk1Njdl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/25 transition-all transform active:scale-95"
              >
                Open Telegram
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* 3. Topmate — Mahidhar */}
          <div className="group relative rounded-2xl border border-gray-800 bg-gray-900/60 p-6 transition-all duration-300 hover:border-rose-500/50 hover:bg-gray-800/50 hover:shadow-xl hover:shadow-rose-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {/* Topmate / Star / Calendar Icon */}
                  <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    1:1 Mentorship & Advisory
                  </span>
                  <button
                    onClick={(e) => handleCopy('https://topmate.io/mahidhar_07', e)}
                    className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors text-xs"
                    title="Copy Link"
                  >
                    {copiedUrl === 'https://topmate.io/mahidhar_07' ? '✓ Copied' : '⎘ Copy'}
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                Topmate — Mahidhar’s Profile
              </h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Schedule personal 1-on-1 advisory sessions with founder Mahidhar. Topics include project roadmap reviews, startup architecture, engineering transitions, and portfolio critique.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">topmate.io/mahidhar_07</span>
              <a
                href="https://topmate.io/mahidhar_07"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-600/25 transition-all transform active:scale-95"
              >
                Book 1:1 on Topmate
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* 4. LinkedIn — Mahidhar */}
          <div className="group relative rounded-2xl border border-gray-800 bg-gray-900/60 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/50 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {/* LinkedIn SVG Icon */}
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    Professional Network
                  </span>
                  <button
                    onClick={(e) => handleCopy('https://www.linkedin.com/in/mahidhar07/', e)}
                    className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors text-xs"
                    title="Copy Link"
                  >
                    {copiedUrl === 'https://www.linkedin.com/in/mahidhar07/' ? '✓ Copied' : '⎘ Copy'}
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                LinkedIn — Mahidhar’s Profile
              </h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Connect on LinkedIn for executive partnerships, ecosystem alliances, tech thought leadership, and institutional collaborations across the NexusHub network.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">linkedin.com/in/mahidhar07</span>
              <a
                href="https://www.linkedin.com/in/mahidhar07/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all transform active:scale-95"
              >
                Connect on LinkedIn
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
