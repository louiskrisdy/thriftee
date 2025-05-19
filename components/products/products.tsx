'use client'

import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import formatPrice from "@/lib/format-price"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductWithTag, TagsWithProducts } from "@/lib/infer-type"
import { ArrowUp, BadgeCheck } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

type ProductTypes = {
    products: ProductWithTag[]
}

export default function Products({products}: ProductTypes) {
    
    const params = useSearchParams();
    const paramTag = params.get("tag");

    const filtered = useMemo(() => {
        if(paramTag) {
            return products.filter((item) => (item.tag.tag.name).toLowerCase() === paramTag);
        }
        return products;
    }, [paramTag, products]);


    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setShowButton(window.scrollY > 300);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return(


        <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3 mb-3">
        {filtered
            .filter((product) => product.stock! > 0)
            .map((product) => (
                <Link
                    className="py-2"
                    key={product.id}
                    href={`/products/${product.id}?id=${product.id}&price=${product.price}&title=${product.title}&image=${product.image![0]}`}
                >
                    <Image
                    className="rounded-md pb-2"
                    src={product.image![0]}
                    width={720}
                    height={480}
                    alt={product.title}
                    loading="lazy"
                    />
                    <div className="flex justify-between">
                        <div className="font-medium">
                            <div className="flex flex-wrap items-center gap-x-1">
                                {(() => {
                                    const words = product.title.trim().split(" ");
                                    const lastWord = words.pop();

                                    return (
                                    <>
                                        <span>{words.join(" ")}</span>
                                        <span className="flex items-center gap-1">
                                        {lastWord}
                                        {product.verified && (
                                            <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                <BadgeCheck className="text-emerald-500 dark:text-emerald-300 w-4 h-4" />
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                <p className="text-emerald-500 dark:text-emerald-300">Authenticity Verified</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        </span>
                                    </>
                                    );
                                })()}
                            </div>
                            <p className="text-sm text-muted-foreground">
                            {product.tag.tag.name}
                            </p>
                        </div>
                        <div>
                            <Badge className="text-sm" variant="secondary">
                            {formatPrice(product.price)}
                            </Badge>
                        </div>
                    </div>
                </Link>
            ))}
            {showButton && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-[4rem] right-5 z-50 p-3 rounded-full bg-primary text-secondary shadow-lg hover:bg-primary/80 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          )}
        </main>

    )
}