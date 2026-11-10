import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-center text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <Image src="/about_hero.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
      </div>
      <div className="relative z-10 max-w-3xl px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200/90 shadow-sm">
          <span className="text-xs font-bold tracking-wider text-stone-700 uppercase">
            All systems verified &amp; operational
          </span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
          The Operating System for Student-to-Founder Success
        </h1>
        <a href="https://topmate.io/mahidhar_07" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
          Join the Network
        </a>
      </div>
    </section>
  );
}
