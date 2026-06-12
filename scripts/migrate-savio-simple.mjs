#!/usr/bin/env node

/**
 * Simple script to add schoolId columns and migrate data to Savio
 */

import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL_SAVIO;
  
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL_SAVIO not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("\n🚀 Migrating Savio database...\n");

    // Add schoolId to courses if not exists
    console.log("1. Adding schoolId to courses...");
    try {
      await sql.query(`ALTER TABLE courses ADD COLUMN schoolId TEXT DEFAULT 'savio' NOT NULL`);
      console.log("✓ Added schoolId to courses");
    } catch (e) {
      if (e.message.includes("already exists")) {
        console.log("✓ schoolId already exists in courses");
      } else {
        throw e;
      }
    }

    // Add schoolId to teachers if not exists
    console.log("2. Adding schoolId to teachers...");
    try {
      await sql.query(`ALTER TABLE teachers ADD COLUMN schoolId TEXT DEFAULT 'savio' NOT NULL`);
      console.log("✓ Added schoolId to teachers");
    } catch (e) {
      if (e.message.includes("already exists")) {
        console.log("✓ schoolId already exists in teachers");
      } else {
        throw e;
      }
    }

    // Add schoolId to school_settings if not exists
    console.log("3. Adding schoolId to school_settings...");
    try {
      await sql.query(`ALTER TABLE school_settings ADD COLUMN schoolId TEXT DEFAULT 'savio' NOT NULL`);
      console.log("✓ Added schoolId to school_settings");
    } catch (e) {
      if (e.message.includes("already exists")) {
        console.log("✓ schoolId already exists in school_settings");
      } else {
        throw e;
      }
    }

    // Create indices
    console.log("4. Creating indices...");
    await sql.query(`CREATE INDEX IF NOT EXISTS idx_courses_schoolid ON courses(schoolId)`);
    await sql.query(`CREATE INDEX IF NOT EXISTS idx_teachers_schoolid ON teachers(schoolId)`);
    await sql.query(`CREATE INDEX IF NOT EXISTS idx_school_settings_schoolid ON school_settings(schoolId)`);
    console.log("✓ Indices created");

    console.log("\n✨ Savio database migrated successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main();
