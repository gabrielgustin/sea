#!/usr/bin/env node

/**
 * Migration script to add schoolId column to courses and teachers tables
 * This ensures data isolation between Villada and Savio
 * Usage: node scripts/migrate-add-schoolid.mjs
 */

import { neon } from "@neondatabase/serverless";

const MIGRATION_SQL = [
  // Add schoolId column to courses
  `ALTER TABLE courses ADD COLUMN IF NOT EXISTS schoolId TEXT DEFAULT 'villada' NOT NULL;`,
  
  // Add schoolId column to teachers
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS schoolId TEXT DEFAULT 'villada' NOT NULL;`,
  
  // Create indices for faster queries
  `CREATE INDEX IF NOT EXISTS idx_courses_schoolid ON courses(schoolId);`,
  `CREATE INDEX IF NOT EXISTS idx_teachers_schoolid ON teachers(schoolId);`,
];

async function migrateDatabase(schoolId, databaseUrl) {
  console.log(`\n[${schoolId}] Starting migration...`);

  if (!databaseUrl) {
    throw new Error(
      `Database URL not found for ${schoolId}. Please set DATABASE_URL${schoolId === "savio" ? "_SAVIO" : ""}`
    );
  }

  const sql = neon(databaseUrl);

  try {
    for (const query of MIGRATION_SQL) {
      await sql.query(query);
    }
    console.log(`[${schoolId}] ✓ All migrations completed`);
  } catch (error) {
    console.error(`[${schoolId}] ✗ Migration failed:`, error.message);
    throw error;
  }
}

async function main() {
  console.log("🚀 Adding schoolId columns to courses and teachers tables...\n");

  try {
    // Migrate Villada
    await migrateDatabase("villada", process.env.DATABASE_URL);

    // Migrate Savio (only if DATABASE_URL_SAVIO is set)
    if (process.env.DATABASE_URL_SAVIO) {
      await migrateDatabase("savio", process.env.DATABASE_URL_SAVIO);
    } else {
      console.log("\n[savio] ⚠️ DATABASE_URL_SAVIO not configured, skipping migration");
    }

    console.log("\n✨ All migrations completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main();
