'use client';

import React, { useState } from 'react';
import { PublicMember } from '@/app/lib/communityTypes';
import { useAuth } from '@/app/context/AuthContext';

interface MemberProfileModalProps {
  member: PublicMember | null;
  onClose: () => void;
  connectionStatus: string;
  onConnectToggle: (memberId: string) => void;
}

export default function MemberProfileModal({
  member,
  onClose,
  connectionStatus,
  onConnectToggle,
}: MemberProfileModalProps) {
  const { user } = useAuth();
  const [connectLoading, setConnectLoading] = useState(false);

  if (!member) return null;

  const roleTheme = {
    student: {
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      avatarGradient: 'from-emerald-500 to-teal-600',
      borderAccent: 'border-emerald-500/30',
    },
    founder: {
      badgeBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
      avatarGradient: 'from-pink-500 to-rose-600',
      borderAccent: 'border-pink-500/30',
    },
    professional: {
      badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      avatarGradient: 'from-indigo-500 to-purple-600',
      borderAccent: 'border-indigo-500/30',
    },
    admin: {
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      avatarGradient: 'from-amber-500 to-orange-600',
      borderAccent: 'border-amber-500/30',
    },
  }[member.role] || {
    badgeBg: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    avatarGradient: 'from-gray-600 to-gray-800',
    borderAccent: 'border-gray-500/30',
  };

  const handleConnect = async () => {
    setConnectLoading(true);
    await onConnectToggle(member.id);
    setConnectLoading(false);
  };

  const isSelf = user?.userId === member.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className={`h-28 bg-gradient-to-r ${roleTheme.avatarGradient} relative opacity-90`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
          {/* Avatar and Primary Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">
            <div className="flex items-end gap-4">
              <div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${roleTheme.avatarGradient} p-1 shadow-xl border-4 border-white dark:border-gray-900 flex items-center justify-center text-white text-3xl font-extrabold uppercase`}
              >
                {member.fullName.charAt(0)}
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {member.fullName}
                  </h3>
                  {member.verificationStatus === 'verified' && (
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold"
                      title="Verified Member"
                    >
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {member.headline}
                </p>
              </div>
            </div>

            {/* Role & Connection CTA */}
            <div className="flex items-center gap-2 sm:mb-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${roleTheme.badgeBg}`}
              >
                {member.role}
              </span>

              {!isSelf && (
                <button
                  onClick={handleConnect}
                  disabled={connectLoading}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-md ${
                    connectionStatus === 'connected'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : connectionStatus === 'pending_sent'
                      ? 'bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {connectLoading
                    ? 'Processing...'
                    : connectionStatus === 'connected'
                    ? '✓ Connected'
                    : connectionStatus === 'pending_sent'
                    ? 'Request Sent'
                    : '+ Connect'}
                </button>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-5 text-sm">
            {/* Location & Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-y border-gray-100 dark:border-gray-800 py-3">
              <span className="flex items-center gap-1.5">
                📍 {member.location || 'Global Community'}
              </span>
              <span className="flex items-center gap-1.5">
                📅 Member since {new Date(member.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                🛡️ Status: {member.verificationStatus === 'verified' ? 'Identity Verified' : 'Standard Member'}
              </span>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                About
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {member.bio ||
                  `${member.fullName} is an active member of NexusHub contributing across the ${member.role} track.`}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Expertise & Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.skills && member.skills.length > 0 ? (
                  member.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No skills listed yet</span>
                )}
              </div>
            </div>

            {/* External Links */}
            {(member.linkedin || member.github || member.website) && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Social & Web Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-medium hover:bg-indigo-500/20 transition-colors"
                    >
                      LinkedIn Profile ↗
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      GitHub Repository ↗
                    </a>
                  )}
                  {member.website && (
                    <a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                    >
                      Portfolio / Web ↗
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
