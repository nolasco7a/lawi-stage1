DROP TABLE "CaseFile";--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "source" varchar DEFAULT 'model' NOT NULL;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "caseId" uuid;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "filename" varchar(255);--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "size" integer;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "vectorData" jsonb;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Document" ADD CONSTRAINT "Document_caseId_Case_id_fk" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_source_idx" ON "Document" USING btree ("source");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_case_id_idx" ON "Document" USING btree ("caseId");