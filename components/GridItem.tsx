"use client"

import Image from "next/image"
import { useState } from "react"
import type { GridItem as GridItemType } from "../app/types"

export function GridItem({ pixelatedSrc, unpixelatedSrc, alt, title }: GridItemType) {
  const [isClicked, setIsClicked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageError = (src: string) => {
    console.error(`Failed to load image: ${src}`)
    setImageError(true)
  }

  return (
    <div
      className="relative aspect-square cursor-pointer bg-[#E5E3DF] ring-[0.5px] ring-[#C9C4BB] overflow-hidden"
      onClick={() => setIsClicked(!isClicked)}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative h-[75%] w-[75%] -mt-8">
          {" "}
          {/* Update: Changed -mt-12 to -mt-16 */}
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              Image not available
            </div>
          ) : (
            <>
              <Image
                src={pixelatedSrc || "/placeholder.svg"}
                alt={`Pixelated ${alt}`}
                fill
                className={`object-contain ${isClicked ? "opacity-0" : "opacity-100"}`}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority
                onError={() => handleImageError(pixelatedSrc)}
              />
              <Image
                src={unpixelatedSrc || "/placeholder.svg"}
                alt={alt}
                fill
                className={`object-contain ${isClicked ? "opacity-100" : "opacity-0"}`}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority
                onError={() => handleImageError(unpixelatedSrc)}
              />
            </>
          )}
        </div>
      </div>
      <div className={`absolute bottom-4 left-0 right-0 pb-2 px-8 ${isClicked ? "block" : "hidden"}`}>
        <h2
          className="text-center text-xs tracking-widest uppercase font-light text-[#BBB5AA]"
          style={{ fontFamily: "SimHei, sans-serif" }}
        >
          {title}
        </h2>
      </div>
    </div>
  )
}
