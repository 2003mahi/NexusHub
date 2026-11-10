import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export default function InitiativeCard({ id, title, description, icon, href }: Props) {
  return (
    <a
      href="https://topmate.io/mahidhar_07"
      target="_blank"
      rel="noopener noreferrer"
      className="group p-6 bg-background rounded-lg shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl hover:bg-muted"
    >
      <div className="flex items-center mb-4">
        <Image src={icon} alt={title} width={40} height={40} className="mr-3" />
        <h3 className="text-xl font-bold text-primary transition-colors group-hover:text-primary-foreground">
          {title}
        </h3>
      </div>
      <p className="text-muted-foreground transition-colors group-hover:text-foreground">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-green-500">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Operational
      </div>
    </a>
  );
}
