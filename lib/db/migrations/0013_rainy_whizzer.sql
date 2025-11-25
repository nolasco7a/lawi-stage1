CREATE TABLE IF NOT EXISTS "CaseFile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caseId" uuid NOT NULL,
	"filename" varchar(255) NOT NULL,
	"originalName" varchar(255) NOT NULL,
	"mimeType" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"vectorData" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Case" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"userId" uuid NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
DROP INDEX IF EXISTS "subscription_is_active_idx";--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "caseId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CaseFile" ADD CONSTRAINT "CaseFile_caseId_Case_id_fk" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Case" ADD CONSTRAINT "Case_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "case_file_case_id_idx" ON "CaseFile" USING btree ("caseId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "case_user_id_idx" ON "Case" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "case_active_idx" ON "Case" USING btree ("active");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_caseId_Case_id_fk" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_case_id_idx" ON "Chat" USING btree ("caseId");--> statement-breakpoint
ALTER TABLE "Subscription" DROP COLUMN IF EXISTS "is_active";