import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Nessun errore all'import: durante `next build` i moduli vengono valutati senza database.
// postgres-js apre la connessione solo alla prima query.
const url = process.env.DATABASE_URL ?? "postgres://localhost:5432/missing-database-url";

// In dev l'HMR ricarica i moduli: riusa la stessa connessione
const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> };
const client = globalForDb.pg ?? postgres(url, { max: 10 });
if (process.env.NODE_ENV !== "production") globalForDb.pg = client;

export const db = drizzle(client, { schema, casing: "snake_case" });
