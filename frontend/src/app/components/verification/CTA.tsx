import React from 'react';
import Link from 'next/link';

export default function VerificationCTA() {
  return (
    <section className="py-8 text-center" id="apply">
      <div className="bg-white border border-[#f0ede6] rounded-3xl p-10 sm:p-14 luxury-card-shadow max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141413] tracking-tight mb-3">
          Claim your verified NexusHub identity
        </h2>
        <p className="text-stone-600 text-sm max-w-lg mx-auto mb-8">
          Join 20,000+ builders with one recognized ID for life. Free, transparent, and reviewed by real peers.
        </p>
        <Link
          href="/get-verified"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Get Verified Today</span>
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
