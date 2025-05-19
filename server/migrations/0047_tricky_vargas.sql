ALTER TABLE "products" ALTER COLUMN "image" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "image" SET DEFAULT '{}'::text[];