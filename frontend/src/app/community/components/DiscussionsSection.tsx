'use client';

import React, { useState } from 'react';
import { CommunityDiscussion, CommunityGroup, DiscussionReply } from '@/app/lib/communityTypes';
import { useAuth } from '@/app/context/AuthContext';

interface DiscussionsSectionProps {
  groups: CommunityGroup[];
  discussions: CommunityDiscussion[];
  onOpenNewDiscussion: () => void;
  onLikeToggle: (discussionId: string) => Promise<void>;
  onGroupJoinToggle: (groupId: string) => Promise<void>;
}

export default function DiscussionsSection({
  groups,
  discussions,
  onOpenNewDiscussion,
  onLikeToggle,
  onGroupJoinToggle,
}: DiscussionsSectionProps) {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDiscussionId, setExpandedDiscussionId] = useState<string | null>(null);
  const [repliesData, setRepliesData] = useState<Record<string, DiscussionReply[]>>({});
  const [replyInput, setReplyInput] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});

  const filteredDiscussions = discussions.filter((disc) => {
    if (selectedGroup !== 'all' && disc.groupId !== selectedGroup) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = disc.title.toLowerCase().includes(q);
      const matchContent = disc.content.toLowerCase().includes(q);
      const matchTags = disc.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }
    return true;
  });

  const toggleExpandReplies = async (discId: string) => {
    if (expandedDiscussionId === discId) {
      setExpandedDiscussionId(null);
      return;
    }

    setExpandedDiscussionId(discId);
    if (!repliesData[discId]) {
      try {
        const res = await fetch(`/api/community/discussions/${discId}`);
        if (res.ok) {
          const data = await res.json();
          setRepliesData((prev) => ({ ...prev, [discId]: data.replies || [] }));
        }
      } catch (err) {
        console.error('Failed to load replies:', err);
      }
    }
  };

  const handlePostReply = async (discId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    setReplyLoading(true);
    try {
      const res = await fetch(`/api/community/discussions/${discId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyInput.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setRepliesData((prev) => ({
          ...prev,
          [discId]: [...(prev[discId] || []), data.reply],
        }));
        setReplyInput('');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to post reply.');
      }
    } catch {
      alert('Network error while posting reply.');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleLike = async (discId: string) => {
    setLikeLoading((prev) => ({ ...prev, [discId]: true }));
    try {
      await onLikeToggle(discId);
    } finally {
      setLikeLoading((prev) => ({ ...prev, [discId]: false }));
    }
  };

  return (
    <div className="space-y-10">
      {/* Community Groups Carousel / Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>🏛️</span> Community Groups & Focused Guilds
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Join specialized tracks tailored to your background and projects.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => {
            const isJoined = user ? group.memberIds.includes(user.userId) : false;

            return (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
                  selectedGroup === group.id
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      {group.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      👥 {group.memberCount} members
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                    {group.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                    {group.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    {selectedGroup === group.id ? '● Active Filter' : 'Click to filter'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGroupJoinToggle(group.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                      isJoined
                        ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {isJoined ? '✓ Member' : '+ Join Group'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discussions Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedGroup === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Discussions
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all truncate max-w-[180px] ${
                selectedGroup === g.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="px-3.5 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary w-48 sm:w-60"
          />
          <button
            onClick={onOpenNewDiscussion}
            className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 shrink-0"
          >
            + New Thread
          </button>
        </div>
      </div>

      {/* Discussions Feed */}
      {filteredDiscussions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
          <span className="text-3xl mb-2 block">💬</span>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            No discussions found in this channel
          </h4>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Be the first community member to start a conversation here!
          </p>
          <button
            onClick={onOpenNewDiscussion}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            Start First Thread
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((disc) => {
            const isLiked = user ? disc.likes.includes(user.userId) : false;
            const replies = repliesData[disc.id] || [];
            const isExpanded = expandedDiscussionId === disc.id;

            return (
              <div
                key={disc.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  disc.pinned
                    ? 'border-indigo-400/40 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : 'border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70'
                }`}
              >
                <div className="p-5 sm:p-6">
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs">
                        {disc.authorName.charAt(0)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900 dark:text-white">
                            {disc.authorName}
                          </span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {disc.authorRole}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          in <span className="font-medium text-gray-600 dark:text-gray-300">{disc.groupName}</span> • {new Date(disc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {disc.pinned && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white flex items-center gap-1 shadow-sm">
                          📌 Pinned
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {disc.track} Track
                      </span>
                    </div>
                  </div>

                  {/* Title & Content */}
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                    {disc.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
                    {disc.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {disc.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Interaction bar */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      {/* Like button */}
                      <button
                        onClick={() => handleLike(disc.id)}
                        disabled={likeLoading[disc.id]}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                          isLiked
                            ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>{isLiked ? '❤️' : '🤍'}</span>
                        <span>{disc.likes.length}</span>
                      </button>

                      {/* Replies Toggle */}
                      <button
                        onClick={() => toggleExpandReplies(disc.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span>💬</span>
                        <span>{disc.repliesCount} {disc.repliesCount === 1 ? 'Reply' : 'Replies'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleExpandReplies(disc.id)}
                      className="text-primary hover:underline font-semibold"
                    >
                      {isExpanded ? 'Hide Discussion ↑' : 'Participate & Reply ↓'}
                    </button>
                  </div>
                </div>

                {/* Expanded Replies Section */}
                {isExpanded && (
                  <div className="bg-gray-50/80 dark:bg-gray-950/50 p-5 sm:p-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Replies & Peer Insights ({replies.length})
                    </h5>

                    {replies.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">
                        No responses yet. Share your thoughts or answer the question!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-gray-900 dark:text-white">
                                  {rep.authorName}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-primary/10 text-primary">
                                  {rep.authorRole}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400">
                                {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {rep.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Post a reply form */}
                    <form onSubmit={(e) => handlePostReply(disc.id, e)} className="pt-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          placeholder="Write a constructive reply..."
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                          maxLength={2500}
                          required
                        />
                        <button
                          type="submit"
                          disabled={replyLoading}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-60 shrink-0"
                        >
                          {replyLoading ? 'Posting...' : 'Reply'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
