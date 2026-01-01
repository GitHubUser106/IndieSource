# CLAUDE.md - MirrorSource Standing Orders

## 1. The "Orchestra" Protocol (Crucial)
* **Role:** You are the "Musician" (Builder). I am the "Conductor" (Architect).
* **Workflow:**
    1.  Check `plan.md` for the current movement (sprint).
    2.  Execute changes autonomously.
    3.  **Commit Protocol:** If using "Auto-Accept," stage changes but ask for a final "Conductor Affirmation" before pushing to origin.
* **Vibecoding Philosophy:** Prioritize working prototypes and speed over academic perfection. Avoid over-engineering.

## 2. Project Context
* **App Name:** MirrorSource
* **Description:** A news analysis and aggregation application that compares coverage across the political spectrum.
* **Key Features:**
    * **Political Lean Classification:** Categorizes sources using AllSides ratings (Left, Center-Left, Center, Center-Right, Right).
    * **Coverage Distribution:** Visual bar chart showing source diversity.
    * **WallHop Integration:** Logic to find free-to-read alternatives for paywalled articles.
    * **Source Comparison:** Side-by-side analysis of how different outlets cover the same story.
* **Deployment:** Vercel.
* **Repo Management:** GitHub.

## 3. Tech Stack & Environment
* **Framework:** Next.js 14.2.5 (App Router)
* **Language:** TypeScript 5
* **UI Library:** React 18
* **Styling:** Tailwind CSS 3.4.1
* **Icons:** Lucide React
* **AI:** Google Gemini (@google/genai)
* **Search API:** Brave Search
* **Analytics:** @vercel/analytics
* **Rule:** ALWAYS check the current directory structure (`ls -R` or similar) before creating new files to avoid duplication.
* **CSS Rule:** Do NOT use dynamic Tailwind classes (e.g., `bg-${color}-500`). Use inline styles with hex colors instead.

## 4. User Preferences (The "Manifesto")
* **Personal Interests (for content seeding):**
    * Silver & Precious Metals (AGQ).
    * Options Trading.
    * Local News: British Columbia (Whistler, Georgetown).
* **Communication Style:** Concise, actionable, no fluff.
* **Automation:** If a task takes more than 3 steps, write a script for it.

## 5. Standard Commands
* `npm run dev` - Start local development server
* `npm run build` - Build for production
* `npm run lint` - Run ESLint
* `npm start` - Start production server
* `git status` - Always check state before complex edits
* `git diff` - Verify changes before asking for approval

## 6. MirrorSource Design System

### Color Palette (Political Lean)
- Left: Blue (#2563eb / bg-blue-600)
- Center-Left: Cyan (#06b6d4 / bg-cyan-500)
- Center: Purple (#a855f7 / bg-purple-500)
- Center-Right: Orange (#f97316 / bg-orange-500)
- Right: Red (#dc2626 / bg-red-600)

### Component Standards
- Border radius: rounded-lg (8px)
- Card shadows: shadow-sm on hover
- Flip cards: CSS 3D transform, 0.5s duration
- Badges: rounded, px-2 py-0.5, text-xs font-medium

### Responsive Breakpoints
- Mobile: 1 column (< 640px)
- Tablet: 2 columns (640px - 1024px)
- Desktop: 3-4 columns (> 1024px)

### Accessibility Requirements
- Minimum tap target: 44px × 44px
- Links must have e.stopPropagation() to prevent parent click handlers
- No empty cards - always show snippet fallback
- Sufficient color contrast (WCAG AA)

### Visual Verification Checklist
Before committing any UI change, verify:
1. Coverage Distribution chart renders all 5 bars
2. Source Analysis cards flip on click
3. "Verify on Wikipedia" links are clickable without flipping card
4. No HTML tags visible in text content
5. Mobile layout is single column
6. No console errors

## 7. Visual Testing Protocol (Playwright MCP)

### After ANY UI Change:
1. Ensure dev server running: `npm run dev`
2. Wait for server ready on localhost:3000

### Desktop Verification (default viewport):
3. Navigate to http://localhost:3000
4. Take screenshot: "homepage-desktop.png"
5. Paste a test URL and click Analyze
6. Wait for results to load
7. Take screenshot: "results-desktop.png"
8. Verify Coverage Distribution shows 5 colored bars
9. Click a Source Analysis card to flip it
10. Take screenshot: "card-flipped-desktop.png"
11. Verify SOURCE TRANSPARENCY content is visible
12. Click "Verify on Wikipedia" - confirm it opens link (not flips card)

### Mobile Verification (390x844 - iPhone):
13. Set viewport to 390x844
14. Reload page
15. Take screenshot: "homepage-mobile.png"
16. Run same test search
17. Take screenshot: "results-mobile.png"
18. Verify grid is single column
19. Tap a card to flip
20. Take screenshot: "card-flipped-mobile.png"
21. Verify tap targets are accessible

### Console Check:
22. Check browser console for errors
23. Report any errors before committing

**Only commit if all checks pass.**
 