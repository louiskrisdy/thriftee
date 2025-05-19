ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_id_pk";--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "expires" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_id_token_pk" PRIMARY KEY("id","token");