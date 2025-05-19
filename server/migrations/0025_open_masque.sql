ALTER TABLE "verification" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "emailVerifiedAt" timestamp;