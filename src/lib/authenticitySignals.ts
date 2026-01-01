// IndieSource: Authenticity Signals Module

export interface AuthenticitySignals {
  channelAgeInDays: number;
  subscriberCount: number;
  totalViews: number;
  videosPerMonth: number;
  countryOfOrigin: string;
}

export interface SuspicionResult {
  score: number;
  level: 'low' | 'medium' | 'high';
  flags: string[];
}

export interface SuspiciousPattern {
  name: string;
  origin: string;
  indicators: string[];
  likelyPurpose: string;
}

export const KNOWN_SUSPICIOUS_PATTERNS: SuspiciousPattern[] = [
  { name: 'Reich Analytics', origin: 'Turkey', indicators: ['AI deepfake using Robert Reich face', '100K+ views with 2.7K subscribers', 'Channel age < 7 days', 'Pro-Mark Carney content'], likelyPurpose: 'Political propaganda' },
  { name: 'The Rational Perspective', origin: 'Turkey', indicators: ['AI deepfake using Jeffrey Sachs face', 'Same origin as Reich Analytics', 'Pro-Mark Carney content'], likelyPurpose: 'Political propaganda' },
  { name: 'Asian Guy Finance Network', origin: 'Unknown', indicators: ['Synthetic Asian male avatar', '100+ videos/month', 'Silver/gold predictions', 'Multiple channels same avatar'], likelyPurpose: 'Precious metals pump / Ad farming' },
];

export function calculateSuspicionScore(signals: AuthenticitySignals): SuspicionResult {
  let score = 0;
  const flags: string[] = [];

  const viewsPerSub = signals.totalViews / Math.max(signals.subscriberCount, 1);
  const isNewChannel = signals.channelAgeInDays < 30;

  // Views/sub > 30 on new channel = +30 points
  if (isNewChannel && viewsPerSub > 30) {
    score += 30;
    flags.push(`Suspicious growth: ${Math.round(viewsPerSub)} views/sub on ${signals.channelAgeInDays}-day channel`);
  }

  // Videos/month > 60 = +25 points
  if (signals.videosPerMonth > 60) {
    score += 25;
    flags.push(`High volume: ${Math.round(signals.videosPerMonth)} videos/month`);
  }

  // Turkey/Pakistan/Bangladesh origin = +20 points
  if (['Turkey', 'Pakistan', 'Bangladesh'].includes(signals.countryOfOrigin)) {
    score += 20;
    flags.push(`Geographic mismatch: English content from ${signals.countryOfOrigin}`);
  }

  const level: 'low' | 'medium' | 'high' = score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';

  return { score: Math.min(score, 100), level, flags };
}

export function isKnownSuspiciousChannel(name: string): SuspiciousPattern | undefined {
  return KNOWN_SUSPICIOUS_PATTERNS.find(p => p.name.toLowerCase() === name.toLowerCase());
}

export function formatSuspicionBadge(level: 'low' | 'medium' | 'high'): { label: string; color: string } {
  if (level === 'high') return { label: 'High Risk', color: 'red' };
  if (level === 'medium') return { label: 'Medium Risk', color: 'orange' };
  return { label: 'Appears Authentic', color: 'green' };
}
