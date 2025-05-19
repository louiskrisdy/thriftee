'use server'

import { auth } from "@/lib/auth";
import { reviewSchema } from "@/types/reviews-schema";
import { createSafeActionClient } from "next-safe-action"
import { headers } from "next/headers";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews, orderProduct, orders } from "../schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const addReview = action.schema(reviewSchema).action(async ({ parsedInput: { productID, rating, comment } }) =>  {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
          });
        if(!session) {
            return { error: "Please sign in" }
        }
        const reviewExists = await db.query.reviews.findFirst({
            where: and(eq(reviews.productID, productID), eq(reviews.userID, session.user.id))
        });
        if(reviewExists) {
            return { error: "You have already reviewed this product" }
        }


        const purchase = await db
        .select()
        .from(orderProduct)
        .innerJoin(orders, eq(orderProduct.orderID, orders.id))
        .where(
          and(
            eq(orderProduct.productID, productID),
            eq(orders.userID, session.user.id),
            eq(orders.status, "succeeded")
          )
        )
        .limit(1);

        if (!purchase || purchase.length === 0) {
            return { error: "You can only review products you have purchased" };
        }

        const newReview = await db
            .insert(reviews)
            .values({productID, rating, comment, userID: session.user.id})
            .returning();

        revalidatePath(`/products/${productID}`);
        return { success: newReview[0] }
    } catch(err) {
        return { error: JSON.stringify(err) }
    }
})