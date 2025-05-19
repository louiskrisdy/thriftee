"use client"

import { TagsWithProducts } from "@/lib/infer-type"
import React, { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { TagSchema } from "@/types/tag-schema"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getAllTags } from "@/server/actions/get-all-tags"
import { toast } from "sonner"
import { addProductTag } from "@/server/actions/add-product-tag"
import { deleteProductTag } from "@/server/actions/delete-product-tag"
  
export default function ProductTag(
    {
        editMode,
        productId,
        children,
        tagName,
        onSuccess
    }: {
        editMode: boolean,
        productId?: number,
        children: React.ReactNode,
        tagName: string,
        onSuccess?: () => void
    }
){
    const form = useForm<z.infer<typeof TagSchema>>({
        resolver: zodResolver(TagSchema),
        defaultValues:{
            editMode,
            tagId: undefined,
            productId,
            tagName
        },
    });

    const fetchTags = async () => {
        const allTags = await getAllTags();
        return allTags;
      };

    const [open, setOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [value, setValue] = useState(tagName);
    const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

    const tagsList = tags.map((tag: { id: number; name: string}) => ({
        value: tag.id.toString(),
        label: tag.name
    }))

    useEffect(() => {

        const loadTags = async () => {
          const data = await fetchTags();
          if (data.success) {
            setTags(data.success);
          } else {
            console.error("Failed to fetch tags:", data.error);
          }
        };
      
        loadTags();
      }, []);

    const onSubmit = async (values: z.infer<typeof TagSchema>) => {
        // console.log(values.productId);

        const response = await addProductTag({
            productId: values.productId,
            tagId: values.tagId,
        });

        if (response.error) {
            toast.error(response.error);
        } else {
            toast.success(`${editMode ? "Updated" : "Added"} tag: ${values.tagName}`);
            onSuccess?.();
            setOpen(false);
        }
        
        
    }

    return(
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{editMode ? "Edit" : "Create"} your tags</DialogTitle>
                <DialogDescription>
                    Manage your product tags
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="tagName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="mr-2">Tag Name</FormLabel>
                            <FormControl>
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={popoverOpen}
                                        className="w-[200px] justify-between"
                                        >
                                        {value
                                            ? tagsList.find((tag) => tag.label === value)?.label
                                            : "Select tags..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <CommandDialog open={popoverOpen} onOpenChange={setPopoverOpen}>
                                            <CommandInput placeholder="Search tags..." />
                                            <CommandList>
                                                <CommandEmpty>No tags found.</CommandEmpty>
                                                <CommandGroup>
                                                {tagsList && tagsList.map((tag) => (
                                                    <CommandItem
                                                    key={tag.value}
                                                    value={tag.label}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? "" : currentValue);
                                                        form.setValue("tagId", parseInt(tag.value));
                                                        form.setValue("tagName", tag.label);
                                                        setPopoverOpen(false);
                                                    }}
                                                    >
                                                    <Check
                                                        className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === tag.label ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {tag.label}
                                                    </CommandItem>
                                                ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </CommandDialog>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {editMode && tagName && (
                            <Button
                                variant="destructive"
                                type="button"
                                onClick={async () => {
                                if (!productId || !form.getValues("tagName")) return;

                                const confirmDelete = confirm(`Are you sure you want to remove tag "${tagName}"?`);
                                if (!confirmDelete) return;

                                const response = await deleteProductTag({
                                    productId,
                                    tagName: form.getValues("tagName"),
                                });

                                if (response.error) {
                                    toast.error(response.error);
                                } else {
                                    toast.success("Tag removed successfully.");
                                    onSuccess?.();
                                    setOpen(false);
                                }
                                }}
                            >
                                Delete Tag
                            </Button>
                        )}
                        <Button className="ml-3" type="submit">
                            {editMode ? "Update Tag" : "Insert Tag"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}