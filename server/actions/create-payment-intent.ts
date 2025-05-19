'use server'


import { auth } from '@/lib/auth';
import { paymentIntentSchema } from '@/types/payment-intent-schema';
import { createSafeActionClient } from 'next-safe-action';
import { headers } from 'next/headers';
import Stripe from 'stripe'


const stripe = new Stripe(process.env.STRIPE_SECRET!);
const action = createSafeActionClient();

export const createPaymentIntent = action.schema(paymentIntentSchema).action(async ({ parsedInput: {amount, cart, currency} }) => {
    const session = await auth.api.getSession({
        headers: await headers()
      });
    if(!session?.user) {
        return {error: 'Please login to continue'};
    }
    if(!amount) {
        return {error: 'No Product to checkout'};
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
            enabled: true
        },
        metadata: {
            cart: JSON.stringify(cart)
        }
    })
    return {
        success: {
            paymentIntentID: paymentIntent.id,
            clientSecretID: paymentIntent.client_secret,
            user: session.user.email,
        }
    }
})