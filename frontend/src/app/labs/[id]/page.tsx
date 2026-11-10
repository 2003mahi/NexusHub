'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '@/app/context/AuthContext';

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  availableSlots: number;
}

interface Participant {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  skills: string[];
  lookingForTeam: boolean;
}

interface FeedbackEntry {
  id: string;
  fromName: string;
  type: string;
  rating?: number;
  comment: string;
  createdAt: number;
}

interface Challenge {
  id: string;
  title: string;
  organization: string;
  category: string;
  difficulty: string;
  status: string;
  description: string;
  problemStatement: string;
  objectives: string[];
  deliverables: string[];
  skills: string[];
  tags: string[];
  prizes: string[];
  timeline: string;
  deadline: string;
  maxTeamSize: number;
  minTeamSize: number;
  participantCount: number;
  submissionCount: number;
  featured: boolean;
  mentors: Mentor[];
  createdBy: { userId: string; name: string; role: string };
}

const diffBadge: Record<string, string> = {
  beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  advanced: 'bg-amber-50 text-amber-700 border-amber-200',
  expert: 'bg-red-50 text-red-700 border-red-200',
};

// Preset sample IoCs for the threat simulator
const SAMPLE_IOCS = [
  {
    type: 'IPv4',
    value: '185.220.101.5',
    threat: 'Tor Exit Node / Brute-force C2 Relay',
    severity: 'High',
    score: 87,
    mitre: 'TA0011 (Command & Control)',
    sources: ['AbuseIPDB (98% confidence)', 'Shodan (Port 9050 open)', 'OTX AlienVault Pulse #2024-918'],
    recommendation: 'Block inbound traffic at perimeter firewall; inspect auth logs for compromised credentials.'
  },
  {
    type: 'SHA-256',
    value: '44d88612fea8a8f36de82e1278abb02f821e3f88ef4a44f128e5dfa4023793e1',
    threat: 'LockBit 3.0 Ransomware Dropper',
    severity: 'Critical',
    score: 96,
    mitre: 'TA0040 (Impact / Data Encrypted)',
    sources: ['VirusTotal (64/72 engines)', 'MISP Event #4492', 'CrowdStrike Intelligence Feed'],
    recommendation: 'Isolate affected host immediately; invoke EDR threat remediation and revoke kerberos tokens.'
  },
  {
    type: 'Domain',
    value: 'api-service-sync-cloud[.]com',
    threat: 'Typosquatting & DGA Exfiltration Beacon',
    severity: 'Medium',
    score: 64,
    mitre: 'TA0010 (Exfiltration)',
    sources: ['Whois Age: 3 days', 'Passive DNS Spike', 'OTX Threat Exchange'],
    recommendation: 'Sinkhole domain via recursive DNS policy; audit proxy logs for outbound HTTP POST beacons.'
  },
  {
    type: 'CVE',
    value: 'CVE-2024-21413',
    threat: 'Microsoft Outlook Remote Code Execution (MonikerLink)',
    severity: 'Critical',
    score: 98,
    mitre: 'TA0001 (Initial Access)',
    sources: ['NVD CVSS 9.8', 'CISA Known Exploited Vulnerability', 'Nexus Threat Feeds'],
    recommendation: 'Deploy emergency patch KB5034129; filter inbound RTF email attachments.'
  }
];

export default function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teamSeekers, setTeamSeekers] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'team' | 'mentors' | 'submit'>('overview');

  // Interactive Checklist State
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    feed_ingest: true,
    ioc_parser: false,
    correlator: false,
    alert_rules: false,
    soc_ui: false,
  });

  // Simulator State
  const [selectedIoc, setSelectedIoc] = useState(SAMPLE_IOCS[0]);
  const [customIocInput, setCustomIocInput] = useState('');
  const [simulatedLogOutput, setSimulatedLogOutput] = useState<string>('');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Join challenge state
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');
  const [joinSkills, setJoinSkills] = useState('');
  const [lookingForTeam, setLookingForTeam] = useState(false);

  // Submission state
  const [subForm, setSubForm] = useState({
    teamName: '',
    title: '',
    summary: '',
    description: '',
    repoUrl: '',
    demoUrl: '',
    technologies: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [subMsg, setSubMsg] = useState({ type: '', text: '' });

  // Feedback state
  const [fbComment, setFbComment] = useState('');
  const [fbRating, setFbRating] = useState(5);
  const [fbSubmissionId, setFbSubmissionId] = useState('');
  const [fbMsg, setFbMsg] = useState('');
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);

  const fetchChallenge = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/labs/${id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setChallenge(data.challenge);
    } catch {
      setError('Challenge not found or is not publicly available.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchParticipants = useCallback(async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        fetch(`/api/labs/${id}?participants=true`),
        fetch(`/api/labs/${id}?team-seekers=true`)
      ]);
      if (pRes.ok) {
        const d = await pRes.json();
        setParticipants(d.participants || []);
      }
      if (tRes.ok) {
        const d = await tRes.json();
        setTeamSeekers(d.seekers || []);
      }
    } catch {
      /* ignore */
    }
  }, [id]);

  const fetchUserSubmissions = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/labs/submissions?challengeId=${id}`);
      if (res.ok) {
        const d = await res.json();
        setUserSubmissions(d.submissions || []);
      }
    } catch {
      /* ignore */
    }
  }, [id, user]);

  useEffect(() => {
    fetchChallenge();
    fetchParticipants();
  }, [fetchChallenge, fetchParticipants]);

  useEffect(() => {
    fetchUserSubmissions();
  }, [fetchUserSubmissions]);

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleJoin = async () => {
    if (!user) {
      setJoinMsg('Please sign in to join this lab challenge.');
      return;
    }
    setJoining(true);
    setJoinMsg('');
    try {
      const res = await fetch(`/api/labs/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: joinSkills.split(',').map((s) => s.trim()).filter(Boolean),
          lookingForTeam
        })
      });
      const data = await res.json();
      if (res.ok) {
        setJoinMsg('🎉 Successfully registered for this challenge!');
        fetchChallenge();
        fetchParticipants();
      } else {
        setJoinMsg(data.error || 'Failed to join.');
      }
    } catch {
      setJoinMsg('Network error. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setSubMsg({ type: 'error', text: 'Please sign in to submit your solution.' });
      return;
    }
    setSubmitting(true);
    setSubMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/labs/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: id,
          teamName: subForm.teamName,
          title: subForm.title,
          summary: subForm.summary,
          description: subForm.description,
          repoUrl: subForm.repoUrl || undefined,
          demoUrl: subForm.demoUrl || undefined,
          technologies: subForm.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSubMsg({ type: 'success', text: '🎉 Solution submitted successfully! Your submission is under review.' });
        setSubForm({ teamName: '', title: '', summary: '', description: '', repoUrl: '', demoUrl: '', technologies: '' });
        fetchChallenge();
        fetchUserSubmissions();
      } else {
        setSubMsg({ type: 'error', text: data.error || 'Failed to submit.' });
      }
    } catch {
      setSubMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedback = async () => {
    if (!fbSubmissionId || !fbComment.trim()) {
      setFbMsg('Please select a submission and provide constructive feedback.');
      return;
    }
    try {
      const res = await fetch('/api/labs/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'feedback',
          submissionId: fbSubmissionId,
          comment: fbComment,
          rating: fbRating,
          type: 'peer'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFbMsg('✅ Feedback submitted successfully!');
        setFbComment('');
        fetchUserSubmissions();
      } else {
        setFbMsg(data.error || 'Failed to submit feedback.');
      }
    } catch {
      setFbMsg('Network error occurred.');
    }
  };

  const handleCustomIocQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIocInput.trim()) return;

    const value = customIocInput.trim();
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
    const isSha = /^[a-fA-F0-9]{64}$/.test(value);
    const isCve = /^cve-\d{4}-\d+/i.test(value);

    const generated = {
      type: isIp ? 'IPv4' : isSha ? 'SHA-256' : isCve ? 'CVE' : 'Domain',
      value: value,
      threat: isIp
        ? 'Suspicious High-Volume Scanner'
        : isSha
        ? 'Potential Malicious Payload Hash'
        : isCve
        ? 'Exploited Known Vulnerability'
        : 'Unverified Domain Asset',
      severity: isIp || isSha ? 'High' : 'Medium',
      score: isSha ? 92 : isIp ? 79 : 68,
      mitre: isIp ? 'TA0001 (Initial Access)' : 'TA0002 (Execution)',
      sources: ['OSINT Live Ingestion Stream', 'Nexus Correlator Node #4', 'Abuse Feed Cache'],
      recommendation: 'Correlate with internal firewall traffic and trigger automatic rate-limiting alert.'
    };

    setSelectedIoc(generated);
    setSimulatedLogOutput(
      `[${new Date().toISOString()}] CORRELATION ENGINE: Evaluated IoC ${value} -> Score: ${generated.score}/100. Generated prioritized SOC alert.`
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const daysLeft = challenge ? Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const progressCount = Object.values(completedTasks).filter(Boolean).length;
  const totalTasks = Object.keys(completedTasks).length;
  const progressPercent = Math.round((progressCount / totalTasks) * 100);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-[#fbfaf8] min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white border border-[#f0ede6] rounded-3xl luxury-card-shadow max-w-sm">
            <div className="w-12 h-12 border-3 border-[#ea4e1b]/20 border-t-[#ea4e1b] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-700 font-medium">Loading challenge workspace...</p>
            <p className="text-xs text-stone-500 mt-1">Fetching threat feeds and challenge specs</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !challenge) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-[#fbfaf8] min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md p-8 bg-white border border-[#f0ede6] rounded-3xl luxury-card-shadow">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mx-auto mb-4 border border-amber-200">
              🛡️
            </div>
            <h2 className="text-2xl font-extrabold text-[#141413] mb-2">Challenge Not Found</h2>
            <p className="text-stone-600 text-sm mb-6">{error || 'This lab challenge might have been moved or archived.'}</p>
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-sm font-semibold rounded-full shadow-sm transition-all"
            >
              ← Back to Labs Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Challenge Overview', icon: '📋' },
    { key: 'simulator', label: 'Threat Lab & Simulator', icon: '⚡' },
    { key: 'team', label: `Participants (${participants.length})`, icon: '👥' },
    { key: 'mentors', label: 'Mentors & Feedback', icon: '🎓' },
    { key: 'submit', label: 'Submit Solution', icon: '🚀' },
  ] as const;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbfaf8] text-[#141413] min-h-screen selection:bg-[#ea4e1b]/15 selection:text-[#ea4e1b]">
        {/* ─── Hero Banner ─── */}
        <section className="relative overflow-hidden border-b border-[#f0ede6] bg-white">
          {/* Subtle warm luxury ambient glow */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-tr from-[#fed7aa]/25 via-[#fde68a]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pb-16">
            <div className="flex items-center justify-between gap-4 mb-6">
              <Link
                href="/labs"
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-[#ea4e1b] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Innovation Labs
              </Link>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Challenge
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Title & Key Meta */}
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                    {challenge.category.toUpperCase()}
                  </span>
                  <span className={`px-3.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${diffBadge[challenge.difficulty] || 'bg-stone-100'}`}>
                    {challenge.difficulty} Level
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#ea4e1b]/10 text-[#ea4e1b] border border-[#ea4e1b]/20">
                    SOC Engineering Track
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-[#141413] leading-[1.12] mb-3">
                  {challenge.title}
                </h1>

                <p className="text-base sm:text-lg text-stone-600 font-medium mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ea4e1b]" />
                  Presented by <strong className="text-stone-900">{challenge.organization}</strong>
                </p>

                {/* Key Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#fbfaf8] border border-[#f0ede6]">
                  <div>
                    <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Participants</div>
                    <div className="text-xl font-bold text-stone-900 mt-0.5">{challenge.participantCount} registered</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Team Size</div>
                    <div className="text-xl font-bold text-stone-900 mt-0.5">{challenge.minTeamSize}–{challenge.maxTeamSize} Engineers</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Timeline</div>
                    <div className="text-xl font-bold text-stone-900 mt-0.5">{challenge.timeline}</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Deadline</div>
                    <div className={`text-xl font-bold mt-0.5 ${daysLeft > 0 ? 'text-[#ea4e1b]' : 'text-stone-500'}`}>
                      {daysLeft > 0 ? `${daysLeft} days remaining` : 'Concluded'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Prize Pool & Fast Action Card */}
              <div className="lg:col-span-4">
                <div className="p-6 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ea4e1b]">Award Pool</span>
                    <span className="text-2xl">🏆</span>
                  </div>

                  {challenge.prizes.length > 0 && (
                    <div className="mb-6 space-y-2.5">
                      <div className="text-2xl font-extrabold text-[#141413]">
                        {challenge.prizes[0]}
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-stone-100">
                        {challenge.prizes.slice(1).map((prize, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                            <span className="text-amber-500">✦</span>
                            <span>{prize}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={() => setActiveTab('submit')}
                      className="w-full py-3 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all text-center block"
                    >
                      🚀 Submit Solution
                    </button>
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className="w-full py-2.5 rounded-full bg-[#fbfaf8] hover:bg-stone-100 border border-stone-200 text-stone-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <span>⚡ Open Threat Simulator</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Tab Bar */}
          <div className="border-t border-[#f0ede6] bg-white sticky top-0 z-20 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex gap-2 sm:gap-4 overflow-x-auto py-2 no-scrollbar">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-[#141413] text-white shadow-sm'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                      {tab.key === 'simulator' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#ea4e1b] text-white text-[10px] font-bold uppercase tracking-wider">
                          Tool
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </section>

        {/* ─── Main Content Tabs ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* TAB 1: OVERVIEW & ARCHITECTURE & CHECKLIST */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left 8 cols: Brief, Requirements, Architecture, Rubric */}
              <div className="lg:col-span-8 space-y-8">
                {/* Problem Statement Card */}
                <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold mb-4">
                    <span>⚠️</span> The Problem to Solve
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#141413] mb-3">
                    Mission Brief: Eliminating Alert Fatigue in SOC Operations
                  </h2>
                  <p className="text-stone-600 leading-relaxed text-base mb-6">
                    {challenge.problemStatement}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#fbfaf8] border border-[#f0ede6] text-sm text-stone-700 leading-relaxed">
                    <strong className="text-stone-900 block mb-1">Challenge Context:</strong>
                    Modern threat intelligence relies on disparate feeds (AlienVault OTX, AbuseIPDB, VirusTotal, MISP, and Shodan). Without an automated pipeline to normalize and correlate overlapping signals, analysts drown in repetitive noise. Your objective is to architect a production-ready, resilient streaming dashboard that separates true attacks from benign telemetry.
                  </div>
                </div>

                {/* Architecture Blueprint & Tech Stack */}
                <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">Specifications</span>
                      <h3 className="text-xl font-extrabold text-[#141413] mt-1">Recommended Architecture Pipeline</h3>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-stone-100 text-stone-700 rounded-full">
                      High Throughput
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-4 gap-3 my-6">
                    {[
                      { step: '1. Ingestion', desc: 'Polling & Webhooks', detail: '5+ OSINT Feeds', icon: '📥' },
                      { step: '2. Normalizer', desc: 'Kafka / Redis Stream', detail: 'IoC Deduplication', icon: '⚡' },
                      { step: '3. Correlation', desc: 'Python Engine', detail: 'MITRE ATT&CK Mapping', icon: '🧠' },
                      { step: '4. SOC Dashboard', desc: 'React + WebSockets', detail: 'Real-time Triage UI', icon: '🖥️' },
                    ].map((phase, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-[#fbfaf8] border border-[#f0ede6] text-center">
                        <div className="text-2xl mb-1">{phase.icon}</div>
                        <div className="text-xs font-bold text-stone-900">{phase.step}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{phase.desc}</div>
                        <div className="text-[10px] text-[#ea4e1b] font-medium mt-1">{phase.detail}</div>
                      </div>
                    ))}
                  </div>

                  {/* Objectives list */}
                  <div className="mt-8">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-3">Core Objectives</h4>
                    <div className="space-y-3">
                      {challenge.objectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fbfaf8] border border-[#f0ede6]">
                          <span className="w-6 h-6 rounded-full bg-[#ea4e1b] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm text-stone-700 font-medium leading-relaxed">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="mt-8">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-3">Required Deliverables</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {challenge.deliverables.map((del, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-stone-800">
                          <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                          <span className="text-xs sm:text-sm font-medium leading-snug">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Evaluation Rubric */}
                <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">Evaluation Standard</span>
                  <h3 className="text-xl font-extrabold text-[#141413] mt-1 mb-6">Expert SOC Evaluation Rubric</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Feed Ingestion Resilience (25%)',
                        desc: 'Graceful rate-limit handling, persistent backoff, and concurrent polling of at least 5 distinct threat intelligence sources.'
                      },
                      {
                        title: 'Correlation & Heuristics (30%)',
                        desc: 'Algorithmic accuracy in grouping related IoCs into single actionable incidents, deduplicating alerts, and scoring confidence.'
                      },
                      {
                        title: 'Analyst Experience & UX (25%)',
                        desc: 'Real-time WebSocket alerts, zero latency search over millions of records, contextual IP/Domain WHOIS details, and clean triage workflow.'
                      },
                      {
                        title: 'Security & Audit Readiness (20%)',
                        desc: 'Strict role-based access control (SOC L1, L2, Lead), secret management, immutable audit logging, and automated unit test suite.'
                      }
                    ].map((rubric, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#fbfaf8] border border-[#f0ede6]">
                        <h4 className="text-sm font-bold text-stone-900 mb-1">{rubric.title}</h4>
                        <p className="text-xs text-stone-600 leading-relaxed">{rubric.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 4 cols: Sticky Lab Readiness Checklist & Quick Join */}
              <div className="lg:col-span-4 space-y-6">
                {/* Interactive Task Readiness Checklist */}
                <div className="p-6 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Your Project Milestones</h3>
                    <span className="text-xs font-bold text-[#ea4e1b]">{progressPercent}% Ready</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-stone-100 rounded-full h-2 mb-4 overflow-hidden">
                    <div
                      className="bg-[#ea4e1b] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="text-xs text-stone-500 mb-4">
                    Track your engineering implementation milestones before final submission.
                  </p>

                  <div className="space-y-2.5">
                    {[
                      { id: 'feed_ingest', title: 'OSINT Feed Ingestion (5 Sources)' },
                      { id: 'ioc_parser', title: 'STIX / TAXII / JSON Normalization' },
                      { id: 'correlator', title: 'Threat Correlation & Scoring Engine' },
                      { id: 'alert_rules', title: 'MITRE ATT&CK Tactic Mapping' },
                      { id: 'soc_ui', title: 'Real-Time Alert Triage Dashboard' },
                    ].map((task) => (
                      <label
                        key={task.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors border border-transparent hover:border-stone-200"
                      >
                        <input
                          type="checkbox"
                          checked={!!completedTasks[task.id]}
                          onChange={() => toggleTask(task.id)}
                          className="w-4 h-4 rounded text-[#ea4e1b] focus:ring-[#ea4e1b] accent-[#ea4e1b]"
                        />
                        <span className={`text-xs font-medium ${completedTasks[task.id] ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                          {task.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Join & Register Card */}
                <div className="p-6 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🛡️</span>
                    <h3 className="text-base font-bold text-[#141413]">Register for this Challenge</h3>
                  </div>
                  <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                    Gain access to mentor guidance, sample API keys, submission portal, and team matchmaking.
                  </p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Your Relevant Skills</label>
                      <input
                        type="text"
                        value={joinSkills}
                        onChange={(e) => setJoinSkills(e.target.value)}
                        placeholder="e.g. Python, Kafka, React, Docker"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b] transition-colors"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lookingForTeam}
                        onChange={(e) => setLookingForTeam(e.target.checked)}
                        className="w-3.5 h-3.5 rounded accent-[#ea4e1b]"
                      />
                      <span>Mark me as looking for teammates</span>
                    </label>
                  </div>

                  <button
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full py-2.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                  >
                    {joining ? 'Registering...' : 'Join as Participant'}
                  </button>

                  {joinMsg && (
                    <p className={`text-xs mt-2.5 font-medium ${joinMsg.includes('🎉') ? 'text-emerald-600' : 'text-red-500'}`}>
                      {joinMsg}
                    </p>
                  )}
                </div>

                {/* Tech Stack Requirements */}
                <div className="p-6 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Required Tech Competencies</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE THREAT SIMULATOR & WORKSPACE */}
          {activeTab === 'simulator' && (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                <div className="max-w-3xl mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">Interactive Tool</span>
                  <h2 className="text-2xl font-extrabold text-[#141413] mt-1 mb-2">
                    Threat Correlation & IoC Sandbox
                  </h2>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Test how indicators of compromise (IoCs) get evaluated, scored, and prioritized by a threat intelligence correlation engine. Select pre-loaded threat vectors or inspect your own custom IoC to preview real-time alerting payloads.
                  </p>
                </div>

                {/* Pre-set Selector Buttons */}
                <div className="mb-6">
                  <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Select a Verified Threat Vector to Simulate:
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {SAMPLE_IOCS.map((sample) => {
                      const isSel = selectedIoc.value === sample.value;
                      return (
                        <button
                          key={sample.value}
                          onClick={() => {
                            setSelectedIoc(sample);
                            setSimulatedLogOutput(
                              `[${new Date().toISOString()}] CORRELATION ENGINE: Ingested IoC ${sample.value} (${sample.type}). Cross-checked ${sample.sources.length} feeds. Alert Priority: ${sample.severity} (Score: ${sample.score}/100).`
                            );
                          }}
                          className={`p-3.5 rounded-2xl text-left border transition-all ${
                            isSel
                              ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                              : 'bg-[#fbfaf8] hover:bg-stone-50 border-[#f0ede6] text-stone-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              isSel ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                            }`}>
                              {sample.type}
                            </span>
                            <span className={`text-xs font-bold ${
                              sample.severity === 'Critical' ? 'text-red-500' : 'text-amber-500'
                            }`}>
                              {sample.score} pts
                            </span>
                          </div>
                          <div className="text-xs font-bold truncate">{sample.threat}</div>
                          <div className={`text-[11px] truncate mt-1 ${isSel ? 'text-stone-300' : 'text-stone-500'}`}>
                            {sample.value}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom IoC Query Box */}
                <form onSubmit={handleCustomIocQuery} className="flex flex-col sm:flex-row gap-3 mb-8">
                  <input
                    type="text"
                    value={customIocInput}
                    onChange={(e) => setCustomIocInput(e.target.value)}
                    placeholder="Enter custom IP (e.g. 198.51.100.24), File Hash, or Domain..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#fbfaf8] border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#141413] hover:bg-stone-800 text-white font-semibold text-xs transition-colors whitespace-nowrap"
                  >
                    Simulate Correlation Engine
                  </button>
                </form>

                {/* Live Simulation Result Display */}
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Triage Detail Card */}
                  <div className="lg:col-span-7 p-6 rounded-2xl bg-[#fbfaf8] border border-[#f0ede6]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                          Prioritized SOC Alert
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        selectedIoc.severity === 'Critical'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {selectedIoc.severity} Severity ({selectedIoc.score}/100)
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 mb-1">{selectedIoc.threat}</h3>
                    <div className="font-mono text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200 break-all mb-4">
                      {selectedIoc.value}
                    </div>

                    <div className="space-y-3 mb-4 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-stone-200/60">
                        <span className="text-stone-500">MITRE ATT&CK Classification</span>
                        <span className="font-semibold text-stone-900">{selectedIoc.mitre}</span>
                      </div>
                      <div className="py-1.5 border-b border-stone-200/60">
                        <span className="text-stone-500 block mb-1">Correlated OSINT Feed Sources:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedIoc.sources.map((src, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-white border border-stone-200 font-medium text-stone-700">
                              {src}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="py-1.5">
                        <span className="text-stone-500 block mb-1">Recommended SOC Action:</span>
                        <p className="text-stone-800 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-relaxed">
                          {selectedIoc.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Ingestion JSON Payload Preview */}
                  <div className="lg:col-span-5 p-6 rounded-2xl bg-stone-900 text-stone-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-stone-400">normalized_ioc_payload.json</span>
                      <button
                        onClick={() =>
                          copyCode(
                            JSON.stringify(
                              {
                                timestamp: new Date().toISOString(),
                                ioc_type: selectedIoc.type,
                                ioc_value: selectedIoc.value,
                                confidence_score: selectedIoc.score,
                                severity: selectedIoc.severity,
                                threat_category: selectedIoc.threat,
                                mitre_tactic: selectedIoc.mitre,
                                feeds_matched: selectedIoc.sources,
                                automated_action: selectedIoc.recommendation
                              },
                              null,
                              2
                            )
                          )
                        }
                        className="text-[11px] px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-colors"
                      >
                        {copiedSnippet ? 'Copied ✓' : 'Copy JSON'}
                      </button>
                    </div>

                    <pre className="font-mono text-[11px] leading-relaxed text-emerald-400 bg-stone-950 p-3.5 rounded-xl overflow-x-auto max-h-[260px] border border-stone-800">
{JSON.stringify(
  {
    timestamp: new Date().toISOString(),
    ioc_type: selectedIoc.type,
    ioc_value: selectedIoc.value,
    confidence_score: selectedIoc.score,
    severity: selectedIoc.severity,
    threat_category: selectedIoc.threat,
    mitre_tactic: selectedIoc.mitre,
    feeds_matched: selectedIoc.sources,
    automated_action: selectedIoc.recommendation
  },
  null,
  2
)}
                    </pre>

                    {simulatedLogOutput && (
                      <div className="mt-3 p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-[10px] font-mono text-stone-400">
                        {simulatedLogOutput}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Starter Code Blueprint */}
              <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">Developer Toolkit</span>
                    <h3 className="text-xl font-extrabold text-[#141413] mt-1">
                      Starter Ingestion Script (Python + Kafka)
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      copyCode(`# Nexus Threat Intelligence Ingestion Skeleton
import requests, json
from kafka import KafkaProducer

FEEDS = [
    {"name": "AbuseIPDB", "url": "https://api.abuseipdb.com/api/v2/blacklist"},
    {"name": "AlienVault OTX", "url": "https://otx.alienvault.com/api/v1/pulses/subscribed"}
]

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def ingest_and_stream():
    print("Ingesting threat feeds into Kafka topic 'threat-indicators'...")
    # Add your extraction and normalization logic here

if __name__ == "__main__":
    ingest_and_stream()`)
                    }
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                  >
                    Copy Starter Code
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-[#fbfaf8] border border-[#f0ede6] text-xs font-mono text-stone-800 overflow-x-auto leading-relaxed">
{`# Nexus Threat Intelligence Ingestion Skeleton
import requests, json
from kafka import KafkaProducer

FEEDS = [
    {"name": "AbuseIPDB", "url": "https://api.abuseipdb.com/api/v2/blacklist"},
    {"name": "AlienVault OTX", "url": "https://otx.alienvault.com/api/v1/pulses/subscribed"},
    {"name": "VirusTotal", "url": "https://www.virustotal.com/api/v3/intelligence/hunting_notification_files"}
]

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def ingest_and_stream():
    print("Starting ingestion loop for 5+ OSINT threat feeds...")
    # Your correlation and alert logic goes here!

if __name__ == "__main__":
    ingest_and_stream()`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: TEAM & PARTICIPANTS */}
          {activeTab === 'team' && (
            <div className="space-y-8">
              {/* Looking for Team banner */}
              <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">Collaboration Hub</span>
                    <h2 className="text-2xl font-extrabold text-[#141413] mt-1">
                      Teammate Matchmaking
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Find engineers with complementary skills (Frontend, Data Pipeline, Security Ops).
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 rounded-full bg-[#141413] text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
                  >
                    + Register to Join Team Pool
                  </button>
                </div>

                {teamSeekers.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-stone-200 rounded-2xl bg-[#fbfaf8]">
                    <div className="text-3xl mb-2">🤝</div>
                    <p className="text-stone-700 font-semibold text-sm">No engineers currently listed as seeking a team.</p>
                    <p className="text-stone-500 text-xs mt-1">Be the first to join and connect with other builders!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamSeekers.map((p) => (
                      <div
                        key={p.id}
                        className="p-5 rounded-2xl bg-[#fbfaf8] border border-[#f0ede6] hover:border-[#ea4e1b]/30 transition-all hover:shadow-xs"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ea4e1b] to-amber-500 text-white font-bold text-sm flex items-center justify-center">
                            {p.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-stone-900">{p.userName}</div>
                            <div className="text-xs text-stone-500 capitalize">{p.userRole}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {p.skills.length > 0 ? (
                            p.skills.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[11px] text-stone-700 font-medium">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-stone-400">Cybersecurity Specialist</span>
                          )}
                        </div>

                        <a
                          href={`mailto:${p.userId}@nexustrust.org?subject=NexusHub Lab Teammate Invitation: ${encodeURIComponent(challenge.title)}`}
                          className="w-full inline-block py-1.5 text-center rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-800 text-xs font-semibold transition-colors"
                        >
                          Invite to Team →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Registered Participants */}
              <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                <h3 className="text-lg font-extrabold text-[#141413] mb-4">
                  All Registered Participants ({participants.length})
                </h3>

                {participants.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-sm">
                    No participants registered yet. Sign in and join!
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-[#fbfaf8] border border-[#f0ede6] flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-stone-800 text-white font-bold text-xs flex items-center justify-center">
                          {p.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-stone-900 truncate">{p.userName}</div>
                          <div className="text-[11px] text-stone-500 capitalize">{p.userRole}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MENTORS & PEER FEEDBACK */}
          {activeTab === 'mentors' && (
            <div className="space-y-8">
              {/* Mentor profile */}
              <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">Guidance & Mentorship</span>
                <h2 className="text-2xl font-extrabold text-[#141413] mt-1 mb-6">
                  Assigned Domain Expert
                </h2>

                {challenge.mentors.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-sm">No mentors assigned yet.</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {challenge.mentors.map((m) => (
                      <div
                        key={m.id}
                        className="p-6 rounded-2xl bg-[#fbfaf8] border border-[#f0ede6] relative"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-stone-900 to-stone-700 text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-stone-900">{m.name}</h3>
                            <div className="text-xs font-semibold text-[#ea4e1b]">
                              CrowdStrike Veteran • SOC Lead
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              {m.availableSlots} office hours slots open
                            </div>
                          </div>
                        </div>

                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">{m.bio}</p>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {m.expertise.map((e) => (
                            <span
                              key={e}
                              className="px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-800 text-xs font-medium"
                            >
                              {e}
                            </span>
                          ))}
                        </div>

                        <a
                          href={`mailto:${m.name.toLowerCase().replace(' ', '.')}@nexustrust.org?subject=NexusHub Lab Question: ${encodeURIComponent(challenge.title)}`}
                          className="w-full inline-block py-2 text-center rounded-xl bg-[#141413] hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
                        >
                          Request Mentor Office Hour →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Peer Feedback Submission */}
              {user && userSubmissions.length > 0 && (
                <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                  <h3 className="text-lg font-extrabold text-[#141413] mb-2">Submit Peer Review</h3>
                  <p className="text-xs text-stone-500 mb-4">Provide constructive technical critique on participating projects.</p>

                  <div className="space-y-4 max-w-xl">
                    <select
                      value={fbSubmissionId}
                      onChange={(e) => setFbSubmissionId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#ea4e1b]"
                    >
                      <option value="">Select a submission to review...</option>
                      {userSubmissions.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.teamName})
                        </option>
                      ))}
                    </select>

                    <textarea
                      value={fbComment}
                      onChange={(e) => setFbComment(e.target.value)}
                      placeholder="Comment on architecture resilience, throughput, correlation logic, or dashboard usability..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b] resize-none"
                    />

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold text-stone-700">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setFbRating(n)}
                            className={`text-lg transition-transform hover:scale-110 ${
                              n <= fbRating ? 'text-amber-400' : 'text-stone-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleFeedback}
                      className="px-6 py-2.5 rounded-full bg-[#141413] hover:bg-stone-800 text-white text-xs font-bold transition-colors"
                    >
                      Submit Review
                    </button>

                    {fbMsg && <p className="text-xs font-medium text-stone-800">{fbMsg}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SUBMIT SOLUTION */}
          {activeTab === 'submit' && (
            <div className="max-w-3xl mx-auto">
              <div className="p-8 rounded-3xl bg-white border border-[#f0ede6] luxury-card-shadow">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ea4e1b]">Final Step</span>
                <h2 className="text-2xl font-extrabold text-[#141413] mt-1 mb-2">
                  Submit Your Threat Intelligence Solution
                </h2>
                <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                  Provide your project repository, architecture write-up, and live demo link. Submissions are reviewed based on ingestion resilience, correlation accuracy, and dashboard usability.
                </p>

                {!user ? (
                  <div className="text-center py-12 rounded-2xl bg-[#fbfaf8] border border-stone-200 p-6">
                    <div className="text-4xl mb-3">✨</div>
                    <h3 className="text-base font-bold text-stone-900 mb-1">Sign in Required</h3>
                    <p className="text-stone-500 text-xs mb-4">You need an active NexusHub account to submit a project.</p>
                    <Link
                      href="/get-verified"
                      className="px-6 py-2.5 bg-[#ea4e1b] hover:bg-[#d43b0c] text-white rounded-full text-xs font-bold transition-all shadow-sm"
                    >
                      Get Verified & Sign In →
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">Team Name *</label>
                        <input
                          type="text"
                          required
                          value={subForm.teamName}
                          onChange={(e) => setSubForm({ ...subForm, teamName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b]"
                          placeholder="e.g. Apex SOC Sentinel"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">Project Title *</label>
                        <input
                          type="text"
                          required
                          value={subForm.title}
                          onChange={(e) => setSubForm({ ...subForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b]"
                          placeholder="e.g. Aegis Intelligence Core"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Executive Summary *</label>
                      <textarea
                        required
                        rows={2}
                        value={subForm.summary}
                        onChange={(e) => setSubForm({ ...subForm, summary: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b] resize-none"
                        placeholder="Brief summary of your threat correlation algorithm and pipeline performance..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Detailed Technical Description</label>
                      <textarea
                        rows={5}
                        value={subForm.description}
                        onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b] resize-none"
                        placeholder="Explain your data pipeline (Kafka/Elasticsearch), scoring heuristics, false-positive suppression rules, and deployment instructions..."
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">GitHub / Code Repository URL</label>
                        <input
                          type="url"
                          value={subForm.repoUrl}
                          onChange={(e) => setSubForm({ ...subForm, repoUrl: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b]"
                          placeholder="https://github.com/org/threat-dashboard"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">Live Demo / Staging URL</label>
                        <input
                          type="url"
                          value={subForm.demoUrl}
                          onChange={(e) => setSubForm({ ...subForm, demoUrl: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b]"
                          placeholder="https://soc-demo.example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Technologies Utilized</label>
                      <input
                        type="text"
                        value={subForm.technologies}
                        onChange={(e) => setSubForm({ ...subForm, technologies: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#fbfaf8] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#ea4e1b]"
                        placeholder="Python, Kafka, Elasticsearch, React, Tailwind, Docker"
                      />
                    </div>

                    {subMsg.text && (
                      <div
                        className={`p-3.5 rounded-xl text-xs font-medium ${
                          subMsg.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {subMsg.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Submitting Solution...' : '🚀 Submit Project for Evaluation'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
