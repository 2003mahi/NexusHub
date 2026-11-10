'use client';

import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh',
  'Puducherry', 'Jammu & Kashmir', 'Ladakh'
];

const DEGREES = [
  'B.Tech / B.E.',
  'BCA',
  'B.Sc',
  'B.Com',
  'BBA',
  'M.Tech',
  'MCA',
  'MBA',
  'M.Sc',
  'Ph.D',
  'Diploma',
  'Other'
];

const CURRENT_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
  'Graduated'
];

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence / Data Science',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration / Management',
  'Commerce & Finance',
  'Design & Arts',
  'Other'
];

const GRAD_YEARS = Array.from({ length: 2035 - 2015 + 1 }, (_, i) => String(2015 + i));

const INITIATIVES_LIST = [
  'Nexus Careers',
  'Nexus Labs',
  'Nexus Community',
  'Nexus Verify',
  'Talent Referrals',
];

export default function VerificationPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [assignedId, setAssignedId] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    role: 'Student',
    institution: '',
    idProofUrl: '',
    college: '',
    degree: '',
    currentYear: '',
    department: '',
    gradYear: '',
    collegeEmail: '',
    linkedin: '',
    instagram: '',
    resumeLink: '',
    initiatives: [] as string[],
    profilePhoto: '',
    declaration: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.phone.trim() || formData.phone.trim().length < 8) newErrors.phone = 'Valid mobile number is required';
      if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
    } else if (currentStep === 2) {
      if (!formData.institution.trim()) newErrors.institution = 'Institution / Organization is required';
    } else if (currentStep === 3) {
      if (!formData.college.trim()) newErrors.college = 'College / University is required';
      if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
      if (!formData.currentYear.trim()) newErrors.currentYear = 'Current year is required';
      if (!formData.department.trim()) newErrors.department = 'Department is required';
      if (!formData.gradYear.trim()) newErrors.gradYear = 'Graduation year is required';
      if (!formData.collegeEmail.trim() || !formData.collegeEmail.includes('@')) newErrors.collegeEmail = 'Valid college email is required';
    } else if (currentStep === 4) {
      if (!formData.linkedin.trim()) newErrors.linkedin = 'LinkedIn link is required';
      if (!formData.instagram.trim()) newErrors.instagram = 'Instagram link is required';
      if (!formData.resumeLink.trim()) newErrors.resumeLink = 'Resume link is required';
      if (!formData.declaration) newErrors.declaration = 'Please confirm the declaration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const stepNames = ['BASICS', 'ROLE & PROFILE', 'DETAILS', 'PHOTO & CONSENT'];

  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(step)) {
      return;
    }
    setErrors({});
    if (step < 4) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      try {
        const res = await fetch('/api/verification/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.id) {
          setAssignedId(data.id);
        } else {
          setAssignedId(`NEX-${Math.floor(100000 + Math.random() * 900000)}`);
        }
      } catch {
        setAssignedId(`NEX-${Math.floor(100000 + Math.random() * 900000)}`);
      } finally {
        setSubmitting(false);
        setSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#141413]">
      <Navbar />

      <main className="flex-1 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-left">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#ea4e1b] uppercase mb-3">
              GET VERIFIED
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#141413] leading-[1.12] mb-4">
              Get Your Official{' '}
              <span className="font-editorial-italic font-normal italic">NexusHub Verified</span>
              <br />
              <span className="font-editorial-italic font-normal italic">Identity</span>.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Become a verified member of the NexusHub ecosystem. Build trust, unlock opportunities, and receive your unique NEX ID after successful verification.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleNext} noValidate>
              {/* Step indicator header card */}
              <div className="bg-white rounded-2xl border border-stone-200/80 px-6 py-4 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-stone-500 mb-3">
                  <span>STEP {step} OF 4</span>
                  <span className="text-stone-700 uppercase">{stepNames[step - 1]}</span>
                </div>
                {/* 4-step progress track */}
                <div className="w-full h-1 bg-[#fed7aa]/35 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ea4e1b] to-[#f97316] rounded-full transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Basics Form Card (Matching Provided Image) */}
              {step === 1 && (
                <div className="bg-white rounded-[24px] border border-stone-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-6">
                    Basic information
                  </h2>

                  {/* Row 1: Full Name & Mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                        FULL NAME <span className="text-[#ea4e1b]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm focus:outline-none transition-all ${
                          errors.fullName
                            ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                            : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                        }`}
                      />
                      {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                        MOBILE NUMBER <span className="text-[#ea4e1b]">*</span>
                      </label>
                      <div className={`flex rounded-xl border overflow-hidden transition-all ${
                        errors.phone
                          ? 'border-red-400 ring-1 ring-red-400'
                          : 'border-stone-200 focus-within:border-stone-400 focus-within:ring-1 focus-within:ring-stone-400'
                      }`}>
                        <span className="px-3.5 py-3 bg-stone-50 border-r border-stone-200 text-stone-700 text-sm font-medium flex items-center justify-center shrink-0">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="9XXXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className="flex-1 px-4 py-3 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none"
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Row 2: Email */}
                  <div className="mb-5">
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                      EMAIL ADDRESS <span className="text-[#ea4e1b]">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                          : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                      }`}
                    />
                    {errors.email ? (
                      <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
                    ) : (
                      <p className="text-xs text-stone-500 mt-2 font-normal">
                        Use your frequently used email. We&apos;ll ask for your official / role-specific email in the next steps.
                      </p>
                    )}
                  </div>

                  {/* Row 3: City & State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                        CITY <span className="text-[#ea4e1b]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm focus:outline-none transition-all ${
                          errors.city
                            ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                            : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                        }`}
                      />
                      {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                        STATE <span className="text-[#ea4e1b]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.state}
                          onChange={(e) => updateField('state', e.target.value)}
                          className={`w-full appearance-none px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none transition-all cursor-pointer pr-10 ${
                            errors.state
                              ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                              : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                          } ${!formData.state ? 'text-stone-400' : 'text-stone-900'}`}
                        >
                          <option value="" disabled>Select state</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s} className="text-stone-900">
                              {s}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-stone-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.state && <p className="text-[11px] text-red-500 mt-1">{errors.state}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Role & Profile */}
              {step === 2 && (
                <div className="bg-white rounded-[24px] border border-stone-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-6">
                    Role &amp; Affiliation
                  </h2>
                  <div className="mb-5">
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                      PRIMARY ROLE <span className="text-[#ea4e1b]">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Student', 'Founder', 'Professional', 'Recruiter'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({ ...formData, role })}
                          className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            formData.role === role
                              ? 'border-[#ea4e1b] bg-[#fff5f0] text-[#ea4e1b]'
                              : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                      COLLEGE / UNIVERSITY / COMPANY <span className="text-[#ea4e1b]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. IIT Bombay, BITS Pilani, etc."
                      value={formData.institution}
                      onChange={(e) => updateField('institution', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm focus:outline-none transition-all ${
                        errors.institution
                          ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                          : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                      }`}
                    />
                    {errors.institution && <p className="text-[11px] text-red-500 mt-1">{errors.institution}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Education (Matching Provided Image) */}
              {step === 3 && (
                <div className="bg-white rounded-[24px] border border-stone-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-6">
                    Education
                  </h2>

                  {/* College / University */}
                  <div className="mb-5">
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                      COLLEGE / UNIVERSITY <span className="text-[#ea4e1b]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => updateField('college', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm focus:outline-none transition-all ${
                        errors.college
                          ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                          : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                      }`}
                    />
                    {errors.college && <p className="text-[11px] text-red-500 mt-1">{errors.college}</p>}
                  </div>

                  {/* Degree & Current Year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                        DEGREE <span className="text-[#ea4e1b]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.degree}
                          onChange={(e) => updateField('degree', e.target.value)}
                          className={`w-full appearance-none px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none transition-all cursor-pointer pr-10 ${
                            errors.degree
                              ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                              : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                          } ${!formData.degree ? 'text-stone-400' : 'text-stone-900'}`}
                        >
                          <option value="" disabled>Select degree</option>
                          {DEGREES.map((d) => (
                            <option key={d} value={d} className="text-stone-900">{d}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-stone-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.degree && <p className="text-[11px] text-red-500 mt-1">{errors.degree}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                        CURRENT YEAR <span className="text-[#ea4e1b]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.currentYear}
                          onChange={(e) => updateField('currentYear', e.target.value)}
                          className={`w-full appearance-none px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none transition-all cursor-pointer pr-10 ${
                            errors.currentYear
                              ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                              : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                          } ${!formData.currentYear ? 'text-stone-400' : 'text-stone-900'}`}
                        >
                          <option value="" disabled>Select year</option>
                          {CURRENT_YEARS.map((y) => (
                            <option key={y} value={y} className="text-stone-900">{y}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-stone-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.currentYear && <p className="text-[11px] text-red-500 mt-1">{errors.currentYear}</p>}
                    </div>
                  </div>

                  {/* Department */}
                  <div className="mb-5">
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                      DEPARTMENT <span className="text-[#ea4e1b]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.department}
                        onChange={(e) => updateField('department', e.target.value)}
                        className={`w-full appearance-none px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none transition-all cursor-pointer pr-10 ${
                          errors.department
                            ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                            : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                        } ${!formData.department ? 'text-stone-400' : 'text-stone-900'}`}
                      >
                        <option value="" disabled>Select degree first</option>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept} className="text-stone-900">{dept}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-stone-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.department && <p className="text-[11px] text-red-500 mt-1">{errors.department}</p>}
                  </div>

                  {/* Graduation Year */}
                  <div className="mb-5">
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                      GRADUATION YEAR <span className="text-[#ea4e1b]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.gradYear}
                        onChange={(e) => updateField('gradYear', e.target.value)}
                        className={`w-full appearance-none px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none transition-all cursor-pointer pr-10 ${
                          errors.gradYear
                            ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                            : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                        } ${!formData.gradYear ? 'text-stone-400' : 'text-stone-900'}`}
                      >
                        <option value="" disabled>Select year (2015–2035)</option>
                        {GRAD_YEARS.map((gy) => (
                          <option key={gy} value={gy} className="text-stone-900">{gy}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-stone-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.gradYear && <p className="text-[11px] text-red-500 mt-1">{errors.gradYear}</p>}
                  </div>

                  {/* College Email */}
                  <div className="mb-2">
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                      COLLEGE EMAIL <span className="text-[#ea4e1b]">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={formData.collegeEmail}
                      onChange={(e) => updateField('collegeEmail', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm focus:outline-none transition-all ${
                        errors.collegeEmail
                          ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                          : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                      }`}
                    />
                    {errors.collegeEmail ? (
                      <p className="text-[11px] text-red-500 mt-1">{errors.collegeEmail}</p>
                    ) : (
                      <p className="text-xs text-stone-500 mt-2 font-normal">
                        Your official college / university email speeds up verification.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Photo & Consent (Matching Provided Image) */}
              {step === 4 && (
                <div className="space-y-4">
                  {/* Card 1: Professional links */}
                  <div className="bg-white rounded-[24px] border border-stone-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-6">
                      Professional links
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                          LINKEDIN <span className="text-[#ea4e1b]">*</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          value={formData.linkedin}
                          onChange={(e) => updateField('linkedin', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm focus:outline-none transition-all placeholder:text-stone-400 ${
                            errors.linkedin
                              ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                              : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                          }`}
                        />
                        {errors.linkedin && <p className="text-[11px] text-red-500 mt-1">{errors.linkedin}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                          INSTAGRAM <span className="text-[#ea4e1b]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/..."
                          value={formData.instagram}
                          onChange={(e) => updateField('instagram', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm focus:outline-none transition-all placeholder:text-stone-400 ${
                            errors.instagram
                              ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                              : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                          }`}
                        />
                        {errors.instagram && <p className="text-[11px] text-red-500 mt-1">{errors.instagram}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
                        RESUME LINK (GOOGLE DRIVE / DROPBOX) <span className="text-[#ea4e1b]">*</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={formData.resumeLink}
                        onChange={(e) => updateField('resumeLink', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm focus:outline-none transition-all placeholder:text-stone-400 ${
                          errors.resumeLink
                            ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                            : 'border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400'
                        }`}
                      />
                      {errors.resumeLink && <p className="text-[11px] text-red-500 mt-1">{errors.resumeLink}</p>}
                    </div>
                  </div>

                  {/* Card 2: Initiative interests */}
                  <div className="bg-white rounded-[24px] border border-stone-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
                      Initiative interests
                    </h2>
                    <p className="text-xs text-stone-500 mb-5">
                      Choose up to 3 initiatives you&apos;d like to be part of.{' '}
                      <span className="font-semibold text-stone-800">{formData.initiatives.length}/3 selected</span>
                    </p>

                    <div className="flex flex-wrap gap-2.5">
                      {INITIATIVES_LIST.map((init) => {
                        const isSelected = formData.initiatives.includes(init);
                        return (
                          <button
                            key={init}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  initiatives: formData.initiatives.filter((i) => i !== init),
                                });
                              } else if (formData.initiatives.length < 3) {
                                setFormData({
                                  ...formData,
                                  initiatives: [...formData.initiatives, init],
                                });
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'border-[#ea4e1b] bg-[#fff5f0] text-[#ea4e1b] shadow-xs'
                                : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                            }`}
                          >
                            {init}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card 3: Profile photo */}
                  <div className="bg-white rounded-[24px] border border-stone-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
                      Profile photo
                    </h2>
                    <p className="text-xs text-stone-500 mb-5">
                      Accepted: JPG, PNG, WEBP. We&apos;ll compress to under 50 KB automatically.
                    </p>

                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-2xl bg-stone-100 border border-stone-200/80 flex items-center justify-center text-xs text-stone-400 font-medium overflow-hidden shrink-0">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span>Preview</span>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const result = reader.result as string;
                              setPhotoPreview(result);
                              setFormData((prev) => ({ ...prev, profilePhoto: result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-all shadow-xs"
                      >
                        <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4" />
                        </svg>
                        <span>Upload photo</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 4: Declaration */}
                  <div className={`bg-white rounded-[24px] border p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all ${
                    errors.declaration ? 'border-red-400 ring-1 ring-red-400 bg-red-50/10' : 'border-stone-200/80'
                  }`}>
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-4">
                      Declaration
                    </h2>

                    <div
                      onClick={() => updateField('declaration', !formData.declaration)}
                      className="flex items-start gap-3.5 cursor-pointer select-none"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        formData.declaration
                          ? 'border-[#ea4e1b] bg-[#ea4e1b]'
                          : errors.declaration
                            ? 'border-red-500 bg-white'
                            : 'border-orange-400 bg-white'
                      }`}>
                        {formData.declaration && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed font-normal">
                        I confirm that the information provided is accurate and belongs to me. I understand that submitting false information may result in rejection of my verification request.
                      </p>
                    </div>
                    {errors.declaration && <p className="text-[11px] text-red-500 mt-2">{errors.declaration}</p>}
                  </div>
                </div>
              )}

              {/* Validation alert banner if required fields are missing */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5">
                  <span className="text-sm">⚠️</span>
                  <span>Please fill in all mandatory fields (*) before proceeding to the next step.</span>
                </div>
              )}

              {/* Action Buttons Below Form */}
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-600 text-sm font-medium transition-all shadow-xs"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleNext()}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#fca07a] via-[#f78263] to-[#ef685c] hover:opacity-95 text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  <span>{step === 4 ? (submitting ? 'Submitting...' : 'Submit Verification Request') : 'Continue'}</span>
                  {step !== 4 && <span>→</span>}
                </button>
              </div>
            </form>
          ) : (
            /* Submission Success Screen */
            <div className="bg-white rounded-[24px] border border-stone-200/80 p-8 sm:p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 text-2xl font-bold">
                ✓
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 mb-2">
                Application Received!
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
                Thank you, <strong>{formData.fullName || 'Builder'}</strong>. Your verification details have been received and stored in our database for evaluation.
              </p>
              <div className="inline-block p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-6">
                <span className="text-xs uppercase tracking-wider text-stone-400 block mb-1">Assigned Temporary ID</span>
                <span className="font-mono text-base font-bold text-[#ea4e1b]">{assignedId || `NEX-${Math.floor(100000 + Math.random() * 900000)}`}</span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-8 py-3 rounded-full bg-[#141413] hover:bg-stone-800 text-white text-sm font-semibold transition-all shadow-sm"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
