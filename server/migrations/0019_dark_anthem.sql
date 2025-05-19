ALTER TABLE "email_tokens" RENAME TO "verification";--> statement-breakpoint
ALTER TABLE "verification" DROP CONSTRAINT "email_tokens_id_token_pk";--> statement-breakpoint
ALTER TABLE "verification" ADD CONSTRAINT "verification_id_token_pk" PRIMARY KEY("id","token");