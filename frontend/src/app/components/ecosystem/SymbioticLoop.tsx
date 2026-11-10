'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export default function SymbioticLoop() {
  const nodes = [
    { id: 'resources', label: 'Resources', icon: '/globe.svg' },
    { id: 'projects', label: 'Projects', icon: '/file.svg' },
    { id: 'mentors', label: 'Mentors', icon: '/window.svg' },
  ];

  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="py-20 px-4 md:px-8 bg-muted text-center" id="visualization">
      <h2 className="text-3xl font-semibold mb-6 text-primary">How It All Connects</h2>
      <div className="relative w-full max-w-5xl mx-auto h-80 flex items-center justify-center">
        {nodes.map((node, idx) => (
          <div
            key={node.id}
            className="absolute flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
            style={{
              left: `${33 * idx + 20}%`,
              top: idx % 2 === 0 ? '20%' : '60%',
            }}
            onClick={() => setActive(active === node.id ? null : node.id)}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-colors ${active === node.id ? 'bg-primary/20' : 'bg-background'}`}>
              <Image src={node.icon} alt={node.label} width={40} height={40} />
            </div>
            <span className="mt-2 text-sm font-medium text-primary">{node.label}</span>
          </div>
        ))}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <line x1="30" y1="30" x2="55" y2="65" stroke={active === 'resources' || active === 'projects' ? '#34d399' : '#9ca3af'} strokeWidth="0.5" />
          <line x1="55" y1="65" x2="80" y2="30" stroke={active === 'projects' || active === 'mentors' ? '#34d399' : '#9ca3af'} strokeWidth="0.5" />
          <line x1="80" y1="30" x2="30" y2="30" stroke={active === 'mentors' || active === 'resources' ? '#34d399' : '#9ca3af'} strokeWidth="0.5" />
        </svg>
      </div>
    </section>
  );
}
