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
    const uploadDates = new Map<string, Date>()

    for (const blob of blobs) {
      if (blob.pathname.endsWith("-pixelated.png")) {
        const title = blob.pathname.replace("-pixelated.png", "")
        if (!seenTitles.has(title)) {
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
            const pixelatedDate = new Date(blob.uploadedAt)
            const unpixelatedDate = new Date(unpixelatedBlob.uploadedAt)
            uploadDates.set(title, new Date(Math.max(pixelatedDate.getTime(), unpixelatedDate.getTime())))
          }
        }
      }
    }

    console.log("Grid items created:", items.length)
    return items.sort((a, b) => {
      const dateA = uploadDates.get(a.id) || new Date(0)
      const dateB = uploadDates.get(b.id) || new Date(0)
      return dateB.getTime() - dateA.getTime()
    })
  } catch (error) {
    console.error("Error fetching grid items:", error)
    throw error
  }
}
