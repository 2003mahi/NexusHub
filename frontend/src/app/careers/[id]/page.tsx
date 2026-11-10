'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CareerOpportunity, JobApplication } from '@/app/lib/careers';
import { useAuth } from '@/app/context/AuthContext';

export default function CareerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const careerId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();

  const [career, setCareer] = useState<CareerOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User state
  const [isSaved, setIsSaved] = useState(false);
  const [existingApplication, setExistingApplication] = useState<JobApplication | null>(null);

  // Apply Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('1-2 years');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Share feedback
  const [copied, setCopied] = useState(false);

  // Fetch opportunity details
  const loadCareerDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/careers/${careerId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Opportunity not found.');
        throw new Error('Failed to load opportunity details.');
      }
      const data = await res.json();
      setCareer(data.career);
      setSelectedSkills(data.career?.skills || []);
    } catch (err: any) {
      console.error('Career detail fetch error:', err);
      setError(err.message || 'Error loading career details.');
    } finally {
      setLoading(false);
    }
  }, [careerId]);

  // Check if saved or already applied
  const checkUserStatus = useCallback(async () => {
    if (!user) return;
    try {
      // Check saved
      const savedRes = await fetch('/api/careers/saved');
      if (savedRes.ok) {
        const data = await savedRes.json();
        setIsSaved(Array.isArray(data.savedIds) && data.savedIds.includes(careerId));
      }

      // Check application
      const appRes = await fetch('/api/careers/applications');
      if (appRes.ok) {
        const appData = await appRes.json();
        const found = (appData.applications || []).find(
          (a: JobApplication) => a.careerId === careerId
        );
        if (found) {
          setExistingApplication(found);
        }
      }
    } catch {
      // ignore
    }
  }, [user, careerId]);

  useEffect(() => {
    loadCareerDetail();
  }, [loadCareerDetail]);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  // Handle Save
  const handleToggleSave = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/careers/${careerId}`);
      return;
    }

    setIsSaved((prev) => !prev);
    try {
      const res = await fetch(`/api/careers/${careerId}/save`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
      }
    } catch {
      checkUserStatus();
    }
  };

  // Handle Apply Submission
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/auth/login?redirect=/careers/${careerId}`);
      return;
    }

    if (!coverLetter.trim() || coverLetter.trim().length < 20) {
      setSubmitError('Please provide a cover letter or introductory statement (minimum 20 characters).');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const res = await fetch(`/api/careers/${careerId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coverLetter: coverLetter.trim(),
          portfolioUrl: portfolioUrl.trim(),
          resumeUrl: resumeUrl.trim(),
          yearsOfExperience,
          skills: selectedSkills
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSubmitSuccess(true);
      setExistingApplication(data.application);
      setTimeout(() => {
        setShowApplyModal(false);
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  // Copy share link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#141413]">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full animate-pulse">
          <div className="h-6 w-48 bg-stone-100 rounded mb-6" />
          <div className="h-10 w-3/4 bg-stone-100 rounded mb-4" />
          <div className="h-6 w-1/3 bg-stone-100 rounded mb-12" />
          <div className="space-y-4">
            <div className="h-32 bg-stone-100 rounded-3xl" />
            <div className="h-48 bg-stone-100 rounded-3xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#141413]">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#ea4e1b] flex items-center justify-center text-3xl mx-auto mb-4 border border-[#ea4e1b]/20">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-[#141413] mb-2">
            Opportunity Not Found
          </h2>
          <p className="text-sm text-stone-600 mb-6">
            The role you are looking for may have expired or been removed by the recruiter.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-xs font-semibold shadow-xs"
          >
            ← Back to Careers Marketplace
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = career.organization
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formattedDeadline = new Date(career.deadline).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#141413] selection:bg-[#ea4e1b]/15 selection:text-[#ea4e1b]">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Header with Breadcrumbs */}
        <section className="bg-gradient-to-b from-[#fed7aa]/20 via-[#fbfaf8] to-[#fbfaf8] border-b border-[#f0ede6] pt-8 pb-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb links */}
            <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
              <Link href="/" className="hover:text-[#ea4e1b]">Home</Link>
              <span>/</span>
              <Link href="/careers" className="hover:text-[#ea4e1b]">Careers</Link>
              <span>/</span>
              <span className="text-stone-900 font-semibold truncate max-w-xs">{career.title}</span>
            </nav>

            {/* Header Main Card */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center font-bold text-xl border border-[#ea4e1b]/20 shadow-xs shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-base font-bold text-[#141413]">
                      {career.organization}
                    </span>
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Verified Employer
                    </span>
                    {career.isRemote && (
                      <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                        Remote
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight mb-2">
                    {career.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {career.location}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-[#ea4e1b] font-mono">
                      {career.salaryRange}
                    </span>
                    <span>•</span>
                    <span>Posted {new Date(career.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleToggleSave}
                  className={`p-3 rounded-full border transition-all flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer ${
                    isSaved
                      ? 'bg-rose-50 text-rose-600 border-rose-300'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-rose-300'
                  }`}
                  title={isSaved ? 'Remove Bookmark' : 'Bookmark Opportunity'}
                >
                  <svg className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>

                {career.isExternal ? (
                  <a
                    href={career.applyUrl || `https://www.google.com/search?q=${encodeURIComponent(career.title + ' ' + career.organization + ' jobs')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none px-7 py-3 rounded-full bg-[#141413] hover:bg-[#ea4e1b] text-white font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Apply on Company Site</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : existingApplication ? (
                  <div className="flex-1 md:flex-none px-6 py-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-center gap-2">
                    <span>✓ Applied with Nexus ID</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        router.push(`/auth/login?redirect=/careers/${careerId}`);
                      } else {
                        setShowApplyModal(true);
                      }
                    }}
                    className="flex-1 md:flex-none px-7 py-3 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>1-Click Apply with Nexus ID</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Existing Application Status Banner */}
            {existingApplication && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-900 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    You submitted your application on{' '}
                    <strong>{new Date(existingApplication.appliedAt).toLocaleDateString()}</strong>. Current review status:{' '}
                    <span className="uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {existingApplication.status.replace('_', ' ')}
                    </span>
                  </span>
                </div>
                <Link
                  href="/careers/applications"
                  className="font-bold underline hover:text-[#ea4e1b]"
                >
                  View Status Tracker →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Content Body Grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <section className="bg-white border border-[#f0ede6] rounded-3xl p-6 sm:p-8 luxury-card-shadow">
                <h2 className="text-xl font-bold text-[#141413] mb-4">
                  Opportunity Overview
                </h2>
                <p className="text-stone-700 leading-relaxed text-sm whitespace-pre-line">
                  {career.description}
                </p>
              </section>

              {/* Responsibilities */}
              {career.responsibilities && career.responsibilities.length > 0 && (
                <section className="bg-white border border-[#f0ede6] rounded-3xl p-6 sm:p-8 luxury-card-shadow">
                  <h2 className="text-xl font-bold text-[#141413] mb-4">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {career.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                        <span className="w-5 h-5 rounded-full bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Requirements */}
              {career.requirements && career.requirements.length > 0 && (
                <section className="bg-white border border-[#f0ede6] rounded-3xl p-6 sm:p-8 luxury-card-shadow">
                  <h2 className="text-xl font-bold text-[#141413] mb-4">
                    Candidate Requirements
                  </h2>
                  <ul className="space-y-3">
                    {career.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                        <span className="w-5 h-5 rounded-full bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          •
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Benefits & Perks */}
              {career.benefits && career.benefits.length > 0 && (
                <section className="bg-white border border-[#f0ede6] rounded-3xl p-6 sm:p-8 luxury-card-shadow">
                  <h2 className="text-xl font-bold text-[#141413] mb-4">
                    Benefits & Growth Perks
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {career.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-800 flex items-center gap-3 font-medium"
                      >
                        <span className="text-base text-[#ea4e1b]">🎁</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Column (1 col) */}
            <div className="space-y-6">
              {/* Job Specification Matrix */}
              <div className="bg-white border border-[#f0ede6] rounded-3xl p-6 luxury-card-shadow">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
                  Role Details
                </h3>

                <div className="space-y-4 text-xs divide-y divide-stone-100">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-stone-500">Domain</span>
                    <span className="font-bold text-[#141413]">{career.role}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-stone-500">Category</span>
                    <span className="font-bold text-[#141413] capitalize">{career.category}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-stone-500">Employment Type</span>
                    <span className="font-bold text-[#141413] capitalize">
                      {career.employmentType.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-stone-500">Experience</span>
                    <span className="font-bold text-[#141413] capitalize">
                      {career.experienceLevel} Level
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-stone-500">Application Deadline</span>
                    <span className="font-bold text-[#141413]">{formattedDeadline}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-stone-500">Active Candidates</span>
                    <span className="font-bold text-[#ea4e1b]">
                      {career.applicantCount} applicants
                    </span>
                  </div>
                </div>
              </div>

              {/* Required Skills Matrix */}
              <div className="bg-white border border-[#f0ede6] rounded-3xl p-6 luxury-card-shadow">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Required Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs rounded-full bg-[#fbfaf8] text-stone-800 border border-stone-200 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recruiter / Poster Profile Box */}
              <div className="bg-white border border-[#f0ede6] rounded-3xl p-6 luxury-card-shadow">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Hiring Team
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ea4e1b]/10 text-[#ea4e1b] border border-[#ea4e1b]/20 flex items-center justify-center font-bold text-sm">
                    {career.postedBy.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#141413]">
                      {career.postedBy.name}
                    </h4>
                    <p className="text-xs text-stone-500 capitalize">{career.postedBy.role} • {career.organization}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white border border-[#f0ede6] rounded-[32px] p-6 sm:p-8 luxury-card-shadow my-8">
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 text-lg cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-6">
                <span className="text-xs font-bold text-[#ea4e1b] uppercase tracking-wider">
                  Direct Application
                </span>
                <h3 className="text-xl font-bold text-[#141413] mt-1">
                  Apply for {career.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Submitting to {career.organization} as{' '}
                  <strong className="text-stone-900">{user?.fullName}</strong> ({user?.email})
                </p>
              </div>

              {submitError && (
                <div className="p-3.5 mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {submitError}
                </div>
              )}

              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-[#141413] mb-1">
                    Application Sent Successfully!
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Your details and cover statement were delivered to {career.organization}. You can track review progress in your dashboard.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  {/* Cover Letter */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-stone-800">
                        Cover Statement / Motivation *
                      </label>
                      <span className="text-[11px] text-stone-400">
                        {coverLetter.length} / 5000 chars
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Explain why you are an exceptional match for this position, highlighting relevant projects, accomplishments, or domain passion..."
                      className="w-full p-3.5 text-xs bg-[#fbfaf8] border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 focus:border-[#ea4e1b]"
                    />
                  </div>

                  {/* Portfolio or GitHub URL */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      Portfolio, GitHub, or LinkedIn Profile Link
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://github.com/yourhandle or https://portfolio.dev"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#fbfaf8] border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 focus:border-[#ea4e1b]"
                    />
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      Relevant Practical Experience
                    </label>
                    <select
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#fbfaf8] border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 focus:border-[#ea4e1b] cursor-pointer"
                    >
                      <option value="Student / Entry Project Experience">Student / Entry Project Experience</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>

                  {/* Skills check */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      Confirm Relevant Skills
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2.5 bg-[#fbfaf8] rounded-2xl border border-stone-200">
                      {career.skills.map((s) => (
                        <label key={s} className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(s)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedSkills([...selectedSkills, s]);
                              else setSelectedSkills(selectedSkills.filter((item) => item !== s));
                            }}
                            className="rounded accent-[#ea4e1b]"
                          />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duplicate warning & submit button */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-5 py-2.5 rounded-full border border-stone-200 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 bg-[#ea4e1b] hover:bg-[#d43b0c] text-white rounded-full text-xs font-semibold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Verifying & Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
