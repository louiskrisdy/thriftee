ALTER TABLE "verification" DROP CONSTRAINT "verification_id_pk";--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "expires" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ADD CONSTRAINT "verification_id_token_pk" PRIMARY KEY("id","token");