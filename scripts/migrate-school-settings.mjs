#!/usr/bin/env node

/**
 * Migration script to set up school_settings table for both Villada and Savio databases
 * Usage: node scripts/migrate-school-settings.mjs
 */

import { neon } from "@neondatabase/serverless";

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS school_settings (
  id SERIAL PRIMARY KEY,
  schoolId TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(schoolId, key)
);
`;

const CREATE_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS idx_school_settings_schoolid ON school_settings(schoolId);
`;

async function migrateDatabase(schoolId, databaseUrl) {
  console.log(`\n[${schoolId}] Starting migration...`);

  if (!databaseUrl) {
    throw new Error(
      `Database URL not found for ${schoolId}. Please set DATABASE_URL${schoolId === "savio" ? "_SAVIO" : ""}`
    );
  }

  const sql = neon(databaseUrl);

  try {
    await sql.query(CREATE_TABLE_SQL);
    console.log(`[${schoolId}] ✓ Table created`);
    
    await sql.query(CREATE_INDEX_SQL);
    console.log(`[${schoolId}] ✓ Index created`);
  } catch (error) {
    console.error(`[${schoolId}] ✗ Migration failed:`, error.message);
    throw error;
  }
}

async function main() {
  console.log("🚀 Migrating school_settings table to both databases...\n");

  try {
    // Migrate Villada
    await migrateDatabase("villada", process.env.DATABASE_URL);

    // Migrate Savio (only if DATABASE_URL_SAVIO is set)
    if (process.env.DATABASE_URL_SAVIO) {
      await migrateDatabase("savio", process.env.DATABASE_URL_SAVIO);
    } else {
      console.log("\n[savio] ⚠️ DATABASE_URL_SAVIO not configured, skipping migration");
      console.log("[savio] ℹ️ Please set DATABASE_URL_SAVIO in your environment to migrate the Savio database");
    }

    console.log("\n✨ Migrations completed!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main();
