'use client';

import React, { useState } from 'react';
import { NotificationItem } from '../types';

interface NotificationsTabProps {
  notifications: NotificationItem[];
  onMarkRead: (notificationId?: string) => Promise<{ success: boolean; error?: string }>;
  onDeleteNotification: (notificationId: string) => Promise<{ success: boolean; error?: string }>;
}

const typeStyles: Record<
  NotificationItem['type'],
  { badge: string; icon: string }
> = {
  info: { badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25', icon: 'ℹ️' },
  success: { badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25', icon: '✓' },
  warning: { badge: 'bg-amber-500/10 text-amber-300 border-amber-500/25', icon: '⚠️' },
  security: { badge: 'bg-rose-500/10 text-rose-300 border-rose-500/25', icon: '🔒' },
};

export default function NotificationsTab({
  notifications,
  onMarkRead,
  onDeleteNotification,
}: NotificationsTabProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayedNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleMarkAllRead = async () => {
    setBusyId('all');
    await onMarkRead();
    setBusyId(null);
  };

  const handleMarkSingle = async (id: string) => {
    setBusyId(id);
    await onMarkRead(id);
    setBusyId(null);
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    await onDeleteNotification(id);
    setBusyId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-white">Notifications Center</h2>
              {unreadCount > 0 && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              System alerts, application updates, and network notifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.06]">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filter === 'unread' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={busyId === 'all'}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors"
              >
                {busyId === 'all' ? 'Updating...' : 'Mark all read'}
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {displayedNotifications.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="text-4xl block mb-2">🎉</span>
            <h4 className="text-base font-semibold text-white">All caught up!</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
              {filter === 'unread'
                ? 'No unread notifications at the moment.'
                : 'No notification records exist for your account.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05] mt-2">
            {displayedNotifications.map((notif) => {
              const cfg = typeStyles[notif.type] || typeStyles.info;
              const dateStr = new Date(notif.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={notif.id}
                  className={`py-4 px-3 sm:px-4 rounded-xl transition-all flex items-start justify-between gap-4 ${
                    !notif.read ? 'bg-indigo-500/[0.04]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border flex-shrink-0 mt-0.5 ${cfg.badge}`}
                    >
                      {cfg.icon}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">{notif.title}</h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                      <span className="text-[11px] text-gray-500 font-mono mt-2 block">{dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkSingle(notif.id)}
                        disabled={busyId === notif.id}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-white/[0.05] transition-colors"
                      >
                        Mark read
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(notif.id)}
                      disabled={busyId === notif.id}
                      className="text-gray-500 hover:text-rose-400 text-xs p-1"
                      title="Delete notification"
                    >
                      ✕
                    </button>
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
