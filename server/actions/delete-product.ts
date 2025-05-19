'use server'

import { createSafeActionClient } from "next-safe-action"
import { z } from "zod";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const actionClient = createSafeActionClient();

export const deleteProduct = actionClient.schema(z.object({id: z.number()})).action(async ({parsedInput}) => {
    const client = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_ID!,
        process.env.ALGOLIA_ADMIN!
    );
    try {
        if(parsedInput.id){
            client.deleteObject({
                indexName: "products",
                objectID: parsedInput.id.toString()
            })
            const data = await db
                .delete(products)
                .where(eq(products.id, parsedInput.id))
                .returning();

            revalidatePath('/dashboard/products')
            return {success: `Product ${data[0].title} has been deleted`}
        }
    } catch (err) {
        return {error: "Failed to delete product"}
    }
})