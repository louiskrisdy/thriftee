ALTER TABLE "user" ALTER COLUMN "email_verified" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "updated_at";