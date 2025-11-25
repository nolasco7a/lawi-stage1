ALTER TABLE "User" ADD COLUMN "name" varchar(100);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "lastname" varchar(100);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "role" varchar DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "is_guest" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "lawyer_credential_number" varchar(50);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "national_id" varchar(20);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "country_id" uuid;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "depto_state_id" uuid;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "city_municipality_id" uuid;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "updatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_country_id_Country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."Country"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_depto_state_id_DeptoState_id_fk" FOREIGN KEY ("depto_state_id") REFERENCES "public"."DeptoState"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_city_municipality_id_CityMunicipality_id_fk" FOREIGN KEY ("city_municipality_id") REFERENCES "public"."CityMunicipality"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "User" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_role_idx" ON "User" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_lawyer_credential_idx" ON "User" USING btree ("lawyer_credential_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_national_id_idx" ON "User" USING btree ("national_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_country_idx" ON "User" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_depto_state_idx" ON "User" USING btree ("depto_state_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_city_municipality_idx" ON "User" USING btree ("city_municipality_id");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "user_lawyer_credential_unique" UNIQUE("lawyer_credential_number");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "user_national_id_unique" UNIQUE("national_id");