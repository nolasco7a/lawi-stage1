ALTER TABLE "User" ADD COLUMN "customer_id" varchar(100);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_customer_id_idx" ON "User" USING btree ("customer_id");