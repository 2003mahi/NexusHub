import React from 'react';

export default function VerificationStatus() {
  const statuses = [
    {
      label: 'Submitted',
      badge: 'Step 1',
      desc: 'Application in queue',
      color: 'bg-stone-100 text-stone-700 border-stone-200',
    },
    {
      label: 'Under Review',
      badge: 'Step 2',
      desc: 'Proof-of-work validation',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      label: 'Verified Member',
      badge: 'Active',
      desc: 'Lifetime NEX ID issued',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
  ];

  return (
    <section className="py-6">
      <div className="bg-white border border-[#f0ede6] rounded-3xl p-8 sm:p-10 luxury-card-shadow max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Application Lifecycle
          </h3>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Real-time transparency at every review checkpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statuses.map((s) => (
            <div
              key={s.label}
              className={`p-5 rounded-2xl border ${s.color} text-center`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70">
                {s.badge}
              </span>
              <div className="text-base font-bold mt-3 text-stone-900">{s.label}</div>
              <div className="text-xs text-stone-600 mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
