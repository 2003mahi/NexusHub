'use client';

import React, { useState } from 'react';
import {
  UserAuthData,
  UserProfileData,
  ProfileCompletionData,
} from '../types';

interface ProfileTabProps {
  user: UserAuthData;
  profile: UserProfileData;
  completion: ProfileCompletionData;
  onUpdateProfile: (data: {
    fullName?: string;
    headline?: string;
    bio?: string;
    location?: string;
    phone?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    skills?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  onGoToDocuments: () => void;
  onGoToVerification: () => void;
}

const roleBadgeColors: Record<string, string> = {
  student: 'from-blue-500 to-cyan-500 text-blue-100',
  founder: 'from-amber-500 to-orange-500 text-amber-100',
  professional: 'from-emerald-500 to-teal-500 text-emerald-100',
  admin: 'from-rose-500 to-purple-500 text-rose-100',
};

const commonSkillSuggestions = [
  'TypeScript',
  'Next.js',
  'React',
  'Node.js',
  'Python',
  'Cloud Architecture',
  'AI / ML',
  'PostgreSQL',
  'System Design',
  'Product Strategy',
  'Cybersecurity',
  'UI/UX Design',
];

export default function ProfileTab({
  user,
  profile,
  completion,
  onUpdateProfile,
  onGoToDocuments,
  onGoToVerification,
}: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [headline, setHeadline] = useState(profile.headline || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [github, setGithub] = useState(profile.github || '');
  const [linkedin, setLinkedin] = useState(profile.linkedin || '');
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddSkill = (skillToAdd?: string) => {
    const val = (skillToAdd || skillInput).trim();
    if (!val) return;
    if (skills.some((s) => s.toLowerCase() === val.toLowerCase())) return;
    if (skills.length >= 20) return;
    setSkills([...skills, val]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg('Full name must be at least 2 characters.');
      return;
    }

    setSaving(true);
    try {
      const res = await onUpdateProfile({
        fullName: fullName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim(),
        phone: phone.trim(),
        website: website.trim(),
        github: github.trim(),
        linkedin: linkedin.trim(),
        skills,
      });

      if (res.success) {
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setErrorMsg(res.error || 'Failed to update profile.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ── 1. Profile Completion Progress & Interactive Checklist ────────── */}
      <div className="rounded-3xl bg-gradient-to-br from-[#12182B] via-[#0E1322] to-[#0A0D18] border border-white/[0.09] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Identity & Readiness Score
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Profile Completion Progress
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              A complete profile unlocks ecosystem matchmaking, venture applications, and verified credential privileges.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
            <div className="text-right">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300">
                {completion.percentage}%
              </span>
              <span className="block text-[11px] text-gray-400 font-medium">Platform Readiness</span>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-white/[0.08] flex items-center justify-center relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${completion.percentage}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Dynamic Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {completion.items.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                if (item.key === 'email' || item.key === 'verification') {
                  onGoToVerification();
                } else if (item.key === 'document') {
                  onGoToDocuments();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                item.completed
                  ? 'bg-emerald-500/[0.05] border-emerald-500/25 hover:border-emerald-500/40 text-emerald-200'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-indigo-500/30 text-gray-400 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.completed
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {item.completed ? '✓' : '○'}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-gray-400">
                  +{item.weight}%
                </span>
              </div>
              <p className="text-xs font-semibold text-white">{item.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Member Profile View & Edit ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card Preview */}
        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[2px] shadow-2xl">
                  <div className="w-full h-full bg-[#0E1322] rounded-[22px] flex items-center justify-center text-3xl font-extrabold text-white">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span
                  className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md bg-gradient-to-r ${
                    roleBadgeColors[user.role]
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
              <p className="text-xs text-indigo-400 mt-0.5 font-medium">
                {profile.headline || 'No headline specified'}
              </p>
              <p className="text-xs text-gray-500 mt-1">{user.email}</p>

              <div className="flex items-center gap-2 mt-3">
                {user.emailVerified ? (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    ✓ Verified Member
                  </span>
                ) : (
                  <button
                    onClick={onGoToVerification}
                    className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/20 transition-colors"
                  >
                    ⚠️ Verify Identity
                  </button>
                )}
              </div>
            </div>

            {/* About / Bio Preview */}
            <div className="pt-4 border-t border-white/[0.06]">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                About
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                {profile.bio || 'Add a personal bio to showcase your background, ambitions, and experience.'}
              </p>
            </div>

            {/* Contact & Location Details */}
            <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span>Location</span>
                <span className="text-white font-medium">{profile.location || 'Not specified'}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Phone</span>
                <span className="text-white font-medium">{profile.phone || 'Not specified'}</span>
              </div>
              {profile.website && (
                <div className="flex items-center justify-between text-gray-400">
                  <span>Website</span>
                  <a
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline truncate max-w-[150px]"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
              {profile.github && (
                <div className="flex items-center justify-between text-gray-400">
                  <span>GitHub</span>
                  <a
                    href={`https://github.com/${profile.github.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    @{profile.github.replace('@', '')}
                  </a>
                </div>
              )}
              {profile.linkedin && (
                <div className="flex items-center justify-between text-gray-400">
                  <span>LinkedIn</span>
                  <a
                    href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
              )}
            </div>

            {/* Skills Tags */}
            <div className="pt-4 border-t border-white/[0.06]">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Core Competencies ({profile.skills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.length === 0 ? (
                  <span className="text-xs text-gray-500">No skills added yet.</span>
                ) : (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/[0.05] text-gray-300 border border-white/[0.08]"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 transition-all text-center"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Member Details'}
            </button>
          </div>
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="lg:col-span-2 rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Profile Management</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Update your professional credentials and verified network information.
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md"
              >
                Enable Edit Mode
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="p-3.5 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              ✓ {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name & Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] disabled:opacity-60 border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Alex Morgan"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Professional Headline
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] disabled:opacity-60 border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Distributed Systems Engineer"
                />
              </div>
            </div>

            {/* Bio with Char Counter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  Personal & Professional Bio
                </label>
                <span className="text-[11px] text-gray-500">
                  {bio.length}/2000 chars (min 20 for completion)
                </span>
              </div>
              <textarea
                disabled={!isEditing}
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] disabled:opacity-60 border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="Share your background, achievements, passion projects, and what opportunities you are looking to collaborate on..."
              />
            </div>

            {/* Location & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Location</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] disabled:opacity-60 border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] disabled:opacity-60 border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. +1 (555) 019-2834"
                />
              </div>
            </div>

            {/* Social / Portfolio Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Website</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] disabled:opacity-60 border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">GitHub</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] disabled:opacity-60 border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">LinkedIn</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] disabled:opacity-60 border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>

            {/* Skills Matrix Manager */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Skills & Technologies ({skills.length}/20)
              </label>

              {isEditing && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Type skill and press Enter..."
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                {skills.length === 0 ? (
                  <span className="text-xs text-gray-500">No skills listed yet.</span>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/25"
                    >
                      <span>{skill}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-400 font-bold ml-0.5 text-sm"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>

              {/* Suggestions */}
              {isEditing && (
                <div className="mt-2.5">
                  <span className="text-[11px] text-gray-500 mr-2">Quick Add:</span>
                  <div className="inline-flex flex-wrap gap-1.5 mt-1">
                    {commonSkillSuggestions
                      .filter((s) => !skills.includes(s))
                      .slice(0, 6)
                      .map((suggested) => (
                        <button
                          type="button"
                          key={suggested}
                          onClick={() => handleAddSkill(suggested)}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.06] transition-colors"
                        >
                          + {suggested}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {isEditing && (
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
