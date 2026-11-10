'use client';

import React, { useState } from 'react';
import { UserAuthData, UserSettingsData } from '../types';

interface SettingsTabProps {
  user: UserAuthData;
  settings: UserSettingsData;
  onUpdateSettings: (data: Partial<UserSettingsData>) => Promise<{ success: boolean; error?: string }>;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
}

export default function SettingsTab({
  user,
  settings,
  onUpdateSettings,
  onChangePassword,
  onLogout,
}: SettingsTabProps) {
  // Settings local state
  const [emailNotifs, setEmailNotifs] = useState(settings.emailNotifications);
  const [marketingEmails, setMarketingEmails] = useState(settings.marketingEmails);
  const [securityAlerts, setSecurityAlerts] = useState(settings.securityAlerts);
  const [profileVisibility, setProfileVisibility] = useState(settings.profileVisibility);
  const [twoFactor, setTwoFactor] = useState(settings.twoFactorEnabled);
  const [themePref, setThemePref] = useState(settings.themePreference);

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password local state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password strength check
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsFeedback(null);

    try {
      const res = await onUpdateSettings({
        emailNotifications: emailNotifs,
        marketingEmails,
        securityAlerts,
        profileVisibility,
        twoFactorEnabled: twoFactor,
        themePreference: themePref,
      });

      if (res.success) {
        setSettingsFeedback({ type: 'success', text: 'Preferences saved successfully!' });
      } else {
        setSettingsFeedback({ type: 'error', text: res.error || 'Failed to save preferences.' });
      }
    } catch {
      setSettingsFeedback({ type: 'error', text: 'Network error saving settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback({ type: 'error', text: 'All password fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (strengthScore < 4) {
      setPasswordFeedback({
        type: 'error',
        text: 'Password must have 8+ characters, uppercase, lowercase, and a number.',
      });
      return;
    }

    setChangingPassword(true);
    try {
      const res = await onChangePassword(currentPassword, newPassword, confirmPassword);
      if (res.success) {
        setPasswordFeedback({ type: 'success', text: 'Password successfully updated!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordFeedback({ type: 'error', text: res.error || 'Failed to change password.' });
      }
    } catch {
      setPasswordFeedback({ type: 'error', text: 'Network error updating password.' });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ── 1. Account Preferences Form ──────────────────────────────────── */}
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Account & Privacy Settings</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Control your visibility across the network and manage automated communication triggers.
            </p>
          </div>
          <span className="text-xs font-mono text-gray-500">User ID: {user.id.slice(0, 8)}...</span>
        </div>

        {settingsFeedback && (
          <div
            className={`p-3.5 mb-6 rounded-xl border text-xs ${
              settingsFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {settingsFeedback.type === 'success' ? '✓ ' : '⚠️ '}
            {settingsFeedback.text}
          </div>
        )}

        <form onSubmit={handleSavePreferences} className="space-y-6">
          {/* Notification Preferences */}
          <div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
              Notification Preferences
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-colors">
                <div>
                  <span className="text-xs font-semibold text-white block">Email Notifications</span>
                  <span className="text-[11px] text-gray-400">
                    Receive email alerts when your applications change status or mentors reply.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-white/10 border-white/20"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-colors">
                <div>
                  <span className="text-xs font-semibold text-white block">Initiatives & Grants Digest</span>
                  <span className="text-[11px] text-gray-400">
                    Weekly curated opportunities matching your role and skill matrix.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={marketingEmails}
                  onChange={(e) => setMarketingEmails(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-white/10 border-white/20"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-colors">
                <div>
                  <span className="text-xs font-semibold text-white block">Security Alerts</span>
                  <span className="text-[11px] text-gray-400">
                    Instant alerts for credential updates, new logins, or vault deletions.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={securityAlerts}
                  onChange={(e) => setSecurityAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-white/10 border-white/20"
                />
              </label>
            </div>
          </div>

          {/* Privacy & Visibility */}
          <div className="pt-4 border-t border-white/[0.06]">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
              Profile Visibility Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'public', title: 'Public Directory', desc: 'Discoverable by all ecosystem members.' },
                { id: 'network', title: 'Network Only', desc: 'Visible only to verified mentors & founders.' },
                { id: 'private', title: 'Private Vault', desc: 'Hidden except when submitting applications.' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setProfileVisibility(opt.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    profileVisibility === opt.id
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{opt.title}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Factor Authentication Toggle */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <span className="text-xs font-semibold text-white block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-gray-400">
                  Adds cryptographic secondary verification layer on session issuance.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactor(!twoFactor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  twoFactor
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/[0.05] text-gray-400 border border-white/[0.1]'
                }`}
              >
                {twoFactor ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
            >
              {savingSettings ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>

      {/* ── 2. Password Security Form ────────────────────────────────────── */}
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Update Password</h2>
        <p className="text-xs text-gray-400 mb-6">
          Ensure your account uses a secure password with letters and numbers.
        </p>

        {passwordFeedback && (
          <div
            className={`p-3.5 mb-6 rounded-xl border text-xs ${
              passwordFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {passwordFeedback.type === 'success' ? '✓ ' : '⚠️ '}
            {passwordFeedback.text}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />

            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthScore <= 1
                        ? 'w-1/4 bg-rose-500'
                        : strengthScore === 2
                        ? 'w-2/4 bg-amber-500'
                        : strengthScore === 3
                        ? 'w-3/4 bg-blue-500'
                        : 'w-full bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] text-gray-400">
                  <span className={hasMinLength ? 'text-emerald-400' : 'text-gray-500'}>8+ chars</span>
                  <span className={hasUpper ? 'text-emerald-400' : 'text-gray-500'}>Uppercase</span>
                  <span className={hasLower ? 'text-emerald-400' : 'text-gray-500'}>Lowercase</span>
                  <span className={hasNumber ? 'text-emerald-400' : 'text-gray-500'}>Number</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* ── 3. Danger Zone ────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-rose-950/20 border border-rose-500/20 p-6 sm:p-8">
        <h3 className="text-base font-bold text-rose-300 mb-1">Session Management</h3>
        <p className="text-xs text-gray-400 mb-4">
          Terminate active cryptographic sessions on all devices or sign out of your account.
        </p>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors"
        >
          Sign Out of NexusHub
        </button>
      </div>
    </div>
  );
}
