import { Nav } from "./components/nav"
import { GridItem } from "./components/GridItem"
import { getGridItems } from "./app/actions"

export default async function ImageGrid() {
  const { items, error } = await getGridItems()

  return (
    <div className="min-h-screen bg-[#E5E3DF]">
      <Nav />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <GridItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  )
}

