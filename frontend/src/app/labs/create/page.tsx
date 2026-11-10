'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '@/app/context/AuthContext';

const CATEGORIES = [
  { value: 'ai-ml', label: 'AI & Machine Learning' },
  { value: 'web-dev', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'iot', label: 'IoT & Embedded' },
  { value: 'cloud', label: 'Cloud & DevOps' },
  { value: 'sustainability', label: 'Sustainability & Climate' },
  { value: 'healthcare', label: 'Healthcare & Biotech' },
  { value: 'education', label: 'Education Tech' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'open-innovation', label: 'Open Innovation' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export default function CreateChallengePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: 'ai-ml',
    difficulty: 'intermediate',
    description: '',
    problemStatement: '',
    objectives: '',
    deliverables: '',
    skills: '',
    tags: '',
    prizes: '',
    timeline: '6 weeks sprint with bi-weekly check-ins',
    deadline: '',
    minTeamSize: 1,
    maxTeamSize: 4,
    isPublic: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Please sign in to publish a challenge.');
      return;
    }

    if (!['founder', 'professional', 'admin'].includes(user.role)) {
      setError('Only Founders, Professionals, and Admins can create challenges.');
      return;
    }

    if (formData.title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (formData.description.trim().length < 30) {
      setError('Description must be at least 30 characters long.');
      return;
    }
    if (formData.problemStatement.trim().length < 30) {
      setError('Problem statement must be at least 30 characters long.');
      return;
    }
    if (!formData.deadline) {
      setError('Please specify a valid deadline date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        organization: formData.organization.trim() || user.fullName,
        category: formData.category,
        difficulty: formData.difficulty,
        description: formData.description.trim(),
        problemStatement: formData.problemStatement.trim(),
        objectives: formData.objectives.split('\n').map((s) => s.trim()).filter(Boolean),
        deliverables: formData.deliverables.split('\n').map((s) => s.trim()).filter(Boolean),
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
        prizes: formData.prizes.split('\n').map((s) => s.trim()).filter(Boolean),
        timeline: formData.timeline.trim(),
        deadline: new Date(formData.deadline).toISOString(),
        minTeamSize: Number(formData.minTeamSize) || 1,
        maxTeamSize: Number(formData.maxTeamSize) || 4,
        isPublic: formData.isPublic,
      };

      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create challenge.');
      }

      setSuccess('Challenge created successfully! Redirecting...');
      setTimeout(() => {
        router.push(`/labs/${data.challenge.id}`);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const isAuthorized = user && ['founder', 'professional', 'admin'].includes(user.role);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 text-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Top Bar */}
          <div className="mb-8">
            <Link href="/labs" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5 mb-3">
              ← Back to Labs Marketplace
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Create Real-World Challenge
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Publish a challenge or project proposal for developers, designers, and innovators to solve.
            </p>
          </div>

          {!authLoading && !user && (
            <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800 text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h2 className="text-lg font-bold text-white mb-2">Verification Required</h2>
              <p className="text-gray-400 text-sm mb-4">You need a verified profile with Founder, Professional, or Admin role to post challenges.</p>
              <Link href="/get-verified" className="px-5 py-2.5 bg-[#ea4e1b] hover:bg-[#d43b0c] text-white rounded-xl text-sm font-semibold inline-block">
                Get Verified
              </Link>
            </div>
          )}

          {!authLoading && user && !isAuthorized && (
            <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h2 className="text-lg font-bold text-amber-300 mb-2">Restricted Access</h2>
              <p className="text-gray-300 text-sm mb-4">
                Challenge creation is reserved for verified Founders, Professionals, and Administrators. Your current role is <span className="font-semibold text-white uppercase">{user.role}</span>.
              </p>
              <Link href="/labs" className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold inline-block">
                Explore & Solve Challenges
              </Link>
            </div>
          )}

          {isAuthorized && (
            <form onSubmit={handleSubmit} className="space-y-8 bg-gray-900/60 p-6 md:p-8 rounded-2xl border border-gray-800/80 shadow-xl">
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                  {success}
                </div>
              )}

              {/* Basic Details */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white border-b border-gray-800 pb-2">1. Overview & Categorization</h2>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Challenge Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Decentralized Carbon Credit Verification Protocol"
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Hosting Organization / Lab</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder={user.fullName || 'NexusHub Labs'}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Domain / Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Difficulty Level *</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Executive Summary * (min 30 chars)</label>
                  <textarea
                    name="description"
                    rows={2}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief high-level summary explaining what this challenge aims to solve..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Problem Statement & Objectives */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white border-b border-gray-800 pb-2">2. Problem Statement & Scope</h2>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Real-World Problem Statement * (min 30 chars)</label>
                  <textarea
                    name="problemStatement"
                    rows={4}
                    required
                    value={formData.problemStatement}
                    onChange={handleChange}
                    placeholder="Explain the background, existing pain points, market inefficiencies, or technological hurdles..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Key Objectives (one per line)</label>
                    <textarea
                      name="objectives"
                      rows={4}
                      value={formData.objectives}
                      onChange={handleChange}
                      placeholder="Build tamper-proof logging&#10;Implement sub-second latency&#10;Provide developer SDK"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Expected Deliverables (one per line)</label>
                    <textarea
                      name="deliverables"
                      rows={4}
                      value={formData.deliverables}
                      onChange={handleChange}
                      placeholder="Open-source repository&#10;Working deployment demo&#10;Architecture paper or presentation"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Skills, Prizes, & Timeline */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white border-b border-gray-800 pb-2">3. Requirements & Rewards</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Recommended Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="Python, PyTorch, React, Docker, Rust"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="AI, Climate, Web3, SmartContracts"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Submission Deadline *</label>
                    <input
                      type="date"
                      name="deadline"
                      required
                      value={formData.deadline}
                      onChange={handleChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Min Team Size</label>
                    <input
                      type="number"
                      name="minTeamSize"
                      min={1}
                      max={10}
                      value={formData.minTeamSize}
                      onChange={handleChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Max Team Size</label>
                    <input
                      type="number"
                      name="maxTeamSize"
                      min={1}
                      max={10}
                      value={formData.maxTeamSize}
                      onChange={handleChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Prizes & Recognition (one per line)</label>
                  <textarea
                    name="prizes"
                    rows={3}
                    value={formData.prizes}
                    onChange={handleChange}
                    placeholder="$10,000 Grand Prize&#10;Incubation & Seed Funding Intro&#10;NexusHub Labs Featured Showcase"
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <Link
                  href="/labs"
                  className="px-5 py-2.5 rounded-xl border border-gray-800 hover:border-gray-700 text-gray-400 text-sm font-medium transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Challenge'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
