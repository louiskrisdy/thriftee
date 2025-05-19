ALTER TABLE "verification" DROP CONSTRAINT "verification_id_token_pk";--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ADD CONSTRAINT "verification_id_pk" PRIMARY KEY("id");