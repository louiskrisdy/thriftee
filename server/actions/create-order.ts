'use server'

import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/types/order-schema";
import { createSafeActionClient } from "next-safe-action"
import { headers } from "next/headers";
import { orderProduct, orders, products as productsTable } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { algoliasearch } from "algoliasearch";


const action = createSafeActionClient();

export const createOrder = action.schema(createOrderSchema).action(async ({ parsedInput: { products, status, total, paymentIntentID } }) => {
    const session = await auth.api.getSession({
        headers: await headers()
      });
    if(!session?.user) {
        return { error: "user not found" };
    }

    const client = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_ID!,
        process.env.ALGOLIA_ADMIN!
    );

    const order = await db.insert(orders).values({
        status,
        paymentIntentID,
        total,
        userID: session.user.id
    })
    .returning();
    const orderProducts = products.map(async({productID, quantity}) => {
        const newOrderProduct = await db.insert(orderProduct).values({
            quantity,
            orderID: order[0].id,
            productID: productID
        });

        const [product] = await db
                            .select({ stock: productsTable.stock })
                            .from(productsTable)
                            .where(eq(productsTable.id, productID));
        if (!product) {
            return { error: `Product ID ${productID} not found` };
        }
        const updatedStock = product.stock! - quantity;
        if(updatedStock < 0) {
            return { error: `Insufficient stock for product ID ${productID}` }; 
        }
        await db
            .update(productsTable)
            .set({ stock: updatedStock })
            .where(eq(productsTable.id, productID));
        client.partialUpdateObject({
            indexName: "products",
            objectID: productID.toString(),
            attributesToUpdate: {
                stock: updatedStock,
            }
        });
    })
    return { success: 'Order has been added' };
})