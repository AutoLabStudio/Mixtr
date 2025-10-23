import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Falling back to in-memory storage.");
}

// Create a PostgreSQL connection pool
let pool: pg.Pool | undefined;
try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    console.log("Database connection pool created successfully");
  }
} catch (error) {
  console.error("Failed to create database connection pool:", error);
}

// Initialize Drizzle ORM with our schema
export const db = pool
  ? drizzle(pool, { schema })
  : undefined;

export { pool };