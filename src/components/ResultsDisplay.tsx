"use client";

import { ExternalLink, Link2, Check, Clock } from 'lucide-react';
import { useState } from 'react';
import { getPoliticalLean, LEAN_COLORS, LEAN_LABELS, type PoliticalLean } from '@/lib/sourceData';

type SourceType =
  | 'wire'
  | 'public'
  | 'public-trust'
  | 'corporate'
  | 'state'
  | 'state-funded'
  | 'nonprofit'
  | 'analysis'
  | 'local'
  | 'national'
  | 'international'
  | 'magazine'
  | 'specialized'
  | 'reference'
  | 'syndication'
  | 'archive'
  | 'platform';

interface SourceResult {
  uri: string;
  title: string;
  displayName?: string;
  sourceDomain?: string;
  sourceType?: SourceType;
  countryCode?: string;
  publishedAt?: string; // ISO date string
  isSyndicated?: boolean;
  politicalLean?: string;
}

interface ResultsDisplayProps {
  results: SourceResult[] | null;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}

// Country flag emoji mapping
const countryFlags: Record<string, { flag: string; label: string }> = {
  US: { flag: '🇺🇸', label: 'US' },
  UK: { flag: '🇬🇧', label: 'UK' },
  GB: { flag: '🇬🇧', label: 'UK' },
  EU: { flag: '🇪🇺', label: 'EU' },
  CA: { flag: '🇨🇦', label: 'CA' },
  AU: { flag: '🇦🇺', label: 'AU' },
  DE: { flag: '🇩🇪', label: 'DE' },
  FR: { flag: '🇫🇷', label: 'FR' },
  JP: { flag: '🇯🇵', label: 'JP' },
  IN: { flag: '🇮🇳', label: 'IN' },
  CN: { flag: '🇨🇳', label: 'CN' },
  HK: { flag: '🇭🇰', label: 'HK' },
  BR: { flag: '🇧🇷', label: 'BR' },
  MX: { flag: '🇲🇽', label: 'MX' },
  KR: { flag: '🇰🇷', label: 'KR' },
  IT: { flag: '🇮🇹', label: 'IT' },
  ES: { flag: '🇪🇸', label: 'ES' },
  NL: { flag: '🇳🇱', label: 'NL' },
  CH: { flag: '🇨🇭', label: 'CH' },
  SE: { flag: '🇸🇪', label: 'SE' },
  NO: { flag: '🇳🇴', label: 'NO' },
  NZ: { flag: '🇳🇿', label: 'NZ' },
  IE: { flag: '🇮🇪', label: 'IE' },
  IL: { flag: '🇮🇱', label: 'IL' },
  AE: { flag: '🇦🇪', label: 'AE' },
  SA: { flag: '🇸🇦', label: 'SA' },
  SG: { flag: '🇸🇬', label: 'SG' },
  QA: { flag: '🇶🇦', label: 'QA' },
  RU: { flag: '🇷🇺', label: 'RU' },
  INT: { flag: '🌐', label: 'Intl' },
};

// Source type badge styling - cleaner, more compact
const sourceTypeBadge: Record<SourceType, { label: string; className: string }> = {
  wire: {
    label: 'Wire',
    className: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  public: {
    label: 'Public',
    className: 'bg-green-50 text-green-700 border-green-200'
  },
  'public-trust': {
    label: 'Public Trust',
    className: 'bg-green-50 text-green-700 border-green-200'
  },
  state: {
    label: 'State',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  'state-funded': {
    label: 'State-Funded',
    className: 'bg-red-50 text-red-700 border-red-200'
  },
  nonprofit: {
    label: 'Nonprofit',
    className: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  corporate: {
    label: 'Corporate',
    className: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  analysis: {
    label: 'Analysis',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  national: {
    label: 'National',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  international: {
    label: 'International',
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  magazine: {
    label: 'Magazine',
    className: 'bg-pink-50 text-pink-700 border-pink-200'
  },
  local: {
    label: 'Local',
    className: 'bg-stone-100 text-stone-700 border-stone-200'
  },
  specialized: {
    label: 'Specialized',
    className: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  reference: {
    label: 'Reference',
    className: 'bg-gray-50 text-gray-600 border-gray-200'
  },
  syndication: {
    label: 'Syndicated',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  archive: {
    label: 'Archive',
    className: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  platform: {
    label: 'Platform',
    className: 'bg-rose-50 text-rose-700 border-rose-200'
  },
};

// Format relative time for freshness display
function formatFreshness(dateString?: string): string | null {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      // Format as "Dec 5" or "Dec 5, 2024" if different year
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      if (date.getFullYear() !== now.getFullYear()) {
        options.year = 'numeric';
      }
      return date.toLocaleDateString('en-US', options);
    }
  } catch {
    return null;
  }
}

function getFaviconUrl(sourceDomain: string): string {
  if (!sourceDomain) return '/favicon.ico';
  const cleanDomain = sourceDomain.replace(/^www\./, '');
  return `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;
}

function getHeadline(result: SourceResult): string {
  if (result.title && !result.title.match(/^[a-z0-9.-]+\.[a-z]{2,}$/i)) {
    return result.title;
  }
  return `Read article on ${result.sourceDomain || 'source'}`;
}

export default function ResultsDisplay({ results, selectedIds = [], onToggleSelect }: ResultsDisplayProps) {
  const [linksCopied, setLinksCopied] = useState(false);

  if (!results || results.length === 0) {
    return null;
  }

  async function handleCopyAllLinks() {
    if (!results) return;
    const links = results.map(r => r.uri).join('\n');
    try {
      await navigator.clipboard.writeText(links);
      setLinksCopied(true);
      setTimeout(() => setLinksCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy links:', err);
    }
  }

  return (
    <div className="space-y-4">
      {/* Two-column grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item, index) => {
          const sourceDomain = item.sourceDomain || '';
          const displayName = item.displayName || sourceDomain.replace(/^www\./, '').toUpperCase();
          const favicon = getFaviconUrl(sourceDomain);
          const headline = getHeadline(item);
          const sourceType = item.sourceType || 'corporate';
          const countryCode = item.countryCode || 'US';
          const freshness = formatFreshness(item.publishedAt);
          
          // Get badge info with fallback
          const badge = sourceTypeBadge[sourceType] || sourceTypeBadge['corporate'];
          const country = countryFlags[countryCode] || countryFlags['US'];

          return (
            <article
              key={index}
              className="group relative bg-white rounded-xl border border-slate-200 shadow-sm p-4 transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300"
            >
              <a
                href={item.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-2.5"
              >
                {/* Top row: Logo + Name + Country */}
                <div className="flex items-center gap-2">
                  <img 
                    src={favicon} 
                    alt="" 
                    className="w-5 h-5 object-contain flex-shrink-0 rounded-md"
                    onError={(e) => { 
                      (e.target as HTMLImageElement).style.display = 'none'; 
                    }} 
                  />
                  <span className="text-sm font-bold uppercase tracking-wide text-blue-600">
                    {displayName}
                  </span>
                  <span className="text-sm" title={country.label}>
                    {country.flag}
                  </span>
                </div>
                
                {/* Badge row: Political Lean (primary) + Type (secondary) + Freshness */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Political Lean Badge - PRIMARY */}
                  {(() => {
                    const lean = (item.politicalLean?.toLowerCase() || getPoliticalLean(sourceDomain)) as PoliticalLean;
                    const colors = LEAN_COLORS[lean] || LEAN_COLORS['center'];
                    const label = LEAN_LABELS[lean] || 'Center';
                    return (
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${colors.bg} ${colors.text}`}>
                        {label}
                      </span>
                    );
                  })()}

                  {/* Source Type Badge - SECONDARY (gray) */}
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {badge.label}
                  </span>

                  {freshness && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={11} />
                      {freshness}
                    </span>
                  )}

                  {item.isSyndicated && (
                    <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-emerald-50 text-emerald-600 border-emerald-200">
                      Free
                    </span>
                  )}
                </div>

                {/* Headline */}
                <h3 className="text-sm font-medium text-slate-800 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                  {headline}
                </h3>
                
                {/* External link icon - shown when not in compare mode */}
                {!onToggleSelect && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                    <ExternalLink size={16} />
                  </div>
                )}
              </a>

              {/* Selection checkbox for compare mode */}
              {onToggleSelect && (
                <div
                  className="absolute top-3 right-3 z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleSelect(item.uri);
                  }}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                    selectedIds.includes(item.uri)
                      ? 'bg-[#2563eb] border-[#2563eb]'
                      : 'bg-white border-slate-300 hover:border-[#2563eb]'
                  }`}>
                    {selectedIds.includes(item.uri) && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Copy all links button */}
      {results.length > 1 && (
        <button
          onClick={handleCopyAllLinks}
          className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 py-2 mt-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {linksCopied ? (
            <>
              <Check size={16} className="text-green-600" />
              <span className="text-green-600">All links copied!</span>
            </>
          ) : (
            <>
              <Link2 size={16} />
              <span>Copy all links</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}