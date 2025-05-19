'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { useSearchParams } from 'next/navigation'
import { reviewSchema } from '@/types/reviews-schema'
import { Textarea } from '../ui/textarea'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAction } from 'next-safe-action/hooks'
import { addReview } from '@/server/actions/add-review'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'


export default function ReviewsForm() {

    const params = useSearchParams();
    const productID = Number(params.get('id'));

    const [open, setOpen] = useState(false)
    
    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
            productID,
        }
    });

    useEffect(() => {
        if (!open) {
        form.reset()
        }
    }, [open])

    const {execute, status} = useAction(addReview, {
        onSuccess(data) {
            if(data.data?.error) {
                toast.error(data.data?.error);
            }
            if(data.data?.success) {
                toast.success("Review Added");
                form.reset();
            }
        }
    })

    function onSubmit(values: z.infer<typeof reviewSchema>) {
        console.log("Running onSubmit");
        execute({
            comment: values.comment,
            rating: values.rating,
            productID
        })
    }

    return(
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger  asChild>
                <div className="w-full">
                    <Button className='font-medium w-full' variant={ "secondary" }>Leave a review</Button>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name='comment' render={({field}) => (
                            <FormItem>
                                <FormLabel>Leave your review</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder='How would you describe this product?' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                        </FormField>
                        <FormField control={form.control} name='comment' render={({field}) => (
                            <FormItem>
                                <FormLabel>Leave your Rating</FormLabel>
                                <FormControl>
                                    <Input {...field} type='hidden' placeholder='Star Rating' />
                                </FormControl>
                                <div className='flex'>
                                    {[1,2,3,4,5].map((value) => {
                                        return(
                                            <motion.div className="relative cursor-pointer" 
                                            whileTap={{ scale:0.8 }} 
                                            whileHover={{ scale: 1.2 }}
                                            key={value}
                                            >
                                               <Star key={value} onClick={() => {
                                                form.setValue("rating", value, {shouldValidate: true})
                                               }} className={cn("text-primary bg-transparent transition-all duration-300 ease-in-out", form.getValues("rating") >= value ? "fill-primary" : "fill-muted")} />
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </FormItem>
                        )}>
                        </FormField>
                        <Button disabled={status === 'executing'} className='w-full' type='submit'>
                            {status === 'executing' ? "Adding Review..." : "Add Review"}
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )

}