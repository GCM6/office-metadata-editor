import { seoMap } from "./seo-map"

const errors: string[] = []
const warnings: string[] = []

function error(msg: string) {
  errors.push(msg)
}

function warn(msg: string) {
  warnings.push(msg)
}

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

console.log(`[seo:check] 开始校验 ${seoMap.length} 个路由的 SEO 合同...\n`)

// 1. TDK 完整性断言
console.log("[check 1/7] TDK 完整性断言...")
for (const page of seoMap) {
  if (!page.title) error(`[${page.path}] title 缺失`)
  if (!page.description) error(`[${page.path}] description 缺失`)
  if (!page.keywords) warn(`[${page.path}] keywords 未设置（建议补充）`)
}

// 2. 层级深度不超过 3 层
console.log("[check 2/7] 层级深度检查（不超过 3 层）...")
for (const page of seoMap) {
  if (page.depth > 3) error(`[${page.path}] 层级深度 ${page.depth} 超过 3 层`)
}

// 3. 路由路径唯一性
console.log("[check 3/7] 路由路径唯一性检查...")
const paths = seoMap.map(p => p.path)
const dupPaths = paths.filter((p, i) => paths.indexOf(p) !== i)
if (dupPaths.length > 0) error(`重复的路由路径: [${[...new Set(dupPaths)].join(", ")}]`)

// 4. Title 全局唯一性
console.log("[check 4/7] Title 全局唯一性检查...")
const titles = seoMap.map(p => p.title)
const dupTitles = titles.filter((t, i) => titles.indexOf(t) !== i)
if (dupTitles.length > 0) warn(`重复的 Title: [${[...new Set(dupTitles)].join(", ")}]`)

// 5. Description 全局唯一性
console.log("[check 5/7] Description 全局唯一性检查...")
const descs = seoMap.map(p => p.description)
const dupDescs = descs.filter((d, i) => descs.indexOf(d) !== i)
if (dupDescs.length > 0) warn(`重复的 Description: [${[...new Set(dupDescs)].join(", ")}]`)

// 6. indexable 页面 Canonical 有效性
console.log("[check 6/7] indexable 页面 Canonical 有效性检查...")
for (const page of seoMap) {
  if (page.indexable !== false) {
    if (!page.canonical) {
      error(`[${page.path}] indexable 页面缺少 canonical URL`)
    } else if (!isValidUrl(page.canonical)) {
      error(`[${page.path}] canonical URL 无效: ${page.canonical}`)
    }
  }
}

// 7. PAA 覆盖度提醒 + 新站关键词难度提醒
console.log("[check 7/7] PAA 覆盖度提醒 & 新站关键词难度提醒...")
const totalPages = seoMap.length
const pagesWithKeywords = seoMap.filter(p => p.keywords).length
const keywordCoverage = totalPages > 0 ? (pagesWithKeywords / totalPages) * 100 : 0
if (keywordCoverage < 80) {
  warn(`关键词覆盖度 ${keywordCoverage.toFixed(0)}%（建议 ≥ 80%），部分页面缺少 keywords，可能影响 PAA 匹配`)
} else {
  console.log(`  关键词覆盖度 ${keywordCoverage.toFixed(0)}% — 良好`)
}

console.log("")

if (warnings.length > 0) {
  console.warn(`⚠️  发现 ${warnings.length} 个警告:`)
  for (const w of warnings) console.warn(`  - ${w}`)
}

if (errors.length > 0) {
  console.error(`\n❌ 发现 ${errors.length} 个错误:`)
  for (const e of errors) console.error(`  - ${e}`)
  console.error("\n[seo:check] 校验未通过，阻断构建")
  process.exit(1)
}

if (warnings.length > 0) {
  console.log(`\n[seo:check] 校验通过（${warnings.length} 个警告）`)
} else {
  console.log("\n[seo:check] 校验通过，全部检查项正常")
}
