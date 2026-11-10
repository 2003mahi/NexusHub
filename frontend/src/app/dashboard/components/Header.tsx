'use client';

import React, { useState } from 'react';
import { DashboardTab, UserAuthData, NotificationItem } from '../types';

interface HeaderProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  user: UserAuthData;
  unreadCount: number;
  notifications: NotificationItem[];
  onOpenMobile: () => void;
}

const tabTitles: Record<DashboardTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Workspace Dashboard',
    subtitle: 'Unified platform performance, recommendations, and recent milestones.',
  },
  profile: {
    title: 'Member Profile',
    subtitle: 'Manage your public presence, verified skills, and background story.',
  },
  verification: {
    title: 'Identity & Trust Verification',
    subtitle: 'Elevate your credibility across the NexusHub ecosystem network.',
  },
  opportunities: {
    title: 'Curated Initiatives & Watchlist',
    subtitle: 'Explore elite grants, mentorship circles, and venture opportunities.',
  },
  applications: {
    title: 'Activity & Applications Track',
    subtitle: 'Monitor submission statuses and audit real-time ecosystem actions.',
  },
  documents: {
    title: 'Secure Document Vault',
    subtitle: 'Encrypted storage for resumes, compliance proofs, and pitch decks.',
  },
  notifications: {
    title: 'Notifications Center',
    subtitle: 'Stay updated on partnership reviews, applications, and system alerts.',
  },
  settings: {
    title: 'Account Settings & Preferences',
    subtitle: 'Configure privacy, communications, and cryptographic access keys.',
  },
};

export default function Header({
  currentTab,
  onSelectTab,
  user,
  unreadCount,
  notifications,
  onOpenMobile,
}: HeaderProps) {
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const { title, subtitle } = tabTitles[currentTab] || {
    title: 'Dashboard',
    subtitle: 'NexusHub Enterprise Platform',
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#090D16]/85 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Active Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-gray-400 mt-0.5 max-w-lg truncate">{subtitle}</p>
        </div>
      </div>

      {/* Right: Actions, Verification Pill, Notification Bell, User Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Verification Pill */}
        <button
          onClick={() => onSelectTab('verification')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            user.emailVerified
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
          <span className="hidden sm:inline">Verification:</span>
          <span>{user.emailVerified ? 'Verified' : 'Pending Review'}</span>
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-gray-300 hover:text-white transition-all"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#090D16] shadow-lg animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Quick Dropdown Preview */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0E1322] border border-white/[0.12] shadow-2xl shadow-black/80 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    onSelectTab('notifications');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-white/[0.05] max-h-64 overflow-y-auto custom-scrollbar my-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">No notifications yet.</p>
                ) : (
                  notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        onSelectTab('notifications');
                      }}
                      className={`p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer ${
                        !notif.read ? 'bg-indigo-500/[0.06]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-white truncate">{notif.title}</p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setNotifDropdownOpen(false);
                  onSelectTab('notifications');
                }}
                className="w-full mt-2 py-2 text-center text-xs text-gray-300 hover:text-white rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
              >
                Go to Notification Center →
              </button>
            </div>
          )}
        </div>

        {/* User Avatar Action */}
        <button
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/[0.05] transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline text-xs font-medium text-gray-300 group-hover:text-white">
            {user.fullName.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
