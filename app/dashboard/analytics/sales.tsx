import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { TotalOrders } from "@/lib/infer-type";
import Image from "next/image";
import placeholderUser from '@/public/placeholder-user.jpg'
import formatPrice from "@/lib/format-price";


  export default function Sales({totalOrders}: {totalOrders: TotalOrders[]}) {
    const sliced = totalOrders.slice(0, 8)
    return(
        <Card className="flex-1 shrink-0 mb-2">
            <CardHeader>
                <CardTitle>New Sales</CardTitle>
                <CardDescription>Here are your recent sales</CardDescription>
            </CardHeader>
            <CardContent className="h-96 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* <TableHead>Order ID</TableHead> */}
                            <TableHead>Customer</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Image</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sliced.map(({order, product, quantity,}) => (
                            <TableRow className="font-medium" key={order.id}>
                                {/* <TableCell>{id}</TableCell> */}
                                <TableCell>
                                    {order.user.image && order.user.name ? (
                                        <div className="flex gap-2 w-32 items-center">
                                            <Image src={order.user.image} width={25} height={25} alt={order.user.name} className="rounded-full max-w-[25px] max-h-[25px]" />
                                            <p className="text-xs font-medium">{order.user.name}</p>

                                        </div>
                                    ) : (
                                         <div className="flex gap-2 w-32 items-center">
                                            <Image src={placeholderUser} width={25} height={25} alt='user not found' className="rounded-full" />
                                            <p className="text-xs font-medium">{order.user.name}</p>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>{product.title}</TableCell>
                                <TableCell>{formatPrice(product.price)}</TableCell>
                                <TableCell>{quantity}</TableCell>
                                <TableCell><Image src={product.image![0]} width={25} height={25} alt={product.title} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )

  }