'use client'


import { useCartStore } from "@/lib/client-store"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";


export default function AddCart({ stock }: { stock: number }) {
    const { addToCart, cart, setCartOpen, setCheckoutProgress } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const params = useSearchParams();
    const productId = Number(params.get('id'));
    const title = params.get("title");
    const price = Number(params.get("price"));
    const image = params.get("image");

    if(!productId || !title || !price || !image) {
        toast.error("Product not found");
        return redirect("/");
    }

    const isInCart = cart.some(item => item.id === productId);

    useEffect(() => {
        if (isInCart) {
            setQuantity(cart.find(item => item.id === productId)?.quantity || 1);
        }
    }, [isInCart, cart, productId]);

    return(
        <>
            {!isInCart && (

                <div className="flex items-center gap-4 justify-stretch my-4">
                    <Button onClick={() => {
                        if(quantity > 1) {
                            setQuantity(quantity - 1);
                        }
                    }} variant={'secondary'} disabled={quantity === 1} className="text-primary">
                        <Minus size={18} strokeWidth={3} />
                    </Button>
                    <Button className="flex-1">
                        Quantity: {quantity}
                    </Button>
                    <Button onClick={() => {
                        if (quantity < stock) {
                            setQuantity(quantity + 1);
                        } else {
                            toast.warning(`Only ${stock} items in stock`);
                        }
                    }} variant={'secondary'} disabled={quantity >= stock} className="text-primary">
                        <Plus size={18} strokeWidth={3} />
                    </Button>
                </div>
            )}
            <Button 
                onClick={() => {
                    if (isInCart) {
                        setCheckoutProgress("cart-page");
                        setCartOpen(true); // Open the cart drawer if the product is in the cart
                    } else {
                        toast.success(`Added ${title} to your cart!`);
                        addToCart({
                            id: productId,
                            name: title,
                            price,
                            image,
                            quantity,
                            stock,
                        });
                    }
                }} 
                disabled={stock === 0} 
                className={
                    isInCart
                        ? "mt-3" // Custom class for "In Cart" state
                        : ""
                }
            >
                {stock === 0 ? "Out of Stock" : isInCart ? "In Cart" : "Add to cart"}
            </Button>
        </>
    )
}