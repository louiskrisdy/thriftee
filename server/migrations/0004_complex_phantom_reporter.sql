ALTER TABLE "account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "provider_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "id_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "access_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refresh_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "scope" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email_verified" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "accountId";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "providerId";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "accessToken";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "refreshToken";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "idToken";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "expiresAt";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "expiresAt";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "ipAdress";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "userAgent";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "verification" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "verification" DROP COLUMN "expiresAt";--> statement-breakpoint
ALTER TABLE "verification" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");