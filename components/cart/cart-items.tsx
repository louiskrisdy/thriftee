'use client'

import { useMemo } from "react";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "../ui/table"
import { useCartStore } from "@/lib/client-store";
import formatPrice from "@/lib/format-price";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
// import Lottie from 'lottie-react';
import emptyCart from '@/public/empty-box.json'
import { createId } from "@paralleldrive/cuid2";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function CartItems() {
    
    const {cart, addToCart, removeFromCart, setCheckoutProgress} = useCartStore();

    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => {
            return acc + item.price! * item.quantity
        }, 0)
    }, [cart]);

    const priceInLetters = useMemo(() => {
        const idrPrice = formatPrice(totalPrice);
        const numericPart = idrPrice.replace(/[^\d,\.]/g, '');
        return [...numericPart].map((letter) => {
          return { letter, id: createId() };
        });
    }, [totalPrice]);

    return(
        <motion.div className="flex flex-col items-center">
            {cart.length === 0 && (
                <div className="flex flex-col w-full items-center justify-center">
                    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                        <h2 className="text-center text-2xl text-muted-foreground">Your cart is empty</h2>
                        <Lottie className="h-60" animationData={emptyCart} />
                    </motion.div>

                </div>
            )}
            {cart.length > 0 && (
                <div className="max-h-80 w-full overflow-y-auto">
                    <Table className="max-w-2xl mx-auto">
                        <TableHeader>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{formatPrice(item.price)}</TableCell>
                                    <TableCell>
                                        <div>
                                            <Image className="rounded-md" width={48} height={48} src={item.image} alt={item.name} priority />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-between">
                                            <MinusCircle className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors" onClick={() => {
                                                removeFromCart({
                                                    ...item
                                                })
                                            }} size={14} />
                                            <p className="text-md font-bold">{item.quantity}</p>
                                            <PlusCircle className={`cursor-pointer transition-colors duration-300 
                                            ${ item.quantity >= item.stock ? "cursor-not-allowed opacity-20" : "hover:text-muted-foreground" }`}
                                            onClick={() => {
                                                if(item.quantity < item.stock) {

                                                    addToCart({
                                                        ...item,
                                                        quantity: 1
                                                    });
                                                    
                                                }
                                            }} size={14} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            <motion.div className="flex items-center justify-center relative overflow-hidden my-4">
                <span className="text-md mr-1">Total: Rp</span>
                <AnimatePresence mode="popLayout">
                    {priceInLetters.map((letter, i) => (
                        <motion.div key={letter.id}>
                            <motion.span initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} transition={{ delay: i * 0.1 }} className="text-md inline-block">
                                {letter.letter}
                            </motion.span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            <Button onClick={() => {
                setCheckoutProgress("payment-page");
            }} className="max-w-md w-full" disabled={cart.length === 0}>
                Checkout
            </Button>
        </motion.div>
    )
}