CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"timestamp" bigint NOT NULL,
	"type" text NOT NULL,
	"note" text,
	"photo_url" text
);
--> statement-breakpoint
CREATE TABLE "readings" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"timestamp" bigint NOT NULL,
	"grate_temp" real,
	"meat_temp" real,
	"source" text DEFAULT 'photo' NOT NULL,
	"photo_url" text
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cut_type" text NOT NULL,
	"probe1_role" text DEFAULT 'grate' NOT NULL,
	"probe2_role" text DEFAULT 'meat' NOT NULL,
	"probe1_label" text DEFAULT 'Probe One' NOT NULL,
	"probe2_label" text DEFAULT 'Probe Two' NOT NULL,
	"started_at" bigint NOT NULL,
	"ended_at" bigint,
	"done_target_temp" real,
	"status" text DEFAULT 'active' NOT NULL,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_session_idx" ON "events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "readings_session_idx" ON "readings" USING btree ("session_id");