'use client';

import React, { useState } from 'react';
import { CommunityGroup } from '@/app/lib/communityTypes';

interface NewDiscussionModalProps {
  groups: CommunityGroup[];
  isOpen: boolean;
  onClose: () => void;
  onDiscussionCreated: () => void;
}

export default function NewDiscussionModal({
  groups,
  isOpen,
  onClose,
  onDiscussionCreated,
}: NewDiscussionModalProps) {
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [track, setTrack] = useState<'student' | 'founder' | 'professional' | 'all'>('all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (content.trim().length < 10) {
      setError('Content must be at least 10 characters long.');
      return;
    }

    setLoading(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/community/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: groupId || groups[0]?.id,
          track,
          title: title.trim(),
          content: content.trim(),
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish discussion.');
      }

      setTitle('');
      setContent('');
      setTagsInput('');
      onDiscussionCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Start a Community Discussion
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Engage student developers, founders, or industry professionals.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Select Space / Group
              </label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Target Track
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Global (All Members)</option>
                <option value="student">Student Innovators</option>
                <option value="founder">Founders Circle</option>
                <option value="professional">Professional Leaders</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Discussion Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How are teams handling vector DB latency at scale?"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={150}
              required
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>Be specific and descriptive</span>
              <span>{title.length}/150</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Post Content & Context *
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide background, what you tried, questions you have, or resources you want to share..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              maxLength={5000}
              required
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>Markdown supported</span>
              <span>{content.length}/5000</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Next.js, Architecture, Startup, Mentorship"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/25 disabled:opacity-60"
            >
              {loading ? 'Publishing...' : 'Publish Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
