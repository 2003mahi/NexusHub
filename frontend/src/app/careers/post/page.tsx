'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { CareerCategory, EmploymentType, ExperienceLevel } from '@/app/lib/careers';

export default function PostOpportunityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('Core Engineering');
  const [category, setCategory] = useState<CareerCategory>('job');
  const [role, setRole] = useState('Software Engineering');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full-time');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('mid');
  const [location, setLocation] = useState('San Francisco, CA / Remote');
  const [isRemote, setIsRemote] = useState(true);
  const [salaryRange, setSalaryRange] = useState('$130,000 - $165,000 / yr');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    'Lead architecture and delivery of core software components\nConduct peer code reviews and architectural discussions\nCollaborate closely with design and product teams'
  );
  const [requirementsText, setRequirementsText] = useState(
    'Demonstrated mastery with modern software engineering paradigms\nProficiency in required tech stack and relational databases\nExcellent written and verbal technical communication'
  );
  const [benefitsText, setBenefitsText] = useState(
    'Competitive salary and equity grant\nComprehensive health, dental, and vision coverage\nFlexible remote-first culture and home office stipend'
  );

  // Skills Tag Input
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['TypeScript', 'React', 'Node.js']);

  // Target roles
  const [targetRoles, setTargetRoles] = useState<string[]>(['student', 'professional']);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/careers/post');
    }
  }, [user, authLoading, router]);

  // Skill management
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleToggleTargetRole = (r: string) => {
    if (targetRoles.includes(r)) {
      setTargetRoles(targetRoles.filter((item) => item !== r));
    } else {
      setTargetRoles([...targetRoles, r]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (title.trim().length < 5) {
      setError('Job title must be at least 5 characters long.');
      return;
    }
    if (organization.trim().length < 2) {
      setError('Organization name is required.');
      return;
    }
    if (description.trim().length < 30) {
      setError('Description must be at least 30 characters long.');
      return;
    }
    if (skills.length === 0) {
      setError('Please provide at least one required technology skill.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          organization: organization.trim(),
          department: department.trim(),
          category,
          role,
          employmentType,
          experienceLevel,
          location: location.trim(),
          isRemote,
          salaryRange: salaryRange.trim(),
          deadline,
          description: description.trim(),
          responsibilities: responsibilitiesText.split('\n').map((s) => s.trim()).filter(Boolean),
          requirements: requirementsText.split('\n').map((s) => s.trim()).filter(Boolean),
          benefits: benefitsText.split('\n').map((s) => s.trim()).filter(Boolean),
          skills,
          targetRoles,
          featured: true
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post opportunity.');
      }

      router.push(`/careers/${data.career.id}`);
    } catch (err: any) {
      setError(err.message || 'Error publishing opportunity.');
    } finally {
      setSubmitting(false);
    }
  };

  // Role gate check: students cannot post jobs
  const isAuthorized = user && ['founder', 'professional', 'admin'].includes(user.role);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/careers" className="hover:text-indigo-600">Careers</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">Post Opportunity</span>
        </div>

        {/* If user is student: Role Permission Warning */}
        {!authLoading && user && !isAuthorized ? (
          <div className="p-8 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/60 rounded-3xl text-center my-10 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl mx-auto mb-4">
              🛡️
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Recruiter Privileges Required
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">
              You are currently signed in as a <strong className="text-amber-600 capitalize">{user.role}</strong>. Opportunity posting is reserved for verified Founders, Employers, and Professionals.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/careers"
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Browse Job & Internship Listings
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                Post an Opportunity
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Reach thousands of top-tier student developers, verified engineers, and startup innovators.
              </p>
            </div>

            {error && (
              <div className="p-4 mb-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Posting Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                  1. Role Overview
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Role / Position Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior Full-Stack Engineer, AI Research Fellow"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. CloudScale, Nexus AI Labs"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Department / Team
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Platform Engineering, Machine Learning"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="job">Full Job Position</option>
                      <option value="internship">Paid Internship</option>
                      <option value="fellowship">Research Fellowship</option>
                      <option value="contract">Project / Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Technical Domain
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="AI / Machine Learning">AI & Machine Learning</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Security">Security & Trust</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Compensation & Logistics */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                  2. Logistics & Compensation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Employment Type
                    </label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Experience Level
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-Level</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead / Principal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA or Worldwide Remote"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Salary / Compensation Range *
                    </label>
                    <input
                      type="text"
                      required
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      placeholder="e.g. $140,000 - $180,000 / yr or $50/hr"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Application Deadline *
                    </label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={isRemote}
                        onChange={(e) => setIsRemote(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Fully Remote Friendly</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Skills and Target Audience */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                  3. Skills & Target Audience
                </h3>

                {/* Skills tags */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Required Technology Skills (Press Enter to Add)
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder="e.g. Next.js, PyTorch, GraphQL, Go"
                      className="flex-1 px-3.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s)}
                          className="text-indigo-400 hover:text-indigo-700 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Eligible Candidate Roles
                  </label>
                  <div className="flex flex-wrap gap-4 text-xs">
                    {[
                      { id: 'student', label: 'Students / Graduates' },
                      { id: 'founder', label: 'Founders / Builders' },
                      { id: 'professional', label: 'Experienced Professionals' }
                    ].map((roleItem) => (
                      <label key={roleItem.id} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={targetRoles.includes(roleItem.id)}
                          onChange={() => handleToggleTargetRole(roleItem.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{roleItem.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description & Expectations */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                  4. Description & Responsibilities
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Position Description & Mission * (min 30 characters)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a comprehensive summary of the mission, technical scope, and day-to-day work environment..."
                    className="w-full p-3.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Key Responsibilities (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                    className="w-full p-3.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Candidate Requirements (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    className="w-full p-3.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Benefits & Perks (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                    className="w-full p-3.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <Link
                  href="/careers"
                  className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Publishing Opportunity...' : 'Publish to Marketplace →'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
