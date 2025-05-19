import * as z from 'zod'

export const TagSchema = z.object({
    productId: z.number(),
    tagId: z.number(),
    editMode: z.boolean(),
    tagName: z.string().min(2, { message: "Tag Name must be at least 2 characters" })
})