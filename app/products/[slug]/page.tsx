import AddCart from "@/components/cart/add-cart";
import ProductShowcase from "@/components/products/product-showcase";
import Reviews from "@/components/reviews/reviews";
import Stars from "@/components/reviews/stars";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import { getReviewAverage } from "@/lib/review-average";
import { db } from "@/server";
import { products, productTags, tags } from "@/server/schema";
import { desc, eq } from "drizzle-orm";
import {NotFound} from "./not-found";

export const revalidate = 60;

export async function generateStaticParams() {
    const data = await db
    .select({
      id: products.id,
      title: products.title,
      price: products.price,
      image: products.image,
      description: products.description,
      tagName: tags.name,
    })
    .from(products)
    .leftJoin(productTags, eq(products.id, productTags.productId))
    .leftJoin(tags, eq(productTags.tagId, tags.id))
    .orderBy(desc(products.id));

    if(data) {
        const slugID = data.map((product) => ({ slug: product.id.toString() }));
        return slugID;
    }
}

export default async function Page({params}: { params: { slug: string } }) {
    
    const { slug } = await params; 
    const product = await db.query.products.findFirst({
        where: eq(products.id, Number(slug)),
        with: {
          tag: {
            with: {
              tag: true,
            },
          },
          reviews: true,
        },
    });
    
    if(product) {
        const reviewAvg = getReviewAverage(product.reviews.map((r) => r.rating))
        return(
            <main>
            <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
                <div className="flex-1">
                    <ProductShowcase product={product} />
                </div>
                <div className="flex flex-col flex-1">
                    <h2 className="text-2xl font-bold">{product.title}</h2>
                    <div className="text-secondary-foreground font-medium">
                        {product.tag.tag.name ?? "No tag"}
                    </div>
                    <div>
                        <Stars rating={reviewAvg} totalReviews={product.reviews.length} />
                    </div>
                    <Separator className="my-2" />
                    <p className="text-2xl font-medium py-2">
                        {formatPrice(product.price)}
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: product.description }}>
                    </div>
                    <AddCart stock={product.stock!} />
                </div>
            </section>
            <Reviews productID={product.id} />
            </main>  
        );
    }
    else {
        return (
            <NotFound />
        )
    }
}