---
name: seo-geo
description: >
  Use when adding, editing, auditing, or optimizing pages for SEO and GEO (AI-search /
  Generative Engine Optimization) in this MetaDocu/office-metadata-editor repo. Triggers:
  "add a page", "new tool/blog page", "SEO", "GEO", "TDK", "title/description/keywords",
  "seoMap", "metadata", "canonical/hreflang", "schema / JSON-LD / structured data",
  "FAQ / PAA", "internal links", "robots / sitemap / llms.txt", "make this page rank /
  citable in ChatGPT/Perplexity/AI Overviews", or any change under seo/. Enforces the
  project's SEO Contract (the prebuild gate) and the AI-search citability layer.
---

# SEO + GEO Skill (MetaDocu)

This skill operationalizes two methodologies for **this** codebase:

1. **SEO Contract** — the rules from `SEO_TDK.md` (page-admission gates, 3-level structure,
   keyword-difficulty thresholds, TDK rules, PAA/FAQ, internal-link权重 reflow, i18n
   anti-penalty, anchor-text ratios). Much of it is already coded in `seo/` and enforced at
   build time.
2. **GEO (Generative Engine Optimization)** — optimizing for AI answer engines (ChatGPT,
   Claude, Perplexity, Gemini, Google AI Overviews) via citable passages, AI-crawler access,
   structured data, E-E-A-T signals, brand mentions, and `llms.txt`.

Treat SEO Contract as **hard rules** (they gate the build) and GEO as the **layer on top**
that wins AI citations. Both apply to every indexable page.

## How the SEO system is wired in this repo

Single source of truth is **`seo/seo-map.ts`** — `seoMap: Record<pageCode, SeoPageContract>`.
Everything else derives from it:

| File | Role |
|------|------|
| `seo/seo-types.ts` | `SeoPageContract` type (incl. `en` override for English) |
| `seo/seo-map.ts` | the contract data; exports `getPublishedPages()`, `getIndexablePages()` |
| `seo/validate-seo.ts` | **build gate** — run via `pnpm seo:check` (also the `prebuild` hook) |
| `seo/generate-seo-metadata.ts` | `generateSeoMetadata(pageCode, locale)` → Next `Metadata` |
| `seo/generate-json-ld.ts` | `generateJsonLd(pageCode, locale)` → JSON-LD array |
| `seo/json-ld.tsx` | `<JsonLd data={...}/>` injector |
| `seo/components/SeoContent.tsx` | renders the FAQ block + `RelatedLinks` from the contract |
| `seo/components/RelatedLinks.tsx` | internal-link reflow using `internalLinksTo` |
| `seo/faq-keys.ts` | maps PAA question text (zh **and** en) → stable answer key |
| `messages/{zh-CN,en}.json` | actual FAQ question/answer **text** (under `seo.faqQuestions` / `seo.faqAnswers`) |
| `app/sitemap.ts` | generated from `getPublishedPages()` |
| `app/robots.ts` | crawler rules (GEO opportunity — see reference) |

**Per-page wiring** (mirror the existing `tools/word` pages):
- `app/[locale]/<route>/layout.tsx` → `export async function generateMetadata()` calls
  `generateSeoMetadata(pageCode, await getLocale())`.
- `app/[locale]/<route>/page.tsx` → `generateJsonLd(pageCode, locale)` + `<JsonLd>` +
  `<OmBreadcrumbs pageCode>` + `<SeoContent pageCode>` (renders the H1 once, tool UI, then FAQ/links).

**i18n reality (important):** routing is `localePrefix: "never"` (`i18n/routing.ts`), locales
`en` + `zh-CN`, default `en`, resolved from the `NEXT_LOCALE` cookie — **the locale is NOT in
the URL path**. So one `path`/`canonical` per page (e.g. `/tools/word`), and English content
comes from the `en: {...}` override inside the contract, not a separate route. This diverges
from `SEO_TDK.md` §7 (which assumed `/en/...` `/zh/...` paths); follow the **code**, not the doc.

## Core workflows

### A. Add a new page
1. **Gate it first** (do not skip — see `reference/seo-contract.md` §Admission). Confirm a real
   search term + intent match + that it slots into the ≤3-level tree under an existing parent.
   If it fails the gate, set `indexable: false` or don't create it.
2. Add a `seoMap` entry with a unique `pageCode`. Required: `path`, `level` (1–3), `pageType`,
   `primaryKeyword`, `secondaryKeywords`, `intent`, `serpPageType`, `indexable`, unique
   `title`/`description`/`h1`, `canonical` (starts with `/`), `internalLinksTo`, `status`.
   Add `parentPageCode` for level 2/3, `schemaTypes`, `paaQuestions`, and a full `en` override.
3. Write TDK to the formulas/limits in `reference/content-playbook.md` (Title ≤60, Desc ≤160,
   globally unique, H1 ≠ Title verbatim).
4. Wire FAQ/PAA end-to-end (the 4-file dance — see playbook §FAQ): `paaQuestions` (zh) +
   `en.paaQuestions` + a `faq-keys.ts` mapping for **both** languages + `seo.faqQuestions.<key>`
   and `seo.faqAnswers.<key>` in **both** message files.
5. Create `layout.tsx` (generateMetadata) and `page.tsx` (JsonLd + Breadcrumbs + H1 + SeoContent).
6. Apply the **GEO layer** (`reference/geo-ai-search.md`): a citable answer-first passage, the
   right `schemaTypes`, E-E-A-T signals.
7. `pnpm seo:check` must pass; then `pnpm typecheck`. Set `status: "published"` only when ready.

### B. Optimize / audit an existing page
Run the **combined checklist** in `reference/geo-ai-search.md` §Audit (citability, crawlers,
schema, brand, technical) and the contract checks in `reference/seo-contract.md`. Report
findings as concrete edits to `seoMap` / messages / components, then re-run `pnpm seo:check`.

### C. Site-wide GEO hardening
Add AI-crawler rules to `app/robots.ts`, create `public/llms.txt`, verify hreflang/canonical
self-reference, and confirm internal-link reflow to the level-1 tool hubs. See
`reference/geo-ai-search.md` §Site-wide.

## Hard rules (never violate — most are build-gated)
- **≤3 page levels.** `level > 3` throws in `validate-seo.ts`.
- **Globally unique** `pageCode`, `path`, `title`, `description` — duplicates throw.
- Indexable page **must** have a `canonical` starting with `/`.
- **No mass machine-translated locales.** Only `en` + `zh-CN`, hand-written. Canonical
  self-references its own page; never cross-point languages.
- **Anchor-text ratio** for any link building: ~60% brand / 30% generic / 10% exact-match.
  Never bulk exact-match — it's the #1 cause of penalties.
- **No zero-value pages.** No search term + no internal links + no plan ⇒ `indexable: false`.

## Reference files (load as needed)
- `reference/seo-contract.md` — admission gates, keyword-difficulty thresholds, field-by-field
  contract rules, what `validate-seo.ts` throws vs warns, sitemap/robots wiring.
- `reference/content-playbook.md` — TDK formulas & limits, the PAA→FAQ 4-file wiring, internal
  linking laws, anchor-text ratios, i18n/hreflang, GSC reflow, Top-list launch tactic.
- `reference/geo-ai-search.md` — GEO scoring model, citability passages, AI-crawler list +
  robots recommendations, `llms.txt` template, schema/E-E-A-T, brand mentions, the audit checklist.
