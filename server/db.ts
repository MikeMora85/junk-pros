import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Clean the DATABASE_URL - remove any accidental prefixes or newlines
let connectionString = process.env.DATABASE_URL;
// Extract the actual postgres URL if there's corruption
const postgresMatch = connectionString.match(/postgresql:\/\/[^\s]+/);
if (postgresMatch) {
  connectionString = postgresMatch[0].trim();
}

console.log('Connecting to database...');

// Single shared pool for all requests - prevents connection exhaustion
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
  max: 10, // Maximum connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Timeout after 10s when connecting
});

// Handle pool errors gracefully
pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

export const db = drizzle(pool, { schema });
