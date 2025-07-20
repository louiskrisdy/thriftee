'use client'

import { ReviewsWithUser } from "@/lib/infer-type"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card } from "../ui/card"
import { formatDistance, subDays } from 'date-fns'
import Stars from "./stars"
import { Avatar, AvatarFallback } from "../ui/avatar"

export default function Review({ reviews }: { reviews: ReviewsWithUser[] }) {
    return(
        <motion.div className="mt-2 flex flex-col gap-4">
            {reviews.length === 0 && <p className="py-2 text-md font-medium">No reviews yet</p>}
            {reviews.map((review) => (
                <Card key={review.id} className="p-4">
                    <div className="flex gap-2 items-center">
                        {review.user.image ? (
                             <Image
                                className="rounded-full max-w-[32px] max-h-[32px]"
                                width={32}
                                height={32}
                                alt={review.user.name!}
                                src={review.user?.image!}
                            />
                        ) : (
                            <Avatar className="w-7 h-7"> 
                                <AvatarFallback className="bg-primary/25">
                                    <div className="font-bold">
                                    {review.user.name!.charAt(0).toUpperCase()}
                                    </div>
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div>
                            <p className="text-sm font-bold">{review.user.name}</p>
                            <div className="flex items-center gap-2">
                                <Stars rating={review.rating} />
                                <p className="text-xs text-bold text-muted-foreground">{formatDistance(subDays(review.created!, 0), new Date())} ago</p>
                            </div>
                        </div>
                    </div>
                    <p className="py-2 font-medium">{review.comment}</p>
                </Card>
            ))}
        </motion.div>
    )
}