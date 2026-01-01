"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReviewRequestModal from "@/components/ReviewRequestModal";
import { getSourcesByLean, LEAN_COLORS, LEAN_LABELS, type PoliticalLean } from "@/lib/sourceData";

// Get sources grouped by lean from single source of truth
const sourcesByLean = getSourcesByLean();

// Badge colors matching the app's taxonomy
const badgeColors: Record<string, string> = {
  Wire: "bg-blue-100 text-blue-700",
  "Public-Trust": "bg-green-100 text-green-700",
  "State-Funded": "bg-red-100 text-red-700",
  Nonprofit: "bg-teal-100 text-teal-700",
  Corporate: "bg-purple-100 text-purple-700",
  National: "bg-yellow-100 text-yellow-700",
  International: "bg-cyan-100 text-cyan-700",
  Magazine: "bg-pink-100 text-pink-700",
  Analysis: "bg-indigo-100 text-indigo-700",
  Specialized: "bg-orange-100 text-orange-700",
  Local: "bg-stone-100 text-stone-700",
};

// Badge descriptions
const badgeDescriptions: Record<string, string> = {
  Wire: "News agencies providing factual reporting to other outlets",
  "Public-Trust": "Publicly funded with editorial independence charter",
  "State-Funded": "Government funded with potential state interests",
  Nonprofit: "Donor or foundation funded, not profit-driven",
  Corporate: "Privately-owned media companies, often ad-supported",
  National: "Major national newspapers and outlets",
  International: "Non-US outlets offering global perspective",
  Magazine: "Long-form journalism and in-depth analysis",
  Analysis: "Think tanks, policy experts, and investigative outlets",
  Specialized: "Industry-focused or financial news outlets",
};

// Lean column styling - uses shared LEAN_COLORS from sourceData.ts

function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

export default function SourcesPage() {
  const totalSources = Object.values(sourcesByLean).flat().length;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="MirrorSource" width={160} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About</Link>
              <Link href="/sources" className="text-blue-600 font-medium">Sources</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Our Sources</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            MirrorSource aggregates <span className="font-semibold">{totalSources}+ news sources</span> across the political spectrum,
            categorizing every outlet by editorial perspective and ownership type so you can see the whole story with full transparency.
          </p>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {(Object.keys(sourcesByLean) as PoliticalLean[]).map((lean) => (
            <div
              key={lean}
              className={`rounded-xl border ${LEAN_COLORS[lean].border} ${LEAN_COLORS[lean].bg} overflow-hidden`}
            >
              <h2 className={`text-lg font-bold text-white py-3 text-center ${LEAN_COLORS[lean].headerBg}`}>
                {LEAN_LABELS[lean]}
              </h2>
              <div className="p-4">
              <div className="space-y-2">
                {sourcesByLean[lean].map((source) => (
                  <div
                    key={source.domain}
                    className="bg-white rounded-lg p-3 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getFaviconUrl(source.domain)}
                        alt=""
                        className="w-4 h-4 rounded"
                      />
                      <span className="font-medium text-slate-800 text-sm leading-tight">
                        {source.name}
                      </span>
                    </div>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full ${badgeColors[source.type] || "bg-gray-100 text-gray-700"}`}
                    >
                      {source.type}
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </div>
          ))}
        </div>

        {/* Badge Legend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 text-lg">Understanding Source Types</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(badgeDescriptions).map(([type, desc]) => (
              <div key={type} className="flex flex-col gap-1">
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full w-fit ${badgeColors[type] || "bg-gray-100 text-gray-700"}`}
                >
                  {type}
                </span>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 max-w-3xl mx-auto">
            Our political labels are informed by independent rating systems like AllSides and Ad Fontes.
            We also tag sources based on who owns them—so you always know if a story is coming from a corporation, a government, or a nonprofit.
            We regularly review our database to keep it balanced and up to date.
            {" "}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="text-[#2563eb] hover:underline font-medium"
            >
              News outlets may request a review
            </button>.
          </p>
        </div>
      </main>

      <ReviewRequestModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} MirrorSource</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link href="/sources" className="hover:text-blue-600 transition-colors">Sources</Link>
            <Link href="/legal" className="hover:text-blue-600 transition-colors">Legal</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
