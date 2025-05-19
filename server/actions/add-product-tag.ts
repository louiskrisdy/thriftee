'use server'

import { algoliasearch } from "algoliasearch"
import { db } from ".."
import { products, productTags, tags } from "../schema"
import { eq } from "drizzle-orm"

export async function addProductTag({
  productId,
  tagId,
}: {
  productId: number
  tagId: number
}): Promise<{ success?: string; error?: string }> {

    const client = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_ID!,
        process.env.ALGOLIA_ADMIN!
    );
    
  try {
    // Check if the product already has a tag
    const existing = await db.query.productTags.findFirst({
      where: eq(productTags.productId, productId),
    })

    if (existing) {
      // Update the tagId for the existing product
      await db
        .update(productTags)
        .set({ tagId })
        .where(eq(productTags.productId, productId));

        const productTagsOnly = await db
        .select({
            tagName: tags.name,
        })
        .from(productTags)
        .innerJoin(tags, eq(productTags.tagId, tags.id))
        .where(eq(productTags.productId, productId));

        if(productTagsOnly) {
            console.log(productId.toString());
            client.partialUpdateObject({
                indexName: "products",
                objectID: productId.toString(),
                attributesToUpdate: {
                    tag: productTagsOnly[0].tagName
                }
            });
        }

      return {
        success: `Updated tag for Product ${productId} to Tag ${tagId}`,
      }
    }

    // Insert if no existing tag found
    await db.insert(productTags).values({ productId, tagId });
    const productWithTags = await db
    .select({
        id: products.id,
        title: products.title,
        price: products.price,
        stock: products.stock,
        image: products.image,
        tagName: tags.name,
    })
    .from(products)
    .innerJoin(productTags, eq(products.id, productTags.productId))
    .innerJoin(tags, eq(productTags.tagId, tags.id))
    .where(eq(products.id, productId));
    if(productWithTags) {
        client.saveObject({
            indexName: "products",
            body: {
                objectID: productId,
                id: productId,
                title: productWithTags[0].title,
                price: productWithTags[0].price,
                stock: productWithTags[0].stock,
                images: productWithTags[0].image,
                tag: productWithTags[0].tagName
            }
        });
    }

    return {
      success: `Added Tag ${tagId} to Product ${productId}`,
    }
  } catch (error) {
    console.error(error)
    return { error: "Failed to add or update tag" }
  }
}
