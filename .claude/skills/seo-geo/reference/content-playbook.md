# Reference: Content Playbook (TDK, FAQ wiring, links, i18n)

Source: `SEO_TDK.md` §4, §6, §7, §8, §10. Grounded in `seo/` + `messages/`.

## TDK formulas & limits

**Title** — `Primary keyword + scenario/pain-point solution | Brand`
- Word: `Edit Word Metadata Online: Remove Authors & Tracked Info | MetaDocu`
- PDF: `PDF Metadata Editor: Clear PDF Properties & Author Online | MetaDocu`
- Rules: globally unique (dup **throws** in `validate-seo.ts`); 50–60 chars (warn >60); same
  *meaning* as H1 but never字面-identical.

**Description** — `whose pain + what we solve + our core advantage + CTA`
- Example: *"Worried about document privacy? Upload and edit Word docx metadata online.
  Delete creator names, modification dates, and hidden authors in 1-click."*
- Rules: globally unique; 120–150 chars (warn >160 in validator); never a keyword-stuffed list.

**H1** — exactly one, contains primary keyword, differs from Title verbatim. Rendered on the
`page.tsx` (see `app/[locale]/tools/word/page.tsx`), not by the SEO helpers.

Write zh in the base contract fields and en in the `en: {...}` override. Keep both within limits.

## FAQ / PAA — the 4-file wiring (do all four, both languages)

FAQ answer **text does not live in `seoMap`**. The contract holds question *pointers*; the text
lives in message files keyed by a stable ID. To add/maintain a PAA question:

1. **`seo/seo-map.ts`** — add the Chinese question string to the page's `paaQuestions`, and the
   English string to `en.paaQuestions` (same order/count).
2. **`seo/faq-keys.ts`** — add a `faqKeyMap` entry for **both** the Chinese and the English
   question text, mapping each to the **same** stable key (e.g. `"如何…？": "edit-word-author"`
   and `"How to…?": "edit-word-author"`).
3. **`messages/zh-CN.json`** and **`messages/en.json`** — under `seo.faqQuestions.<key>` add the
   display question, and under `seo.faqAnswers.<key>` add the answer, in each language.

Then it renders automatically: `SeoContent.tsx` reads `paaQuestions` → `questionToKey()` →
`seo.faqQuestions/faqAnswers`; `generate-json-ld.ts` emits a `FAQPage` JSON-LD from the same
data (so include `"FAQPage"` in `schemaTypes`). Unmapped questions fall back to
`online-metadata-security` — a sign you missed step 2/3.

> The **home** page is special: its FAQ comes from `messages.<locale>.home.faqItems` (literal
> `{q,a}` pairs), not the key-mapped path. Edit those directly for home.

PAA content rule: every researched PAA question must be answered on-page as **H3/H4** with a
natural, expert answer — and emitted as `FAQPage` structured data. This doubles as the GEO
"answer-first" surface (see geo-ai-search.md).

## Internal-link reflow (权重 distribution) — three laws

Internal links are the lifeline of authority distribution on a new site.
1. **Sink blogs reflow 100%.** Every blog post hard-links to its core landing page with a
   keyword anchor (all Word articles → `/tools/word` via anchor "Word Metadata Editor"). Encode
   as `internalLinksTo` so `RelatedLinks.tsx` renders it.
2. **Aggregation pages are the long-term core.** Blog traffic is short-lived; the level-1 tool
   hubs (`tool.word`, `tool.excel`, `tool.pdf`) are the durable assets — keep feeding them.
3. **Home body links matter most.** Do **not** rely on header/footer links alone. The home
   page's first-screen body / card grid must surface the level-1 tool hubs directly, so
   domain authority entering the home page flows to them through prime in-body links.

`RelatedLinks.tsx` anchors use the **target page's `primaryKeyword`** — keep keywords accurate.

## Anchor-text ratio (link building — internal & external)

Never bulk exact-match anchors — #1 penalty cause. Target distribution:

```
Brand (MetaDocu / metadocu.com)   ~60%
Generic (click here / website)    ~30%
Exact keyword (Word Metadata Editor) ~10%
```

External cadence: launch day = social shares (signals) → +1 week = directory/comment links
(50–100, to dilute anchors) → +2 weeks = quality guest posts (5–10/month, ongoing).

## i18n / hreflang (anti-penalty)

- **Only `en` + `zh-CN`, hand-written.** Mass auto-translated locales are the top demotion
  cause — never add a 100-language plugin.
- This repo uses `localePrefix: "never"` (cookie-based locale, no path prefix) and the
  `en: {...}` content override — **not** `/en/…` `/zh/…` routes (that's what `SEO_TDK.md` §7
  assumed; follow the code). `canonical` self-references the single page path.
- If machine-translated junk ever caused a demotion, the only fix is 301-redirecting all
  meaningless locale URLs back into the canonical languages.

## Post-launch: GSC reflow & launch tactics (P2)

- **New-word handling:** when Google Search Console shows an un-targeted query already getting
  impressions/clicks with clear intent — do **not** stuff it into an existing page. Write a new
  blog post or feature page to capture it.
- **Fast-traffic tactic:** blogs rank fastest. Write Top-list comprehensive guides
  (*"Top 5 Free Word Metadata Editors in 2026"*, *"How to Clean Hidden PDF Info: 10 Tools
  Compared"*) and place them in the header nav / home first screen so they get max internal
  authority — multiplies indexing/ranking speed.
