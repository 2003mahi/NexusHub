'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message);
      } else {
        setError(data.error || 'Reset failed.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">NexusHub</h1>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Set your new password</p>
        </div>

        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/40">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{success}</h2>
              <Link href="/auth/login" className="inline-block w-full mt-4 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl text-center hover:from-indigo-500 hover:to-purple-500 transition-all">
                Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="reset-token" className="block text-sm font-medium text-gray-300 mb-1.5">Reset Token</label>
                  <input
                    id="reset-token"
                    type="text"
                    required
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 font-mono text-sm"
                    placeholder="Paste your reset token"
                  />
                </div>

                <div>
                  <label htmlFor="reset-password" className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      id="reset-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 pr-12"
                      placeholder="Min 8 chars, upper, lower, number"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} /></svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="reset-confirm" className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                  <input
                    id="reset-confirm"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                    placeholder="Confirm your new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Resetting...
                    </span>
                  ) : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">← Back to Sign In</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
