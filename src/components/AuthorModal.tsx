'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { AuthorAnalysis, AuthorVerdict } from '@/types';

interface AuthorModalProps {
  authorName: string;
  outlet: string;
  onClose: () => void;
}

const VERDICT_CONFIG: Record<AuthorVerdict, { icon: string; label: string; color: string; description: string }> = {
  deep_reporter: {
    icon: '🎯',
    label: 'Deep Dive Reporter',
    color: 'text-green-700 bg-green-100',
    description: 'Low output suggests thorough, original reporting',
  },
  moderate: {
    icon: '📝',
    label: 'Regular Reporter',
    color: 'text-blue-700 bg-blue-100',
    description: 'Normal output for a working journalist',
  },
  high_volume: {
    icon: '🐹',
    label: 'High Volume',
    color: 'text-orange-700 bg-orange-100',
    description: 'High output may indicate rewrites or aggregation',
  },
  unknown: {
    icon: '❓',
    label: 'Unknown',
    color: 'text-slate-700 bg-slate-100',
    description: 'Could not determine output pattern',
  },
};

export function AuthorModal({ authorName, outlet, onClose }: AuthorModalProps) {
  const [analysis, setAnalysis] = useState<AuthorAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch(
          `/api/author?name=${encodeURIComponent(authorName)}&outlet=${encodeURIComponent(outlet)}`
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (data.error && !data.articleCount) {
          setError(data.error);
        } else {
          setAnalysis(data);
        }
      } catch (err) {
        setError('Could not analyze author');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [authorName, outlet]);

  const verdictConfig = analysis ? VERDICT_CONFIG[analysis.verdict] : VERDICT_CONFIG.unknown;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span>👤</span> {authorName}
            </h2>
            <p className="text-sm text-slate-500">{outlet}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 -m-1 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-600">Analyzing author output...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-slate-500">{error}</p>
            <p className="text-xs text-slate-400 mt-2">Author analysis requires search API</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            {/* Output Stats */}
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-4xl font-bold text-slate-900">
                {analysis.articleCount}
              </div>
              <div className="text-sm text-slate-500">
                articles in the last {analysis.timeframeDays} days
              </div>
            </div>

            {/* Verdict Badge */}
            <div className={`rounded-xl p-4 ${verdictConfig.color}`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{verdictConfig.icon}</span>
                <span className="font-semibold">{verdictConfig.label}</span>
              </div>
              <p className="text-sm mt-1 opacity-80">
                {verdictConfig.description}
              </p>
            </div>

            {/* Context from Flat Earth News */}
            <p className="text-xs text-slate-500 italic leading-relaxed">
              💡 Per Nick Davies (Flat Earth News): Real reporting takes time.
              High-volume output often indicates wire rewrites rather than original journalism.
            </p>

            {/* Search Query (for transparency) */}
            <details className="text-xs text-slate-400">
              <summary className="cursor-pointer hover:text-slate-600 py-1">
                How we calculated this
              </summary>
              <code className="block mt-2 p-3 bg-slate-100 rounded-lg text-xs break-all text-slate-600">
                {analysis.searchQuery}
              </code>
            </details>
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthorModal;
