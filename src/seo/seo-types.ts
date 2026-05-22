export interface SeoPageContract {
  path: string
  title: string
  description: string
  keywords?: string
  canonical?: string
  indexable?: boolean
  depth: number
}
