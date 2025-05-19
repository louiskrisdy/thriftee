import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
  primaryKey,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";

export const RoleEnum = pgEnum("roles", ["user", "admin"]);

export const user = pgTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: boolean("emailVerified"),
  emailVerifiedDate: timestamp("emailVerifiedDate", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
  stripeCustomerId: text("stripeCustomerId"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable(
  "verification",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token"),
    email: text("email"),
    identifier: text("identifier"),
    value: text("value"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
    expires: timestamp("expires", { mode: "date" }),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id] }),
  })
);

export const passwordResetTokens = pgTable(
    "password_reset_tokens",
    {
        id: text("id")
            .notNull()
            .$defaultFn(() => createId()),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
        email: text("email").notNull()
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
    })
)

export const twoFactorTokens = pgTable(
    "two_factor_tokens",
    {
        id: text("id")
            .notNull()
            .$defaultFn(() => createId()),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
        email: text("email").notNull()
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
    })
)

export const twoFactor = pgTable("twoFactor", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  secret: text("secret"),
  backupCodes: text("backupCodes"),
})

export const products = pgTable(
    "products",
    {
        id: serial('id').primaryKey(),
        description: text('description').notNull(),
        title: text('title').notNull(),
        stock: integer("stock"),
        image: text("image").array(),
        createdAt: timestamp("createdAt").defaultNow(),
        price: real("price").notNull(),
        upc: text('upc'),
        verified: boolean("verified")
    }
)

export const tags = pgTable(
    "tags",
    {
        id: serial("id").primaryKey(),
        name: text("name").notNull().unique(),
    }
)

export const productTags = pgTable(
    "productTags",
    {
        productId: integer("productId")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        tagId: integer("tagId")
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (vt) => ({
        pk: primaryKey({ columns: [vt.productId, vt.tagId] }),
    })
)

export const productRelations = relations(products, ({ one, many }) => ({
  tag: one(productTags, {
    fields: [products.id],
    references: [productTags.productId],
  }),
  reviews: many(reviews, { relationName: "reviews" }),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  products: many(productTags),
}));

export const productTagRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  rating: real("rating").notNull(),
  userID: text("userID").notNull().references(() => user.id, { onDelete: "cascade" }),
  productID: serial("productID").notNull().references(() => products.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  created: timestamp("created").defaultNow(),
}, (table) => {
  return {
    productIdx: index('productIdx').on(table.productID),
    userIdx: index('userIdx').on(table.userID)
  }
})

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(user, {
    fields: [reviews.userID],
    references: [user.id],
    relationName: "user_reviews",
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: "reviews",
  })
}))

export const userRelations = relations(user, ({ many }) => ({
  reviews: many(reviews, { relationName: "user_reviews" }),
  orders: many(orders, { relationName: "user_orders" }),
}))

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userID: text("userID")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status").notNull(),
  created: timestamp("created").defaultNow(),
  receiptURL: text("receiptURL"),
  paymentIntentID: text("paymentIntentID"),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userID],
    references: [user.id],
    relationName: "user_orders",
  }),
  orderProduct: many(orderProduct, { relationName: "orderProduct" }),
}))

export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  orderID: serial("orderID")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
})

export const orderProductRelations = relations(orderProduct, ({ one }) => ({
  order: one(orders, {
    fields: [orderProduct.orderID],
    references: [orders.id],
    relationName: "orderProduct",
  }),
  product: one(products, {
    fields: [orderProduct.productID],
    references: [products.id],
    relationName: "products",
  }),
}))