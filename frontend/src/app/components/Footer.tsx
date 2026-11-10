'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#fbfaf8] border-t border-[#f0ede6] pt-16 pb-12 text-[#141413]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#f0ede6]">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-10 h-10 rounded-2xl bg-[#171717] border border-stone-800/90 p-0.5 flex items-center justify-center shadow-xs group-hover:border-[#ea4e1b]/60 transition-all duration-300 overflow-hidden shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="NexusHub Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline font-bold tracking-tight text-[#141413] text-[19px] leading-none group-hover:text-stone-950 transition-colors">
                  <span>nexushub</span>
                  <span className="text-[#ea4e1b] ml-0.5 inline-block text-lg leading-none">.</span>
                </div>
                <span className="text-[9.5px] uppercase tracking-[0.24em] text-stone-500 font-semibold mt-1">
                  connecting Dreams
                </span>
              </div>
            </Link>
            <p className="text-sm text-stone-600 max-w-sm leading-relaxed">
              India&apos;s verified student-to-founder ecosystem. Bridging high-potential builders, founders, mentors, and investors into high-trust collaboration.
            </p>
            <div className="pt-2 text-xs text-stone-500 font-medium">
              Free · Human-reviewed · One Nexus ID for life
            </div>
          </div>

          {/* Ecosystem Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-wider uppercase text-stone-400">Initiatives</div>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/careers" className="hover:text-[#ea4e1b] transition-colors">Careers & Talent</Link></li>
              <li><Link href="/labs" className="hover:text-[#ea4e1b] transition-colors">Nexus Labs</Link></li>
              <li><Link href="/community" className="hover:text-[#ea4e1b] transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-wider uppercase text-stone-400">Platform</div>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/get-verified" className="hover:text-[#ea4e1b] transition-colors">Get Verified</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#ea4e1b] transition-colors">Member Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-wider uppercase text-stone-400">Connect</div>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/about" className="hover:text-[#ea4e1b] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#ea4e1b] transition-colors">Contact Team</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} NexusHub Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="inline-flex items-center gap-1.5 text-stone-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems verified & operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
