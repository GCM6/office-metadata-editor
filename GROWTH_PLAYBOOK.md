# MetaDocu Growth Playbook — fixing "no traffic"

Status at start: ~13 impressions / 1 click in 90 days, avg position 7.2.
Diagnosis: **on-page SEO is already strong; the bottleneck is (a) an edge/Cloudflare
mis-config silently blocking AI crawlers, and (b) a brand-new domain with zero off-site
authority.** No amount of additional `seoMap` polish fixes a site Google/AI engines don't
trust yet. This doc is the off-site + edge work — the part that actually moves the needle.

Position 7.2 across only 13 impressions means: *when* you appear you're already on page 1 —
you just appear almost never. That's an authority + visibility problem, not a ranking-quality
problem.

---

## P0 — Fix the Cloudflare robots override (do this first, ~10 min)

Your code (`app/robots.ts`) **allows** all AI crawlers. But the **live** `https://metadocu.com/robots.txt`
is being rewritten by Cloudflare's *Managed robots.txt / AI Audit Content Signals* feature, which
**prepends a block that disallows the exact bots you want**:

```
# BEGIN Cloudflare Managed content
User-agent: *
Content-Signal: search=yes,ai-train=no
...
User-agent: GPTBot          Disallow: /
User-agent: ClaudeBot       Disallow: /
User-agent: Google-Extended Disallow: /
User-agent: CCBot           Disallow: /
User-agent: Applebot-Extended Disallow: /
User-agent: Bytespider / Amazonbot / meta-externalagent  Disallow: /
# END Cloudflare Managed Content
```

Because the Cloudflare block appears **first**, GPTBot/ClaudeBot/Google-Extended/CCBot obey
`Disallow: /` and never crawl you — **your entire GEO/AI-citability investment is currently
neutralized at the edge.** (Regular Google *search* via Googlebot is still allowed —
`search=yes` — so this doesn't explain low Google traffic, but it does explain zero AI citations.)

**Fix:** Cloudflare dashboard → the zone for `metadocu.com` → **AI Audit / Bots → Manage robots.txt**
(or **Scrape Shield / Content Signals**). Either:
- Turn **off** the managed robots.txt block so your app's `robots.ts` is served verbatim, **or**
- Set the content signals to `ai-train=yes` (or at least stop disallowing GPTBot/ClaudeBot/
  Google-Extended) if you want them cited/trained.

**Also verify Googlebot isn't being challenged.** A plain fetch of `metadocu.com/` returns
**HTTP 403** (Cloudflare bot protection). Cloudflare normally lets *verified* Googlebot through,
but confirm in **Google Search Console → URL Inspection → Test Live URL**: the "Page fetch" must
say **"Successful."** If it says *Failed/Forbidden*, Cloudflare Bot Fight Mode is blocking Googlebot
— that alone would cause "Discovered – currently not indexed" and near-zero impressions. If so:
Cloudflare → Security → Bots → disable **Bot Fight Mode**, or add a WAF skip rule for verified
search bots.

---

## P0.5 — Confirm the indexing reality in GSC (~15 min, you)

1. **Pages report** → how many URLs are **Indexed** vs **Discovered/Crawled – currently not
   indexed**? With 19 indexable pages, anything under ~15 indexed is the real cap on impressions.
2. **Performance → Queries** → what were the 13 impressions actually for? (Tells us if remaining
   work is *indexing* or *keyword targeting*.)
3. Confirm `metadocu.com` property is **verified** and `sitemap.xml` is **Submitted / Success**.
4. For the top 5 pages: **URL Inspection → Request Indexing** to nudge crawling.

---

## P1 — Off-site authority (the real lever; nothing on-page substitutes for this)

A new domain with ~0 referring domains won't get indexed widely or rank, and AI engines weight
**brand mentions above backlinks**. Goal for month 1: **10–20 real referring domains + 5+ branded
mentions.** Anchor-text mix across everything: **~60% brand (MetaDocu / metadocu.com), ~30% generic
(this tool / website), ~10% exact-match** (never bulk exact-match — #1 penalty cause).

### Launch assets (one-time, high ROI)
- [ ] **Product Hunt** launch. Strong fit: free, no signup, privacy-first, runs 100% in-browser.
      Prep tagline, 3–5 screenshots, a GIF of "scan → see hidden author → clear → verify".
- [ ] **AlternativeTo.net** — list MetaDocu. You already have `/ilovepdf-alternative`,
      `/smallpdf-alternative`, `/metadatakit-alternative` pages — register MetaDocu there as an
      alternative to iLovePDF, Smallpdf, Adobe Acrobat (metadata), and MetadataKit. Self-reinforcing.
- [ ] **Show HN** (Hacker News) — "Show HN: MetaDocu – strip hidden metadata from Word/Excel/PDF
      in your browser, nothing uploaded." HN loves local-first privacy tools. Be present in comments.
- [ ] **Directories:** Free SaaS/tool directories — SaaSHub, There's An AI For That (it has a
      utility section), Toolfolio, OpenAlternative, FreePrivacyTools-type lists, libhunt. Aim 15–30
      (these dilute anchors, not for ranking power).

### Recurring brand mentions (the durable GEO signal)
Answer **real questions** where the intent matches a page you already have — link naturally,
lead with help not promotion:
- [ ] **Reddit** — r/privacy, r/sysadmin, r/legaltech, r/jobs & r/resumes (the resume angle →
      `/remove-metadata-from-resume`), r/excel, r/pdf. Search "remove author from docx", "metadata
      in PDF", "tracked changes leaked". Build comment karma first; don't drive-by spam.
- [ ] **Quora / StackExchange (Super User, Law SE)** — same questions, evergreen.
- [ ] **YouTube** — a 60–90s screen-capture "Remove hidden author/metadata from a Word doc before
      sending (no upload)" + link in description. Video ranks and gets cited by AI.
- [ ] **One genuinely useful data piece** people cite: expand `/metadata-leak-study` into a small
      original study ("we scanned N public .docx/.pdf — X% still carried author/company") and pitch
      it to privacy/infosec newsletters & journalists. Original data = the #1 earned-link magnet.

### Cadence (per content-playbook §anchor-text)
Launch day = social shares → +1 week = directories/comments (dilute anchors) → +2 weeks onward =
1–2 quality guest posts / month on privacy, legal-tech, or job-search blogs.

---

## P2 — Content velocity (fast-ranking, feeds the hubs)
Blogs index and rank fastest; route their authority to the level-1 tool hubs. Ship "Top-list"
comparison guides + more long-tail scenario pages, and surface them in the home first screen / nav.
(Tracked in code work — see the seoMap/content tasks.)

Candidate Top-lists (high commercial intent, English head terms):
- "Top 5 Free Word Metadata Removers in 2026" → reflows to `/tools/word`
- "How to Remove PDF Metadata: 6 Tools Compared (No Upload)" → `/tools/pdf`
- "Best Way to Remove Metadata Before Emailing a File" (already have `/remove-metadata-before-sending` — expand or interlink)

---

## What NOT to spend time on right now
- More structured-data / JSON-LD types — already comprehensive.
- More on-page keyword tweaking beyond the English-title fixes — diminishing returns until you're
  indexed and have referring domains.
- Adding more locales — `en` + `zh-CN` only; mass machine translation is a demotion risk.

## Scorecard (revisit in 30 days)
| Metric | Now | 30-day target |
|---|---:|---:|
| Pages indexed (GSC) | ? | ≥ 15 / 19 |
| Referring domains | ~0 | 10–20 |
| Branded mentions (Reddit/PH/HN/YT) | ~0 | 5+ |
| Impressions / day | ~0.15 | 20+ |
| AI crawlers allowed in live robots.txt | ❌ blocked | ✅ allowed |
