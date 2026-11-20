import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "postgres://cosenza:cosenza@localhost:5433/cosenza" },
  // Le tabelle di PostGIS (spatial_ref_sys, …) non sono gestite da Drizzle
  extensionsFilters: ["postgis"],
  strict: true,
  verbose: true,
});
