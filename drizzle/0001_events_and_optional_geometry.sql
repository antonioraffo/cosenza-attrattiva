CREATE TYPE "public"."event_category" AS ENUM('cultura', 'spettacolo', 'tradizioni', 'shopping-notti', 'artigianato');--> statement-breakpoint
CREATE TYPE "public"."itinerary_kind" AS ENUM('a-piedi', 'misto', 'tematico');--> statement-breakpoint
CREATE TYPE "public"."pillar" AS ENUM('vive', 'connect', 'crea');--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb NOT NULL,
	"summary" jsonb NOT NULL,
	"description" jsonb NOT NULL,
	"category" "event_category" NOT NULL,
	"pillar" "pillar" DEFAULT 'vive' NOT NULL,
	"major" boolean DEFAULT false NOT NULL,
	"start_date" text,
	"end_date" text,
	"month" smallint,
	"period" jsonb,
	"schedule" jsonb,
	"venue" text,
	"place_id" integer,
	"geom" geometry(Point, 4326),
	"cover_media_id" integer,
	"source_url" text,
	"demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "camera" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "geom" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "route_fraction" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "itineraries" ALTER COLUMN "length_m" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "itineraries" ALTER COLUMN "route" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "image_media_id" integer;--> statement-breakpoint
ALTER TABLE "itineraries" ADD COLUMN "kind" "itinerary_kind" DEFAULT 'a-piedi' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_geom_idx" ON "events" USING gist ("geom");--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;