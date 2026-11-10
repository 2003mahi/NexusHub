'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function VerificationLookup() {
  const [query, setQuery] = useState('NEX-000001');
  const [result, setResult] = useState<{
    status: string;
    name: string;
    role: string;
    id: string;
    avatar: string;
    verifiedSince: string;
    tags: string[];
  } | null>({
    status: 'Verified Member',
    name: 'Mahidhar A',
    role: 'Founder, NexusHub',
    id: 'NEX-000001',
    avatar: '/founder_avatar.jpg',
    verifiedSince: 'November 2024',
    tags: ['Founder', 'Nexus Labs', 'Ventures'],
  });
  const [loading, setLoading] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (query.trim().toLowerCase().includes('raj') || query.trim().toUpperCase().includes('000001') || query.trim() === '') {
        setResult({
          status: 'Verified Member',
          name: 'Mahidhar A',
          role: 'Founder, NexusHub',
          id: 'NEX-000001',
          avatar: '/founder_avatar.jpg',
          verifiedSince: 'November 2024',
          tags: ['Founder', 'Nexus Labs', 'Ventures'],
        });
      } else {
        setResult({
          status: 'Verified Member',
          name: query.trim(),
          role: 'Student Builder · Engineering',
          id: `NEX-${Math.floor(100000 + Math.random() * 900000)}`,
          avatar: '/founder_avatar.jpg',
          verifiedSince: 'Recent',
          tags: ['Active Builder', 'Verified Student'],
        });
      }
    }, 400);
  };

  return (
    <section id="lookup" className="py-12 scroll-mt-24">
      <div className="bg-white border border-[#f0ede6] rounded-3xl p-8 sm:p-12 luxury-card-shadow max-w-4xl mx-auto">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ea4e1b] bg-[#fff5f0] px-3 py-1 rounded-full border border-[#fed7aa]/50">
            Registry Check
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight mt-3">
            Public Member Registry Lookup
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            Verify any builder&apos;s credentials or Member ID in real-time.
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Member ID (e.g. NEX-000001) or Name"
            className="w-full px-5 py-3.5 rounded-full bg-[#fbfaf8] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ea4e1b] text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] flex-shrink-0 cursor-pointer"
          >
            {loading ? 'Verifying...' : 'Verify ID'}
          </button>
        </form>

        {result && (
          <div className="max-w-md mx-auto bg-[#fbfaf8] border border-[#f0ede6] rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ea4e1b]"></span>
                <span className="text-xs font-bold text-stone-900">NexusHub Verified Credential</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Active & Authenticated
              </span>
            </div>

            <div className="py-4 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white shadow-xs flex-shrink-0">
                <Image
                  src={result.avatar}
                  alt={result.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900">{result.name}</h4>
                <p className="text-xs text-stone-500 font-medium">{result.role}</p>
                <div className="font-mono text-xs font-bold text-[#ea4e1b] tracking-wider mt-1">
                  {result.id}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {result.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-medium bg-white text-stone-600 px-2.5 py-1 rounded-full border border-stone-200">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-stone-400 font-medium">Since {result.verifiedSince}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
