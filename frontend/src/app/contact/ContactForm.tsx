'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
  consent: boolean;
  hp: string;
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  subject: '',
  message: '',
  consent: false,
  hp: '',
};

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'TSS Solutions Enquiry',
  'Partnership',
  'Event Collaboration',
  'Hiring',
  'Internship',
  'Startup Support',
  'Media & Press',
  'Technical Support',
  'Feedback',
  'Other',
];

const REACH_CHANNELS = [
  {
    title: 'Email',
    desc: 'mahidhar@cliquelog.in',
    href: 'mailto:mahidhar@cliquelog.in',
    icon: (
      <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect width="20" height="16" x="2" y="4" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'WhatsApp',
    desc: 'Collaboration & Support',
    href: 'https://wa.me/919581929676',
    icon: (
      <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      </svg>
    ),
  },
  {
    title: 'WhatsApp Community',
    desc: 'Join the community channel',
    href: 'https://whatsapp.com/channel/0029VbBhwMJ0AgW4DyiKl40q',
    icon: (
      <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" strokeWidth="2" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'WhatsApp Channel',
    desc: 'Follow announcements',
    href: 'https://whatsapp.com/channel/0029VbBhwMJ0AgW4DyiKl40q',
    icon: (
      <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16.247 7.761a6 6 0 0 1 0 8.478" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19.075 4.933a10 10 0 0 1 0 14.134" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4.925 19.067a10 10 0 0 1 0-14.134" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7.753 16.239a6 6 0 0 1 0-8.478" />
        <circle cx="12" cy="12" r="2" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Instagram',
    desc: '@ai_onloop',
    href: 'https://www.instagram.com/ai_onloop/',
    icon: (
      <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2" />
        <path strokeWidth="2" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'LinkedIn',
    desc: 'NexusHub Technologies',
    href: 'https://www.linkedin.com/company/nexushubtech/',
    icon: (
      <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" strokeWidth="2" />
        <circle cx="4" cy="4" r="2" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'X (Twitter)',
    desc: '@Mahi00227555',
    href: 'https://x.com/Mahi00227555',
    icon: (
      <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    title: 'Telegram',
    desc: 't.me/aMKEo1zdyzk1Njdl',
    href: 'https://t.me/aMKEo1zdyzk1Njdl',
    icon: (
      <svg className="w-6 h-6 text-[#ea4e1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m21.854 2.147-10.94 10.939" />
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: 'How quickly will I receive a response?',
    a: 'Usually within 24–48 hours.',
  },
  {
    q: 'Can I collaborate with NexusHub?',
    a: 'Yes. Use the Partnership subject while submitting the form.',
  },
  {
    q: 'Can companies post hiring opportunities?',
    a: 'Yes. Submit a Hiring inquiry through the contact form.',
  },
  {
    q: 'Where can I join the community?',
    a: 'Use the WhatsApp Community or WhatsApp Channel links above.',
  },
];

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  const emailError = form.email && !emailRegex.test(form.email) ? 'Enter a valid email' : '';
  const phoneError =
    form.phone && !phoneRegex.test(form.phone) ? '10-digit Indian mobile starting with 6-9' : '';
  const messageLength = form.message.trim().length;

  const isFormValid =
    form.name.trim().length >= 2 &&
    !emailError &&
    emailRegex.test(form.email) &&
    phoneRegex.test(form.phone) &&
    !!form.subject &&
    messageLength >= 20 &&
    messageLength <= 2000 &&
    form.consent &&
    !submitting;

  const handleChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSubmitting(true);
    setServerError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          organization: form.organization.trim() || undefined,
          subject: form.subject,
          message: form.message.trim(),
          hp: form.hp,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong while submitting.');
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="w-full">
      {/* SUCCESS SCREEN */}
      {submitted ? (
        <section className="pt-20 pb-28 px-4">
          <div className="mx-auto max-w-2xl rounded-3xl border border-stone-200 bg-white p-8 sm:p-14 text-center shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#fff5f0] border border-[#fed7aa] flex items-center justify-center text-[#ea4e1b] mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141413]">
              Thank you! We&apos;ve received your message.
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-stone-600">
              Your message has been submitted successfully. Our team will review your request and
              respond as soon as possible.
            </p>
            <p className="mt-4 text-sm text-stone-500">
              Average response time: <strong className="text-stone-800">24–48 hours</strong>.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-[15px] font-semibold transition-all hover:shadow-md"
              >
                Back to home
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm(initialForm);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-[15px] font-semibold transition-all"
              >
                Send another message
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* HERO SECTION */}
          <section className="mx-auto max-w-4xl px-4 pt-12 sm:pt-20 pb-10 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-stone-600 shadow-xs mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ea4e1b]" />
              Contact
            </div>

            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.08] tracking-tight text-[#141413]">
              Let&apos;s Build Something{' '}
              <span className="font-editorial-italic font-normal italic text-[#ea4e1b]">
                Meaningful
              </span>{' '}
              Together.
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-stone-600">
              Whether you have a question, partnership proposal, hiring opportunity, event
              collaboration, or simply want to connect — we&apos;d love to hear from you.
            </p>
          </section>

          {/* CONTACT FORM */}
          <section className="mx-auto max-w-3xl px-4 pb-20">
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#f0ede6] rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6"
            >
              {/* Bot Honeypot */}
              <input
                type="text"
                name="hp"
                value={form.hp}
                onChange={(e) => handleChange('hp', e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                    Full name <span className="text-[#ea4e1b]">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="h-11 w-full rounded-xl border border-stone-200 bg-[#fbfaf8] px-4 text-sm text-[#141413] placeholder-stone-400 focus:border-[#ea4e1b] focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                    Email address <span className="text-[#ea4e1b]">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@domain.com"
                      className={`h-11 w-full rounded-xl border ${
                        emailError ? 'border-red-500' : 'border-stone-200'
                      } bg-[#fbfaf8] px-4 text-sm text-[#141413] placeholder-stone-400 focus:border-[#ea4e1b] focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 transition-all`}
                    />
                  </div>
                  {emailError && <p className="mt-1.5 text-xs text-red-500">{emailError}</p>}
                </div>

                {/* Mobile number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                    Mobile number <span className="text-[#ea4e1b]">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
                      placeholder="9XXXXXXXXX"
                      className={`h-11 w-full rounded-xl border ${
                        phoneError ? 'border-red-500' : 'border-stone-200'
                      } bg-[#fbfaf8] px-4 text-sm text-[#141413] placeholder-stone-400 focus:border-[#ea4e1b] focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 transition-all`}
                    />
                  </div>
                  {phoneError && <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>}
                </div>

                {/* Organization / College */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                    Organization / College
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(e) => handleChange('organization', e.target.value)}
                      placeholder="College or company name"
                      className="h-11 w-full rounded-xl border border-stone-200 bg-[#fbfaf8] px-4 text-sm text-[#141413] placeholder-stone-400 focus:border-[#ea4e1b] focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                    Subject <span className="text-[#ea4e1b]">*</span>
                  </label>
                  <div className="mt-2 relative">
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-[#fbfaf8] px-4 pr-10 text-sm text-[#141413] focus:border-[#ea4e1b] focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 transition-all cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      {SUBJECT_OPTIONS.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-stone-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                    Message <span className="text-[#ea4e1b]">*</span>
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={6}
                      maxLength={2000}
                      required
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Tell us about your inquiry…"
                      className="w-full rounded-xl border border-stone-200 bg-[#fbfaf8] p-4 text-sm text-[#141413] placeholder-stone-400 focus:border-[#ea4e1b] focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 transition-all"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
                    <span>
                      {messageLength > 0 && messageLength < 20 ? (
                        <span className="text-red-500">Minimum 20 characters ({messageLength}/20)</span>
                      ) : (
                        ''
                      )}
                    </span>
                    <span>{messageLength}/2000</span>
                  </div>
                </div>
              </div>

              {/* Consent checkbox */}
              <label
                htmlFor="contact-consent"
                className="flex items-start gap-3 text-sm text-stone-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  id="contact-consent"
                  checked={form.consent}
                  onChange={(e) => handleChange('consent', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#ea4e1b] focus:ring-[#ea4e1b] accent-[#ea4e1b] cursor-pointer"
                />
                <span>I agree that The Student Spot / NexusHub may contact me regarding this inquiry.</span>
              </label>

              {serverError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {serverError}
                </div>
              )}

              {/* Submit button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="inline-flex items-center justify-center h-12 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white px-8 text-[15px] font-semibold shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* REACH US ANYWHERE */}
          <section className="mx-auto max-w-4xl px-4 pb-20">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141413]">
              Reach us anywhere.
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {REACH_CHANNELS.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="bg-white rounded-2xl border border-stone-200/80 p-7 flex flex-col gap-3 shadow-xs hover:shadow-md hover:border-[#ea4e1b] transition-all group hover:-translate-y-0.5"
                >
                  <div className="transition-transform group-hover:scale-110 duration-200">
                    {item.icon}
                  </div>
                  <div className="font-display text-lg font-bold text-[#141413] group-hover:text-[#ea4e1b] transition-colors">
                    {item.title}
                  </div>
                  <div className="text-sm text-stone-500 break-all leading-snug">
                    {item.desc}
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="mx-auto max-w-3xl px-4 pb-24">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141413]">
              FAQ
            </h2>
            <div className="mt-6 rounded-2xl border border-stone-200/80 bg-white shadow-xs overflow-hidden divide-y divide-stone-100">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.q} className="px-6 py-4 transition-colors">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left flex justify-between items-center py-1 font-semibold text-stone-900 group cursor-pointer"
                    >
                      <span className="text-base group-hover:text-[#ea4e1b] transition-colors pr-4">
                        {faq.q}
                      </span>
                      <svg
                        className={`w-5 h-5 text-stone-400 group-hover:text-[#ea4e1b] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="pt-2 pb-1 text-sm text-stone-600 leading-relaxed animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* FLOATING ACTION: NAVIGATOR AI */}
          <a
            href="https://chatgpt.com/g/g-6a6742bbf3848191b3dcf2d7c8d06f58-tss-navigator"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Need Help? Ask TSS Navigator AI"
            title="Need Help? Ask TSS Navigator AI"
            className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white px-4 py-3 text-[13px] sm:text-[14px] font-semibold shadow-[0_8px_20px_rgba(234,78,27,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(234,78,27,0.45)]"
          >
            <svg
              className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 2v4M22 4h-4" />
              <circle cx="4" cy="20" r="2" strokeWidth="2" />
            </svg>
            <span className="hidden sm:inline">TSS Navigator AI</span>
            <span className="sm:hidden font-medium">AI Guide</span>
          </a>
        </>
      )}
    </div>
  );
}
