import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "" });

interface SourceInput {
  id: string;
  name: string;
  url: string;
  domain: string;
  title?: string;
  snippet?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { sources, storyContext } = await req.json();

    if (!sources || sources.length === 0) {
      return NextResponse.json({ error: "No sources provided" }, { status: 400 });
    }

    // Build source descriptions using title/snippet from search results
    const sourceList = sources.map((s: SourceInput, i: number) => {
      const parts = [`Source ${i + 1} (${s.name}):`];
      if (s.title) parts.push(`Title: "${s.title}"`);
      if (s.snippet) parts.push(`Preview: "${s.snippet}"`);
      parts.push(`URL: ${s.url}`);
      return parts.join('\n');
    }).join('\n\n');

    // Check if we have actual content to analyze
    const hasContent = sources.some((s: SourceInput) => s.title || s.snippet);

    const prompt = `Analyze these news sources covering the same story. For EACH source, provide analysis.

${storyContext ? `STORY CONTEXT:\n${storyContext}\n\n` : ''}SOURCES:
${sourceList}

Return a JSON object with this EXACT structure:
{
  "analyses": [
    {
      "sourceId": "source-0",
      "headline": "The article's main angle based on its title (max 10 words)",
      "tone": "1-2 word emotional tone (e.g., 'Urgent', 'Measured', 'Critical', 'Sympathetic')",
      "focus": "What this source emphasizes based on headline/preview (max 8 words)",
      "uniqueAngle": "What makes this coverage different (max 12 words)",
      "missingContext": "What this source doesn't cover based on comparison (max 10 words)",
      "isInferred": ${!hasContent}
    }
  ]
}

RULES:
- Return one analysis object per source, in order
- sourceId should match the source's id field (e.g., "source-0", "source-1")
- Base your analysis on the title and preview snippet provided
- Keep all text concise
- Be specific about each source's unique angle
- "isInferred" should be true if working from limited preview info, false if headline is clear`;

    const response: any = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let text = response?.response?.text?.() || response?.candidates?.[0]?.content?.parts?.[0]?.text;

    const jsonMatch = text?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ analyses: [] });

  } catch (error) {
    console.error("[Compare API] Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
