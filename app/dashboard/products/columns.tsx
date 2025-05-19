"use client"

import { ColumnDef, Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { deleteProduct } from "@/server/actions/delete-product"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { TagsWithProducts } from "@/lib/infer-type"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ProductTag from "./product-tag"
import { useState } from "react"
import { useRouter } from "next/navigation"
import formatPrice from "@/lib/format-price"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type ProductColumn = {
    title: string,
    price: number,
    image: string[],
    tags: {productId: number;
        tagId: number;
        tag: {
            id: number;
            name: string;
        }},
    id: number
}

const ActionCell = ({row}: {row: Row<ProductColumn>}) => {
    const {execute, status} = useAction(deleteProduct, {
        onSuccess: (data) => {
            toast.dismiss();
            if(data.data?.success){
                toast.success(data.data?.success)
            }
            if(data.data?.error){
                toast.error(data.data?.error)
            }
        },
        onExecute: () => {
            toast.loading("Deleting product")
        }
    })

    const [open, setOpen] = useState(false);

    const product = row.original;
    return(
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/add-product?id=${product.id}`}
                  className="w-full dark:focus:bg-secondary focus:bg-primary/50 cursor-pointer"
                >
                  Edit Product
                </Link>
              </DropdownMenuItem>
    
              {/* Use AlertDialogTrigger inside DropdownMenuItem */}
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem className="dark:focus:bg-destructive focus:bg-destructive/50 text-destructive cursor-pointer">
                  Delete Product
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
    
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => execute({ id: product.id })}
                className="bg-destructive hover:bg-destructive/90 text-primary"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "tags",
        header: "Tags",
        cell: ({row}) => {
            
            const tags = row.getValue("tags") as { tag: { id: number; name: string }; productId: number };
        //    console.log(tags);
            const router = useRouter();
            const handleTagUpdate = () => {
                router.refresh(); // Trigger re-render
              };
            return(
                <div className="flex gap-1">
                    {
                        tags ? (
                            <ProductTag
                            editMode={true}
                            productId={tags.productId}
                            tagName={tags.tag.name}
                            onSuccess={handleTagUpdate}
                            >
                            <Badge variant="default">
                                {tags.tag.name}
                            </Badge>
                            </ProductTag>
                        ) : (
                            // <Badge variant="outline">None</Badge>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ProductTag editMode={false} productId={row.original.id} tagName="" onSuccess={handleTagUpdate}>
                                            <span className="text-primary">
                                                <PlusCircle className="h-4 w-4" />
                                            </span>
                                        </ProductTag>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Create a new tag</p>
                                    </TooltipContent>
                                </Tooltip>
                         </TooltipProvider>
                        )
                    }
                    {/* <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ProductTag editMode={false} productId={row.original.id} tagName="" onSuccess={handleTagUpdate}>
                                    <span className="text-primary">
                                        <PlusCircle className="h-4 w-4" />
                                    </span>
                                </ProductTag>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create a new tag</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider> */}
                </div>
            )
        }
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({row}) => {
            const price = parseFloat(row.getValue('price'));
            const formatted = formatPrice(price);
            return(<div className="font-medium text-xs">{formatted}</div>)
        }
    },
    {
        accessorKey: "stock",
        header: "Stock Quantity",
        cell: ({row}) => {
            const stock = parseFloat(row.getValue('stock'));
            return(<div className="font-medium text-xs">{stock}</div>);
        }
    },
    {
        accessorKey: "image",
        header: "Images",
        cell: ({ row }) => {
          const images = row.getValue("image") as string[];
          const cellTitle = row.getValue("title") as string;
      
          return (
            <div className="flex gap-2">
              {images.length > 0 ? (
                images.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="relative">
                    <Image
                      src={img}
                      alt={`${cellTitle} - Image ${idx + 1}`}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </div>
                ))
              ) : (
                <div>No images</div>
              )}
              {images.length > 3 && (
                <div className="text-xs text-gray-500">+{images.length - 3} more</div>
              )}
            </div>
          );
        },
    },
      
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ActionCell,
    }
]
