# Reference: SEO Contract (gates, thresholds, field rules)

Source of these rules: `SEO_TDK.md` §1–3, §9. Enforcement: `seo/validate-seo.ts` (run by
`pnpm seo:check`, also the `prebuild` hook — a failure blocks `pnpm build`).

## Admission gate — may this page be `indexable: true`?

A page earns indexing **only** when ALL hold:

```
indexable =
    has a real search term (verified search volume in Ahrefs/Semrush)
  + a keyword tool produces related long-tails
  + search intent matches (the SERP top-10 page types match what we're building)
  + it supports a parent page, or is sink content that supplements a higher page
```

If it fails: set `indexable: false` (noindex via `generate-seo-metadata.ts`) or don't ship it.
Pure parameter/model pages with no search term, no internal links, and no plan are garbage
that dilutes site-wide authority — `indexable: false`, always.

**Intent strategy:**
- A keyword with **mixed** intent (informational + transactional) → build a **content
  aggregation page** (`pageType: "category"`), not a bare product page or a blog post.
- Low-volume long-tails / variants / synonyms → fold into the parent page as **H3/H4**
  (`secondaryKeywords` + `paaQuestions`), do **not** make a standalone page (avoids internal
  competition / cannibalization).

## New-site keyword-difficulty thresholds (first ~6 months)

Only make a standalone indexable page when a term passes all three. Encode in
`keywordMetrics` — `validate-seo.ts` **warns** (does not throw) when exceeded:

| Metric | Field | Threshold |
|--------|-------|-----------|
| Ahrefs KD | `ahrefsKd` | `< 10` (rank without backlinks) |
| Semrush KD | `semrushKd` | `< 20` (rank on content/structure alone) |
| Allintitle "golden score" | `goldenScore` | `< 10` (direct competitors — avoid red oceans) |

Beyond tools, mine real pain points from Twitter/Reddit (e.g. *"remove original author from
docx without Word"*) — these blue-ocean long-tails convert first.

## `SeoPageContract` field rules

(Type: `seo/seo-types.ts`. Example: the `tool.word` entry in `seo/seo-map.ts`.)

- `pageCode` — globally unique key (e.g. `home`, `tool.word`, `blog.remove-author`). **Dup throws.**
- `path` — real route, leading `/`, locale-free (see i18n note in SKILL.md). **Dup throws.**
- `level` — `1 | 2 | 3`. **`> 3` throws.** (Home/level-1 hubs = priority 1.0 in sitemap;
  level 2 = 0.8; level 3 = 0.5 — see `app/sitemap.ts`.)
- `pageType` — `home | category | tool-detail | blog-hub | blog-post | faq`.
- `primaryKeyword` — must have verified search volume; appears in `title` + `h1`.
- `secondaryKeywords` — variants/synonyms woven into body as H3/H4; not separate pages.
- `intent` / `serpPageType` — drives whether we compete with this page type at all.
- `indexable` — gated above. If `true`, `canonical` is **required** and must start with `/`
  (else **throws**).
- `parentPageCode` — required for level 2/3; powers `BreadcrumbList` + breadcrumb UI.
- `title` — unique, ≤60 chars (warn >60). See content-playbook for the formula.
- `description` — unique, ≤160 chars (warn >160). Not a keyword list.
- `h1` — exactly one per page; contains the primary keyword; **must not be字面-identical to
  `title`** (Title is for the SERP, H1 is on-page).
- `keywords` — internal keyword map only; never stuffed into the rendered page.
- `canonical` — self-referencing, leading `/`.
- `alternates` — hreflang map. Self-reference per language; never cross-point.
- `schemaTypes` — subset of `Organization | WebSite | BreadcrumbList | Product | FAQPage |
  Article | ItemList`. Only types actually rendered by `generate-json-ld.ts` emit output.
- `internalLinksTo` — pageCodes this page links to with keyword anchors (reflow — see playbook).
- `paaQuestions` — People-Also-Ask, **Chinese text** (the `en` override holds English). Wiring
  in content-playbook §FAQ. `validate-seo.ts` **warns** if a `tool-detail`/`category` page is
  indexable with none.
- `status` — `draft | ready | published`. **Only `published` pages are validated, emitted in
  metadata/JSON-LD, and listed in the sitemap.** Use `draft`/`ready` to stage work.
- `en` — `Partial` override of `title/description/keywords/h1/og/paaQuestions` for English.
  Every published indexable page should have a complete, hand-written `en`.

## What `validate-seo.ts` does

**Throws (blocks build):** missing `title`/`description`/`h1`; `level > 3`; duplicate
`pageCode`; duplicate `path`; duplicate `title`; duplicate `description`; `indexable` without
`canonical`; `canonical` not starting with `/`.

**Warns (non-blocking):** indexable `tool-detail`/`category` with no `paaQuestions`;
`title` > 60 chars; `description` > 160 chars; `keywordMetrics` over the new-site thresholds.

After any `seoMap`/contract change, run `pnpm seo:check`, then `pnpm typecheck`.
