// =============================================================================
// types.ts - MirrorSource 3.0
// =============================================================================

// Ownership structure types
export type OwnershipType = 
  | 'private' 
  | 'public_traded' 
  | 'nonprofit' 
  | 'public_media' 
  | 'state_owned' 
  | 'cooperative' 
  | 'trust';

export interface OwnershipInfo {
  owner: string;
  parent?: string;
  type: OwnershipType;
  note?: string;
}

export interface FundingInfo {
  model: string;
  note?: string;
}

// Source type from the API
export type SourceType = 
  | 'wire' 
  | 'public' 
  | 'corporate' 
  | 'state' 
  | 'analysis' 
  | 'local' 
  | 'national' 
  | 'international' 
  | 'magazine' 
  | 'specialized' 
  | 'reference' 
  | 'syndication' 
  | 'platform';

// Political lean type
export type PoliticalLean = 'left' | 'center-left' | 'center' | 'center-right' | 'right';

// Narrative analysis type
export type NarrativeType = 'policy' | 'horse_race' | 'culture_war' | 'scandal' | 'human_interest';

// Narrative analysis - tone and coverage type
export interface NarrativeAnalysis {
  emotionalIntensity: number; // 1-10
  narrativeType: NarrativeType;
  isClickbait: boolean;
}

// Author Intelligence types
export interface AuthorInfo {
  name: string;
  isStaff: boolean;  // true if "Staff", "AP", "Reuters", etc.
}

export type AuthorVerdict = 'deep_reporter' | 'moderate' | 'high_volume' | 'unknown';

export interface AuthorAnalysis {
  name: string;
  outlet: string;
  articleCount: number;      // Articles in last 30 days
  timeframeDays: number;     // 30
  verdict: AuthorVerdict;
  searchQuery: string;       // The Brave query used
}

// Main source interface returned from the API
export interface GroundingSource {
  uri: string;
  title: string;
  snippet: string;
  displayName: string;
  sourceDomain: string;
  sourceType: SourceType;
  countryCode: string;
  isSyndicated: boolean;
  // NEW in 3.0 - Transparency data
  ownership?: OwnershipInfo;
  funding?: FundingInfo;
  // Political lean for comparison feature
  politicalLean?: PoliticalLean;
  // Author Intelligence
  author?: AuthorInfo;
}

// API Response structure
export interface FindResponse {
  summary: string | null;
  commonGround: string | null;
  keyDifferences: string | null;
  alternatives: GroundingSource[];
  isPaywalled: boolean;
  usage?: {
    used: number;
    remaining: number;
    limit: number;
    resetAt: string;
  };
  needsKeywords?: boolean;
  error?: string;
  errorType?: string;
  retryable?: boolean;
}