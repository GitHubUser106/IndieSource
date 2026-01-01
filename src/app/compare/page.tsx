"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, X } from "lucide-react";

interface SourceData {
  id: string;
  name: string;
  type: 'Wire' | 'Corporate' | 'Public' | 'International' | 'Local' | 'Syndicated' | 'Magazine' | 'Specialized' | 'Analysis' | 'Platform' | 'National';
  url: string;
  domain: string;
  countryCode?: string;
  title?: string;
  snippet?: string;
  headline?: string;
  keyPoints?: string[];
  tone?: string;
  focus?: string;
  missing?: string;
}

// Country flag emoji mapping
const countryFlags: Record<string, string> = {
  US: '🇺🇸', UK: '🇬🇧', GB: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺', DE: '🇩🇪', FR: '🇫🇷',
  JP: '🇯🇵', IN: '🇮🇳', CN: '🇨🇳', HK: '🇭🇰', BR: '🇧🇷', MX: '🇲🇽', KR: '🇰🇷',
  IT: '🇮🇹', ES: '🇪🇸', NL: '🇳🇱', CH: '🇨🇭', SE: '🇸🇪', NO: '🇳🇴', NZ: '🇳🇿',
  IE: '🇮🇪', IL: '🇮🇱', AE: '🇦🇪', SA: '🇸🇦', SG: '🇸🇬', QA: '🇶🇦', RU: '🇷🇺',
  KE: '🇰🇪', ZA: '🇿🇦', NG: '🇳🇬', EG: '🇪🇬', PL: '🇵🇱', TR: '🇹🇷', TH: '🇹🇭',
};

const typeColors: Record<string, string> = {
  Wire: 'bg-blue-100 text-blue-700 border-blue-200',
  Corporate: 'bg-purple-100 text-purple-700 border-purple-200',
  Public: 'bg-green-100 text-green-700 border-green-200',
  'Public-Trust': 'bg-green-100 text-green-700 border-green-200',
  'State-Funded': 'bg-red-100 text-red-700 border-red-200',
  Nonprofit: 'bg-teal-100 text-teal-700 border-teal-200',
  International: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Local: 'bg-stone-100 text-stone-700 border-stone-200',
  Syndicated: 'bg-gray-100 text-gray-600 border-gray-200',
  Magazine: 'bg-pink-100 text-pink-700 border-pink-200',
  Specialized: 'bg-orange-100 text-orange-700 border-orange-200',
  Analysis: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Platform: 'bg-rose-100 text-rose-700 border-rose-200',
  National: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const typeDescriptions: Record<string, string> = {
  Wire: 'News agencies that provide factual reporting to other outlets',
  'Public-Trust': 'Publicly funded with editorial independence charter',
  'State-Funded': 'Government funded with potential state interests',
  Nonprofit: 'Donor or foundation funded, not profit-driven',
  Corporate: 'Privately-owned media companies, often ad-supported',
  National: 'Major national newspapers and outlets',
  International: 'Non-US outlets offering global perspective',
  Magazine: 'Long-form journalism and in-depth analysis',
  Analysis: 'Think tanks, policy experts, and investigative outlets',
  Specialized: 'Industry-focused or financial news outlets',
  Local: 'Regional newspapers and stations',
  Syndicated: 'Content republished from other sources',
  Platform: 'User-generated content platforms',
  Public: 'Publicly funded broadcasting, less commercial pressure',
};

function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const [sources, setSources] = useState<SourceData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTypeInfo, setShowTypeInfo] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [storyContext, setStoryContext] = useState<string>('');

  // Load sources from URL params or localStorage
  useEffect(() => {
    const sourcesParam = searchParams.get('sources');
    if (sourcesParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sourcesParam));
        // Add domain if missing (extract from url)
        const withDomains = parsed.map((source: any) => ({
          ...source,
          domain: source.domain || (source.url ? new URL(source.url).hostname.replace('www.', '') : 'unknown')
        }));
        // De-duplicate by domain just in case
        const uniqueSources = withDomains.filter((source: SourceData, index: number, self: SourceData[]) =>
          index === self.findIndex(s => s.domain === source.domain)
        );
        setSources(uniqueSources);
        // Auto-select first 2-3 sources
        setSelectedIds(uniqueSources.slice(0, Math.min(3, uniqueSources.length)).map((s: SourceData) => s.id));
      } catch (e) {
        console.error('Failed to parse sources:', e);
      }
    }
    setLoading(false);
  }, [searchParams]);

  // Extract story context from URL params
  useEffect(() => {
    const contextParam = searchParams.get('context');
    if (contextParam) {
      setStoryContext(decodeURIComponent(contextParam));
    }
  }, [searchParams]);

  // Batch analyze selected sources
  useEffect(() => {
    async function fetchAnalyses() {
      const selectedSources = sources.filter(s => selectedIds.includes(s.id));
      if (selectedSources.length === 0) return;

      // Check if we already have analyses for all selected sources
      const needsAnalysis = selectedSources.some(s => !analyses[s.id]);
      if (!needsAnalysis) return;

      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sources: selectedSources, storyContext }),
        });
        const data = await res.json();

        if (data.analyses) {
          const analysisMap: Record<string, any> = { ...analyses };
          data.analyses.forEach((a: any) => {
            analysisMap[a.sourceId] = a;
          });
          setAnalyses(analysisMap);
        }
      } catch (err) {
        console.error('Analysis failed:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }

    fetchAnalyses();
  }, [selectedIds, sources, storyContext]);

  const selectedSources = sources.filter(s => selectedIds.includes(s.id));
  const availableSources = sources.filter(s => !selectedIds.includes(s.id));

  const toggleSource = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(s => s !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // Group sources by type for the insight
  const typeGroups = selectedSources.reduce((acc, source) => {
    acc[source.type] = (acc[source.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getInsight = () => {
    const types = Object.keys(typeGroups);
    if (types.length === 1) {
      return `You're comparing ${types.length} ${types[0].toLowerCase()} source${typeGroups[types[0]] > 1 ? 's' : ''}. Consider adding sources with different ownership models for a broader perspective.`;
    }
    if (types.length >= 3) {
      return `Great diversity! You're comparing sources across ${types.length} different ownership models, giving you a well-rounded view of this story.`;
    }
    return `You're comparing ${types.join(' and ').toLowerCase()} sources. Each ownership model brings different editorial priorities and perspectives.`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading comparison...</div>
      </div>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">No sources to compare</h1>
        <p className="text-slate-600 mb-6">Search for a story first, then select sources to compare.</p>
        <Link href="/" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-full font-medium">
          Go to MirrorSource
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-transparent border-none cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to results</span>
            </button>
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="MirrorSource" width={140} height={35} className="h-8 w-auto" />
            </Link>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Compare Coverage</h1>
          <p className="text-slate-600">See how different sources cover the same story</p>
        </div>

        {/* Source Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-600 mr-2">Comparing:</span>
            {selectedSources.map(source => (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-full px-3 py-1.5 text-sm transition-colors"
              >
                <img src={getFaviconUrl(source.domain)} alt="" className="w-4 h-4 rounded" />
                <span className="font-medium text-slate-700">{source.name}</span>
                {source.countryCode && countryFlags[source.countryCode] && (
                  <span className="text-sm">{countryFlags[source.countryCode]}</span>
                )}
                <X size={14} className="text-slate-400 hover:text-slate-600" />
              </button>
            ))}
            {availableSources.length > 0 && selectedIds.length < 4 && (
              <select
                className="bg-white border border-slate-200 rounded-full px-3 py-1.5 text-sm text-slate-600 cursor-pointer hover:border-slate-300"
                onChange={(e) => {
                  if (e.target.value) {
                    toggleSource(e.target.value);
                    e.target.value = '';
                  }
                }}
                value=""
              >
                <option value="">+ Add source</option>
                {availableSources.map(source => (
                  <option key={source.id} value={source.id}>{source.name}</option>
                ))}
              </select>
            )}
          </div>
          {selectedIds.length >= 4 && (
            <p className="text-xs text-slate-500 mt-2">Maximum 4 sources for comparison</p>
          )}
        </div>

        {/* Side-by-Side Cards */}
        {selectedSources.length > 0 ? (
          <div className={`grid gap-4 mb-8 ${
            selectedSources.length === 1 ? 'md:grid-cols-1 max-w-xl' : 
            selectedSources.length === 2 ? 'md:grid-cols-2' : 
            selectedSources.length === 3 ? 'md:grid-cols-3' :
            'md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {selectedSources.map(source => (
              <div key={source.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {/* Source Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={getFaviconUrl(source.domain)} alt="" className="w-6 h-6 rounded" />
                      <span className="font-semibold text-slate-900">{source.name}</span>
                      {source.countryCode && countryFlags[source.countryCode] && (
                        <span className="text-base" title={source.countryCode}>{countryFlags[source.countryCode]}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowTypeInfo(showTypeInfo === source.type ? null : source.type)}
                      className={`text-xs px-2 py-1 rounded-full border ${typeColors[source.type]} cursor-help`}
                    >
                      {source.type}
                    </button>
                  </div>
                  {showTypeInfo === source.type && (
                    <p className="text-xs text-slate-500 mt-2 p-2 bg-white rounded border border-slate-200">
                      {typeDescriptions[source.type]}
                    </p>
                  )}
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#2563eb] hover:underline text-sm flex items-center gap-1"
                  >
                    Read full article <ExternalLink size={12} />
                  </a>
                </div>

                {/* Content */}
                <div className="p-5 flex-1">
                  {isAnalyzing && !analyses[source.id] ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  ) : analyses[source.id] ? (
                    <div className="space-y-4">
                      {/* Inferred badge */}
                      {analyses[source.id].isInferred && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                          Based on search preview - full article not fetched
                        </div>
                      )}
                      {/* Headline */}
                      <div>
                        <p className="font-semibold text-slate-900 leading-snug">
                          "{analyses[source.id].headline}"
                        </p>
                      </div>

                      {/* Tone Badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tone</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          {analyses[source.id].tone}
                        </span>
                      </div>

                      {/* Focus */}
                      <div>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Focus</span>
                        <p className="text-sm text-slate-700">{analyses[source.id].focus}</p>
                      </div>

                      {/* Unique Angle */}
                      <div>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Unique Angle</span>
                        <p className="text-sm text-slate-700">{analyses[source.id].uniqueAngle}</p>
                      </div>

                      {/* Missing Context */}
                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-xs font-medium text-amber-600 uppercase tracking-wide block mb-1">Not Covered</span>
                        <p className="text-sm text-slate-500 italic">{analyses[source.id].missingContext}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400">
                      <p className="text-sm">Analysis unavailable</p>
                    </div>
                  )}
                </div>

                {/* Read full article link */}
                <div className="p-4 pt-0">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Read full article <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center mb-8">
            <p className="text-slate-600">Select at least one source to compare</p>
          </div>
        )}

        {/* Ownership Type Legend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <h3 className="font-semibold text-slate-900 mb-4">Understanding Ownership Types</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(typeDescriptions).map(([type, desc]) => (
              <div key={type} className="flex gap-3">
                <span className={`text-xs px-2 py-1 rounded-full border h-fit whitespace-nowrap ${typeColors[type]}`}>
                  {type}
                </span>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insight Box */}
        {selectedSources.length >= 2 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span>💡</span> Perspective Check
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {getInsight()}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MirrorSource</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#2563eb] transition-colors">About</Link>
            <Link href="/sources" className="hover:text-[#2563eb] transition-colors">Sources</Link>
            <Link href="/legal" className="hover:text-[#2563eb] transition-colors">Legal</Link>
            <Link href="/contact" className="hover:text-[#2563eb] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}