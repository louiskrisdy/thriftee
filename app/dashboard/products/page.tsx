import { db } from "@/server";
import placeholder from "@/public/placeholder_small.png";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { user } from "@/server/schema";
import { eq } from "drizzle-orm";

export default async function Products() {
    
    const session = await auth.api.getSession({
        headers: await headers()
    });

    let userRole = 'user';
    
    if(session?.user.email){
        const existingUser = await db.query.user.findFirst({
            where: eq(user.email, session?.user.email),
        });

        userRole = existingUser?.role ?? 'user';
    }

    if (userRole !== "admin") return redirect('/dashboard/settings');
    
    const products = await db.query.products.findMany({
        with: {
          tag: {
            with: {
              tag: true,
            },
          },
        },
        orderBy: (products, { asc }) => [asc(products.id)],
      });

    if (!products.length) {
        throw new Error("No products found");
    }

    const dataTable = products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        tags: product.tag,
        image: product.image ?? [],
    }));

    return (
        <div>
        <DataTable columns={columns} data={dataTable} />
        </div>
    );
}
