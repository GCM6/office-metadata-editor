import { seoMap } from "./seo-map"

export function validateSeoMap(): void {
  const titles = new Map<string, string>()
  const descriptions = new Map<string, string>()
  const activePaths = new Set<string>()
  const pageCodes = new Set<string>()

  console.log("SEO Contract Validation Starting...")

  for (const item of Object.values(seoMap)) {
    if (item.status !== "published") continue

    const loc = `[PageCode: ${item.pageCode}]`

    assert(item.title, `${loc} Must have a Title field`)
    assert(item.description, `${loc} Must have a Description field`)
    assert(item.h1, `${loc} Must have an H1 field`)

    if (item.level > 3) {
      throw new Error(
        `${loc} Page level is ${item.level}, violates "max 3-level page structure" rule`
      )
    }

    if (pageCodes.has(item.pageCode)) {
      throw new Error(`${loc} Duplicate pageCode`)
    }
    pageCodes.add(item.pageCode)

    if (activePaths.has(item.path)) {
      throw new Error(
        `${loc} Path ${item.path} conflicts with another page. This creates internal keyword competition.`
      )
    }
    activePaths.add(item.path)

    if (titles.has(item.title)) {
      throw new Error(
        `${loc} Title duplicates ${titles.get(item.title)}. Must be globally unique.`
      )
    }
    if (descriptions.has(item.description)) {
      throw new Error(
        `${loc} Description duplicates ${descriptions.get(item.description)}. Must be globally unique.`
      )
    }
    titles.set(item.title, item.pageCode)
    descriptions.set(item.description, item.pageCode)

    if (item.indexable) {
      assert(item.canonical, `${loc} Indexable but missing Canonical URL`)
      if (!item.canonical.startsWith("/")) {
        throw new Error(
          `${loc} Canonical path must start with "/", current: ${item.canonical}`
        )
      }
    }

    if (item.indexable && (item.pageType === "tool-detail" || item.pageType === "category")) {
      if (!item.paaQuestions || item.paaQuestions.length === 0) {
        console.warn(
          `Warning: ${loc} No PAA (People Also Ask) questions configured. Adding them can increase long-tail keyword rankings.`
        )
      }
    }

    if (item.title.length > 60) {
      console.warn(
        `Warning: ${loc} Title is ${item.title.length} characters (recommended ≤60)`
      )
    }

    if (item.description.length > 160) {
      console.warn(
        `Warning: ${loc} Description is ${item.description.length} characters (recommended ≤160)`
      )
    }

    if (item.keywordMetrics) {
      const { ahrefsKd, semrushKd, goldenScore } = item.keywordMetrics
      if (ahrefsKd >= 10 || semrushKd >= 20 || goldenScore >= 10) {
        console.warn(
          `Warning: ${loc} Keyword metrics (KD:${ahrefsKd}/${semrushKd}, Golden:${goldenScore}) exceed new site launch thresholds. Consider a stronger content/link strategy.`
        )
      }
    }
  }

  console.log("SEO Contract Validation Passed")
}

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message)
}

try {
  validateSeoMap()
} catch (error) {
  console.error("SEO Contract Validation Failed:")
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
