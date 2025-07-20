import { db } from "@/server";
import { products, productTags, tags } from "@/server/schema";
import { desc, eq } from "drizzle-orm";
import Products from "@/components/products/products";
import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tags";

export const revalidate = 60 * 60;

export default async function Home() {
  // const data = await db
  //   .select({
  //     id: products.id,
  //     title: products.title,
  //     price: products.price,
  //     image: products.image,
  //     description: products.description,
  //     tagName: tags.name,
  //   })
  //   .from(products)
  //   .leftJoin(productTags, eq(products.id, productTags.productId))
  //   .leftJoin(tags, eq(productTags.tagId, tags.id))
  //   .orderBy(desc(products.id));

  const data = await db.query.products.findMany({
    with: {
      tag: {
        with: {
          tag: true,
        },
      },
      // reviews: true,
    },
  });

  return (
    <main>
      <Algolia />
      <ProductTags />
      <Products products={data} />
    </main>
  );
}
