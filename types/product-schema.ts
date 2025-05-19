import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  description: z.string().min(40, {
    message: "Description must be at least 40 characters long",
  }),
  stock: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    }),
  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive({
      message: "Price must be a positive number",
    }),
  upc: z
    .string()
    .length(12, {
      message: "UPC must be exactly 12 characters",
    })
    .regex(/^\d{12}$/, {
      message: "UPC must contain exactly 12 digits",
    }),
  image: z
    .array(z.string())
    .min(1, { message: "Please upload at least one image" }),
});

export type zProductSchema = z.infer<typeof ProductSchema>;
