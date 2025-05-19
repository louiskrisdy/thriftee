CREATE TABLE "twoFactor" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"secret" text,
	"backupCodes" text
);
--> statement-breakpoint
ALTER TABLE "twoFactor" ADD CONSTRAINT "twoFactor_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;