import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "页面未找到 | Office元数据编辑器",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground/40">404</h1>
      <p className="mt-4 text-lg font-medium text-foreground">页面未找到</p>
      <p className="mt-2 text-sm text-muted-foreground">
        您请求的页面不存在，可能已被移除或地址输入有误。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        返回首页
      </Link>
    </main>
  )
}
