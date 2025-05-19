ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_id_token_pk";--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "expires" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_id_pk" PRIMARY KEY("id");