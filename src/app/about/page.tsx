import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search, FileText, ExternalLink, Shield, Zap, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About | MirrorSource",
  description: "Learn how MirrorSource helps you see the whole story by finding free, public coverage of news articles.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="MirrorSource" 
              width={180} 
              height={45} 
              className="h-auto w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            See the whole story.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            MirrorSource is a free tool that helps you find multiple perspectives on any news story. Paste a link, get a summary, and discover free coverage from sources around the world.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-[#2563eb]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Paste a Link</h3>
              <p className="text-slate-600">
                Drop in any news article URL. We search the open web to find related coverage.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-[#2563eb]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Get a Summary</h3>
              <p className="text-slate-600">
                We generate a neutral summary of the story based on publicly available sources.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-7 h-7 text-[#2563eb]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Explore Sources</h3>
              <p className="text-slate-600">
                Click through to read full coverage from free, public news sources. You're always in control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            What Makes Us Different
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Respects Copyright</h3>
                <p className="text-slate-600">
                  We never scrape, store, or republish copyrighted content. Our summaries are generated from public information, and we link directly to original sources.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Neutral by Design</h3>
                <p className="text-slate-600">
                  Our summaries are designed to be balanced and factual. We help you understand what happened, not what to think about it.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Global Perspective</h3>
                <p className="text-slate-600">
                  See how stories are covered by sources from around the world—from major wire services to regional outlets you might never have found on your own.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-[#2563eb]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Free to Use</h3>
                <p className="text-slate-600">
                  MirrorSource is free with a daily search limit. We believe everyone deserves access to diverse news perspectives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to see the whole story?
          </h2>
          <p className="text-slate-600 mb-8">
            Try MirrorSource now—paste any news link and discover alternative coverage in seconds.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Try MirrorSource
            <ExternalLink size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} MirrorSource</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#2563eb] transition-colors">About</Link>
            <Link href="/sources" className="hover:text-[#2563eb] transition-colors">Sources</Link>
            <Link href="/legal" className="hover:text-[#2563eb] transition-colors">Legal</Link>
            <Link href="/contact" className="hover:text-[#2563eb] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}