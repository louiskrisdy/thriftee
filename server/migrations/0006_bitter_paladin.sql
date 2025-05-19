ALTER TABLE "verification" RENAME TO "email_tokens";--> statement-breakpoint
ALTER TABLE "email_tokens" RENAME COLUMN "identifier" TO "token";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'email_tokens'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "email_tokens" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "email_tokens" ADD CONSTRAINT "email_tokens_id_token_pk" PRIMARY KEY("id","token");--> statement-breakpoint
ALTER TABLE "email_tokens" DROP COLUMN "value";