'use client';

import { useState } from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { LEAN_COLORS, LEAN_LABELS, getWikiLink } from '@/lib/sourceData';
import type { GroundingSource, PoliticalLean, OwnershipType, AuthorInfo } from '@/types';

// Strip HTML tags from Brave Search snippets
const cleanSnippet = (text: string) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
};

// Ownership type labels - clearer naming for users
const OWNERSHIP_LABELS: Record<string, string> = {
  'private': 'Private',
  'public_traded': 'Public Co.',
  'nonprofit': 'Nonprofit',
  'public_media': 'Public Broadcaster',
  'state_owned': 'State-Funded',
  'cooperative': 'Co-op',
  'trust': 'Trust',
  // Legacy types from sourceData.ts
  'corporate': 'Corporate',
  'public': 'Public Co.',
  'family': 'Family-Owned',
  'billionaire': 'Billionaire-Owned',
  'government': 'Public Broadcaster',
};

const OWNERSHIP_COLORS: Record<string, { bg: string; text: string }> = {
  'nonprofit': { bg: 'bg-green-100', text: 'text-green-700' },
  'public_media': { bg: 'bg-green-100', text: 'text-green-700' },
  'cooperative': { bg: 'bg-green-100', text: 'text-green-700' },
  'trust': { bg: 'bg-green-100', text: 'text-green-700' },
  'public_traded': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'public': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'private': { bg: 'bg-slate-100', text: 'text-slate-700' },
  'corporate': { bg: 'bg-slate-100', text: 'text-slate-700' },
  'family': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'billionaire': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'state_owned': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'government': { bg: 'bg-purple-100', text: 'text-purple-700' },
};

interface SourceFlipCardProps {
  source: GroundingSource;
  analysis?: {
    headline?: string;
    tone?: string;
    focus?: string;
    uniqueAngle?: string;
    notCovered?: string;
  };
  getPoliticalLean: (domain: string) => PoliticalLean;
  onAuthorClick?: (authorName: string, outlet: string) => void;
}

export function SourceFlipCard({ source, analysis, getPoliticalLean, onAuthorClick }: SourceFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const lean = (source.politicalLean?.toLowerCase() || getPoliticalLean(source.sourceDomain || '')) as PoliticalLean;
  const leanColors = LEAN_COLORS[lean] || LEAN_COLORS['center'];
  const leanLabel = LEAN_LABELS[lean] || 'Center';

  const ownershipType = source.ownership?.type || 'corporate';
  const ownershipLabel = OWNERSHIP_LABELS[ownershipType] || 'Corporate';
  const ownershipColors = OWNERSHIP_COLORS[ownershipType] || OWNERSHIP_COLORS['corporate'];

  const sourceName = source.displayName || source.sourceDomain?.split('.')[0].toUpperCase() || 'Source';

  return (
    <div
      className="relative h-[320px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 backface-hidden border border-slate-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Source Header */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={`https://www.google.com/s2/favicons?domain=${source.sourceDomain}&sz=32`}
              alt=""
              className="w-6 h-6 rounded-md flex-shrink-0"
            />
            <span className="font-semibold text-slate-900 truncate">{sourceName}</span>
            {source.countryCode && (
              <span className="text-xs flex-shrink-0">
                {source.countryCode === 'US' ? '🇺🇸' : source.countryCode === 'GB' ? '🇬🇧' : source.countryCode === 'CA' ? '🇨🇦' : '🌍'}
              </span>
            )}
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${leanColors.bg} ${leanColors.text}`}>
              {leanLabel}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${ownershipColors.bg} ${ownershipColors.text}`}>
              {ownershipLabel}
            </span>
          </div>

          {/* Author Byline */}
          {source.author && (
            <div className="text-xs text-slate-500 mb-3">
              {source.author.isStaff ? (
                <span className="flex items-center gap-1">
                  <span>✍️ {source.author.name}</span>
                  <span className="text-amber-500" title="Wire/Staff - No individual accountability">⚠️</span>
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAuthorClick?.(source.author!.name, sourceName);
                  }}
                  className="flex items-center gap-1 hover:text-blue-600 hover:underline cursor-pointer py-1 -my-1"
                >
                  <span>✍️ {source.author.name}</span>
                  <span className="text-blue-400">🔍</span>
                </button>
              )}
            </div>
          )}

          {/* Content Area - AI analysis OR fallback */}
          {analysis?.headline ? (
            <>
              {/* Headline from AI */}
              <p className="font-medium text-slate-900 leading-snug text-sm mb-3 line-clamp-2">
                "{analysis.headline}"
              </p>

              {/* Tone Badge */}
              {analysis?.tone && (
                <div className="mb-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Tone: </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    ['Critical', 'Alarming', 'Concerned', 'Skeptical', 'Warning'].some(t => analysis.tone?.includes(t))
                      ? 'bg-red-100 text-red-700'
                      : ['Supportive', 'Approving', 'Optimistic', 'Positive'].some(t => analysis.tone?.includes(t))
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {analysis.tone}
                  </span>
                </div>
              )}

              {/* Focus */}
              {analysis?.focus && (
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">{analysis.focus}</p>
              )}
            </>
          ) : (
            /* Fallback content when no AI analysis */
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-3">
              {cleanSnippet(source.snippet) || `Click to read full coverage from ${sourceName}.`}
            </p>
          )}

          {/* Read Article Link - 44px min tap target for mobile */}
          <a
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline inline-flex items-center gap-1.5 py-2 px-3 -ml-3 min-h-[44px] rounded-lg hover:bg-blue-50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Read article <ExternalLink size={14} />
          </a>

          {/* Flip Indicator */}
          <div className="absolute bottom-3 right-3 text-slate-400 flex items-center gap-1 text-xs">
            <Info size={12} />
            <span className="md:hidden">Tap for info</span>
            <span className="hidden md:inline">Click for info</span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 backface-hidden border border-slate-200 rounded-xl p-5 bg-slate-50 rotate-y-180 flex flex-col h-full"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📋</span>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Source Transparency</h3>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-grow overflow-y-auto pr-1">
            {/* Owner */}
            <div className="mb-3">
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium block mb-1">Owner</span>
              <p className="text-sm text-slate-800 font-medium">
                {source.ownership?.owner || 'Unknown'}
                {source.ownership?.parent && source.ownership.parent !== source.ownership.owner && (
                  <span className="text-slate-500 font-normal"> ({source.ownership.parent})</span>
                )}
              </p>
              {source.ownership?.note && (
                <p className="text-xs text-slate-500 mt-1">{source.ownership.note}</p>
              )}
            </div>

            {/* Funding */}
            <div className="mb-3">
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium block mb-1">Funding</span>
              <p className="text-sm text-slate-700">{source.funding?.model || 'Not disclosed'}</p>
              {source.funding?.note && (
                <p className="text-xs text-slate-500 mt-1">{source.funding.note}</p>
              )}
            </div>
          </div>

          {/* Fixed Footer - 44px min tap target for mobile */}
          <div className="pt-2 mt-auto border-t border-slate-200">
            <a
              href={getWikiLink(sourceName)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium py-2 px-3 -ml-3 min-h-[44px] rounded-lg hover:bg-blue-50 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              🔗 Verify on Wikipedia
              <ExternalLink size={14} />
            </a>
            <div className="text-slate-400 flex items-center gap-1 text-xs mt-1">
              <span className="md:hidden">Tap to flip back</span>
              <span className="hidden md:inline">Click to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for 3D flip */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

export default SourceFlipCard;
