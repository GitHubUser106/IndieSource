import { parse } from 'node-html-parser';

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

    // Parse HTML with node-html-parser
    const root = parse(html);

    // Extract title
    const title = root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                  root.querySelector('title')?.text ||
                  root.querySelector('h1')?.text ||
                  '';

    // Extract site name
    const siteName = root.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
                     null;

    // Extract byline/author
    const byline = root.querySelector('meta[name="author"]')?.getAttribute('content') ||
                   root.querySelector('[rel="author"]')?.text ||
                   root.querySelector('.author')?.text ||
                   root.querySelector('.byline')?.text ||
                   null;

    // Try common article selectors for content
    const articleSelectors = [
      'article',
      '[role="article"]',
      '.article-body',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.story-body',
      '.story-content',
      '.content-body',
      'main',
    ];

    let content = '';
    for (const selector of articleSelectors) {
      const el = root.querySelector(selector);
      if (el) {
        // Remove script, style, nav, aside elements
        el.querySelectorAll('script, style, nav, aside, .ad, .advertisement').forEach(n => n.remove());
        content = el.text.replace(/\s+/g, ' ').trim();
        if (content.length > 500) break;
      }
    }

    // Fallback: get all <p> tags
    if (content.length < 500) {
      const paragraphs = root.querySelectorAll('p');
      content = paragraphs.map(p => p.text).join(' ').replace(/\s+/g, ' ').trim();
    }

    if (!content || content.length < 200) {
      return {
        title: title.trim(),
        content: '',
        excerpt: '',
        byline: byline?.trim() || null,
        siteName: siteName?.trim() || null,
        success: false,
        paywallDetected: false,
        error: 'Could not extract sufficient article content',
      };
    }

    // Clean and truncate content
    const cleanContent = content.slice(0, 8000);

    // Final paywall check on parsed content
    if (cleanContent.length < 500 && detectPaywallInContent(cleanContent)) {
      return {
        title: title.trim(),
        content: '',
        excerpt: '',
        byline: byline?.trim() || null,
        siteName: siteName?.trim() || null,
        success: false,
        paywallDetected: true,
        error: 'Content too short - likely paywall truncated',
      };
    }

    return {
      title: title.trim(),
      content: cleanContent,
      excerpt: cleanContent.slice(0, 500),
      byline: byline?.trim() || null,
      siteName: siteName?.trim() || null,
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
