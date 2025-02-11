import type { GridItem } from "@/app/types"
import { getGridItems as getBlobItems } from "@/utils/blob-storage"
import { getEnv } from "@/utils/env"

export async function getGridItems(): Promise<{ items: GridItem[]; error: string | null }> {
  try {
    if (!getEnv("BLOB_READ_WRITE_TOKEN")) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not set")
    }

    console.log("Fetching grid items")
    const items = await getBlobItems()
    console.log("Grid items fetched successfully:", items.length)
    return { items, error: null }
  } catch (error) {
    console.error("Error fetching items:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return { items: [], error: errorMessage }
  }
}
