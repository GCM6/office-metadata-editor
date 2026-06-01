import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [],
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: [],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
