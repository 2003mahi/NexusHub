'use client';

import React, { useState } from 'react';
import { UserAuthData, UserProfileData, DocumentItem } from '../types';

interface VerificationTabProps {
  user: UserAuthData;
  profile: UserProfileData;
  documents: DocumentItem[];
  onRequestVerification: () => Promise<{ success: boolean; error?: string }>;
  onGoToDocuments: () => void;
}

export default function VerificationTab({
  user,
  profile,
  documents,
  onRequestVerification,
  onGoToDocuments,
}: VerificationTabProps) {
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const idDocs = documents.filter((d) => d.category === 'id_verification');
  const hasIdDoc = idDocs.length > 0;
  const isPending = profile.verificationStatus === 'pending';
  const isVerified = user.emailVerified && profile.verificationStatus === 'verified';

  const handleSubmitVerification = async () => {
    setMsg(null);
    if (!hasIdDoc) {
      setMsg({
        type: 'error',
        text: 'Please upload an ID verification document in the vault before submitting.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await onRequestVerification();
      if (res.success) {
        setMsg({
          type: 'success',
          text: 'Verification application submitted! Compliance will review within 24-48 hours.',
        });
      } else {
        setMsg({ type: 'error', text: res.error || 'Failed to submit verification request.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ── Status Banner ─────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-gradient-to-br from-[#12182B] via-[#0E1322] to-[#0A0D18] border border-white/[0.09] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Trust & Compliance Center
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Identity & Ecosystem Verification
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 max-w-xl">
            NexusHub maintains a high-trust network for innovators, founders, and academic partners through rigorous cryptographic and credential verification.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl self-start md:self-auto">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
            {isVerified ? '🛡️' : isPending ? '⏳' : '⚠️'}
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium block">Current Status</span>
            <span
              className={`text-sm font-bold ${
                isVerified
                  ? 'text-emerald-400'
                  : isPending
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {isVerified ? 'Fully Verified Member' : isPending ? 'Under Compliance Review' : 'Action Required'}
            </span>
          </div>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-2xl border text-xs ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          }`}
        >
          {msg.type === 'success' ? '✓ ' : '⚠️ '}
          {msg.text}
        </div>
      )}

      {/* ── 2-Tier Verification Breakdown ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier 1: Email Verification */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Tier 1 Verification
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  user.emailVerified
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}
              >
                {user.emailVerified ? 'Completed' : 'Pending'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">Email Address Ownership</h3>
            <p className="text-xs text-gray-400">
              Validates that you own <span className="text-white font-mono">{user.email}</span> and receive vital security and application alerts.
            </p>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-400">Registered Email</span>
              <span className="text-white font-medium truncate max-w-[180px]">{user.email}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            {user.emailVerified ? (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <span>✓</span> Email verified and securely linked to session tokens.
              </p>
            ) : (
              <p className="text-xs text-amber-300">
                Verification link was dispatched during signup. Check your inbox or spam folder.
              </p>
            )}
          </div>
        </div>

        {/* Tier 2: Identity & Academic / Professional Credentials */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Tier 2 Verification
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  isVerified
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : isPending
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    : 'bg-white/[0.05] text-gray-400 border-white/[0.1]'
                }`}
              >
                {isVerified ? 'Verified' : isPending ? 'In Review' : 'Not Submitted'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">Government ID or Academic Proof</h3>
            <p className="text-xs text-gray-400">
              Upload a valid Passport, National ID, Student Card, or Business Registration in your encrypted vault.
            </p>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-400">Verification Documents</span>
              <span className="text-white font-medium">
                {idDocs.length} {idDocs.length === 1 ? 'file' : 'files'} attached
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-3">
            {!hasIdDoc ? (
              <button
                onClick={onGoToDocuments}
                className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-md text-center"
              >
                Upload ID Document in Vault →
              </button>
            ) : isPending ? (
              <button
                disabled
                className="w-full py-2.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl cursor-default text-center"
              >
                Compliance Review Pending
              </button>
            ) : isVerified ? (
              <div className="w-full py-2 text-xs font-semibold text-emerald-400 text-center">
                ✓ Identity Verified & Good Standing
              </div>
            ) : (
              <button
                onClick={handleSubmitVerification}
                disabled={submitting}
                className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl shadow-lg transition-all"
              >
                {submitting ? 'Submitting Application...' : 'Submit Verification Request'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Verified Member Perks ─────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">
          Verified Credential Ecosystem Privileges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: '🌟',
              title: 'Gold Trust Badge',
              desc: 'Displays verified badge on your profile and applications.',
            },
            {
              icon: '💰',
              title: 'Exclusive Grants',
              desc: 'Eligible for equity-free fellowship and venture capital grants.',
            },
            {
              icon: '🤝',
              title: 'Direct Mentorship',
              desc: 'Priority booking for 1-on-1 sessions with industry leaders.',
            },
            {
              icon: '🛡️',
              title: 'Enterprise Trust',
              desc: 'Zero-knowledge verification preserves privacy across organizations.',
            },
          ].map((perk) => (
            <div
              key={perk.title}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center"
            >
              <span className="text-2xl block mb-2">{perk.icon}</span>
              <h4 className="text-xs font-bold text-white mb-1">{perk.title}</h4>
              <p className="text-[11px] text-gray-400">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
