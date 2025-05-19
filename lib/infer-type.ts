import type {
    BuildQueryResult,
    DBQueryConfig,
    ExtractTablesWithRelations,
} from "drizzle-orm"
import * as schema from '@/server/schema'

type Schema = typeof schema
type TSchema = ExtractTablesWithRelations<Schema>

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
    "one" | "many",
    boolean,
    TSchema,
    TSchema[TableName]
>["with"]

export type InferResultType<
    TableName extends keyof TSchema,
    With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
    TSchema,
    TSchema[TableName],
    {
        with: With
    }
>

export type ProductWithTag = InferResultType<
  "products",
  { tag: { with: { tag: true } } }
>

export type TagsWithProducts = InferResultType<
  "productTags",
  { tag: true; product: true }
>

export type ReviewsWithUser = InferResultType<
    "reviews",
    {
        user: true
    }
>

export type TotalOrders = InferResultType<
    "orderProduct",
  {
    order: { with: { user: true } }
    product: true
  }
>