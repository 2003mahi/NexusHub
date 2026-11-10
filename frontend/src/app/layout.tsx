import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "NexusHub – India's Verified Student-to-Founder Ecosystem",
  description: "Connect, learn, and grow. NexusHub is the luxury verified ecosystem connecting students, founders, recruiters, and innovators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#fbfaf8] text-[#111827] selection:bg-[#ea4e1b]/15 selection:text-[#ea4e1b]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

