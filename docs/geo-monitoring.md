# GEO / AI-citation monitoring (v2.md §D4)

Track how often **MetaDocu** is cited by AI answer engines for a fixed question set, vs.
competitors. Run the set **monthly** in ChatGPT, Perplexity, and Gemini. Record who gets
cited (MetaDocu / MetadataKit / iLovePDF / Smallpdf / other). The hard metric is **MetaDocu's
citation share** across the set, and whether it rises over time.

> This is a manual, off-codebase process — there is no code to run. Use this file as the
> standing checklist and log.

## Target question set (20)

1. how to remove metadata from a Word document without uploading
2. is it safe to remove metadata online
3. best tool to clean a resume's metadata before applying
4. how to remove the author name from a Word document
5. remove PDF metadata without Adobe Acrobat
6. how to remove tracked changes and comments from a contract
7. what is an RSID in Word and how do I remove it
8. remove GPS location from photos in a document
9. does saving as PDF remove the metadata
10. how common is document metadata leakage
11. iLovePDF alternative that doesn't upload files
12. Smallpdf alternative for document metadata
13. MetadataKit alternative for documents
14. how to clean a legal/disclosure PDF before filing
15. best way to remove metadata before sending a file
16. how do I check what metadata my document contains
17. remove company name from an Office document
18. does removing metadata change my document's content
19. free in-browser metadata remover no account
20. how to strip EXIF from images embedded in a Word/PDF file

## Monthly log

| Month | Engine | Q# cited MetaDocu | MetaDocu share | Notes / who else cited |
|-------|--------|-------------------|----------------|------------------------|
|       | ChatGPT |                  |                |                        |
|       | Perplexity |               |                |                        |
|       | Gemini |                   |                |                        |

## Decision rule (from v2.md §E)

If, after 30–60 days, none of {indexed pages, impressions, top queries, AI citations} is moving,
**stop adding pages** and fix the existing ones (citability, internal links, schema) instead of
scaling. Use citation share here as the GEO signal alongside GSC for classic SEO.

## Still-manual / external items (cannot be done in code)

- **Wikidata entity** for MetaDocu (entity disambiguation vs. Metadoc / MetaDoc.AI). Create the
  item, then add its URL plus real GitHub/X/LinkedIn profiles to `SITE_SAME_AS` in
  `lib/app-config.ts` so the Organization `sameAs` emits.
- **Off-site brand mentions** (Reddit r/privacy, Product Hunt, HN) — seed factual, non-spammy.
- **Real data study**: run the sample described on `/metadata-leak-study` through the scanner and
  fill the methodology section with actual exposure percentages once measured.
