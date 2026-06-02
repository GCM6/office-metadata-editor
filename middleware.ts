import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const hasLocaleCookie = request.cookies.has("NEXT_LOCALE")

  if (!hasLocaleCookie) {
    // 第一次访问，没有语言 Cookie，强制在当前请求中设置为默认语言 'en'
    request.cookies.set("NEXT_LOCALE", "en")
    const response = intlMiddleware(request)
    
    // 同时在 response 中写入 Cookie，保证下次请求直接携带 'en'
    response.cookies.set("NEXT_LOCALE", "en", {
      path: "/",
      maxAge: 31536000, // 1 年有效
      sameSite: "lax",
    })
    return response
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
