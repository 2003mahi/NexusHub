'use client';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbfaf8] text-[#141413]">
        {/* Editorial Hero */}
        <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-200 bg-white shadow-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-[#ea4e1b]"></span>
            <span className="text-[11px] font-bold tracking-wider text-stone-700 uppercase">
              The Nexus Story & Mission
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#141413] leading-[1.1] mb-6">
            Empowering India&apos;s next generation of <br />
            <span className="font-editorial-italic font-normal italic text-[#ea4e1b]">founders & innovators</span>.
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
            NexusHub bridges high-potential student builders with the verified network, mentorship, capital, and real-world opportunities needed to launch enduring ventures.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/get-verified"
              className="px-8 py-3.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              Get Verified Member ID →
            </Link>
            <Link
              href="/ecosystem"
              className="px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-sm font-semibold shadow-xs transition-all hover:scale-[1.02]"
            >
              Explore Ecosystem
            </Link>
          </div>
        </section>

        {/* Founder Profile Spotlight */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-white border border-[#f0ede6] rounded-3xl p-8 sm:p-12 luxury-card-shadow flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden ring-4 ring-[#fbfaf8] shadow-md flex-shrink-0">
              <Image
                src="/founder_avatar.jpg"
                alt="Mahidhar A"
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ea4e1b] bg-[#fff5f0] px-3 py-1 rounded-full border border-[#fed7aa]/50">
                Founding Vision
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight mt-3">
                &ldquo;Every student deserves a fair runway to build.&rdquo;
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed mt-3">
                NexusHub was founded by Mahidhar A with a singular vision: to dismantle the geographic and social gatekeeping around startup building. By combining proof-of-work identity, curated peer sprints, and direct investor pipelines, we ensure the most determined students turn ideas into real products.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900 text-sm">Mahidhar A</div>
                  <div className="text-xs text-stone-500">Founder, NexusHub</div>
                </div>
                <div className="font-mono text-xs font-semibold text-stone-400">
                  NEX-000001
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Timeline Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16 text-left">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ea4e1b] block mb-3">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#141413] tracking-tight leading-[1.15]">
              From an idea to an<br />ecosystem.
            </h2>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Center vertical line for md+ screens */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-12 w-[1.5px] bg-[#e6e2da] -translate-x-1/2" />
            
            {/* Left vertical line for mobile screens */}
            <div className="md:hidden absolute left-4 top-2 bottom-6 w-[1.5px] bg-[#e6e2da]" />

            <div className="space-y-12 md:space-y-20">
              {/* Item 1: 2024 - Founded */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-20">
                {/* Mobile & Desktop Dot */}
                <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ea4e1b] ring-4 ring-[#ea4e1b]/15 z-10" />

                {/* Left Card */}
                <div className="pl-10 md:pl-0 md:text-right">
                  <div className="bg-white border border-[#eae6de] rounded-3xl p-7 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] text-left hover:border-stone-300 transition-all">
                    <div className="flex justify-end mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea4e1b]">
                        Nov 8
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-2 tracking-tight">
                      Founded
                    </h3>
                    <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed font-normal">
                      The Student Spot was founded with the vision of connecting ambitious students with meaningful opportunities.
                    </p>
                  </div>
                </div>

                {/* Right Year */}
                <div className="pl-10 md:pl-0 flex items-center justify-start">
                  <span className="text-4xl sm:text-6xl font-extrabold text-[#ded8ce]/70 select-none tracking-tight">
                    2024
                  </span>
                </div>
              </div>

              {/* Item 2: 2025 - Expansion */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-20">
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ea4e1b] ring-4 ring-[#ea4e1b]/15 z-10" />

                {/* Left Year on Desktop (order-2 on mobile) */}
                <div className="pl-10 md:pl-0 flex items-center justify-start md:justify-end order-2 md:order-1">
                  <span className="text-4xl sm:text-6xl font-extrabold text-[#ded8ce]/70 select-none tracking-tight">
                    2025
                  </span>
                </div>

                {/* Right Card (order-1 on mobile) */}
                <div className="pl-10 md:pl-0 order-1 md:order-2">
                  <div className="bg-white border border-[#eae6de] rounded-3xl p-7 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] text-left hover:border-stone-300 transition-all">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea4e1b] block mb-2">
                      Expansion
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-2 tracking-tight">
                      Community &amp; partnerships
                    </h3>
                    <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed font-normal">
                      Expanded the community, launched initiatives and built partnerships across campuses and organizations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 3: 2026 - Ecosystem */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-20">
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ea4e1b] ring-4 ring-[#ea4e1b]/15 z-10" />

                {/* Left Card */}
                <div className="pl-10 md:pl-0">
                  <div className="bg-white border border-[#eae6de] rounded-3xl p-7 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] text-left hover:border-stone-300 transition-all">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea4e1b] block mb-2">
                      Ecosystem
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-2 tracking-tight">
                      Trust-first platform
                    </h3>
                    <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed font-normal">
                      Building a trusted ecosystem focused on verified identities, careers, collaboration, innovation and entrepreneurship.
                    </p>
                  </div>
                </div>

                {/* Right Year */}
                <div className="pl-10 md:pl-0 flex items-center justify-start">
                  <span className="text-4xl sm:text-6xl font-extrabold text-[#ded8ce]/70 select-none tracking-tight">
                    2026
                  </span>
                </div>
              </div>

              {/* Item 4: Future - Scale */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-20">
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ea4e1b] ring-4 ring-[#ea4e1b]/15 z-10" />

                {/* Left Year on Desktop (order-2 on mobile) */}
                <div className="pl-10 md:pl-0 flex items-center justify-start md:justify-end order-2 md:order-1">
                  <span className="text-4xl sm:text-6xl font-extrabold text-[#ded8ce]/70 select-none tracking-tight">
                    Future
                  </span>
                </div>

                {/* Right Card (order-1 on mobile) */}
                <div className="pl-10 md:pl-0 order-1 md:order-2">
                  <div className="bg-white border border-[#eae6de] rounded-3xl p-7 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] text-left hover:border-stone-300 transition-all">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea4e1b] block mb-2">
                      Scale
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-2 tracking-tight">
                      Millions connected
                    </h3>
                    <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed font-normal">
                      Connecting millions of students, founders, professionals, recruiters and organizations through one unified ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Values */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-[#141413] tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              The high standards that govern the NexusHub community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#f0ede6] rounded-3xl p-8 luxury-card-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center font-extrabold text-sm mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Verified Proof-of-Work</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Reputation isn&apos;t bought with marketing. Every member, project, and accolade is verified through real Git commits, product builds, or academic credentials.
              </p>
            </div>

            <div className="bg-white border border-[#f0ede6] rounded-3xl p-8 luxury-card-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center font-extrabold text-sm mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">High Signal, Zero Noise</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                We reject spammy networking. NexusHub focuses exclusively on tangible collaboration: building code, launching MVP experiments, and closing founder rounds.
              </p>
            </div>

            <div className="bg-white border border-[#f0ede6] rounded-3xl p-8 luxury-card-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#ea4e1b]/10 text-[#ea4e1b] flex items-center justify-center font-extrabold text-sm mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Democratic Opportunity</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Whether you study at an IIT or a tier-3 college in a regional town, your verified talent speaks for itself. Opportunities are unlocked solely on merit.
              </p>
            </div>
          </div>
        </section>

        {/* Numbers & CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* By The Numbers Header */}
          <div className="mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#ea4e1b]">
              By The Numbers
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#141413] tracking-tight mt-2 max-w-lg leading-tight">
              A community that is already moving.
            </h2>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-16">
            <div className="bg-white border border-[#eceae5] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-left hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
                20,000+
              </div>
              <div className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                Community members
              </div>
            </div>

            <div className="bg-white border border-[#eceae5] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-left hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
                100+
              </div>
              <div className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                Campuses connected
              </div>
            </div>

            <div className="bg-white border border-[#eceae5] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-left hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
                Growing
              </div>
              <div className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                Startup network
              </div>
            </div>

            <div className="bg-white border border-[#eceae5] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-left hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
                8
              </div>
              <div className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                Ecosystem initiatives
              </div>
            </div>

            <div className="bg-white border border-[#eceae5] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-left hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
                1000s
              </div>
              <div className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                Future opportunities
              </div>
            </div>
          </div>

          {/* Vibrant Gradient CTA Banner */}
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-r from-[#ff6b2b] via-[#ea4e1b] to-[#c83204] text-white p-8 sm:p-14 md:p-16 text-center shadow-2xl shadow-orange-500/15">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-black/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                Be part of something bigger.
              </h2>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
                Whether you&apos;re a student beginning your journey, a founder building your next company, a recruiter hiring exceptional talent, or an organization looking to create impact — there&apos;s a place for you in The Student Spot.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/get-verified"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-[#ea4e1b] hover:bg-stone-50 font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <span>Get Verified</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/ecosystem"
                  className="inline-flex items-center px-7 py-3 rounded-full border border-white/50 hover:border-white text-white hover:bg-white/10 font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                >
                  Explore Initiatives
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
