"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Copy, Check, Mail, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = "mirrorsourcecontact@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="pt-8 pb-4 px-4 flex flex-col items-center">
        <Link href="/" className="mb-6 hover:opacity-90 transition-opacity">
          <Image src="/logo.png" alt="MirrorSource Logo" width={300} height={75} priority className="w-48 sm:w-64 h-auto" />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 pt-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Contact Us</h1>
                <p className="text-slate-500 text-sm">We'd love to hear from you</p>
              </div>
            </div>

            <p className="text-slate-600 mb-6">
              Have feedback, questions, or suggestions? Send us an email and we'll get back to you as soon as possible.
            </p>

            {/* Email display with copy */}
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between gap-4">
              <span className="text-slate-800 font-medium">{email}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Alternative: Open email client */}
            <a
              href={`mailto:${email}?subject=MirrorSource%20Feedback`}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
            >
              <Mail size={16} />
              Open in email app
            </a>
          </div>

          {/* Back link */}
          <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm">
            <ArrowLeft size={16} />
            Back to MirrorSource
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} MirrorSource</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link href="/sources" className="hover:text-blue-600 transition-colors">Sources</Link>
            <Link href="/legal" className="hover:text-blue-600 transition-colors">Legal</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}