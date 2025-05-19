import DashboardNav from "@/components/navigation/dashboard-nav";
import { auth } from "@/lib/auth";
import { db } from "@/server";
import { user } from "@/server/schema";
import { eq } from "drizzle-orm";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react"
import { headers } from "next/headers";
import { usePathname } from "next/navigation";

export default async function DashboardLayout({children}: {children: React.ReactNode}){
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    const userLinks = [
        {
            label: 'Orders',
            path: '/dashboard/orders',
            icon: <Truck size={16} />
        },
        {
            label: 'Settings',
            path: '/dashboard/settings',
            icon: <Settings size={16} />
        },
    ] as const

    let userRole = 'user';

    if(session?.user.email){
        const existingUser = await db.query.user.findFirst({
            where: eq(user.email, session?.user.email),
        });

        userRole = existingUser?.role ?? 'user';
    }

    const adminLinks = userRole === "admin" ? [
        {
            label: 'Analytics',
            path: '/dashboard/analytics',
            icon: <BarChart size={16} />
        },
        {
            label: 'Create',
            path: '/dashboard/add-product',
            icon: <PenSquare size={16} />
        },
        {
            label: 'Products',
            path: '/dashboard/products',
            icon: <Package size={16} />
        },
    ] : []

    const allLinks = [...adminLinks, ...userLinks]
    
    return(
        <div>
            <DashboardNav allLinks={allLinks}  />
            {children}
        </div>
    )
}