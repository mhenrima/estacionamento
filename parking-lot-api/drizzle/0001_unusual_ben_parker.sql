CREATE TABLE IF NOT EXISTS "parking_records" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"entry_at" timestamp with time zone DEFAULT now() NOT NULL,
	"exit_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parking_records" ADD CONSTRAINT "parking_records_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vehicle_id_idx" ON "parking_records" ("vehicle_id");