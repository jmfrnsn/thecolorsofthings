import { list } from "@vercel/blob"
import type { GridItem } from "@/app/types"
import { getEnv } from "./env"

// Define the Blob type based on Vercel Blob API
type BlobItem = {
  pathname: string
  url: string
  uploadedAt: string
}

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

    // First pass: collect all items except lilies and okensand
    for (const blob of blobs) {
      if (blob.pathname.endsWith("-pixelated.png")) {
        const title = blob.pathname.replace("-pixelated.png", "")
        if (!seenTitles.has(title) && !title.includes("lilies") && !title.includes("okensand")) {
          seenTitles.add(title)
          const unpixelatedBlob = blobs.find((b: BlobItem) => b.pathname === `${title}-unpixelated.png`)
          if (unpixelatedBlob) {
            items.push({
              id: title,
              title: title.replace(/-/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase()),
              alt: `${title} image`,
              pixelatedSrc: blob.url,
              unpixelatedSrc: unpixelatedBlob.url,
            })
          }
        }
      }
    }

    // Second pass: find lilies and okensand
    let liliesItem: GridItem | null = null
    let okensandIndex = -1

    for (const blob of blobs) {
      if (blob.pathname.endsWith("-pixelated.png")) {
        const title = blob.pathname.replace("-pixelated.png", "")
        if (!seenTitles.has(title)) {
          seenTitles.add(title)
          const unpixelatedBlob = blobs.find((b: BlobItem) => b.pathname === `${title}-unpixelated.png`)
          if (unpixelatedBlob) {
            const item = {
              id: title,
              title: title.replace(/-/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase()),
              alt: `${title} image`,
              pixelatedSrc: blob.url,
              unpixelatedSrc: unpixelatedBlob.url,
            }
            
            if (title.includes("lilies")) {
              liliesItem = item
            } else if (title.includes("okensand")) {
              okensandIndex = items.length
              items.push(item)
            }
          }
        }
      }
    }

    // Insert lilies where okensand would be
    if (liliesItem && okensandIndex !== -1) {
      items[okensandIndex] = liliesItem
    } else if (liliesItem) {
      // If okensand wasn't found, just append lilies
      items.push(liliesItem)
    }

    console.log("Grid items created:", items.length)
    return items
  } catch (error) {
    console.error("Error fetching grid items:", error)
    throw error
  }
}
