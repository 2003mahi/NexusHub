import React from 'react';
import Link from 'next/link';

export default function AccessBanner() {
  return (
    <section className="py-24 bg-primary text-primary-foreground text-center" id="cta">
      <h3 className="text-4xl font-bold mb-6">
        Ready to Explore the Ecosystem?
      </h3>
      <a
        href="https://topmate.io/mahidhar_07"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 bg-background text-primary rounded-md hover:bg-background/90 transition"
      >
        Get Started with NexusHub
      </a>
    </section>
  );
}
