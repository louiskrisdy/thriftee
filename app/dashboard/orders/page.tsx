import { auth } from "@/lib/auth";
import { db } from "@/server";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistance, subMinutes } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";
import Link from "next/link";
import formatPrice from "@/lib/format-price";

export default async function Page(){
    const session = await auth.api.getSession({
        headers: await headers()
      });

      if(!session?.user) {
        redirect("/auth/login");
      }

      const userOrders = await db.query.orders.findMany({
        where: eq(orders.userID, session.user.id),
        with: {
            orderProduct: {
                with: {
                    product: true,
                    order: true,
                }
            }
        }
      })

    return(
       <div>
        <Card>
        <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>Check the status of your orders</CardDescription>
        </CardHeader>
        <CardContent>
         <Table>
            <TableCaption>A list of your recent orders.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userOrders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>
                            <Badge className={order.status === "succeeded" ? "bg-green-700 hover:bg-green-800" : "bg-yellow-700 hover:bg:yellow-800"}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                            {formatDistance(subMinutes(order.created!, 0), new Date(), {
                            addSuffix: true,
                        })}
                        </TableCell>
                        <TableCell>
                            <Dialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant={"ghost"}>
                                            <MoreHorizontal size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <DialogTrigger asChild>
                                                <Button className="w-full" variant={"ghost"}>
                                                    View Details
                                                </Button>
                                            </DialogTrigger>
                                        </DropdownMenuItem>
                                        {order.receiptURL ? (
                                            <DropdownMenuItem>
                                                    <Button asChild className="w-full" variant={"ghost"}>
                                                        <Link href={order.receiptURL} target="_blank">
                                                            Download Receipt
                                                        </Link>
                                                    </Button>
                                            </DropdownMenuItem>
                                        ) : null}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DialogContent className="rounded-md">
                                    <DialogHeader>
                                        <DialogTitle>Order Details #{order.id}</DialogTitle>
                                        <DialogDescription>
                                            Your order total is {formatPrice(order.total)}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Card className="overflow-auto p-2 flex flex-col gap-4">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                <TableHead>Image</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {order.orderProduct.map(({product, quantity}) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>
                                                            <Image src={product.image![0]} width={48} height={48} alt={product.title} />
                                                        </TableCell>
                                                        <TableCell>{formatPrice(product.price)}</TableCell>
                                                        <TableCell>{product.title}</TableCell>
                                                        <TableCell>{quantity}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>

        </CardContent>
        </Card>
       </div> 
    )
}