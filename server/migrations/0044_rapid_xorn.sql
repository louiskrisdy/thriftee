CREATE TABLE "productTags" (
	"productId" integer NOT NULL,
	"tagId" integer NOT NULL,
	CONSTRAINT "productTags_productId_tagId_pk" PRIMARY KEY("productId","tagId")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "productTags" ADD CONSTRAINT "productTags_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productTags" ADD CONSTRAINT "productTags_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;