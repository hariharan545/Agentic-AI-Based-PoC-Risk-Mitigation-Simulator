'use client';
import './globals.css';
import React from 'react';
import Link from 'next/link';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50`}>
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow">Agentic PoC Simulator</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-white font-semibold hover:underline">Home</Link>
            <Link href="/dashboard" className="text-white font-semibold hover:underline">Dashboard</Link>
            <Link href="/admin" className="text-white font-semibold hover:underline">Admin</Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
