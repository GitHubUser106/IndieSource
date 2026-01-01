import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export interface ArticleContent {
  title: string;
  content: string;
  excerpt: string;
  byline: string | null;
  siteName: string | null;
  success: boolean;
  paywallDetected: boolean;
  error?: string;
}

// Known paywall domains - don't even attempt full scrape
const KNOWN_PAYWALL_DOMAINS = [
  'nytimes.com',
  'wsj.com',
  'washingtonpost.com',
  'ft.com',
  'economist.com',
  'theatlantic.com',
  'newyorker.com',
  'bloomberg.com',
  'thetimes.co.uk',
  'telegraph.co.uk',
];

// Paywall indicator phrases
const PAYWALL_PHRASES = [
  'subscribe to continue',
  'subscription required',
  'sign in to read',
  'become a member',
  'for subscribers only',
  'premium content',
  'paywall',
  'already a subscriber',
  'create an account to read',
];

function isKnownPaywallDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return KNOWN_PAYWALL_DOMAINS.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
}

function detectPaywallInContent(text: string): boolean {
  const lowerText = text.toLowerCase().slice(0, 2000);
  return PAYWALL_PHRASES.some(phrase => lowerText.includes(phrase));
}

export async function fetchArticleContent(url: string): Promise<ArticleContent> {
  // Quick check: skip known paywall domains
  if (isKnownPaywallDomain(url)) {
    return {
      title: '',
      content: '',
      excerpt: '',
      byline: null,
      siteName: null,
      success: false,
      paywallDetected: true,
      error: 'Known paywall domain - skipping fetch',
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MirrorSource/1.0; +https://mirrorsource.app)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    });

    // Paywall response codes
    if (response.status === 401 || response.status === 402 || response.status === 403) {
      return {
        title: '',
        content: '',
        excerpt: '',
        byline: null,
        siteName: null,
        success: false,
        paywallDetected: true,
        error: `HTTP ${response.status} - likely paywall`,
      };
    }

    if (!response.ok) {
      return {
        title: '',
        content: '',
        excerpt: '',
        byline: null,
        siteName: null,
        success: false,
        paywallDetected: false,
        error: `HTTP ${response.status}`,
      };
    }

    const html = await response.text();

    // Check for paywall phrases in raw HTML
    if (detectPaywallInContent(html)) {
      return {
        title: '',
        content: '',
        excerpt: '',
        byline: null,
        siteName: null,
        success: false,
        paywallDetected: true,
        error: 'Paywall detected in content',
      };
    }

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      return {
        title: '',
        content: '',
        excerpt: '',
        byline: null,
        siteName: null,
        success: false,
        paywallDetected: false,
        error: 'Could not parse article content',
      };
    }

    // Clean and truncate content
    const cleanContent = article.textContent
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);

    // Final paywall check on parsed content
    if (cleanContent.length < 500 && detectPaywallInContent(cleanContent)) {
      return {
        title: article.title || '',
        content: '',
        excerpt: '',
        byline: null,
        siteName: null,
        success: false,
        paywallDetected: true,
        error: 'Content too short - likely paywall truncated',
      };
    }

    return {
      title: article.title || '',
      content: cleanContent,
      excerpt: cleanContent.slice(0, 500),
      byline: article.byline || null,
      siteName: article.siteName || null,
      success: true,
      paywallDetected: false,
    };
  } catch (error) {
    return {
      title: '',
      content: '',
      excerpt: '',
      byline: null,
      siteName: null,
      success: false,
      paywallDetected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
