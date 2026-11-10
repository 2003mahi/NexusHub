'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardTab, UserAuthData, ProfileCompletionData } from '../types';

interface SidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  user: UserAuthData;
  completion: ProfileCompletionData;
  unreadCount: number;
  savedCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

const roleBadgeColors: Record<string, string> = {
  student: 'from-blue-500 to-cyan-500 text-blue-100',
  founder: 'from-amber-500 to-orange-500 text-amber-100',
  professional: 'from-emerald-500 to-teal-500 text-emerald-100',
  admin: 'from-rose-500 to-purple-500 text-rose-100',
};

const roleIcons: Record<string, string> = {
  student: '🎓',
  founder: '🚀',
  professional: '💼',
  admin: '🛡️',
};

export default function Sidebar({
  currentTab,
  onSelectTab,
  user,
  completion,
  unreadCount,
  savedCount,
  mobileOpen,
  onCloseMobile,
  onLogout,
}: SidebarProps) {
  const navItems = [
    {
      id: 'overview' as DashboardTab,
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'profile' as DashboardTab,
      label: 'Member Profile',
      badge: `${completion.percentage}%`,
      badgeColor: completion.percentage >= 80 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'verification' as DashboardTab,
      label: 'Verification Status',
      badge: user.emailVerified ? 'Verified' : 'Action Req.',
      badgeColor: user.emailVerified ? 'text-cyan-400 bg-cyan-500/10' : 'text-amber-400 bg-amber-500/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 'opportunities' as DashboardTab,
      label: 'Opportunities & Watchlist',
      badge: savedCount > 0 ? `${savedCount}` : undefined,
      badgeColor: 'text-indigo-400 bg-indigo-500/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
    {
      id: 'applications' as DashboardTab,
      label: 'Activity & Applications',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'documents' as DashboardTab,
      label: 'Documents Vault',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
    },
    {
      id: 'notifications' as DashboardTab,
      label: 'Notifications',
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
      badgeColor: 'text-rose-400 bg-rose-500/10 font-bold',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      id: 'settings' as DashboardTab,
      label: 'Account & Preferences',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#090D16]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex flex-col">
          <div className="h-20 px-6 flex items-center justify-between border-b border-white/[0.06]">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-10 h-10 rounded-xl bg-[#171717] border border-white/[0.12] p-0.5 shadow-md group-hover:border-[#ea4e1b]/60 group-hover:scale-105 transition-all duration-300 overflow-hidden shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="NexusHub Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight flex items-baseline gap-1 leading-none">
                  <span>nexushub</span>
                  <span className="text-[#ea4e1b] text-lg font-bold">.</span>
                  <span className="ml-1 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#ea4e1b]/15 text-[#ea4e1b] border border-[#ea4e1b]/30">
                    SaaS
                  </span>
                </span>
                <span className="text-[9.5px] uppercase tracking-[0.2em] text-gray-400 block font-semibold mt-1">connecting Dreams</span>
              </div>
            </Link>

            <button
              onClick={onCloseMobile}
              className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
            >
              ✕
            </button>
          </div>

          {/* User Mini Card */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.06] shadow-inner">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 text-xs">
                  {roleIcons[user.role] || '👤'}
                </span>
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${
                      roleBadgeColors[user.role] || 'from-gray-500 to-gray-600 text-white'
                    }`}
                  >
                    {user.role}
                  </span>
                  {user.emailVerified ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-medium" title="Verified Member">
                      ✓
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-medium" title="Email Unverified">
                      ⚠️
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 via-indigo-600/20 to-transparent text-white border-l-2 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`transition-colors duration-200 ${
                        isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold border border-white/[0.08] ${
                        item.badgeColor || 'text-gray-400 bg-white/[0.05]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Completion Progress & Logout */}
        <div className="p-4 border-t border-white/[0.06] space-y-3 bg-[#080B14]">
          {/* Profile Completion Box */}
          <button
            onClick={() => {
              onSelectTab('profile');
              onCloseMobile();
            }}
            className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all group"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-400 group-hover:text-gray-200 font-medium">Profile Completion</span>
              <span className="text-indigo-400 font-bold">{completion.percentage}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-700 ease-out"
                style={{ width: `${completion.percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5 flex items-center justify-between">
              <span>{completion.percentage === 100 ? 'All milestones achieved' : 'Tap to complete credentials'}</span>
              <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </p>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-rose-300 hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/30 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
