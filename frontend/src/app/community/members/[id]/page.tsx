'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PublicMember } from '@/app/lib/communityTypes';
import { useAuth } from '@/app/context/AuthContext';

export default function MemberPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [member, setMember] = useState<PublicMember | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('none');
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMember() {
      if (!id) return;
      try {
        const res = await fetch(`/api/community/members/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMember(data.member);
          setConnectionStatus(data.connectionStatus || 'none');
        } else {
          setError('Member profile not found.');
        }
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    loadMember();
  }, [id]);

  const handleConnect = async () => {
    if (!user) {
      alert('Please sign in to connect.');
      return;
    }
    setConnectLoading(true);
    try {
      const res = await fetch('/api/community/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setConnectionStatus(data.status);
      }
    } catch {
      alert('Error updating connection.');
    } finally {
      setConnectLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <span className="text-4xl mb-3">👤</span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Member Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">{error || 'This public profile could not be located.'}</p>
        <Link
          href="/community"
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
        >
          Back to Community Directory
        </Link>
      </div>
    );
  }

  const roleGradients: Record<string, string> = {
    student: 'from-emerald-500 to-teal-600',
    founder: 'from-pink-500 to-rose-600',
    professional: 'from-indigo-500 to-purple-600',
    admin: 'from-amber-500 to-orange-600',
  };

  const gradient = roleGradients[member.role] || 'from-gray-600 to-gray-800';

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          ← Back to Community
        </button>

        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {/* Banner */}
          <div className={`h-36 bg-gradient-to-r ${gradient} relative`} />

          <div className="p-6 sm:p-8 pt-0">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
              <div className="flex items-end gap-4">
                <div
                  className={`w-28 h-28 rounded-2xl bg-gradient-to-tr ${gradient} border-4 border-white dark:border-gray-900 flex items-center justify-center text-white text-4xl font-extrabold uppercase shadow-lg`}
                >
                  {member.fullName.charAt(0)}
                </div>
                <div className="mb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {member.fullName}
                    </h1>
                    {member.verificationStatus === 'verified' && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {member.headline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {member.role}
                </span>
                {user?.userId !== member.id && (
                  <button
                    onClick={handleConnect}
                    disabled={connectLoading}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      connectionStatus === 'connected'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : connectionStatus === 'pending_sent'
                        ? 'bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {connectLoading
                      ? '...'
                      : connectionStatus === 'connected'
                      ? '✓ Connected'
                      : connectionStatus === 'pending_sent'
                      ? 'Pending'
                      : '+ Connect'}
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="space-y-6 text-sm">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-y border-gray-100 dark:border-gray-800 py-3">
                <span>📍 {member.location || 'Global'}</span>
                <span>📅 Member since {new Date(member.joinedAt).toLocaleDateString()}</span>
                <span>🛡️ {member.verificationStatus === 'verified' ? 'Identity Verified' : 'Standard Member'}</span>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  About
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {member.bio || `${member.fullName} is a valued member of the NexusHub community.`}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Skills & Technical Domains
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {(member.linkedin || member.github || member.website) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Connect Externally
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20"
                      >
                        LinkedIn ↗
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20"
                      >
                        Website ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
