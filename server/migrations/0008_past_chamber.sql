ALTER TABLE "email_tokens" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "email_tokens" ADD COLUMN "email" text NOT NULL;