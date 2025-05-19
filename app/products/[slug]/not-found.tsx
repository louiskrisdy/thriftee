'use client'

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import Link from "next/link";
import noProductFound from "@/public/no-product-found.json";


const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


export const NotFound = () => {

    return(
        <main className="flex flex-col items-center justify-center h-[70vh] text-center">
                <Lottie className="h-60" animationData={noProductFound} />
                <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
                <Link href="/" passHref replace>
                <Button asChild>
                    <span>Go to Homepage</span>
                </Button>
                </Link>
            </main>
    );

}

export default NotFound;