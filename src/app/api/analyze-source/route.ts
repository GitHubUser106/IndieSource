import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { url, sourceName } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    const prompt = `Analyze this news article URL: ${url}

    Source: ${sourceName || 'Unknown'}

    Return a JSON object with:
    {
      "headline": "The article's main headline (or your best summary if not accessible)",
      "keyPoints": ["Point 1", "Point 2", "Point 3"],
      "tone": "1-3 words describing the tone (e.g., 'Urgent', 'Clinical', 'Sympathetic')",
      "focus": "What angle does this source emphasize? (1 sentence)",
      "missing": "What perspectives or facts are NOT covered? (1 sentence)"
    }

    If you cannot access the article, make reasonable inferences based on the URL and source reputation.
    Keep all responses concise. Max 15 words per field.`;

    const response: any = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let text = response?.response?.text?.() || response?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Parse JSON from response
    const jsonMatch = text?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({
      headline: "Analysis unavailable",
      keyPoints: [],
      tone: "Unknown",
      focus: "Unable to analyze",
      missing: "Unable to determine"
    });

  } catch (error) {
    console.error("Analyze source error:", error);
    return NextResponse.json({
      headline: "Analysis failed",
      keyPoints: [],
      tone: "Unknown",
      focus: "Error during analysis",
      missing: "N/A"
    });
  }
}
