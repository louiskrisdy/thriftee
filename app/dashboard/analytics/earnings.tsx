'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TotalOrders } from "@/lib/infer-type"
import { cn } from "@/lib/utils"
import { router } from "better-auth/api"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { weeklyChart } from "./weekly-chart"
import { Bar, BarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { monthlyChart } from "./monthly-chart"
import formatPrice from "@/lib/format-price"

export default function Earnings({totalOrders}: {totalOrders: TotalOrders[]}) {
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const filter = searchParams.get("filter") || "week";


    const chartItems = totalOrders.map((order) => ({
            date: order.order.created!, 
            revenue: order.quantity*order.product.price,
        }));

    const activeChart = useMemo(() => {
        const weekly = weeklyChart(chartItems);
        if(filter === "week") {
            return weekly;
        }
        const monthly = monthlyChart(chartItems);
        if(filter === "month") {
            return monthly;
        }
    }, [filter]);

    const activeTotal = useMemo(() => {
        if(filter === "month") {
            return monthlyChart(chartItems).reduce((acc, items) => acc + items.revenue, 0);
        }
        return weeklyChart(chartItems).reduce((acc, items) => acc + items.revenue, 0);
    }, [filter])

    return(
        <Card className="flex-1 shrink-0 h-full">
            <CardHeader>
                <CardTitle>Your Revenue: {formatPrice(activeTotal)}</CardTitle>
                <CardDescription>Here are your recent earnings</CardDescription>
                <div className="flex items-center gap-2">
                    <Badge className={cn('cursor-pointer', filter === 'week' ? "bg-primary" : "bg-primary/25")} onClick={() => router.push("/dashboard/analytics/?filter=week", {
                        scroll: false,
                    }) }>This Week</Badge>
                    <Badge className={cn('cursor-pointer', filter === 'month' ? "bg-primary" : "bg-primary/25")} onClick={() => router.push("/dashboard/analytics/?filter=month", {
                        scroll: false,
                    }) }>This Month</Badge>
                </div>
                <CardContent className="h-96">
                    <ResponsiveContainer width={'100%'} height={'100%'}>
                        <BarChart data={activeChart}>
                            <Tooltip content={(props) => (
                                <div>
                                    {props.payload?.map((item) => {
                                        return (
                                            <div className="bg-emerald-400 bg-opacity-80 text-white py-2 px-4 rounded-md shadow-lg" key={item.payload.date}>
                                                <p>Revenue: {formatPrice(item.value as number)}</p>
                                                <p>Date: {item.payload.date}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            )} />
                            <Bar dataKey="revenue" className="fill-primary" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </CardHeader>
        </Card>
    )
}