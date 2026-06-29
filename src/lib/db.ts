import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazily create the Drizzle client on first use. Importing this module must be
// side-effect free so `next build` (which evaluates route modules) succeeds
// even when DATABASE_URL isn't set yet — e.g. a first Vercel deploy before the
// env var is configured. The connection is only opened when a query actually
// runs at request time.
let _db: NeonHttpDatabase<typeof schema> | null = null;

function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Add your Neon connection string to the environment."
      );
    }
    _db = drizzle(neon(url), { schema });
  }
  return _db;
}

// A proxy so call sites can keep using `db.select()...` while the underlying
// connection stays lazy.
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export * from "./schema";
