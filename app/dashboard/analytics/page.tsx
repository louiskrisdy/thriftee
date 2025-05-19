import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { db } from "@/server";
import { orderProduct, orders, user } from "@/server/schema";
import { desc, eq } from "drizzle-orm";
import Sales from "./sales";
import Earnings from "./earnings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Analytics(){

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

    const totalOrders = await db.query.orderProduct.findMany({
        orderBy: [desc(orderProduct.id)],
        limit: 10,
        with: {
            order: { with: { user: true } },
            product: true,
        }
    })


    if(totalOrders.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Orders</CardTitle>
                </CardHeader>
            </Card>
        );
    }


    if(totalOrders) {

        return(
           <Card>
                <CardHeader>
                    <CardTitle>Your Analytics</CardTitle>
                    <CardDescription>
                        Check your sales, new customers and more
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Sales totalOrders={totalOrders} />
                    <Earnings totalOrders={totalOrders} />
                </CardContent>
           </Card>
        )
    }

}