'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [initiativesOpen, setInitiativesOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setInitiativesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch {
      // ignore
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Verify', href: '/get-verified' },
    { name: 'Contact', href: '/contact' },
  ];

  const initiatives = [
    { name: 'Careers', href: '/careers', desc: 'Curated roles & talent network', tag: 'Hiring' },
    { name: 'Labs', href: '/labs', desc: 'Real-world collaborative projects', tag: 'Live' },
    { name: 'Community', href: '/community', desc: '20,000+ verified members', tag: 'Active' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fbfaf8]/90 backdrop-blur-md border-b border-[#f0ede6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand identity: Emblem + Text + Subtitle */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 rounded-2xl bg-[#171717] border border-stone-800/90 p-1 flex items-center justify-center shadow-sm group-hover:border-[#ea4e1b]/60 group-hover:shadow-md group-hover:shadow-stone-900/10 group-hover:scale-105 transition-all duration-300 overflow-hidden shrink-0">
            <Image
              src="/logo.jpg"
              alt="NexusHub Logo"
              width={44}
              height={44}
              className="w-full h-full object-cover rounded-xl"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline font-bold tracking-tight text-[#141413] text-[20px] leading-none group-hover:text-stone-950 transition-colors">
              <span>nexushub</span>
              <span className="text-[#ea4e1b] ml-0.5 inline-block text-xl leading-none">.</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500 font-semibold mt-1">
              connecting Dreams
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-7">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-[#141413]' : 'text-stone-600 hover:text-[#141413]'
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${
              pathname === '/about' ? 'text-[#141413]' : 'text-stone-600 hover:text-[#141413]'
            }`}
          >
            About
          </Link>

          {/* Initiatives Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setInitiativesOpen(!initiativesOpen)}
              className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-[#141413] transition-colors py-2 cursor-pointer"
            >
              <span>Initiatives</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${initiativesOpen ? 'rotate-180 text-[#ea4e1b]' : 'text-stone-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {initiativesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#f0ede6] p-3 grid gap-1.5 animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-stone-400">
                  NexusHub Ecosystem
                </div>
                {initiatives.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setInitiativesOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#fbfaf8] transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-stone-900 group-hover:text-[#ea4e1b] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-xs text-stone-500">{item.desc}</div>
                    </div>
                    <span className="text-[10px] font-medium bg-[#fff5f0] text-[#ea4e1b] px-2 py-0.5 rounded-full border border-[#fed7aa]/50">
                      {item.tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/get-verified"
            className={`text-sm font-medium transition-colors ${
              pathname === '/get-verified' || pathname === '/verification' ? 'text-[#ea4e1b]' : 'text-stone-600 hover:text-[#141413]'
            }`}
          >
            Verify
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors ${
              pathname === '/contact' ? 'text-[#141413]' : 'text-stone-600 hover:text-[#141413]'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Action: Get Verified Pill CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/get-verified"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#ea4e1b] hover:bg-[#d43b0c] text-white text-sm font-semibold shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Verified
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Toggle Navigation"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#fbfaf8] border-b border-[#f0ede6] px-4 pt-3 pb-6 space-y-3">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200/60">
            <div className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Ecosystem
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {initiatives.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-stone-700 bg-white border border-stone-200/60 hover:border-[#ea4e1b]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200/60 flex flex-col gap-2">
            <Link
              href="/get-verified"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-3 rounded-full bg-[#ea4e1b] text-white text-sm font-semibold shadow-sm"
            >
              Get Verified
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
