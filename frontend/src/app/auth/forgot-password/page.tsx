'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message);
        if (data.resetToken) setResetToken(data.resetToken);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-amber-600/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">NexusHub</h1>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Reset your password</p>
        </div>

        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/40">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-gray-400 text-sm mb-4">{success}</p>

              {resetToken && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-left mb-4">
                  <p className="text-xs text-indigo-400 font-medium mb-1">🔑 Demo: Reset Token</p>
                  <p className="text-xs text-gray-400 break-all font-mono">{resetToken}</p>
                </div>
              )}

              <Link href="/auth/reset-password" className="inline-block w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl text-center hover:from-indigo-500 hover:to-purple-500 transition-all">
                Reset Password
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

              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                </div>
                <p className="text-gray-400 text-sm">Enter your email and we&apos;ll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                    placeholder="you@example.com"
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
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
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
