import { list } from "@vercel/blob"
import type { GridItem } from "@/app/types"
import { getEnv } from "./env"

function getToken(): string {
  const token = getEnv("BLOB_READ_WRITE_TOKEN")
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set")
  }
  return token
}

export async function getGridItems(): Promise<GridItem[]> {
  try {
    console.log("Attempting to get grid items")
    const { blobs } = await list({ token: getToken() })
    console.log("Blobs listed successfully:", blobs.length)

    const items: GridItem[] = []
    const seenTitles = new Set<string>()

    for (const blob of blobs) {
      if (blob.pathname.endsWith("-pixelated.png")) {
        const title = blob.pathname.replace("-pixelated.png", "")
        if (!seenTitles.has(title)) {
          seenTitles.add(title)
          const unpixelatedBlob = blobs.find((b) => b.pathname === `${title}-unpixelated.png`)
          if (unpixelatedBlob) {
            items.push({
              id: title,
              title: title.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
              alt: `${title} image`,
              pixelatedSrc: blob.url,
              unpixelatedSrc: unpixelatedBlob.url,
            })
          }
        }
      }
    }

    console.log("Grid items created:", items.length)
    return items.sort((a, b) => {
      if (a.title.toLowerCase().includes("lilies")) return -1
      if (b.title.toLowerCase().includes("lilies")) return 1
      if (a.title.toLowerCase().includes("butter")) return 1
      if (b.title.toLowerCase().includes("butter")) return -1
      return 0
    })
  } catch (error) {
    console.error("Error fetching grid items:", error)
    throw error
  }
}
