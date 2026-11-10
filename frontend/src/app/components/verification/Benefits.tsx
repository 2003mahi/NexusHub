import React from 'react';

export default function VerificationBenefits() {
  const benefits = [
    {
      title: 'Lifetime Member ID',
      description: 'Your unique identifier (e.g. NEX-000001) that verifies your student-to-founder credentials.',
      icon: (
        <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    },
    {
      title: 'Direct Recruiter Access',
      description: 'Skip applicant tracking systems with fast-tracked referrals to top engineering and product teams.',
      icon: (
        <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Founder Grants & Seed Capital',
      description: 'Eligibility for equity-free grants up to ₹5,00,000 through the Nexus Ventures partner network.',
      icon: (
        <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Closed Community Access',
      description: 'Join 20,000+ verified peers, founder AMAs, and exclusive hackathons with high signal.',
      icon: (
        <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
  ];

  return (
    <section className="py-6">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight">
          Why Get Verified on NexusHub?
        </h2>
        <p className="text-stone-600 text-sm mt-2">
          A badge of trust recognized across the tech and venture ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="p-7 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow hover:border-[#ea4e1b]/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ea4e1b]/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              {b.icon}
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">{b.title}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
