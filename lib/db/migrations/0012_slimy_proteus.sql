ALTER TABLE "Subscription" ADD COLUMN "is_active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_is_active_idx" ON "Subscription" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_user_active_unique" ON "Subscription" ("user_id") WHERE "is_active" = true;