# IndieSource Sprint 2: Wire Up Independent Sources

## Section 1: Global Context & Rules

**App Name:** IndieSource
**Stack:** Next.js 14, TypeScript 5, Tailwind 3.4, Brave Search API, Gemini AI
**Repo:** https://github.com/GitHubUser106/IndieSource
**Branch:** main (create feature branch for this work)
**Working Directory:** ~/Desktop/IndieSource

**Environment Variables (.env.local):**
- BRAVE_API_KEY
- GEMINI_API_KEY

---

## Section 2: Current Sprint

**Goal:** Replace legacy MSM source matching with independent media sources and display authenticity signals in the UI

**Context:** The search API currently matches results against `sourceData.ts` (legacy MSM outlets). We need to swap this to match against `independentSourceData.ts` and show the `verifiedHuman` status and platform type on source cards.

---

## Execution Checklist

- [ ] Create feature branch: `git checkout -b feature/indie-sources`
- [ ] Read current search API: `src/app/api/find/route.ts`
- [ ] Read current source data: `src/lib/sourceData.ts`
- [ ] Identify where source matching happens
- [ ] CHECKPOINT 1: Report current architecture before making changes
- [ ] Update imports in route.ts to use `independentSourceData.ts`
- [ ] Update source matching logic for platform-based URLs (youtube, substack, rumble, etc.)
- [ ] Update SourceFlipCard to show platform badge and verifiedHuman indicator
- [ ] Test on localhost:3000 with a real article URL
- [ ] CHECKPOINT 2: Report test results with screenshots
- [ ] Update page title/branding to "IndieSource"
- [ ] Commit and push feature branch
- [ ] Merge to main after verification

---

## Success Criteria

- Search returns independent media sources (Rebel News, Breaking Points, etc.)
- Source cards show platform type (YouTube, Substack, Podcast, etc.)
- Source cards show ✓ Verified Human badge for `verifiedHuman: true` sources
- App title shows "IndieSource" not "MirrorSource"
- No TypeScript errors

---

## Files to Modify

- MODIFY: `src/app/api/find/route.ts` (swap source imports, update matching)
- MODIFY: `src/components/SourceFlipCard.tsx` (add platform + verified badges)
- MODIFY: `src/app/layout.tsx` or `src/app/page.tsx` (update title/branding)
- REFERENCE: `src/lib/independentSourceData.ts` (already created)
- REFERENCE: `src/lib/authenticitySignals.ts` (already created)

---

## Key Questions for Checkpoint 1

Before modifying, CC should report:
1. How does `route.ts` currently import and use `sourceData.ts`?
2. What's the matching logic? (domain-based? name-based?)
3. What fields from sourceData are used in the response?
4. Any obvious blockers for swapping to independentSourceData?

---

## Testing Plan

Test URL (use a real indie media article):
- Find a recent Rebel News or Breaking Points YouTube video URL
- Or use a Substack article URL from Matt Taibbi or Glenn Greenwald

Kill browsers first: `pkill -f "chrome.*mcp"`
Run: `npm run dev`
Test: http://localhost:3000