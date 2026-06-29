import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"

// AI answer-engine crawlers explicitly allowed for GEO citability (v2.md §D, geo-ai-search).
// Blocking them = invisible to that engine; we opt in for maximum AI visibility.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bingbot",
]

export default function robots(): MetadataRoute.Robots {
  const disallowPaths = ["/editor", "/batch", "/api/"]
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowPaths,
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: disallowPaths,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: disallowPaths,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
