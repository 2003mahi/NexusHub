import React from 'react';

const faqs = [
  {
    q: 'What is a NexusHub Member ID?',
    a: 'It is a permanent cryptographic & human-reviewed credential (e.g. NEX-000001) that verifies you as a legit student builder or founder in India.',
  },
  {
    q: 'Is verification free?',
    a: 'Yes, NexusHub verification is 100% free for all students, college founders, and early-stage innovators.',
  },
  {
    q: 'How long does the human review process take?',
    a: 'Applications are typically reviewed within 24 to 48 hours by our community council.',
  },
  {
    q: 'What if I am still in my first or second year of college?',
    a: 'We welcome builders at any college stage. If you have built projects, participated in hackathons, or are enthusiastic about launching, you qualify.',
  },
];

export default function VerificationFAQ() {
  return (
    <section className="py-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-stone-600 text-sm mt-2">
          Everything you need to know about the verification process.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-[#f0ede6] luxury-card-shadow"
          >
            <h3 className="text-base font-bold text-stone-900 mb-2">
              {item.q}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
