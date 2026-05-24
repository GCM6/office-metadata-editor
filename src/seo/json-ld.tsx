import type { JsonLdData } from "./generate-json-ld"

export function JsonLd({ data }: { data: JsonLdData[] }) {
  if (!data || data.length === 0) {
    return null
  }

  return (
    <>
      {data.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
