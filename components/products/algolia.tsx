'use client'

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { SearchBox, Hits } from 'react-instantsearch';
import { searchClient } from '@/lib/algolia-client';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '../ui/card';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import formatPrice from '@/lib/format-price';

export default function Algolia() {

    const [active, setActive]= useState(false);

    const MC = useMemo(() => motion(Card), []);

    return(
        <InstantSearchNext future={{ persistHierarchicalRootCount: true, preserveSharedStateOnUnmount: true, }} indexName='products' searchClient={searchClient}>
            <div className='relative'>
                <SearchBox onFocus={() => setActive(true)} onBlur={() => setTimeout(() => {
                    setActive(false)
                }, 100)} classNames={{ 
                    input: "flex h-full w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    submitIcon: "hidden",
                    form: "relative h-10 mb-4",
                    resetIcon: "hidden",
                 }} />
                 <AnimatePresence>
                    {active && (
                        <MC animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.8 }} exit={{ opacity: 0, scale: 0.8 }} className='absolute w-full z-50 overflow-y-scroll h-96'>
                            <div className='rounded-md'><Hits hitComponent={Hit} /></div>
                        </MC>
                    )}
                 </AnimatePresence>
            </div>
        </InstantSearchNext>
    )

}

function Hit({hit}: {hit: {
    objectID: string,
    id: string,
    price: number,
    title: string,
    // productType: string,
    images: string,
    _highlightResult: {
    title: {
        value: string,
        matchLevel: string,
        fullyHighlighted: boolean,
        matchedWords: string[],
    },
    // productType: {
    //     value: string,
    //     matchLevel: string,
    //     fullyHighlighted: boolean,
    //     matchedWords: string[],
    // }
}}}) {

    // console.log(hit.images);
    return (
        <div className='p-4 mb-2 hover:bg-secondary'>
            <Link href={`/products/${hit.objectID}?id=${hit.id}&price=${hit.price}&title=${hit.title}&image=${hit.images[0]}`} >
                <div className='flex w-full gap-12 items-center justify-between'>
                    <Image src={hit.images[0]} alt={hit.title} width={60} height={60} />
                    <p dangerouslySetInnerHTML={{ __html: hit._highlightResult.title.value }}></p>
                    <p className='font-medium'>{formatPrice(hit.price)}</p>
                </div>
            </Link>
        </div>
    )
}