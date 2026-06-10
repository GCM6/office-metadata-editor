# Reference: GEO — Generative Engine Optimization (AI search)

Methodology adapted from the **geo-seo-claude** skill, applied to this repo. GEO optimizes for
AI answer engines (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews) — where a page
wins by being **cited in the answer**, not just ranked in a list. Brand mentions correlate with
AI visibility far more strongly than backlinks, and a page can be cited by ChatGPT yet absent
from Google AI Overviews (only ~11% of domains rank on both for the same query) — so optimize
for citability and platform breadth, not just blue links.

## GEO score model (use to prioritize an audit)

| Dimension | Weight | What it means here |
|-----------|-------:|--------------------|
| AI citability & visibility | 25% | self-contained, fact-rich, quotable passages |
| Brand authority signals | 20% | mentions on Reddit/YouTube/Wikipedia/LinkedIn etc. |
| Content quality & E-E-A-T | 20% | experience, expertise, authoritativeness, trust |
| Technical foundations | 15% | crawlable, fast, clean HTML, canonical/hreflang |
| Structured data | 10% | JSON-LD: FAQPage, HowTo, SoftwareApplication, Breadcrumb |
| Platform optimization | 10% | format for each engine; `llms.txt`; AI-crawler access |

## 1. Citability — the highest-leverage GEO move

AI engines extract **self-contained passages** to quote. On every indexable page include
answer-first blocks that:
- **Lead with the answer** in the first 1–2 sentences (don't bury it after preamble).
- Run roughly **130–170 words**, self-contained (no "as mentioned above"), fact-rich (specific
  numbers, formats, steps).
- Map 1:1 to a real question. The existing **PAA → FAQ** system (content-playbook §FAQ) is the
  ideal vehicle: each `faqAnswers.<key>` should be a citable, answer-first passage in **both**
  `zh-CN` and `en` message files. Upgrade thin answers there first.
- Use HowTo-style numbered steps for "how to remove/clear metadata" intents.

## 2. AI-crawler access — `app/robots.ts`

Today `app/robots.ts` only sets `*` + `Baiduspider`. To be citable, AI crawlers must be
**allowed** (blocking them = invisible to that engine). Add explicit allows for the major AI
bots, e.g. `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` (OpenAI); `ClaudeBot`, `Claude-Web`,
`anthropic-ai` (Anthropic); `PerplexityBot`; `Google-Extended` (Gemini/AI Overviews training);
`Applebot-Extended`; `CCBot` (Common Crawl, feeds many models); `Bingbot` (Copilot).
Decision: **allow** for maximum AI visibility; only block a specific bot if the user explicitly
wants to opt out of that engine's training. Keep the `sitemap` line. Verify a deployed site's
live `robots.txt` doesn't contradict the generated file.

## 3. `llms.txt` — emerging standard

Create `public/llms.txt` (served at `/llms.txt`) summarizing the site for AI crawlers: product
one-liner, what MetaDocu does (local, no-upload Office/PDF metadata scanning & cleaning),
supported formats (DOCX/DOC/XLSX/PDF), and a curated link list to the level-1 tool hubs and key
guides. Keep it concise, factual, link-rich. (Optionally a longer `llms-full.txt`.) This file is
static — add it under `public/`, no code change needed.

## 4. Structured data — `seo/generate-json-ld.ts`

Currently emits `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Article` based on
`schemaTypes`. For GEO, ensure:
- Every tool/blog page with PAA includes `"FAQPage"` (already wired) — keep answers citable.
- Consider extending the generator with **`SoftwareApplication`** (or `WebApplication`) for the
  tool pages (name, applicationCategory, `offers` free, `featureList`, operatingSystem "Web") and
  **`HowTo`** for step-based guides. If you add a `schemaTypes` value, you MUST add a matching
  branch in `generate-json-ld.ts` (it only emits types it explicitly handles) and the type union
  in `seo-types.ts`. Validate output with Google's Rich Results test mentally before shipping.

## 5. E-E-A-T & brand authority signals

- **Trust:** prominently state "100% local, no upload to any server" (the product's core trust
  claim) on tool pages and in schema descriptions — strong for a privacy tool's E-E-A-T.
- **Experience/Expertise:** author/about info, last-updated dates on guides, concrete how-to detail.
- **Brand mentions (off-site, highest GEO ROI):** recommend the user seed factual, non-spammy
  mentions on Reddit (r/privacy, r/sysadmin), YouTube, a Wikipedia-grade reference where
  legitimate, Product Hunt, and answer real questions ("remove author from docx without Word").
  These move AI visibility more than backlinks. (Advisory — outside the codebase.)

## Audit checklist (workflow B)

Run per page (or site-wide) and report concrete edits:

1. **Citability** — does each PAA answer lead with the answer, 130–170 words, self-contained,
   fact-rich, in both locales? List thin ones to rewrite.
2. **Crawlers** — does `app/robots.ts` allow the AI bots? Does deployed `/robots.txt` agree?
3. **Structured data** — right `schemaTypes`; FAQPage present where PAA exists; consider
   SoftwareApplication/HowTo; generator branch exists for each declared type.
4. **Technical/Contract** — canonical self-references; hreflang/`en` override complete; Title
   ≤60 / Desc ≤160; `pnpm seo:check` green; passes `validate-seo.ts`.
5. **Internal links** — `internalLinksTo` reflows to level-1 hubs; home body surfaces them.
6. **Brand/E-E-A-T** — trust claim visible; off-site mention plan (advisory).
7. **Platform/llms.txt** — `public/llms.txt` exists and is current.

Output: a prioritized list of edits to `seoMap` / `messages/*` / `robots.ts` /
`generate-json-ld.ts` / `public/llms.txt`, then re-run `pnpm seo:check` and `pnpm typecheck`.
