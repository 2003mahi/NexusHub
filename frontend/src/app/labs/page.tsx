'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/app/context/AuthContext';

interface Challenge {
  id: string;
  title: string;
  organization: string;
  category: string;
  difficulty: string;
  status: string;
  description: string;
  skills: string[];
  tags: string[];
  prizes: string[];
  deadline: string;
  participantCount: number;
  submissionCount: number;
  featured: boolean;
  mentors: { id: string; name: string; expertise: string[] }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface Stats {
  totalChallenges: number;
  openChallenges: number;
  totalParticipants: number;
  totalSubmissions: number;
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: '🌐' },
  { value: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖' },
  { value: 'web-dev', label: 'Web Development', icon: '🌍' },
  { value: 'mobile', label: 'Mobile', icon: '📱' },
  { value: 'data-science', label: 'Data Science', icon: '📊' },
  { value: 'cybersecurity', label: 'Cybersecurity', icon: '🔒' },
  { value: 'blockchain', label: 'Blockchain', icon: '⛓️' },
  { value: 'iot', label: 'IoT', icon: '📡' },
  { value: 'cloud', label: 'Cloud', icon: '☁️' },
  { value: 'sustainability', label: 'Sustainability', icon: '🌱' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'fintech', label: 'FinTech', icon: '💰' },
  { value: 'open-innovation', label: 'Open Innovation', icon: '💡' },
];

const DIFFICULTIES = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'deadline', label: 'Deadline (Soonest)' },
  { value: 'participants', label: 'Most Participants' },
  { value: 'difficulty', label: 'Difficulty (Ascending)' },
];

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  advanced: 'bg-amber-50 text-amber-700 border-amber-200',
  expert: 'bg-red-50 text-red-700 border-red-200',
};

export default function LabsPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/labs?stats=true');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch { /* ignore */ }
  }, []);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (category !== 'all') params.set('category', category);
      if (difficulty !== 'all') params.set('difficulty', difficulty);
      params.set('sortBy', sortBy);
      params.set('page', String(page));
      params.set('limit', '9');

      const res = await fetch(`/api/labs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setChallenges(data.items || []);
      setPagination(data.pagination || null);
    } catch {
      setError('Failed to load challenges. Please try again.');
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, difficulty, sortBy, page]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchChallenges(); }, [fetchChallenges]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchChallenges();
  };

  const daysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days left` : 'Expired';
  };

  const getCategoryIcon = (cat: string) => CATEGORIES.find((c) => c.value === cat)?.icon || '💡';

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbfaf8] text-[#141413] min-h-screen selection:bg-[#ea4e1b]/15 selection:text-[#ea4e1b]">
        {/* ─── Hero Section ─── */}
        <section className="relative overflow-hidden">
          {/* Subtle warm ambient glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#fed7aa]/20 via-[#fde68a]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-200/90 bg-white/80 backdrop-blur-sm shadow-xs mb-6">
                <svg className="w-3.5 h-3.5 text-[#ea4e1b]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                  Innovation Platform
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-[#141413] leading-[1.06] mb-6">
                NexusHub <span className="font-editorial-italic font-normal italic text-[#ea4e1b]">Labs</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Tackle real-world challenges, build innovative solutions, and collaborate with brilliant minds.
                From AI climate prediction to decentralized identity — solve problems that matter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#challenges" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-base font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Explore Challenges →
                </a>
                {user && ['founder', 'professional', 'admin'].includes(user.role) && (
                  <Link href="/labs/create" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-base font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Create Challenge
                  </Link>
                )}
                {user && (
                  <Link href="/labs/submissions" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-base font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]">
                    My Submissions
                  </Link>
                )}
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
                {[
                  { label: 'Active Challenges', value: stats.openChallenges, icon: '🎯' },
                  { label: 'Total Challenges', value: stats.totalChallenges, icon: '🧪' },
                  { label: 'Participants', value: stats.totalParticipants, icon: '👥' },
                  { label: 'Submissions', value: stats.totalSubmissions, icon: '📦' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-5 rounded-2xl bg-white border border-[#f0ede6] luxury-card-shadow hover:border-[#ea4e1b]/30 transition-all duration-300">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-3xl font-extrabold text-[#141413]">{stat.value}</div>
                    <div className="text-xs font-medium text-stone-500 mt-1 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── How it Works ─── */}
        <section className="py-20 bg-white border-t border-[#f0ede6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">
                Step by Step
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141413] tracking-tight mt-2">How Labs Works</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Discover', desc: 'Browse real-world challenges across AI, security, healthcare, and more.' },
                { step: '02', title: 'Join & Team Up', desc: 'Register for challenges, find teammates, and connect with mentors.' },
                { step: '03', title: 'Build & Submit', desc: 'Develop your solution, push code, and submit your project proposal.' },
                { step: '04', title: 'Get Feedback', desc: 'Receive expert mentorship feedback, iterate, and win prizes.' },
              ].map((item) => (
                <div key={item.step} className="p-8 rounded-3xl bg-[#fbfaf8] border border-[#f0ede6] hover:border-[#ea4e1b]/30 transition-all duration-300">
                  <div className="text-3xl font-extrabold text-[#ea4e1b] mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Search & Filters ─── */}
        <section id="challenges" className="py-16 border-t border-[#f0ede6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">
                  Explore
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141413] tracking-tight mt-2">Challenge Marketplace</h2>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-full bg-white border border-stone-300 text-sm text-stone-700 font-semibold hover:border-[#ea4e1b]/40 transition-colors md:hidden"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'} ▾
              </button>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  placeholder="Search challenges by title, skill, technology, or keyword..."
                  className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-white border border-[#f0ede6] text-[#141413] placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b]/50 focus:ring-1 focus:ring-[#ea4e1b]/20 transition-all duration-300 luxury-card-shadow"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Filter bar */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#f0ede6] text-stone-700 text-sm focus:outline-none focus:border-[#ea4e1b]/50 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
              <select
                value={difficulty}
                onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#f0ede6] text-stone-700 text-sm focus:outline-none focus:border-[#ea4e1b]/50 transition-colors"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#f0ede6] text-stone-700 text-sm focus:outline-none focus:border-[#ea4e1b]/50 transition-colors"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* ─── Results ─── */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-3xl bg-white border border-[#f0ede6] p-6 animate-pulse luxury-card-shadow">
                    <div className="h-4 w-24 bg-stone-100 rounded mb-4" />
                    <div className="h-6 w-3/4 bg-stone-100 rounded mb-3" />
                    <div className="h-4 w-full bg-stone-100 rounded mb-2" />
                    <div className="h-4 w-5/6 bg-stone-100 rounded mb-6" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-stone-100 rounded-full" />
                      <div className="h-6 w-16 bg-stone-100 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-stone-500 mb-4">{error}</p>
                <button onClick={fetchChallenges} className="px-6 py-2.5 bg-[#ea4e1b] hover:bg-[#d43b0c] text-white rounded-full font-semibold transition-colors">
                  Retry
                </button>
              </div>
            ) : challenges.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔬</div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">No Challenges Found</h3>
                <p className="text-stone-500 mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={() => { setSearchQuery(''); setCategory('all'); setDifficulty('all'); setPage(1); }} className="px-6 py-2.5 bg-white hover:bg-stone-50 text-stone-800 rounded-full border border-stone-300 font-semibold transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challenges.map((challenge) => (
                    <Link key={challenge.id} href={`/labs/${challenge.id}`}>
                      <div className="group bg-white border border-[#f0ede6] rounded-3xl p-6 hover:border-[#ea4e1b]/40 luxury-card-shadow transition-all duration-300 cursor-pointer h-full flex flex-col hover:scale-[1.01]">
                        {/* Featured badge */}
                        {challenge.featured && (
                          <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff5f0] border border-[#fed7aa] text-[11px] font-semibold text-[#ea4e1b] mb-3">
                            ⭐ Featured
                          </div>
                        )}

                        {/* Category & Difficulty */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{getCategoryIcon(challenge.category)}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[challenge.difficulty]}`}>
                            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-[#ea4e1b] transition-colors line-clamp-2">
                          {challenge.title}
                        </h3>
                        <p className="text-xs text-stone-500 mb-1 font-medium">{challenge.organization}</p>
                        <p className="text-sm text-stone-600 mb-4 line-clamp-2 flex-grow leading-relaxed">{challenge.description}</p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {challenge.skills.slice(0, 4).map((skill) => (
                            <span key={skill} className="px-2 py-0.5 rounded-full bg-stone-50 text-xs text-stone-600 border border-stone-200/80 font-medium">
                              {skill}
                            </span>
                          ))}
                          {challenge.skills.length > 4 && (
                            <span className="px-2 py-0.5 rounded-full bg-stone-50 text-xs text-stone-400">
                              +{challenge.skills.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Footer stats */}
                        <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500">
                          <div className="flex items-center gap-3">
                            <span>👥 {challenge.participantCount}</span>
                            <span>📦 {challenge.submissionCount}</span>
                          </div>
                          <span className={`font-semibold ${new Date(challenge.deadline) > new Date() ? 'text-emerald-600' : 'text-red-500'}`}>
                            {daysUntil(challenge.deadline)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrev}
                      className="px-6 py-2.5 rounded-full bg-white border border-stone-300 text-sm text-stone-700 font-semibold hover:border-[#ea4e1b]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-stone-500 font-medium">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.hasNext}
                      className="px-6 py-2.5 rounded-full bg-white border border-stone-300 text-sm text-stone-700 font-semibold hover:border-[#ea4e1b]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
