'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { PublicMember, CommunityGroup, CommunityDiscussion, CommunityEvent, CommunityAnnouncement } from '@/app/lib/communityTypes';
import NetworkCanvas from './components/NetworkCanvas';
import FounderConnectSection from './components/FounderConnectSection';
import MemberCard from './components/MemberCard';
import MemberProfileModal from './components/MemberProfileModal';
import NewDiscussionModal from './components/NewDiscussionModal';
import DiscussionsSection from './components/DiscussionsSection';
import EventsSection from './components/EventsSection';

export default function CommunityPage() {
  // ==== Hero Section ==== //
  const heroBg = '/hero-community.jpg'; // place image in public folder
  const heroStyle = {
    backgroundImage: `url(${heroBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  // ==== Animated Counter Component ==== //
  const Counter = ({ target }: { target: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const duration = 1200; // ms
      const stepTime = Math.abs(Math.floor(duration / target));
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= target) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }, [target]);
    return <span className="text-2xl font-bold">{count}</span>;
  };

  // ==== Lazy Load Heavy Components ==== //
  const LazyNetworkCanvas = React.lazy(() => import('./components/NetworkCanvas'));
  const LazyMemberProfileModal = React.lazy(() => import('./components/MemberProfileModal'));
  const LazyNewDiscussionModal = React.lazy(() => import('./components/NewDiscussionModal'));

  // ==== Rest of original state declarations remain unchanged ==== 
  const { user } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'founders' | 'professionals' | 'discussions' | 'events'>('all');

  // Community Data States
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<PublicMember[]>([]);
  const [membersTotal, setMembersTotal] = useState(0);
  const [membersPage, setMembersPage] = useState(1);
  const [membersTotalPages, setMembersTotalPages] = useState(1);
  const [memberRoleFilter, setMemberRoleFilter] = useState<'all' | 'student' | 'founder' | 'professional'>('all');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [announcements, setAnnouncements] = useState<CommunityAnnouncement[]>([]);

  // Modal & Selection States
  const [selectedMember, setSelectedMember] = useState<PublicMember | null>(null);
  const [memberModalStatus, setMemberModalStatus] = useState<string>('none');
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [userConnections, setUserConnections] = useState<Record<string, string>>({});

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Core Stats & Overview
  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch('/api/community');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error('Failed to load overview:', err);
    }
  }, []);

  // Fetch Members with filtering
  const fetchMembers = useCallback(async () => {
    setMembersLoading(true);
    try {
      const params = new URLSearchParams();
      if (memberRoleFilter !== 'all') params.set('role', memberRoleFilter);
      if (searchMemberQuery.trim()) params.set('q', searchMemberQuery.trim());
      params.set('page', membersPage.toString());
      params.set('limit', '9');

      const res = await fetch(`/api/community/members?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setMembersTotal(data.total || 0);
        setMembersTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setMembersLoading(false);
    }
  }, [memberRoleFilter, searchMemberQuery, membersPage]);

  // Fetch Groups, Discussions & Events
  const fetchCommunityContent = useCallback(async () => {
    try {
      const [grpRes, discRes, evRes] = await Promise.all([
        fetch('/api/community/groups'),
        fetch('/api/community/discussions'),
        fetch('/api/community/events'),
      ]);

      if (grpRes.ok) {
        const data = await grpRes.json();
        setGroups(data.groups || []);
      }
      if (discRes.ok) {
        const data = await discRes.json();
        setDiscussions(data.discussions || []);
      }
      if (evRes.ok) {
        const data = await evRes.json();
        setEvents(data.events || []);
        if (data.announcements) setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error('Failed to load community content:', err);
      setError('Unable to load community content. Please refresh.');
    }
  }, []);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      await Promise.all([fetchOverview(), fetchMembers(), fetchCommunityContent()]);
      setLoading(false);
    }
    loadAll();
  }, [fetchOverview, fetchMembers, fetchCommunityContent]);

  // Handle Tab Switch
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'students') {
      setMemberRoleFilter('student');
    } else if (tab === 'founders') {
      setMemberRoleFilter('founder');
    } else if (tab === 'professionals') {
      setMemberRoleFilter('professional');
    } else if (tab === 'all') {
      setMemberRoleFilter('all');
    }
  };

  // Connection Handler
  const handleConnectToggle = async (targetUserId: string) => {
    if (!user) {
      showToast('Please sign in to send connection requests.');
      return;
    }

    try {
      const res = await fetch('/api/community/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });

      const data = await res.json();
      if (res.ok) {
        setUserConnections((prev) => ({ ...prev, [targetUserId]: data.status }));
        if (selectedMember && selectedMember.id === targetUserId) {
          setMemberModalStatus(data.status);
        }
        showToast(
          data.status === 'connected'
            ? 'Connection confirmed!'
            : data.status === 'pending_sent'
            ? 'Connection request sent successfully!'
            : 'Connection updated.'
        );
      } else {
        showToast(data.error || 'Failed to update connection.');
      }
    } catch {
      showToast('Network error while processing connection.');
    }
  };

  // Open Member Profile
  const handleViewProfile = async (member: PublicMember) => {
    setSelectedMember(member);
    if (userConnections[member.id]) {
      setMemberModalStatus(userConnections[member.id]);
    } else {
      try {
        const res = await fetch(`/api/community/members/${member.id}`);
        if (res.ok) {
          const data = await res.json();
          setMemberModalStatus(data.connectionStatus || 'none');
          setUserConnections((prev) => ({ ...prev, [member.id]: data.connectionStatus || 'none' }));
        }
      } catch {
        setMemberModalStatus('none');
      }
    }
  };

  // Discussion Like Toggle
  const handleLikeToggle = async (discussionId: string) => {
    if (!user) {
      showToast('Please sign in to like discussions.');
      return;
    }

    try {
      const res = await fetch(`/api/community/discussions/${discussionId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setDiscussions((prev) =>
          prev.map((d) => {
            if (d.id === discussionId) {
              const updatedLikes = data.isLiked
                ? [...d.likes, user.id]
                : d.likes.filter((uid) => uid !== user.id);
              return { ...d, likes: updatedLikes };
            }
            return d;
          })
        );
      }
    } catch {
      showToast('Error updating like status.');
    }
  };

  // Group Join Toggle
  const handleGroupJoinToggle = async (groupId: string) => {
    if (!user) {
      showToast('Please sign in to join community groups.');
      return;
    }

    try {
      const res = await fetch('/api/community/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId }),
      });

      if (res.ok) {
        const data = await res.json();
        setGroups((prev) =>
          prev.map((g) => {
            if (g.id === groupId) {
              const updatedMembers = data.isMember
                ? [...g.memberIds, user.id]
                : g.memberIds.filter((uid) => uid !== user.id);
              return {
                ...g,
                memberIds: updatedMembers,
                memberCount: data.isMember ? g.memberCount + 1 : Math.max(0, g.memberCount - 1),
              };
            }
            return g;
          })
        );
        showToast(data.isMember ? 'Joined group!' : 'Left group.');
      }
    } catch {
      showToast('Error updating group membership.');
    }
  };

  // Event RSVP Toggle
  const handleRsvpToggle = async (eventId: string) => {
    if (!user) {
      showToast('Please sign in to RSVP for community events.');
      return;
    }

    try {
      const res = await fetch('/api/community/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => {
            if (e.id === eventId) {
              const updatedRsvps = data.isRsvped
                ? [...e.rsvps, user.id]
                : e.rsvps.filter((uid) => uid !== user.id);
              return { ...e, rsvps: updatedRsvps };
            }
            return e;
          })
        );
        showToast(data.isRsvped ? 'RSVP confirmed! See you there.' : 'RSVP cancelled.');
      } else {
        showToast(data.error || 'Failed to update RSVP.');
      }
    } catch {
      showToast('Network error while updating RSVP.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-gray-900 text-white border border-indigo-500/40 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* ─── HERO SECTION WITH 3D NETWORK CANVAS ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-primary/5 via-transparent to-background">
        <NetworkCanvas />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              NexusHub Community & Networking
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
              Where Builders, Founders & Leaders Intersect.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Connect directly with verified students building breakthrough tech, venture founders launching MVPs, and senior engineering mentors across the globe.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  handleTabChange('all');
                  document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all transform active:scale-95"
              >
                Discover Members
              </button>
              <button
                onClick={() => {
                  handleTabChange('discussions');
                  document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-gray-200 text-sm font-bold backdrop-blur-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Join Discussions
              </button>
              <a
                href="#founder-connect"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500 transition-all"
              >
                Connect With Founder ↗
              </a>
            </div>

            {/* Live Ecosystem Metrics */}
            {stats && (
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                    {stats.totalMembers || '10+'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                    Verified Members
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {stats.studentsCount || '5+'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                    Student Builders
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-pink-600 dark:text-pink-400">
                    {stats.foundersCount || '4+'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                    Founders Circle
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {stats.professionalsCount || '3+'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                    Tech Leaders
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ─── DEDICATED FOUNDER & OFFICIAL CHANNELS SECTION ─── */}
        <FounderConnectSection />

        {/* ─── TRACK NAVIGATION / TAB SWITCHER ─── */}
        <div id="directory" className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 pb-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Community Hub & Directory
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Explore specialized tracks, real member profiles, and collaborative discussion rooms.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60">
              {[
                { id: 'all', label: 'All Community' },
                { id: 'students', label: '🎓 Students' },
                { id: 'founders', label: '🚀 Founders' },
                { id: 'professionals', label: '💼 Professionals' },
                { id: 'discussions', label: '💬 Discussions' },
                { id: 'events', label: '📅 Events' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── TAB CONTENT ─── */}
          {error && (
            <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Tab: Member Discovery (All, Students, Founders, Professionals) */}
          {['all', 'students', 'founders', 'professionals'].includes(activeTab) && (
            <div className="space-y-6">
              {/* Filter Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Filter Role:
                  </span>
                  {[
                    { id: 'all', label: 'All Roles' },
                    { id: 'student', label: 'Students' },
                    { id: 'founder', label: 'Founders' },
                    { id: 'professional', label: 'Professionals' },
                  ].map((roleOpt) => (
                    <button
                      key={roleOpt.id}
                      onClick={() => {
                        setMemberRoleFilter(roleOpt.id as any);
                        setMembersPage(1);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                        memberRoleFilter === roleOpt.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {roleOpt.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchMemberQuery}
                    onChange={(e) => {
                      setSearchMemberQuery(e.target.value);
                      setMembersPage(1);
                    }}
                    placeholder="Search by name, skill, or location..."
                    className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="absolute left-3 top-2 text-xs text-gray-400">🔍</span>
                </div>
              </div>

              {/* Members Grid or Loading/Empty State */}
              {membersLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="h-56 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/40 animate-pulse"
                    />
                  ))}
                </div>
              ) : members.length === 0 ? (
                <div className="p-16 text-center rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                  <span className="text-4xl mb-3 block">🌐</span>
                  <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
                    No members match your criteria
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4">
                    Try adjusting your search terms or clearing the role filters.
                  </p>
                  <button
                    onClick={() => {
                      setMemberRoleFilter('all');
                      setSearchMemberQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onViewProfile={handleViewProfile}
                      onConnect={handleConnectToggle}
                      connectionStatus={userConnections[member.id] || 'none'}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {membersTotalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">
                    Showing page {membersPage} of {membersTotalPages} ({membersTotal} total members)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMembersPage((p) => Math.max(1, p - 1))}
                      disabled={membersPage === 1}
                      className="px-3 py-1 rounded-xl text-xs font-medium border border-gray-300 dark:border-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setMembersPage((p) => Math.min(membersTotalPages, p + 1))}
                      disabled={membersPage === membersTotalPages}
                      className="px-3 py-1 rounded-xl text-xs font-medium border border-gray-300 dark:border-gray-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Discussions & Groups */}
          {activeTab === 'discussions' && (
            <DiscussionsSection
              groups={groups}
              discussions={discussions}
              onOpenNewDiscussion={() => {
                if (!user) {
                  showToast('Please sign in to start a community discussion.');
                  return;
                }
                setIsNewDiscussionOpen(true);
              }}
              onLikeToggle={handleLikeToggle}
              onGroupJoinToggle={handleGroupJoinToggle}
            />
          )}

          {/* Tab: Events & Announcements */}
          {activeTab === 'events' && (
            <EventsSection
              events={events}
              announcements={announcements}
              onRsvpToggle={handleRsvpToggle}
            />
          )}
        </div>
      </main>

      {/* ─── MODALS ─── */}
      <MemberProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        connectionStatus={memberModalStatus}
        onConnectToggle={handleConnectToggle}
      />

      <NewDiscussionModal
        groups={groups}
        isOpen={isNewDiscussionOpen}
        onClose={() => setIsNewDiscussionOpen(false)}
        onDiscussionCreated={() => {
          fetchCommunityContent();
          showToast('Discussion thread published successfully!');
        }}
      />
    </div>
  );
}
