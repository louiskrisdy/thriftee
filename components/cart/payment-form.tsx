'use client'

import { useCartStore } from "@/lib/client-store";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/create-order";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

export default function PaymentForm({ totalPrice }: {totalPrice: number}) {

    const router = useRouter();

    const stripe = useStripe();
    const elements = useElements();
    const {cart, setCheckoutProgress, clearCart, setCartOpen} = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<string>(''); // Default to 'credit-card'
    const [otherPayment, setOtherPayment] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (paymentMethod === 'other') {
            // Call the function when the payment method is 'other'
            handleOtherPaymentOption();
        }
    }, [paymentMethod]);

    const {execute} = useAction(createOrder, {
        onSuccess: (data) => {
            if(data.data?.error) {
                toast.error(data.data.error);
            }
            if(data.data?.success) {
                setIsLoading(false);
                toast.success(data.data.success);
                setCheckoutProgress("confirmation-page");
                clearCart();
            }
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if(!stripe || !elements) {
            setIsLoading(false);
            return;
        }

        const {error: submitError} = await elements.submit();
        if(submitError) {
            setErrorMessage(submitError.message!);
            setIsLoading(false);
            return;
        }

        const result  = await createPaymentIntent({
            amount: totalPrice * 100,
            currency: "idr",
            cart: cart.map((item) => ({
                quantity: item.quantity,
                productID: item.id,
                title: item.name,
                price: item.price,
                image: item.image
            })),
        })
        if(result?.data?.error) {
            console.log(result.data.error);
            toast.error(result.data.error);
            setErrorMessage(result.data.error);
            setIsLoading(false);
            return;
        }
        if(result?.data?.success) {
            const {error} = await stripe.confirmPayment({
                elements,
                clientSecret: result.data.success.clientSecretID!,
                redirect: "if_required",
                confirmParams: {
                    return_url: "http://localhost:3000/success",
                    receipt_email: result.data.success.user as string,
                }
            });
            if(error) {
                setErrorMessage(error.message!);
                setIsLoading(false);
                return;
            } else {
                setIsLoading(false);
                execute({
                    status: "pending",
                    paymentIntentID: result.data.success.paymentIntentID,
                    total: totalPrice,
                    products: cart.map((item) => ({
                        productID: item.id,
                        quantity: item.quantity
                    }))
                })
            }
        }
    }
    
    const handleOtherPaymentOption = async () => {
        // setOtherPayment(true);
        setCartOpen(false);
        try {
            const cartPayload = cart.map(item => ({
                key: item.id,
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity
              }));
              const response = await axios
              .post("/api/payment", cartPayload)
              .then((res) => {
                return res.data;
              })
              .catch((err) => {
                console.log(err);
              });
            //   if (typeof window.snap === 'undefined') {
            //     toast.error("Payment system is not ready. Please try again later.");
            //     return;
            //   }

              

            //   window.snap.pay(response.token);

            //   const res = await fetch(`/api/payment/?order_id=${response.orderId}`);
            //   const statusData = await res.json();
            //   console.log(statusData);

    
                // window.snap.embed(response, {embedId: 'snap-container'});

        } catch (err: any) {
          console.log("Payment error:", err);
          toast.error("Failed to initiate other payment.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Payment Options Dropdown */}
            <div className="my-4">
                <label htmlFor="payment-method" className="text-sm font-medium text-muted-foreground mb-2">Choose Payment Method</label>
                <select
                    id="payment-method"
                    value={paymentMethod}
                    onChange={(e) => {
                        setPaymentMethod(e.target.value);

                    }}
                    className="w-full border rounded-md p-2"
                >
                    <option value="">Select a Payment Method</option>
                    <option value="credit-card">Debit/Credit Card</option>
                    <option disabled value="other">Other Payment Options (Soon)</option>
                </select>
            </div>


            {paymentMethod === 'credit-card' && (

                <motion.div
                    className=""
                    animate={{ scale: 1, opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.5 }} exit={{ scale: 0 }}
                >
                    <PaymentElement />
                    <AddressElement options={{ mode: "shipping" }} />
                </motion.div>
            )}

            {paymentMethod === 'other' && (
                
                <motion.div
                    className=""
                    animate={{ scale: 1, opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.5 }} exit={{ scale: 0 }}
                >
                    {/* <div className="w-full mb-4" id="snap-container"></div> */}
                </motion.div>
            )}

            {/* <div
                className={`transition-all duration-500 ease-in-out ${
                    paymentMethod === 'other' ? 'opacity-100' : 'opacity-0 hidden'
                }`}
            >
                <div className="my-4 w-full">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Other Payment Options</h3>
                    <div className="flex gap-2">
                        <Button onClick={handleOtherPaymentOption} variant="outline">Other Payment Options</Button>
                        <div id="snap-container"></div>
                    </div>
                </div>
            </div> */}

            <Button
                className="my-4 w-full"
                disabled={!stripe || !elements || isLoading || paymentMethod === ""}
            >
                {isLoading ? "Processing..." : "Pay now"}
            </Button>
        </form>
    )

}