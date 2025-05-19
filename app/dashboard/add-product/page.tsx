import { auth } from "@/lib/auth";
import { db } from "@/server";
import { user } from "@/server/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import ProductForm from "./product-form";

export default async function AddProduct(){
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

    // Check if the user is admin or not
    // If not admin, user cannot check this page
    if (userRole !== "admin") return redirect('/dashboard/settings');

    return(
       <ProductForm />
    )
}