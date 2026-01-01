"use client";

// Narrative Decoder (Lite) - Analyzes story framing and emotional intensity

type NarrativeType = 'policy' | 'horse_race' | 'culture_war' | 'scandal' | 'human_interest';

interface NarrativeAnalysis {
  emotionalIntensity: number; // 1-10
  narrativeType: NarrativeType;
  isClickbait: boolean;
}

interface NarrativeCardProps {
  narrative: NarrativeAnalysis;
}

// Narrative type metadata
const NARRATIVE_META: Record<NarrativeType, { icon: string; label: string; description: string; color: string }> = {
  policy: {
    icon: '📊',
    label: 'Policy Focus',
    description: 'Facts, data, and policy implications',
    color: 'bg-blue-100 text-blue-800'
  },
  horse_race: {
    icon: '🏇',
    label: 'Horse Race',
    description: 'Who\'s winning, polling, political strategy',
    color: 'bg-purple-100 text-purple-800'
  },
  culture_war: {
    icon: '⚔️',
    label: 'Culture War',
    description: 'Identity, values, social division framing',
    color: 'bg-orange-100 text-orange-800'
  },
  scandal: {
    icon: '🔥',
    label: 'Scandal',
    description: 'Controversy, wrongdoing, accusations',
    color: 'bg-red-100 text-red-800'
  },
  human_interest: {
    icon: '❤️',
    label: 'Human Interest',
    description: 'Personal stories, emotional narratives',
    color: 'bg-pink-100 text-pink-800'
  },
};

// Intensity level descriptions
function getIntensityLevel(intensity: number): { label: string; color: string } {
  if (intensity <= 3) return { label: 'Measured', color: 'bg-green-500' };
  if (intensity <= 5) return { label: 'Moderate', color: 'bg-yellow-500' };
  if (intensity <= 7) return { label: 'Elevated', color: 'bg-orange-500' };
  return { label: 'High', color: 'bg-red-500' };
}

export function NarrativeCard({ narrative }: NarrativeCardProps) {
  const meta = NARRATIVE_META[narrative.narrativeType];
  const intensity = getIntensityLevel(narrative.emotionalIntensity);

  return (
    <div className="border-b border-slate-200 pb-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎭</span>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Narrative Style</h3>
      </div>

      {/* Narrative Type Badge */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${meta.color}`}>
          {meta.icon} {meta.label}
        </span>
        {narrative.isClickbait && (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
            ⚠️ Clickbait Detected
          </span>
        )}
      </div>

      {/* Emotional Intensity Meter */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-600">Emotional Intensity</span>
          <span className="text-xs font-medium text-slate-700">
            {intensity.label} ({narrative.emotionalIntensity}/10)
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${intensity.color} transition-all duration-300`}
            style={{ width: `${narrative.emotionalIntensity * 10}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 italic leading-relaxed">
        {meta.description}
      </p>
    </div>
  );
}

// Compact inline variant for Intel Brief
export function NarrativeInline({ narrative }: NarrativeCardProps) {
  const meta = NARRATIVE_META[narrative.narrativeType];
  const intensity = getIntensityLevel(narrative.emotionalIntensity);

  return (
    <div className="flex items-center gap-2 text-sm flex-wrap">
      <span>{meta.icon}</span>
      <span className="text-slate-600">Framing:</span>
      <span className="font-medium text-slate-800">{meta.label}</span>
      <span className="text-slate-500">
        ({intensity.label} tone)
      </span>
      {narrative.isClickbait && (
        <span className="text-amber-600 font-medium">⚠️ Clickbait</span>
      )}
    </div>
  );
}

export default NarrativeCard;
