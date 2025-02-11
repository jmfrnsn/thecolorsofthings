import { getGridItems } from "./actions"
import { GridItem } from "@/components/GridItem"
import { Nav } from "@/components/nav"

export const revalidate = 0 // This will revalidate the page on every request

export default async function Home() {
  const { items, error } = await getGridItems()

  return (
    <div className="min-h-screen bg-[#E5E3DF]">
      <Nav />
      <main>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
            {items.map((item) => (
              <GridItem key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">No images found in Blob storage.</p>
        )}
      </main>
    </div>
  )
}
