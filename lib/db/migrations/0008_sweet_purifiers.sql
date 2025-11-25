CREATE TABLE IF NOT EXISTS "CityMunicipality" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"depto_state_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Country" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"iso2_code" varchar(2) NOT NULL,
	"iso3_code" varchar(3) NOT NULL,
	"area_code" varchar(5) NOT NULL,
	"demonym" varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DeptoState" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"zip_code" varchar(10),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CityMunicipality" ADD CONSTRAINT "CityMunicipality_depto_state_id_DeptoState_id_fk" FOREIGN KEY ("depto_state_id") REFERENCES "public"."DeptoState"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DeptoState" ADD CONSTRAINT "DeptoState_country_id_Country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."Country"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
