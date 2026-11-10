'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CareerOpportunity } from '@/app/lib/careers';
import { AuthUser } from '@/app/context/AuthContext';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  career: CareerOpportunity | null;
  user: AuthUser | null;
  onSuccess?: () => void;
}

export default function ApplyModal({
  isOpen,
  onClose,
  career,
  user,
  onSuccess
}: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('1-2 years');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Nexus ID derivation
  const nexusId = user?.id
    ? `NX-${user.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase()}`
    : 'NX-GUEST-2026';

  useEffect(() => {
    if (career) {
      setSelectedSkills(career.skills || []);
      // Reset state for new opening
      setError(null);
      setSuccess(false);
      // Smart 1-click template prefill
      const roleTitle = career.title;
      const org = career.organization;
      const skillText = (career.skills || []).slice(0, 3).join(', ');
      setCoverLetter(
        `I am writing to express my strong enthusiasm for the ${roleTitle} role at ${org}. With hands-on experience in ${skillText || 'modern engineering systems'}, I am confident in delivering high impact and eager to contribute to your roadmap.`
      );
    }
  }, [career, user]);

  if (!isOpen || !career) return null;

  const handleSmartDraft = () => {
    const roleTitle = career.title;
    const org = career.organization;
    const skillList = (career.skills || []).slice(0, 4).join(', ');
    setCoverLetter(
      `Hello ${org} team,\n\nI am thrilled to submit my 1-Click application via Nexus ID for the ${roleTitle} position. My background aligns closely with your technical requirements in ${skillList}, and I have a proven track record of shipping resilient, accessible software. Looking forward to discussing how I can add immediate value to your engineering sprints.`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim() || coverLetter.trim().length < 20) {
      setError('Please provide a cover statement (minimum 20 characters).');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Submit application
      const res = await fetch(`/api/careers/${career.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coverLetter: coverLetter.trim(),
          portfolioUrl: portfolioUrl.trim(),
          yearsOfExperience,
          skills: selectedSkills
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        onClose();
      }, 2400);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-[32px] p-6 sm:p-8 luxury-card-shadow border border-[#f0ede6] z-10 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ea4e1b]/10 text-[#ea4e1b] border border-[#ea4e1b]/20 text-[10px] font-bold uppercase tracking-wider">
              1-Click Verified Apply
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
              ID: {nexusId}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#141413] leading-tight">
            {career.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
            {career.organization} • {career.department} • {career.location}
          </p>
        </div>

        {/* Success Screen */}
        {success ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto border border-emerald-200 shadow-xs">
              ✓
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#141413]">
                Application Successfully Submitted!
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1 leading-relaxed">
                Your verified profile and Nexus ID (<span className="font-mono font-semibold text-stone-900">{nexusId}</span>) have been dispatched directly to the hiring team at {career.organization}.
              </p>
            </div>
            <div className="pt-3">
              <Link
                href="/careers/applications"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141413] hover:bg-[#ea4e1b] text-white rounded-full text-xs font-semibold transition-all shadow-xs"
              >
                <span>Track in Dashboard</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identity Card */}
            <div className="p-3.5 bg-[#fbfaf8] border border-stone-200/90 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ea4e1b]/10 text-[#ea4e1b] font-bold flex items-center justify-center text-sm border border-[#ea4e1b]/20">
                  {user?.fullName ? user.fullName[0].toUpperCase() : 'N'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141413]">
                    {user?.fullName || 'Verified Nexus Candidate'}
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">
                    {user?.email || 'nexus.candidate@network.id'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                Verified Member
              </span>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Cover Statement */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-800">
                  Personal Pitch / Cover Statement *
                </label>
                <button
                  type="button"
                  onClick={handleSmartDraft}
                  className="text-[11px] text-[#ea4e1b] hover:underline font-semibold cursor-pointer"
                >
                  ✨ Refine Pitch
                </button>
              </div>
              <textarea
                required
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Share your technical background, passion for the role, and relevant projects..."
                className="w-full p-3 text-xs bg-[#fbfaf8] border border-stone-200/90 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 focus:border-[#ea4e1b] transition-all leading-relaxed placeholder-stone-400"
              />
              <div className="text-right text-[10px] text-stone-400 mt-1">
                {coverLetter.length} chars (min 20)
              </div>
            </div>

            {/* Portfolio Link & Experience Level Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  Portfolio / GitHub Link
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/handle"
                  className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-stone-200/90 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ea4e1b]/20 focus:border-[#ea4e1b] placeholder-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  Experience Tier
                </label>
                <select
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-stone-200/90 rounded-xl text-stone-900 focus:outline-none focus:border-[#ea4e1b] cursor-pointer"
                >
                  <option value="Student / Entry Level">Student / Entry Level</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                  <option value="Lead / Staff">Lead / Staff</option>
                </select>
              </div>
            </div>

            {/* Skills Confirmation Pills */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Confirm Skills for 1-Click Verification
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-[#fbfaf8] rounded-xl border border-stone-200/90">
                {career.skills.map((skill) => {
                  const isChecked = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedSkills(selectedSkills.filter((s) => s !== skill));
                        } else {
                          setSelectedSkills([...selectedSkills, skill]);
                        }
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                        isChecked
                          ? 'bg-[#ea4e1b] text-white border-[#ea4e1b]'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      <span>#{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#f0ede6] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Submitting with Nexus ID...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Submit with Nexus ID</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">1-Click</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

