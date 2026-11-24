CREATE TABLE "itinerary_links" (
	"from_id" integer NOT NULL,
	"to_id" integer NOT NULL,
	"distance_m" integer NOT NULL,
	CONSTRAINT "itinerary_links_from_id_to_id_pk" PRIMARY KEY("from_id","to_id")
);
--> statement-breakpoint
ALTER TABLE "itinerary_links" ADD CONSTRAINT "itinerary_links_from_id_itineraries_id_fk" FOREIGN KEY ("from_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_links" ADD CONSTRAINT "itinerary_links_to_id_itineraries_id_fk" FOREIGN KEY ("to_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;