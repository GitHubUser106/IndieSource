import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit, incrementUsage, COOKIE_OPTIONS } from "@/lib/rate-limiter";
import {
  getPoliticalLean,
  getFullSourceInfo,
  BALANCED_DOMAINS,
  type SourceType,
  type OwnershipInfo,
  type FundingInfo,
  type PoliticalLean,
  type FullSourceInfo,
} from "@/lib/sourceData";
import { fetchArticleContent, type ArticleContent } from "@/lib/articleFetcher";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// API Keys
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "" });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// =============================================================================
// SIMPLE IN-MEMORY CACHE (1 hour TTL, resets on cold start)
// =============================================================================
const searchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCachedResult(query: string): any | null {
  const cached = searchCache.get(query.toLowerCase());
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    searchCache.delete(query.toLowerCase());
    console.log('[Cache] Expired:', query);
    return null;
  }

  console.log('[Cache] HIT:', query);
  return cached.data;
}

function setCachedResult(query: string, data: any): void {
  // Limit cache size to prevent memory issues
  if (searchCache.size > 500) {
    const oldest = searchCache.keys().next().value;
    if (oldest) searchCache.delete(oldest);
  }

  searchCache.set(query.toLowerCase(), { data, timestamp: Date.now() });
  console.log('[Cache] SET:', query);
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// --- Error Types ---
type ErrorType = 'INVALID_URL' | 'INVALID_KEYWORDS' | 'NETWORK_ERROR' | 'TIMEOUT' | 'RATE_LIMITED' | 'API_ERROR' | 'NO_RESULTS';

interface AppError {
  type: ErrorType;
  userMessage: string;
  statusCode: number;
  retryable: boolean;
}

function createError(type: ErrorType, details?: string): AppError {
  const errors: Record<ErrorType, Omit<AppError, 'type'>> = {
    INVALID_URL: {
      userMessage: 'Please enter a valid news article URL (must start with http:// or https://)',
      statusCode: 400,
      retryable: false,
    },
    INVALID_KEYWORDS: {
      userMessage: 'Please enter some keywords to search for.',
      statusCode: 400,
      retryable: false,
    },
    NETWORK_ERROR: {
      userMessage: 'Unable to connect. Please check your internet connection and try again.',
      statusCode: 503,
      retryable: true,
    },
    TIMEOUT: {
      userMessage: 'The search took too long. Please try again.',
      statusCode: 504,
      retryable: true,
    },
    RATE_LIMITED: {
      userMessage: details || 'You\'ve reached your daily limit. Try again tomorrow!',
      statusCode: 429,
      retryable: false,
    },
    API_ERROR: {
      userMessage: 'Search failed. Please try again.',
      statusCode: 500,
      retryable: true,
    },
    NO_RESULTS: {
      userMessage: 'No coverage found on trusted news sources. Try different keywords.',
      statusCode: 200,
      retryable: true,
    },
  };
  
  return { type, ...errors[type] };
}

// --- Paywall Detection ---
const PAYWALLED_DOMAINS = new Set([
  'wsj.com', 'nytimes.com', 'washingtonpost.com', 'ft.com', 
  'economist.com', 'bloomberg.com', 'theatlantic.com', 'newyorker.com',
  'barrons.com', 'thetimes.co.uk',
]);

function isPaywalledSource(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace('www.', '');
    return Array.from(PAYWALLED_DOMAINS).some(domain => hostname.includes(domain));
  } catch { return false; }
}

// Gap Fill Domains now imported from @/lib/sourceData
// Source classification types and data now imported from @/lib/sourceData
// getFullSourceInfo function is imported from @/lib/sourceData

// Helper alias for backward compatibility with existing code
const getSourceInfo = getFullSourceInfo;
// --- Fetch Article Title from URL ---
async function fetchArticleTitle(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MirrorSource/1.0)' },
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const html = await response.text();
    // Extract <title> tag content
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      // Clean up: remove site name suffixes like " - CNN" or " | BBC"
      let title = titleMatch[1].trim();
      title = title.replace(/\s*[\|\-–—]\s*[^|\-–—]+$/, '').trim();
      return title.length > 10 ? title : null;
    }
    return null;
  } catch {
    return null;
  }
}

// --- URL to Keywords Extraction ---
function extractKeywordsFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const segments = path.split('/').filter(s => s.length > 0);

    const noiseWords = new Set([
      'article', 'articles', 'news', 'story', 'stories', 'post', 'posts',
      'content', 'index', 'page', 'html', 'htm', 'php', 'aspx', 'amp',
      'live', 'video', 'watch', 'read', 'the', 'and', 'for', 'with',
      'from', 'that', 'this', 'have', 'has', 'are', 'was', 'were',
      'been', 'will', 'would', 'could', 'should', 'into', 'over',
      'after', 'before', 'id', 'newsfront'
    ]);

    // Find best slug
    let bestSlug = '';
    for (const segment of segments) {
      if (/^\d+$/.test(segment)) continue;
      if (/^\d{2,4}$/.test(segment)) continue;
      if (noiseWords.has(segment.toLowerCase())) continue;
      if (segment.toLowerCase() === 'us' || segment.toLowerCase() === 'uk') continue;

      if (segment.includes('-') && segment.length > bestSlug.length) {
        bestSlug = segment;
      }
    }

    if (!bestSlug) return null;

    const words = bestSlug
      .toLowerCase()
      .split(/[-_]/)
      .filter(w => w.length > 2)
      .filter(w => !noiseWords.has(w))
      .slice(0, 6);

    return words.length >= 2 ? words.join(' ') : null;
  } catch {
    return null;
  }
}

// --- Helpers ---
function extractJson(text: string): any {
  let cleaned = text.trim().replace(/^```[a-z]*\s*/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try { return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1)); } catch {}
  }
  return null;
}

// --- URL Validation ---
function validateUrl(url: string): { valid: boolean; error?: AppError } {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { valid: false, error: createError('INVALID_URL') };
  }
  try {
    const parsed = new URL(url.trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: createError('INVALID_URL') };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: createError('INVALID_URL') };
  }
}

// =============================================================================
// STEP 1: THE EYES - Google Custom Search
// =============================================================================
interface CSEResult {
  url: string;
  title: string;
  snippet: string;
  domain: string;
  source?: 'google' | 'brave';
}

// =============================================================================
// BRAVE SEARCH - Primary search engine
// =============================================================================
async function searchWithBrave(query: string): Promise<CSEResult[]> {
  if (!BRAVE_API_KEY) {
    console.log('[Brave] No API key configured, skipping');
    return [];
  }

  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=20&search_lang=en&country=us&freshness=pw`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log('[Brave] API error:', response.status);
      return [];
    }

    const data = await response.json();

    const results: CSEResult[] = (data.web?.results || []).map((item: any) => {
      let domain = '';
      try { domain = new URL(item.url).hostname.replace(/^www\./, ''); } catch {}

      return {
        url: item.url,
        title: item.title || '',
        snippet: item.description || '',
        domain,
        source: 'brave' as const,
      };
    });

    console.log('[Brave] Found', results.length, 'results');
    return results;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('[Brave] Search timeout');
    } else {
      console.error('[Brave] Search error:', error);
    }
    return [];
  }
}

// Filter out low-quality results using 50% keyword match ratio
function filterQualityResults(results: CSEResult[], searchQuery: string): CSEResult[] {
  if (!results || !Array.isArray(results)) return [];
  if (!searchQuery || typeof searchQuery !== 'string') return results;

  const stopWords = ['this', 'that', 'with', 'from', 'have', 'been', 'were', 'they', 'their', 'about', 'which', 'would', 'could', 'should', 'there', 'where', 'when', 'what', 'news', 'report', 'story'];

  const SPAM_KEYWORDS = [
    'crossword', 'puzzle', 'clue', 'wordle', 'answer key', 'cheat',
    'coupon', 'promo code', 'discount code',
    'essay', 'homework help',
    'lyrics', 'chords', 'tabs',
    'horoscope', 'zodiac',
    'recipe', 'calories'
  ];

  const SPAM_DOMAINS = [
    // Gaming guides & walkthroughs
    'tryhardguides.com', 'progameguides.com', 'gamerjournalist.com',
    'attackofthefanboy.com', 'gamerant.com', 'screenrant.com',
    // Gaming & entertainment (not news)
    'fandomwire.com', 'fandom.com', 'gosugamers.net', 'biztoc.com',
    'cbr.com', 'polygon.com', 'kotaku.com', 'ign.com', 'pcgamer.com',
    // Homework & reference
    'quizlet.com', 'brainly.com', 'chegg.com', 'coursehero.com',
    'genius.com', 'azlyrics.com',
    // Recipes & lifestyle
    'allrecipes.com', 'food.com', 'delish.com',
    // Shopping & social
    'pinterest.com', 'etsy.com', 'amazon.com',
    // Reference (not news)
    'wikipedia.org', 'en.wikipedia.org', 'britannica.com',
    'merriam-webster.com', 'investopedia.com'
  ];

  const queryWords = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2)
    .filter(w => !stopWords.includes(w));

  if (queryWords.length === 0) return results;

  const scored = results.map(result => {
    if (!result || !result.url) return { result, score: 0, passed: false };

    const urlLower = (result.url || '').toLowerCase();
    const titleLower = (result.title || '').toLowerCase();
    const snippetLower = (result.snippet || '').toLowerCase();

    // Block known spam domains
    if (SPAM_DOMAINS.some(d => urlLower.includes(d))) {
      console.log(`[Spam Filter] Blocked domain: ${result.url}`);
      return { result, score: 0, passed: false };
    }

    // Block spam content types by title/snippet keywords
    if (SPAM_KEYWORDS.some(k => titleLower.includes(k) || snippetLower.includes(k))) {
      console.log(`[Spam Filter] Blocked keyword in: ${result.title}`);
      return { result, score: 0, passed: false };
    }

    try {
      const path = new URL(result.url).pathname;
      if (path === '/' || path === '') return { result, score: 0, passed: false };
    } catch { return { result, score: 0, passed: false }; }

    const text = ((result.title || '') + ' ' + (result.snippet || '')).toLowerCase();

    let matches = 0;
    for (const word of queryWords) {
      if (text.includes(word)) matches++;
    }

    const matchRatio = matches / queryWords.length;

    let passed = false;
    if (queryWords.length <= 2) {
      passed = matches >= 1;
    } else if (queryWords.length <= 4) {
      passed = matchRatio >= 0.5;
    } else {
      passed = matchRatio >= 0.4;
    }

    const titleHasMatch = queryWords.some(w => titleLower.includes(w));
    if (queryWords.length > 1 && !titleHasMatch) {
      passed = false;
    }

    return { result, score: matches, passed };
  });

  const passing = scored
    .filter(s => s.passed)
    .sort((a, b) => b.score - a.score)
    .map(s => s.result);

  console.log(`[Quality Filter] Query: "${searchQuery}" | Words: ${queryWords.length} | In: ${results.length} -> Out: ${passing.length}`);

  return passing;
}

// Diversify results by source type using round-robin
function diversifyResults(results: CSEResult[], maxResults: number = 15): CSEResult[] {
  // Defensive null checks
  if (!results || !Array.isArray(results) || results.length === 0) return [];

  // Group by political lean instead of just type
  const byLean: Record<string, CSEResult[]> = {
    'right': [],
    'center-right': [],
    'center': [],
    'center-left': [],
    'left': [],
    'unknown': []
  };

  for (const result of results) {
    if (!result || !result.domain) continue;
    const lean = getPoliticalLean(result.domain);
    byLean[lean].push(result);
  }

  // Round-robin from each lean category across the political spectrum
  const diverse: CSEResult[] = [];
  const leans = ['left', 'center-left', 'center', 'center-right', 'right', 'unknown'];
  let added = true;
  let round = 0;

  while (added && diverse.length < maxResults) {
    added = false;
    for (const lean of leans) {
      if (byLean[lean][round]) {
        // Avoid duplicates by domain
        if (!diverse.find(d => d.domain === byLean[lean][round].domain)) {
          diverse.push(byLean[lean][round]);
          added = true;
        }
        if (diverse.length >= maxResults) break;
      }
    }
    round++;
  }

  // Log lean breakdown for debugging
  console.log('[CSE] Lean breakdown:', {
    right: diverse.filter(r => getPoliticalLean(r.domain) === 'right').length,
    centerRight: diverse.filter(r => getPoliticalLean(r.domain) === 'center-right').length,
    center: diverse.filter(r => getPoliticalLean(r.domain) === 'center').length,
    centerLeft: diverse.filter(r => getPoliticalLean(r.domain) === 'center-left').length,
    left: diverse.filter(r => getPoliticalLean(r.domain) === 'left').length,
  });

  return diverse;
}

// =============================================================================
// STEP 2: THE BRAIN - Gemini Synthesis
// =============================================================================
interface CommonGroundFact {
  label: string;
  value: string;
}

interface KeyDifference {
  label: string;
  value: string;
}

// NEW: Story Provenance tracking - identifies where news stories originate
interface ProvenanceInfo {
  origin: 'wire_service' | 'single_outlet' | 'press_release' | 'unknown';
  originSource: string | null;
  originConfidence: 'high' | 'medium' | 'low';
  originalReporting: string[];
  aggregators: string[];
  explanation: string;
}

// NEW: Narrative Analysis - tone and coverage type
type NarrativeType = 'policy' | 'horse_race' | 'culture_war' | 'scandal' | 'human_interest';

interface NarrativeAnalysis {
  emotionalIntensity: number; // 1-10
  narrativeType: NarrativeType;
  isClickbait: boolean;
}

// Author info for per-source bylines
interface AuthorInfo {
  name: string;
  isStaff: boolean;
}

interface IntelBrief {
  summary: string;
  commonGround: CommonGroundFact[] | string;  // Array preferred, string for backward compatibility
  keyDifferences: KeyDifference[] | string;   // Array for differences, string for consensus message
  provenance?: ProvenanceInfo;  // Story origin tracking
  narrative?: NarrativeAnalysis;  // NEW: Narrative tone analysis
  authors?: Record<string, AuthorInfo>;  // NEW: Per-source author bylines
}

async function synthesizeWithGemini(
  searchResults: CSEResult[],
  originalQuery: string,
  timeoutMs: number = 18000,
  originalArticle: ArticleContent | null = null
): Promise<IntelBrief | null> {
  // Limit sources to prevent timeout - use first 10 for synthesis
  const sourcesForSynthesis = searchResults.slice(0, 10);
  console.log(`[Gemini] Using ${sourcesForSynthesis.length} of ${searchResults.length} sources for synthesis`);
  if (originalArticle?.success) {
    console.log(`[Gemini] Including original article content (${originalArticle.content.length} chars)`);
  }

  const context = sourcesForSynthesis.map((r, i) =>
    `[Source ${i + 1}: ${r.domain}]\nTitle: ${r.title}\nSnippet: ${r.snippet}`
  ).join('\n\n');

  // Build original article section if we have content
  const originalArticleSection = originalArticle?.success
    ? `
ORIGINAL ARTICLE (from ${originalArticle.siteName || 'source'}):
Title: ${originalArticle.title}
${originalArticle.byline ? `Byline: ${originalArticle.byline}` : ''}
Content excerpt (first 2000 chars):
${originalArticle.content.slice(0, 2000)}
---
`
    : '';

  const prompt = `You are a news intelligence analyst. Based on the sources provided below, write a brief analysis.
${originalArticle?.success ? '\nYou have access to the ORIGINAL ARTICLE the user submitted. Use it to provide more accurate analysis and identify how other sources cover the same story differently.' : ''}

CRITICAL: First, identify the PRIMARY EVENT the user is researching. Then ONLY analyze coverage of that specific event. Ignore tangential events.

STORY QUERY: "${originalQuery}"
${originalArticleSection}
OTHER SOURCES COVERING THIS STORY:
${context}

RESPOND IN JSON FORMAT:
{
  "summary": "3-4 sentences summarizing THE PRIMARY EVENT ONLY. Grade 6-8 reading level. Bold only the KEY TAKEAWAY of each sentence using **bold** syntax. Max 4 bold phrases. Do NOT include unrelated historical events.",
  "commonGround": [{"label": "Short category", "value": "What sources agree on ABOUT THE PRIMARY EVENT"}, ...],
  "keyDifferences": [{"label": "Topic", "value": "How sources differ ON THE PRIMARY EVENT"}, ...] OR "Sources present a consistent narrative on this story.",
  "provenance": {
    "origin": "wire_service" | "single_outlet" | "press_release" | "unknown",
    "originSource": "AP" | "Reuters" | "Wall Street Journal" | null,
    "originConfidence": "high" | "medium" | "low",
    "originalReporting": ["outlet1", "outlet2"],
    "aggregators": ["outlet3", "outlet4"],
    "explanation": "Brief explanation of how you determined origin"
  },
  "narrative": {
    "emotionalIntensity": <number 1-10>,
    "narrativeType": "policy" | "horse_race" | "culture_war" | "scandal" | "human_interest",
    "isClickbait": <boolean>
  }
}

RULES:
- ABSOLUTE PROHIBITION: Never write "(Source X)", "[Source X]", "Source 1", or any variation. No source numbers anywhere. Use Publisher Names ONLY (e.g., "Reuters", "CNN", "Fox News").
- ONLY use information from the sources above.
- TIME AWARENESS: If sources differ because some are older (e.g., "Manhunt underway" vs "Suspect caught"), trust the latest status. Do NOT list outdated early reports as a "Key Difference". Only list genuine conflicts where sources disagree on the *same* facts at the *same* time.
- CITATION STYLE: Refer to sources by their Publisher Name as written in the text (e.g., "**Reuters**", "**CNN**", "**Al Jazeera**").
- Bold publisher names in keyDifferences using **markdown**.
- commonGround: 2-4 fact objects.
- keyDifferences: Look for differences in FACTS, FRAMING, and TONE across sources. Do NOT just check factual agreement.
  * Factual difference: Source A says "9 killed", Source B says "15 killed" → KEY DIFFERENCE
  * Framing difference: Source A says "Politician defends policy", Source B says "Politician under fire for policy" → KEY DIFFERENCE
  * Tone difference: Source A uses "crisis" framing, Source B uses "routine" framing → KEY DIFFERENCE
  * Omission difference: Source A mentions the cost, Source B omits it entirely → KEY DIFFERENCE
  Return 1-3 difference objects highlighting the most significant divergences. Keep each "value" under 25 words.
  ONLY return a consensus string if tone, framing, AND facts are nearly identical across ALL sources. This should be rare.
- CONSENSUS RULE: Only return a consensus string when there are genuinely NO meaningful differences in framing or tone. If you identified ANY keyDifferences, do NOT also claim consensus. Default to finding differences - consensus should be rare.
- Use simple language
- Be concise - prioritize speed over length.

STORY PROVENANCE ANALYSIS:
Analyze the sources to determine where this story originated:
1. WIRE SERVICE: Is this wire service content? Look for verbatim text across multiple sources, "(AP)", "(Reuters)", "(AFP)" markers, or identical quotes/phrasing.
2. SINGLE OUTLET: Can you identify which outlet broke the story? Look for "first reported by", "exclusive", unique interviews, or original investigation.
3. PRESS RELEASE: Is this from a press release? Look for PR Newswire, Business Wire, official statements, or corporate newsroom language.
4. ORIGINAL vs AGGREGATOR: Which outlets have ORIGINAL reporting (unique quotes, interviews, on-the-ground coverage)? Which are AGGREGATING (rewriting wire copy, no original content)?

Set originConfidence based on evidence strength:
- "high": Clear wire markers, explicit attribution, or obvious original scoop
- "medium": Strong indicators but not definitive
- "low": Best guess based on limited evidence

NARRATIVE ANALYSIS:
Analyze the tone and type of coverage:

1. EMOTIONAL INTENSITY (1-10):
   - 1-3: Neutral, factual, measured ("reported," "announced," "said")
   - 4-6: Some perspective, moderate language ("claimed," "argued," "warned")
   - 7-10: Charged, inflammatory ("slammed," "destroyed," "catastrophic")

2. NARRATIVE TYPE (pick the dominant one):
   - "policy": Substantive focus on legislation, regulations, policy details
   - "horse_race": Focus on polls, strategy, who's winning/losing, optics
   - "culture_war": Focus on identity, values, tribal divisions
   - "scandal": Focus on wrongdoing, accusations, investigations
   - "human_interest": Focus on personal stories, emotional impact

3. CLICKBAIT CHECK:
   - true if: Question headlines, "BREAKING", superlatives, emotional hooks
   - false if: Straightforward factual headlines

AUTHOR/BYLINE EXTRACTION:
For each source, look for author bylines in the title or snippet:
- Common patterns: "By John Smith", "John Smith reports", author names at end of snippets
- If byline is "Staff", "Staff Report", "AP", "Reuters", "AFP", or similar wire/staff attribution, set isStaff: true
- If a real person's name is found, set isStaff: false
- If no byline is detectable, omit that source from the authors object

Add to your JSON response:
"authors": {
  "domain.com": {"name": "Author Name", "isStaff": false},
  "reuters.com": {"name": "Reuters Staff", "isStaff": true}
}

FINAL CHECK: Before responding, verify you have not included any "(Source" or "Source 1" text anywhere in your response.`.trim();

  // Create timeout promise
  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => {
      console.log(`[Gemini] Request timed out after ${timeoutMs}ms`);
      resolve(null);
    }, timeoutMs);
  });

  try {
    // Race between Gemini call and timeout
    const geminiPromise = genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const geminiResponse: any = await Promise.race([geminiPromise, timeoutPromise]);

    // Check if timeout won
    if (geminiResponse === null) {
      return null; // Timeout - caller handles fallback
    }

    let text: string | undefined;
    if (geminiResponse?.response && typeof geminiResponse.response.text === 'function') {
      text = geminiResponse.response.text();
    } else if (Array.isArray(geminiResponse?.candidates)) {
      text = geminiResponse.candidates[0]?.content?.parts?.[0]?.text;
    }

    if (!text) {
      return {
        summary: `We found **${searchResults.length} sources** covering this story. Click any source below to read their coverage.`,
        commonGround: [],
        keyDifferences: '',
      };
    }

    const parsed = extractJson(text);
    if (!parsed) {
      return {
        summary: `We found **${searchResults.length} sources** covering this story. Click any source below to read their coverage.`,
        commonGround: [],
        keyDifferences: '',
      };
    }

    // Handle commonGround as array or string for backward compatibility
    let commonGround: CommonGroundFact[] | string = [];
    if (Array.isArray(parsed.commonGround)) {
      commonGround = parsed.commonGround.filter((f: any) => f.label && f.value);
    } else if (typeof parsed.commonGround === 'string') {
      commonGround = parsed.commonGround.trim();
    }

    // Handle keyDifferences as array (conflicts) or string (consensus)
    let keyDifferences: KeyDifference[] | string = '';
    if (Array.isArray(parsed.keyDifferences)) {
      keyDifferences = parsed.keyDifferences.filter((f: any) => f.label && f.value);
    } else if (typeof parsed.keyDifferences === 'string') {
      keyDifferences = parsed.keyDifferences.trim();
    }

    // Parse provenance data (handle missing/malformed gracefully)
    let provenance: ProvenanceInfo | undefined;
    if (parsed.provenance && typeof parsed.provenance === 'object') {
      const p = parsed.provenance;
      // Validate origin type
      const validOrigins = ['wire_service', 'single_outlet', 'press_release', 'unknown'];
      const origin = validOrigins.includes(p.origin) ? p.origin : 'unknown';

      // Validate confidence level
      const validConfidence = ['high', 'medium', 'low'];
      const confidence = validConfidence.includes(p.originConfidence) ? p.originConfidence : 'low';

      provenance = {
        origin: origin as ProvenanceInfo['origin'],
        originSource: typeof p.originSource === 'string' ? p.originSource : null,
        originConfidence: confidence as ProvenanceInfo['originConfidence'],
        originalReporting: Array.isArray(p.originalReporting) ? p.originalReporting.filter((s: any) => typeof s === 'string') : [],
        aggregators: Array.isArray(p.aggregators) ? p.aggregators.filter((s: any) => typeof s === 'string') : [],
        explanation: typeof p.explanation === 'string' ? p.explanation.trim() : 'Unable to determine story origin.',
      };
      console.log('[Gemini] Provenance detected:', provenance.origin, '->', provenance.originSource || 'unknown source');
    }

    // Parse narrative analysis (handle missing/malformed gracefully)
    let narrative: NarrativeAnalysis | undefined;
    if (parsed.narrative && typeof parsed.narrative === 'object') {
      const n = parsed.narrative;
      // Validate narrative type
      const validTypes: NarrativeType[] = ['policy', 'horse_race', 'culture_war', 'scandal', 'human_interest'];
      const narrativeType = validTypes.includes(n.narrativeType) ? n.narrativeType : 'policy';

      // Clamp intensity to 1-10
      const intensity = typeof n.emotionalIntensity === 'number'
        ? Math.max(1, Math.min(10, Math.round(n.emotionalIntensity)))
        : 5;

      narrative = {
        emotionalIntensity: intensity,
        narrativeType: narrativeType as NarrativeType,
        isClickbait: n.isClickbait === true,
      };
      console.log('[Gemini] Narrative detected:', narrative.narrativeType, `intensity=${narrative.emotionalIntensity}`, narrative.isClickbait ? 'CLICKBAIT' : '');
    }

    // Parse author bylines (handle missing/malformed gracefully)
    let authors: Record<string, AuthorInfo> | undefined;
    if (parsed.authors && typeof parsed.authors === 'object') {
      authors = {};
      for (const [domain, authorData] of Object.entries(parsed.authors)) {
        if (authorData && typeof authorData === 'object') {
          const a = authorData as { name?: string; isStaff?: boolean };
          if (typeof a.name === 'string' && a.name.trim()) {
            authors[domain] = {
              name: a.name.trim(),
              isStaff: a.isStaff === true,
            };
          }
        }
      }
      console.log('[Gemini] Authors detected:', Object.keys(authors).length, 'sources with bylines');
    }

    return {
      summary: (parsed.summary || '').trim(),
      commonGround,
      keyDifferences,
      provenance,
      narrative,
      authors,
    };
  } catch (error: any) {
    console.error('[Gemini] Synthesis error:', error?.message);
    return null; // Return null so caller can handle fallback
  }
}

// =============================================================================
// STEP 3: PROCESS RESULTS - Apply badges, transparency, and sort
// =============================================================================
interface ProcessedSource {
  uri: string;
  title: string;
  snippet: string;
  displayName: string;
  sourceDomain: string;
  sourceType: SourceType;
  countryCode: string;
  isSyndicated: boolean;
  // NEW: Transparency data
  ownership?: OwnershipInfo;
  funding?: FundingInfo;
  // Political lean for comparison feature
  politicalLean?: PoliticalLean;
  // Author Intelligence
  author?: AuthorInfo;
}

// Detect opinion-laden or characterization language in search query
function detectQueryBias(query: string): string | null {
  if (!query) return null;

  const opinionPatterns = [
    // Negative characterizations
    /\b(maniac|lunatic|crazy|insane|unhinged|deranged|mad|nuts)\b/i,
    /\b(liar|fraud|criminal|corrupt|evil|dangerous|extremist)\b/i,
    /\b(failed|failing|disaster|catastrophe|worst|terrible)\b/i,
    // Positive characterizations
    /\b(genius|brilliant|amazing|best|greatest|hero)\b/i,
    // Clickbait framing words
    /\b(slams?|destroys?|obliterates?|owns?|wrecks?|eviscerates?)\b/i,
    /\b(exposed|busted|caught|admits?|confesses?)\b/i,
    /\b(humiliates?|embarrasses?|shocks?|stuns?)\b/i,
  ];

  for (const pattern of opinionPatterns) {
    if (pattern.test(query)) {
      console.log(`[QueryBias] Detected opinion language in query: "${query}"`);
      return 'This search includes opinion language which may limit perspective diversity.';
    }
  }
  return null;
}

// Analyze political diversity of results
// inputUrl: the user's input URL (if provided) - included in coverage calculation
function analyzePoliticalDiversity(
  results: ProcessedSource[],
  _gapFillInfo?: unknown, // Deprecated - kept for backward compatibility
  inputUrl?: string
): {
  isBalanced: boolean;
  leftCount: number;
  centerCount: number;
  rightCount: number;
  warning: string | null;
} {
  let leftCount = 0;    // left + center-left
  let centerCount = 0;  // center
  let rightCount = 0;   // right + center-right

  console.log(`[Diversity] Analyzing ${results.length} sources...`);

  // Include the INPUT source in the count (the URL the user pasted)
  let inputLean: PoliticalLean | undefined;
  if (inputUrl) {
    inputLean = getPoliticalLean(inputUrl);
    console.log(`[Diversity] Input source: ${inputUrl} -> lean: ${inputLean}`);
    if (inputLean === 'left' || inputLean === 'center-left') leftCount++;
    else if (inputLean === 'right' || inputLean === 'center-right') rightCount++;
    else centerCount++;
  }

  for (const result of results) {
    const domain = result.sourceDomain || '';
    const lean = getPoliticalLean(domain);

    console.log(`[Diversity] ${domain} -> lean: ${lean}`);

    if (lean === 'left' || lean === 'center-left') leftCount++;
    else if (lean === 'right' || lean === 'center-right') rightCount++;
    else centerCount++;
  }

  // Total includes input source if provided
  const total = results.length + (inputUrl ? 1 : 0);
  if (total === 0) return { isBalanced: true, leftCount: 0, centerCount: 0, rightCount: 0, warning: null };

  const leftPct = leftCount / total;
  const rightPct = rightCount / total;

  console.log(`[Diversity] Counts - Left: ${leftCount} (${(leftPct * 100).toFixed(0)}%), Center: ${centerCount}, Right: ${rightCount} (${(rightPct * 100).toFixed(0)}%)${inputUrl ? ' (includes input source)' : ''}`);

  // Check for imbalance (more than 60% from one side)
  let warning: string | null = null;
  let isBalanced = true;

  if (leftPct > 0.6 && rightCount < 2) {
    isBalanced = false;
    warning = `Sources lean left (${leftCount}/${total}). Right-leaning perspectives may be underrepresented.`;
    console.log(`[Diversity] WARNING: ${warning}`);
  } else if (rightPct > 0.6 && leftCount < 2) {
    isBalanced = false;
    warning = `Sources lean right (${rightCount}/${total}). Left-leaning perspectives may be underrepresented.`;
    console.log(`[Diversity] WARNING: ${warning}`);
  } else {
    console.log(`[Diversity] Sources are balanced - no warning`);
  }

  return { isBalanced, leftCount, centerCount, rightCount, warning };
}

function processSearchResults(cseResults: CSEResult[], authors?: Record<string, AuthorInfo>): ProcessedSource[] {
  const seen = new Set<string>();
  const processed: ProcessedSource[] = [];

  for (const result of cseResults) {
    if (!result.domain || seen.has(result.domain)) continue;
    seen.add(result.domain);

    const sourceInfo = getSourceInfo(result.domain);

    // Find author for this domain (check both with and without www.)
    const domainVariants = [result.domain, result.domain.replace('www.', ''), 'www.' + result.domain];
    let author: AuthorInfo | undefined;
    if (authors) {
      for (const variant of domainVariants) {
        if (authors[variant]) {
          author = authors[variant];
          break;
        }
      }
    }

    processed.push({
      uri: result.url,
      title: result.title,
      snippet: result.snippet || '',
      displayName: sourceInfo.displayName,
      sourceDomain: result.domain,
      sourceType: sourceInfo.type,
      countryCode: sourceInfo.countryCode,
      isSyndicated: false,
      // Include transparency data
      ownership: sourceInfo.ownership,
      funding: sourceInfo.funding,
      politicalLean: sourceInfo.lean,
      // Author Intelligence
      author,
    });
  }

  // Sort by source type priority
  const typePriority: Record<SourceType, number> = {
    'wire': 0,
    'specialized': 1,
    'national': 2,
    'international': 3,
    'public': 4,
    'public-trust': 4,
    'nonprofit': 5,
    'analysis': 6,
    'corporate': 7,
    'syndication': 8,
    'magazine': 9,
    'local': 10,
    'state': 11,
    'state-funded': 11,
    'reference': 12,
    'platform': 13,
  };

  processed.sort((a, b) => typePriority[a.sourceType] - typePriority[b.sourceType]);
  return processed;
}

// =============================================================================
// MAIN HANDLER
// =============================================================================
export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limit Check
    const limitCheck = await checkRateLimit(req);
    if (!limitCheck.success) {
      const error = createError('RATE_LIMITED', `Daily limit reached. You have 0/${limitCheck.info.limit} remaining.`);
      return NextResponse.json(
        { error: error.userMessage, errorType: error.type, retryable: error.retryable },
        { status: error.statusCode, headers: corsHeaders }
      );
    }

    // 2. Parse Request Body
    let body: any;
    try { body = await req.json(); } catch { 
      return NextResponse.json(
        { error: 'Invalid request body', errorType: 'INVALID_URL', retryable: false },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Determine search query
    const hasKeywords = body.keywords && typeof body.keywords === 'string' && body.keywords.trim();
    const hasUrl = body.url && typeof body.url === 'string' && body.url.trim();

    if (!hasKeywords && !hasUrl) {
      const error = createError('INVALID_URL');
      return NextResponse.json(
        { error: error.userMessage, errorType: error.type, retryable: error.retryable },
        { status: error.statusCode, headers: corsHeaders }
      );
    }

    let searchQuery: string;
    let isPaywalled = false;
    let originalArticleContent: ArticleContent | null = null;

    if (hasKeywords) {
      searchQuery = body.keywords.trim();
      if (searchQuery.length < 3) {
        return NextResponse.json(
          { error: 'Please enter at least a few keywords to search.', errorType: 'INVALID_KEYWORDS', retryable: false },
          { status: 400, headers: corsHeaders }
        );
      }
      // Use keywords directly - no quote wrapping
    } else {
      const validation = validateUrl(body.url);
      if (!validation.valid && validation.error) {
        return NextResponse.json(
          { error: validation.error.userMessage, errorType: validation.error.type, retryable: validation.error.retryable },
          { status: validation.error.statusCode, headers: corsHeaders }
        );
      }

      const url = body.url.trim();
      isPaywalled = isPaywalledSource(url);

      // ==========================================================================
      // OPPORTUNISTIC ARTICLE FETCH - Try full content for indie sites
      // ==========================================================================
      console.log(`[ArticleFetch] Attempting to fetch full article from: ${url}`);
      const articleResult = await fetchArticleContent(url);

      if (articleResult.success && articleResult.title) {
        console.log(`[ArticleFetch] SUCCESS - Got ${articleResult.content.length} chars from "${articleResult.siteName || 'unknown'}"`);
        console.log(`[ArticleFetch] Title: "${articleResult.title}"`);
        console.log(`[ArticleFetch] Byline: ${articleResult.byline || 'none'}`);

        // Store article content for Gemini (will be used later)
        originalArticleContent = articleResult;

        // Use article title for search query
        searchQuery = articleResult.title;
      } else {
        // Article fetch failed or no title - log reason
        if (articleResult.success && !articleResult.title) {
          console.log(`[ArticleFetch] SUCCESS but no title - falling back`);
          originalArticleContent = articleResult; // Still store content for Gemini
        } else {
          console.log(`[ArticleFetch] FALLBACK - ${articleResult.error}${articleResult.paywallDetected ? ' (paywall)' : ''}`);
        }

        // FALLBACK: Try to fetch just the title
        console.log(`[Query] Attempting to fetch article title from: ${url}`);
        const articleTitle = await fetchArticleTitle(url);

        if (articleTitle) {
          console.log(`[Query] Got article title: "${articleTitle}"`);
          searchQuery = articleTitle;
        } else {
          // FALLBACK 2: Extract from URL slug
          console.log(`[Query] Title fetch failed, falling back to URL extraction`);
          const extractedKeywords = extractKeywordsFromUrl(url);
          console.log('[DEBUG] URL extraction result:', extractedKeywords);
          console.log('[DEBUG] extractedKeywords type:', typeof extractedKeywords);
          console.log('[DEBUG] extractedKeywords length:', extractedKeywords?.length);

          if (!extractedKeywords) {
            console.log('[DEBUG] EARLY EXIT: extractedKeywords is null/empty');
            return NextResponse.json({
              summary: null,
              commonGround: null,
              keyDifferences: null,
              alternatives: [],
              isPaywalled,
              needsKeywords: true,
              error: 'This link doesn\'t contain readable keywords. Please enter 3-5 key words from the story.',
              errorType: 'NEEDS_KEYWORDS',
              retryable: false,
            }, { headers: corsHeaders });
          }

          searchQuery = extractedKeywords;
        }
      }
    }

    // Final safeguard: ensure searchQuery is valid
    console.log('[DEBUG] Final safeguard check - searchQuery:', searchQuery);
    console.log('[DEBUG] Final safeguard - type:', typeof searchQuery, 'length:', searchQuery?.trim()?.length);
    if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim().length < 2) {
      console.log('[DEBUG] EARLY EXIT: searchQuery invalid at final safeguard');
      return NextResponse.json({
        summary: null,
        commonGround: null,
        keyDifferences: null,
        alternatives: [],
        isPaywalled,
        needsKeywords: true,
        error: 'Could not generate a valid search query. Please enter keywords manually.',
        errorType: 'NEEDS_KEYWORDS',
        retryable: false,
      }, { headers: corsHeaders });
    }

    // 4. Check cache BEFORE incrementing usage (cache hits don't cost API calls)
    const cachedResult = getCachedResult(searchQuery);
    if (cachedResult) {
      console.log('[Cache] Returning cached result for:', searchQuery);
      return NextResponse.json({ ...cachedResult, cached: true }, { headers: corsHeaders });
    }

    // 5. Increment Usage (only for non-cached requests)
    const { info: usageInfo, cookieValue } = await incrementUsage(req);

    // ==========================================================================
    // BALANCED SEARCH: Single query targeting all 5 political leans
    // Replaces the old multi-call "Gap Fill" system to avoid 429 rate limits
    // ==========================================================================

    // Build balanced query with site: operators for all political leans
    const siteFilters = BALANCED_DOMAINS.map(d => `site:${d}`).join(' OR ');
    const balancedQuery = `${searchQuery} (${siteFilters})`;

    console.log(`[BalancedSearch] Primary query: "${balancedQuery.substring(0, 100)}..."`);
    console.log(`[BalancedSearch] Targeting ${BALANCED_DOMAINS.length} domains across political spectrum`);

    // Primary search: Balanced query targeting all political leans
    const primaryResults = await searchWithBrave(balancedQuery);
    console.log(`[BalancedSearch] Primary search returned ${primaryResults.length} results`);

    // Deduplicate by domain
    const seenDomains = new Set<string>();
    let qualityFiltered = primaryResults.filter(result => {
      if (!result.domain || seenDomains.has(result.domain)) return false;
      seenDomains.add(result.domain);
      return true;
    });
    console.log(`[BalancedSearch] After deduplication: ${qualityFiltered.length}`);

    // Apply quality filter
    qualityFiltered = filterQualityResults(qualityFiltered, searchQuery);
    console.log(`[BalancedSearch] After quality filter: ${qualityFiltered.length}`);

    // FALLBACK: If primary returns <10 results, run a broad search without site: filters
    if (qualityFiltered.length < 10) {
      console.log(`[BalancedSearch] Primary returned <10 results. Running fallback broad search...`);

      const broadResults = await searchWithBrave(searchQuery);
      console.log(`[BalancedSearch] Fallback returned ${broadResults.length} results`);

      // Merge results, deduplicating by URL
      const existingUrls = new Set(qualityFiltered.map(r => r.url));
      const newResults = broadResults.filter(r => !existingUrls.has(r.url));

      // Apply quality filter to new results
      const newFiltered = filterQualityResults(newResults, searchQuery);
      console.log(`[BalancedSearch] Fallback added ${newFiltered.length} new results after quality filter`);

      qualityFiltered = [...qualityFiltered, ...newFiltered];

      // Re-deduplicate by domain after merge
      const finalDomains = new Set<string>();
      qualityFiltered = qualityFiltered.filter(result => {
        if (!result.domain || finalDomains.has(result.domain)) return false;
        finalDomains.add(result.domain);
        return true;
      });
      console.log(`[BalancedSearch] After merge and dedup: ${qualityFiltered.length}`);
    }

    // 5-category political lean counter (for logging)
    type LeanCounts = {
      left: number;
      centerLeft: number;
      center: number;
      centerRight: number;
      right: number;
      sources: Record<string, string[]>;
    };

    const countPoliticalLean5 = (results: CSEResult[]): LeanCounts => {
      const counts: LeanCounts = {
        left: 0,
        centerLeft: 0,
        center: 0,
        centerRight: 0,
        right: 0,
        sources: { left: [], centerLeft: [], center: [], centerRight: [], right: [] }
      };

      for (const r of results) {
        const lean = getPoliticalLean(r.domain || '');
        const domain = r.domain || 'unknown';
        switch (lean) {
          case 'left':
            counts.left++;
            counts.sources.left.push(domain);
            break;
          case 'center-left':
            counts.centerLeft++;
            counts.sources.centerLeft.push(domain);
            break;
          case 'center-right':
            counts.centerRight++;
            counts.sources.centerRight.push(domain);
            break;
          case 'right':
            counts.right++;
            counts.sources.right.push(domain);
            break;
          default:
            counts.center++;
            counts.sources.center.push(domain);
        }
      }
      return counts;
    };

    const finalCounts = countPoliticalLean5(qualityFiltered);
    console.log(`[BalancedSearch] Final 5-category distribution:`);
    console.log(`  Left: ${finalCounts.left} [${finalCounts.sources.left.join(', ') || 'none'}]`);
    console.log(`  Center-Left: ${finalCounts.centerLeft} [${finalCounts.sources.centerLeft.join(', ') || 'none'}]`);
    console.log(`  Center: ${finalCounts.center} [${finalCounts.sources.center.join(', ') || 'none'}]`);
    console.log(`  Center-Right: ${finalCounts.centerRight} [${finalCounts.sources.centerRight.join(', ') || 'none'}]`);
    console.log(`  Right: ${finalCounts.right} [${finalCounts.sources.right.join(', ') || 'none'}]`);
    console.log(`[BalancedSearch] Total results: ${qualityFiltered.length}`);

    // Diversify by source type using round-robin
    const diverseResults = diversifyResults(qualityFiltered, 15);
    console.log(`[Search] After diversity: ${diverseResults.length} results`);

    if (diverseResults.length === 0) {
      const response = NextResponse.json({
        summary: 'No coverage found on trusted news sources for this story. Try different keywords.',
        commonGround: null,
        keyDifferences: null,
        alternatives: [],
        isPaywalled,
        usage: usageInfo,
      }, { headers: corsHeaders });
      response.cookies.set(COOKIE_OPTIONS.name, cookieValue, COOKIE_OPTIONS);
      return response;
    }

    // 6. STEP 2: THE BRAIN - Synthesize with Gemini
    console.log(`[Gemini] Synthesizing ${diverseResults.length} sources...`);
    const intelBrief = await synthesizeWithGemini(diverseResults, searchQuery, 18000, originalArticleContent);

    // 7. STEP 3: Process results with badges + transparency + author info
    const alternatives = processSearchResults(diverseResults, intelBrief?.authors);

    // 8. Analyze political diversity + query bias
    // Include input URL in diversity analysis so warnings account for the user's source
    const inputUrl = hasUrl ? body.url.trim() : undefined;
    const diversityAnalysis = analyzePoliticalDiversity(alternatives, undefined, inputUrl);
    const queryBiasWarning = detectQueryBias(searchQuery);
    console.log(`[Diversity] Left: ${diversityAnalysis.leftCount}, Center: ${diversityAnalysis.centerCount}, Right: ${diversityAnalysis.rightCount}, Balanced: ${diversityAnalysis.isBalanced}`);
    if (queryBiasWarning) console.log(`[QueryBias] Warning: ${queryBiasWarning}`);

    // 9. Handle Gemini timeout - return fallback response
    if (!intelBrief) {
      console.log('[Gemini] Timeout or error - returning fallback response');
      const response = NextResponse.json({
        summary: `Found **${alternatives.length} sources** covering this story. AI synthesis timed out - please review the sources below.`,
        commonGround: [{ label: 'Coverage', value: `${alternatives.length} sources found covering this topic.` }],
        keyDifferences: 'AI analysis unavailable due to timeout. Compare sources manually.',
        alternatives,
        isPaywalled,
        usage: usageInfo,
        diversityAnalysis: {
          isBalanced: diversityAnalysis.isBalanced,
          leftCount: diversityAnalysis.leftCount,
          centerCount: diversityAnalysis.centerCount,
          rightCount: diversityAnalysis.rightCount,
          warning: diversityAnalysis.warning,
        },
        queryBiasWarning,
        timedOut: true,
      }, { headers: corsHeaders });
      response.cookies.set(COOKIE_OPTIONS.name, cookieValue, COOKIE_OPTIONS);
      return response;
    }

    console.log(`[Gemini] Synthesis complete`);

    // 10. Override consensus language if diversity warning OR query bias is triggered
    let finalKeyDifferences: KeyDifference[] | string = intelBrief.keyDifferences;
    if ((diversityAnalysis.warning || queryBiasWarning) && typeof finalKeyDifferences === 'string') {
      const consensusPhrases = ['consistent narrative', 'sources agree', 'consensus'];
      const kdLower = (finalKeyDifferences as string).toLowerCase();
      const hasConsensusLanguage = consensusPhrases.some(phrase => kdLower.includes(phrase));
      if (hasConsensusLanguage) {
        if (queryBiasWarning) {
          finalKeyDifferences = 'Sources using this framing present a consistent narrative. Other perspectives may use different framing.';
          console.log(`[QueryBias] Overrode consensus language due to opinion-laden query`);
        } else {
          finalKeyDifferences = 'Sources in this sample agree. Note: This sample may not include all political perspectives.';
          console.log(`[Diversity] Overrode consensus language due to imbalanced sources`);
        }
      }
    }

    // 11. Build Response
    const responseData = {
      summary: intelBrief.summary,
      commonGround: intelBrief.commonGround || null,
      keyDifferences: finalKeyDifferences || null,
      provenance: intelBrief.provenance || null,  // NEW: Story origin tracking
      narrative: intelBrief.narrative || null,   // NEW: Narrative tone analysis
      alternatives,
      isPaywalled,
      usage: usageInfo,
      diversityAnalysis: {
        isBalanced: diversityAnalysis.isBalanced,
        leftCount: diversityAnalysis.leftCount,
        centerCount: diversityAnalysis.centerCount,
        rightCount: diversityAnalysis.rightCount,
        warning: diversityAnalysis.warning,
      },
      queryBiasWarning,
    };

    // 12. Cache the result for future identical queries
    setCachedResult(searchQuery, responseData);

    const response = NextResponse.json(responseData, { headers: corsHeaders });
    response.cookies.set(COOKIE_OPTIONS.name, cookieValue, COOKIE_OPTIONS);
    return response;

  } catch (error: any) {
    console.error('Error in /api/find:', error?.message || error);
    
    let appError: AppError;
    if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
      appError = createError('NETWORK_ERROR');
    } else if (error.message?.includes('timeout') || error.name === 'AbortError') {
      appError = createError('TIMEOUT');
    } else {
      appError = createError('API_ERROR');
    }
    
    return NextResponse.json(
      { error: appError.userMessage, errorType: appError.type, retryable: appError.retryable },
      { status: appError.statusCode, headers: corsHeaders }
    );
  }
}