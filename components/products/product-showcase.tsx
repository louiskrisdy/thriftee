"use client"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function ProductShowcase({
  product,
}: {
  product: any
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeThumbnail, setActiveThumbnail] = useState([0])

  const updatePreview = (index: number) => {
    api?.scrollTo(index)
  }

  useEffect(() => {
    if (!api) {
      return
    }

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView())
    })
  }, [api])

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {product.image.map(
          (img: any) => {
            return (
                <CarouselItem key={img}>
                  {img ? (
                    <Image
                      priority
                      className="rounded-md"
                      width={1280}
                      height={720}
                      src={img}
                      alt={img}
                    />
                  ) : null}
                </CarouselItem>
              )
          }
         )}
      </CarouselContent>
      <div className="flex overflow-clip py-2 gap-4">
        {product.image.map(
          (img:any, index:any) => {
            return (
                <div key={img}>
                  {img ? (
                    <Image
                      onClick={() => updatePreview(index)}
                      priority
                      className={cn(
                        index === activeThumbnail[0]
                          ? "opacity-100"
                          : "opacity-75",
                        "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                      )}
                      width={72}
                      height={48}
                      src={img}
                      alt={img}
                    />
                  ) : null}
                </div>
              )
          }
        
        )}
      </div>
    </Carousel>
  )
}