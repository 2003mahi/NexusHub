import React from 'react';

export default function VerificationProcess() {
  const steps = [
    {
      step: '01',
      title: 'Submit Academic & Project Links',
      description: 'Fill our concise 2-minute form with your student email, GitHub handle, or project URL.',
    },
    {
      step: '02',
      title: 'Human Review & Proof Verification',
      description: 'Our verification council checks your proof-of-work to guarantee community integrity.',
    },
    {
      step: '03',
      title: 'Digital Pass & Nexus Member ID Issued',
      description: 'Receive your unique verifiable credentials (NEX-XXXXXX) and your profile badge.',
    },
    {
      step: '04',
      title: 'Access Grants, Mentors & Startups',
      description: 'Unlock closed investor pitches, partner hackathons, and direct recruiter pipelines.',
    },
  ];

  return (
    <section className="py-6">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight">
          The 4-Step Verification Path
        </h2>
        <p className="text-stone-600 text-sm mt-2">
          Designed for builders. Fast, fair, and human-evaluated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div
            key={s.step}
            className="p-7 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow relative"
          >
            <div className="text-2xl font-black text-[#ea4e1b] mb-4">
              {s.step}
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2 leading-snug">
              {s.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
