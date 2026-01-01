import { NextRequest, NextResponse } from 'next/server';

// Copy the extractKeywordsFromUrl function here (or import it)
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

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  const extracted = extractKeywordsFromUrl(url);
  const urlObj = new URL(url);
  const segments = urlObj.pathname.split('/').filter(s => s.length > 0);

  return NextResponse.json({
    input: url,
    domain: urlObj.hostname,
    pathSegments: segments,
    extractedKeywords: extracted,
    success: !!extracted && extracted.split(' ').length >= 2
  });
}
