"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export default function CarGallery({ images }: { images: Array<{ url: string; alt?: string }> }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [images])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(images.length - 1, i + 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length])

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-72 bg-slate-100 flex items-center justify-center rounded-lg"> 
        <div className="text-slate-500">No images available</div>
      </div>
    )
  }

  return (
    <div>
      <div className="relative w-full rounded-lg overflow-hidden bg-slate-50 h-72 sm:h-96">
        {/* Main image */}
        <Image src={images[index].url} alt={images[index].alt || 'vehicle image'} fill style={{ objectFit: 'cover' }} />

        {/* Prev/Next controls */}
        {images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
            >
              ‹
            </button>
            <button
              aria-label="Next image"
              onClick={() => setIndex((i) => Math.min(images.length - 1, i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative rounded-md overflow-hidden border ${i === index ? 'ring-2 ring-sky-500' : 'border-slate-200'} flex-shrink-0 w-20 h-12`}
            >
              <Image src={img.url} alt={img.alt || `thumb-${i}`} fill style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
