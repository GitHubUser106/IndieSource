"use client";

// Story Provenance tracking - identifies where news stories originate

interface ProvenanceInfo {
  origin: 'wire_service' | 'single_outlet' | 'press_release' | 'unknown';
  originSource: string | null;
  originConfidence: 'high' | 'medium' | 'low';
  originalReporting: string[];
  aggregators: string[];
  explanation: string;
}

interface ProvenanceCardProps {
  provenance: ProvenanceInfo;
}

// Origin type metadata
const ORIGIN_META = {
  wire_service: { icon: '📡', label: 'Wire Service Story', color: 'bg-blue-100 text-blue-800' },
  single_outlet: { icon: '🎯', label: 'Original Scoop', color: 'bg-purple-100 text-purple-800' },
  press_release: { icon: '📋', label: 'Press Release', color: 'bg-gray-100 text-gray-700' },
  unknown: { icon: '❓', label: 'Origin Unknown', color: 'bg-slate-100 text-slate-600' },
};

// Confidence badge styles
const CONFIDENCE_STYLES = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-100 text-gray-600',
};

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${CONFIDENCE_STYLES[level]}`}>
      {level} confidence
    </span>
  );
}

export function ProvenanceCard({ provenance }: ProvenanceCardProps) {
  const meta = ORIGIN_META[provenance.origin];

  return (
    <div className="border-b border-slate-200 pb-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{meta.icon}</span>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Story Origin</h3>
      </div>

      {/* Origin Badge Row */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${meta.color}`}>
          {meta.label}
        </span>
        {provenance.originSource && (
          <span className="px-2 py-0.5 rounded text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {provenance.originSource}
          </span>
        )}
        <ConfidenceBadge level={provenance.originConfidence} />
      </div>

      {/* Original Reporters */}
      {provenance.originalReporting.length > 0 && (
        <div className="flex items-start gap-2 mb-2 text-sm">
          <span className="text-slate-500">🔍</span>
          <div>
            <span className="text-slate-600">Original reporting: </span>
            <span className="font-medium text-slate-800">
              {provenance.originalReporting.join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Aggregators */}
      {provenance.aggregators.length > 0 && (
        <div className="flex items-start gap-2 mb-2 text-sm">
          <span className="text-slate-400">📋</span>
          <div>
            <span className="text-slate-500">Rewrites: </span>
            <span className="text-slate-500">
              {provenance.aggregators.join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Explanation */}
      <p className="text-xs text-slate-500 mt-3 italic leading-relaxed">
        {provenance.explanation}
      </p>
    </div>
  );
}

// Inline variant for more compact display (Option B from plan)
export function ProvenanceInline({ provenance }: ProvenanceCardProps) {
  const meta = ORIGIN_META[provenance.origin];

  return (
    <div className="flex items-center gap-2 text-sm flex-wrap">
      <span>{meta.icon}</span>
      <span className="text-slate-600">Origin:</span>
      <span className="font-medium text-slate-800">
        {provenance.originSource || meta.label}
      </span>
      {provenance.origin === 'wire_service' && provenance.aggregators.length > 0 && (
        <span className="text-slate-500">
          ({provenance.aggregators.length} outlets rewriting)
        </span>
      )}
      {provenance.origin === 'single_outlet' && provenance.originalReporting.length > 0 && (
        <span className="text-slate-500">
          (exclusive by {provenance.originalReporting[0]})
        </span>
      )}
    </div>
  );
}

export default ProvenanceCard;
