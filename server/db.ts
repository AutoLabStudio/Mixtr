import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure neon to use websockets
neonConfig.webSocketConstructor = ws;

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Falling back to in-memory storage.");
}

// Create a PostgreSQL connection pool
let pool: Pool | undefined;
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