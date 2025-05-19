ALTER TABLE "verification" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "updated_at" timestamp;