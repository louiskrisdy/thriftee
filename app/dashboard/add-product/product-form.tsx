"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { ProductSchema, zProductSchema } from "@/types/product-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { useRouter, useSearchParams } from "next/navigation";
import {toast} from 'sonner'
import { getProduct } from "@/server/actions/get-product";
import { useEffect, useState } from "react";
import { UploadDropzone } from "@/app/api/uploadthing/upload";

export default function ProductForm(){
    const form = useForm<zProductSchema>({
        resolver: zodResolver(ProductSchema),
        defaultValues:{
            title: "",
            description: "",
            price: 0,
            stock: 0,
            upc: "",
            image:[],
        },
        mode: "onChange"
    });

    const { control, setValue, setError, handleSubmit, formState, watch } = form;
    const [existingImg, setImages] = useState<string[]>([]);
    const [isImageChanged, setImageChanged] = useState(false);
    function arraysEqual(a: string[], b: string[]) {
        if (a.length !== b.length) return false;
        return a.every((val, idx) => val === b[idx]);
    }
      

    const router = useRouter();
    const searchParams = useSearchParams();
    const editMode = searchParams.get('id');
    

    const checkProduct = async (id: number) => {
        if(editMode){
            const data = await getProduct(id)
            if(data.error){
                toast.error(data.error)
                router.push("/dashboard/products")
                return
            }
            if(data.success){
                const id = parseInt(editMode);
                form.setValue("title", data.success.title);
                form.setValue("description", data.success.description);
                form.setValue("price", data.success.price);
                form.setValue("stock", data.success.stock || 0);
                if(data.success.upc){
                    form.setValue("upc", data.success.upc);
                }
                form.setValue("id", id);
            }
            const existingImages =
            typeof data.success?.image === "string"
              ? [data.success.image]
              : Array.isArray(data.success?.image)
              ? data.success.image
              : [];
        
            form.setValue("image", existingImages);
            setImages(existingImages);
        }
    }

    useEffect(() => {
        if(editMode){
            checkProduct(parseInt(editMode))
        }
    }, [])

  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
        toast.dismiss()

        if (data.data?.error) {
            toast.error(data.data?.error);
            }
        if (data.data?.success) {
            router.push("/dashboard/products");
            toast.success(data.data?.success)
        }
      
    },
    onExecute: () =>{
        toast.loading(editMode ? 'Updating Product Details' : 'Creating Product')
    },
  });

  async function onSubmit(values: zProductSchema) {
    execute(values);
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{editMode ? 'Edit Product' : 'Create Product'}</CardTitle>
        <CardDescription>{editMode ? 'Make changes to existing product': 'Add a brand new product'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Denim Jacket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-6">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Product Price</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-2">
                        <p>Rp</p>
                        <Input
                            type="number"
                            placeholder="Your price in Rupiah"
                            {...field}
                            step="0.1"
                            min={0}
                        />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                        <div className="flex items-center">
                        <Input
                            type="number"
                            placeholder="Your stock quantity"
                            {...field}
                            step="1"
                            min={0}
                        />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="upc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Code (UPC)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter UPC code e.g. 196154981606"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <UploadDropzone
                      appearance={{ 
                        button: "bg-primary/75 ut-readying:bg-secondary px-2",
                     }}
                      endpoint="variantUploader"
                      className="py-3 ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary"
                      onUploadError={(error) => {
                        setError("image", {
                          type: "manual",
                          message: error.message,
                        });
                      }}
                      onClientUploadComplete={(files) => {
                        const urls = files.map((f) => f.url);
                        field.onChange([...(field.value ?? []), ...urls]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {(field.value?.length ?? 0) > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {(field.value ?? []).map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img}
                            alt={`Product Image ${idx + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1"
                            onClick={() =>{
                                const updatedImages = (field.value ?? []).filter((_, i) => i !== idx);
                                field.onChange(updatedImages);
                                form.setValue("image", updatedImages);
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />


            <Button
            disabled={
                status === "executing" ||
                
                (
                editMode 
                    ? (
                        
                        !form.formState.isDirty && 
                        arraysEqual(existingImg, form.getValues("image") || []) && !form.formState.isValid
                    )
                    : (
                        
                        !form.formState.isDirty
                    )
                ) || !form.formState.isValid
            }
            type="submit"
            >
            {editMode ? 'Save Changes' : 'Create Product'}
            </Button>



          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
