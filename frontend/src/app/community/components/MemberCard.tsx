'use client';

import React from 'react';
import { PublicMember } from '@/app/lib/communityTypes';

interface MemberCardProps {
  member: PublicMember;
  onViewProfile: (member: PublicMember) => void;
  onConnect: (memberId: string) => void;
  connectionStatus: string;
}

export default function MemberCard({
  member,
  onViewProfile,
  onConnect,
  connectionStatus,
}: MemberCardProps) {
  const roleStyles = {
    student: {
      borderHover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      avatarBg: 'from-emerald-500 to-teal-600',
    },
    founder: {
      borderHover: 'hover:border-pink-500/50 hover:shadow-pink-500/10',
      badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
      avatarBg: 'from-pink-500 to-rose-600',
    },
    professional: {
      borderHover: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
      badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      avatarBg: 'from-indigo-500 to-purple-600',
    },
    admin: {
      borderHover: 'hover:border-amber-500/50 hover:shadow-amber-500/10',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      avatarBg: 'from-amber-500 to-orange-600',
    },
  }[member.role] || {
    borderHover: 'hover:border-gray-500/50 hover:shadow-gray-500/10',
    badge: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    avatarBg: 'from-gray-500 to-gray-700',
  };

  return (
    <div
      className={`group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 p-5 shadow-sm backdrop-blur-md transition-all duration-300 ${roleStyles.borderHover} hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between`}
    >
      <div>
        {/* Top bar with role badge & verified pill */}
        <div className="flex items-center justify-between mb-3.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${roleStyles.badge}`}
          >
            {member.role}
          </span>
          {member.verificationStatus === 'verified' && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full"
              title="Verified Nexus Identity"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Member Avatar & Basic Info */}
        <div className="flex items-center gap-3.5 mb-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${roleStyles.avatarBg} text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0`}
          >
            {member.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h4
              onClick={() => onViewProfile(member)}
              className="font-bold text-base text-gray-900 dark:text-white truncate cursor-pointer hover:text-primary transition-colors"
            >
              {member.fullName}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {member.headline}
            </p>
          </div>
        </div>

        {/* Location & Metadata */}
        <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
          <span>📍</span>
          <span className="truncate">{member.location || 'Nexus Global'}</span>
        </p>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {member.skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700/60"
            >
              {skill}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[11px] text-gray-400">
              +{member.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-2">
        <button
          onClick={() => onViewProfile(member)}
          className="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
        >
          View Profile
        </button>
        <button
          onClick={() => onConnect(member.id)}
          className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            connectionStatus === 'connected'
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : connectionStatus === 'pending_sent'
              ? 'bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {connectionStatus === 'connected'
            ? '✓ Linked'
            : connectionStatus === 'pending_sent'
            ? 'Pending'
            : '+ Connect'}
        </button>
      </div>
    </div>
  );
}
