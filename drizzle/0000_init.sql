CREATE TYPE "public"."difficulty" AS ENUM('facile', 'media', 'impegnativa');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('image', 'historic', 'audio');--> statement-breakpoint
CREATE TYPE "public"."place_category" AS ENUM('chiesa', 'museo', 'piazza', 'strada', 'teatro', 'parco', 'monumento', 'opera-arte', 'architettura', 'paesaggio', 'quartiere', 'cantina', 'scienza');--> statement-breakpoint
CREATE TYPE "public"."theme" AS ENUM('fede', 'arte', 'storia', 'enogastronomia', 'contemporaneo', 'quartieri');--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"itinerary_id" integer NOT NULL,
	"place_id" integer,
	"position" smallint NOT NULL,
	"title" jsonb NOT NULL,
	"body" jsonb NOT NULL,
	"audio_url" jsonb,
	"camera" jsonb NOT NULL,
	"geom" geometry(Point, 4326) NOT NULL,
	"route_fraction" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itineraries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb NOT NULL,
	"subtitle" jsonb NOT NULL,
	"intro" jsonb NOT NULL,
	"theme" "theme" NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"duration_min" integer NOT NULL,
	"length_m" integer NOT NULL,
	"color" text NOT NULL,
	"cover_media_id" integer,
	"route" geometry(LineString, 4326) NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "itineraries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"kind" "media_kind" NOT NULL,
	"url" text NOT NULL,
	"width" integer,
	"height" integer,
	"alt" jsonb NOT NULL,
	"credit" text,
	"license" text,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "neighborhoods" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" jsonb NOT NULL,
	"description" jsonb NOT NULL,
	"geom" geometry(Polygon, 4326) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "neighborhoods_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "place_media" (
	"place_id" integer NOT NULL,
	"media_id" integer NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "place_media_place_id_media_id_pk" PRIMARY KEY("place_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" jsonb NOT NULL,
	"category" "place_category" NOT NULL,
	"summary" jsonb NOT NULL,
	"body" jsonb NOT NULL,
	"curiosities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"geom" geometry(Point, 4326) NOT NULL,
	"coords_verified" boolean DEFAULT false NOT NULL,
	"coords_source" text,
	"geofence_radius_m" smallint DEFAULT 40 NOT NULL,
	"address" text,
	"opening_hours" jsonb,
	"accessibility" jsonb,
	"historic_media_id" integer,
	"historic_year" text,
	"historic_caption" jsonb,
	"audio_url" jsonb,
	"streetview" jsonb,
	"ar" jsonb,
	"neighborhood_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "places_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_itinerary_id_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_media" ADD CONSTRAINT "place_media_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_media" ADD CONSTRAINT "place_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_historic_media_id_media_id_fk" FOREIGN KEY ("historic_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_neighborhood_id_neighborhoods_id_fk" FOREIGN KEY ("neighborhood_id") REFERENCES "public"."neighborhoods"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "chapters_itinerary_position_idx" ON "chapters" USING btree ("itinerary_id","position");--> statement-breakpoint
CREATE INDEX "itineraries_route_idx" ON "itineraries" USING gist ("route");--> statement-breakpoint
CREATE INDEX "neighborhoods_geom_idx" ON "neighborhoods" USING gist ("geom");--> statement-breakpoint
CREATE INDEX "places_geom_idx" ON "places" USING gist ("geom");