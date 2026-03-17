import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema.ts'

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is undefined. If you are on Cloudflare Workers, make sure to add it via 'npx wrangler secret put DATABASE_URL'");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
