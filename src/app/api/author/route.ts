import { NextRequest, NextResponse } from 'next/server';

// Domain mapping for common outlets
const DOMAIN_MAP: Record<string, string> = {
  'New York Times': 'nytimes.com',
  'NYT': 'nytimes.com',
  'Washington Post': 'washingtonpost.com',
  'CNN': 'cnn.com',
  'Fox News': 'foxnews.com',
  'BBC': 'bbc.com',
  'BBC News': 'bbc.com',
  'Reuters': 'reuters.com',
  'AP': 'apnews.com',
  'Associated Press': 'apnews.com',
  'The Guardian': 'theguardian.com',
  'NBC News': 'nbcnews.com',
  'CBS News': 'cbsnews.com',
  'ABC News': 'abcnews.go.com',
  'NPR': 'npr.org',
  'Wall Street Journal': 'wsj.com',
  'WSJ': 'wsj.com',
  'Politico': 'politico.com',
  'The Hill': 'thehill.com',
  'Bloomberg': 'bloomberg.com',
  'MSNBC': 'msnbc.com',
  'HuffPost': 'huffpost.com',
  'Vox': 'vox.com',
  'Daily Wire': 'dailywire.com',
  'Breitbart': 'breitbart.com',
  'The Atlantic': 'theatlantic.com',
  'Axios': 'axios.com',
};

type AuthorVerdict = 'deep_reporter' | 'moderate' | 'high_volume' | 'unknown';

interface AuthorAnalysis {
  name: string;
  outlet: string;
  articleCount: number;
  timeframeDays: number;
  verdict: AuthorVerdict;
  searchQuery: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authorName = searchParams.get('name');
  const outlet = searchParams.get('outlet');

  if (!authorName || !outlet) {
    return NextResponse.json({ error: 'Missing name or outlet' }, { status: 400 });
  }

  // Get domain from outlet name
  const domain = DOMAIN_MAP[outlet] || outlet.toLowerCase().replace(/\s+/g, '') + '.com';

  // Build search query for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

  const searchQuery = `site:${domain} "${authorName}" after:${dateStr}`;

  try {
    const braveApiKey = process.env.BRAVE_API_KEY;

    if (!braveApiKey) {
      console.log('[Author] No Brave API key configured');
      return NextResponse.json({
        name: authorName,
        outlet,
        articleCount: 0,
        timeframeDays: 30,
        verdict: 'unknown' as AuthorVerdict,
        searchQuery,
        error: 'Search API not configured',
      });
    }

    // Call Brave Search API
    const braveResponse = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}&count=20`,
      {
        headers: {
          'X-Subscription-Token': braveApiKey,
          'Accept': 'application/json',
        },
      }
    );

    if (!braveResponse.ok) {
      console.error('[Author] Brave API error:', braveResponse.status);
      return NextResponse.json({
        name: authorName,
        outlet,
        articleCount: 0,
        timeframeDays: 30,
        verdict: 'unknown' as AuthorVerdict,
        searchQuery,
        error: 'Search failed',
      });
    }

    const data = await braveResponse.json();
    const articleCount = data.web?.results?.length || 0;

    console.log(`[Author] ${authorName} at ${outlet}: ${articleCount} articles in 30 days`);

    // Determine verdict based on output volume
    // Based on Nick Davies' "Flat Earth News" insights on journalist workload
    let verdict: AuthorVerdict;
    if (articleCount === 0) {
      verdict = 'unknown';
    } else if (articleCount <= 4) {
      verdict = 'deep_reporter';  // ~1/week = thorough research time
    } else if (articleCount <= 12) {
      verdict = 'moderate';       // ~2-3/week = normal workload
    } else {
      verdict = 'high_volume';    // 12+ in 30 days = likely aggregation
    }

    const analysis: AuthorAnalysis = {
      name: authorName,
      outlet,
      articleCount,
      timeframeDays: 30,
      verdict,
      searchQuery,
    };

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('[Author] Analysis error:', error);
    return NextResponse.json({
      name: authorName,
      outlet,
      articleCount: 0,
      timeframeDays: 30,
      verdict: 'unknown' as AuthorVerdict,
      searchQuery,
      error: 'Failed to analyze author',
    }, { status: 500 });
  }
}
