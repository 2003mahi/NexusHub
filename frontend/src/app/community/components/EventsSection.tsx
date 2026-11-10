'use client';

import React, { useState } from 'react';
import { CommunityEvent, CommunityAnnouncement } from '@/app/lib/communityTypes';
import { useAuth } from '@/app/context/AuthContext';

interface EventsSectionProps {
  events: CommunityEvent[];
  announcements: CommunityAnnouncement[];
  onRsvpToggle: (eventId: string) => Promise<void>;
}

export default function EventsSection({
  events,
  announcements,
  onRsvpToggle,
}: EventsSectionProps) {
  const { user } = useAuth();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [rsvpLoading, setRsvpLoading] = useState<Record<string, boolean>>({});

  const filteredEvents = events.filter((ev) => {
    if (filterCategory === 'all') return true;
    return ev.category === filterCategory;
  });

  const handleRsvp = async (eventId: string) => {
    setRsvpLoading((prev) => ({ ...prev, [eventId]: true }));
    try {
      await onRsvpToggle(eventId);
    } finally {
      setRsvpLoading((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  return (
    <div className="space-y-12">
      {/* Official Announcements Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📢</span> Official Announcements & Milestones
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Direct updates from NexusHub leadership and core engineering.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                ann.pinned
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60'
                  : 'bg-white/80 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {ann.category}
                </span>
                <span className="text-xs text-gray-400">{ann.date}</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                {ann.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                {ann.content}
              </p>
              <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Posted by <span className="text-indigo-600 dark:text-indigo-400">{ann.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Calendar & RSVP */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📅</span> Upcoming Community Events & Townhalls
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Interactive sessions, project showcases, and founder masterclasses.
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'ama', label: 'Townhalls & AMAs' },
              { id: 'pitch', label: 'Pitch Nights' },
              { id: 'workshop', label: 'Masterclasses' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  filterCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
            <span className="text-3xl mb-2 block">🗓️</span>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No events found for this filter
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Check back soon or suggest a community event in the discussion space.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {filteredEvents.map((ev) => {
              const isRsvped = user ? ev.rsvps.includes(user.userId) : false;
              const isFull = ev.maxCapacity ? ev.rsvps.length >= ev.maxCapacity : false;

              return (
                <div
                  key={ev.id}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Event Header with Date Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center shrink-0">
                        <span className="block text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                          {ev.date.split(' ')[0]}
                        </span>
                        <span className="block text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
                          {ev.date.split(' ')[1]?.replace(',', '') || '15'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-1">
                          {ev.category}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug line-clamp-2">
                          {ev.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {ev.description}
                    </p>

                    <div className="space-y-1.5 text-[11px] text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <span>⏰</span>
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>📍</span>
                        <span className="truncate">{ev.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>🎙️</span>
                        <span>Hosted by {ev.organizer.name} ({ev.organizer.role})</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {ev.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* RSVP & Action Bar */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      👥 {ev.rsvps.length} {ev.rsvps.length === 1 ? 'Attending' : 'Attending'}
                    </div>

                    <div className="flex items-center gap-2">
                      {ev.meetingUrl && (
                        <a
                          href={ev.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          Link ↗
                        </a>
                      )}
                      <button
                        onClick={() => handleRsvp(ev.id)}
                        disabled={rsvpLoading[ev.id] || (isFull && !isRsvped)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isRsvped
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : isFull
                            ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20'
                        }`}
                      >
                        {rsvpLoading[ev.id]
                          ? 'Updating...'
                          : isRsvped
                          ? '✓ Attending'
                          : isFull
                          ? 'Fully Booked'
                          : 'RSVP Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
