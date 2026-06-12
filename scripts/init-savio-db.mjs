#!/usr/bin/env node

/**
 * Initialize Savio database with all required tables
 * Usage: node scripts/init-savio-db.mjs
 */

import { neon } from "@neondatabase/serverless";

const INIT_QUERIES = [
  // Create users table (Better Auth)
  `CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  image TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
)`,

  // Create sessions table (Better Auth)
  `CREATE TABLE IF NOT EXISTS "session" (
  id TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
)`,

  // Create courses table
  `CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  "schoolId" TEXT NOT NULL DEFAULT 'savio',
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL DEFAULT '',
  badge TEXT NOT NULL DEFAULT 'PRESENCIAL',
  status TEXT NOT NULL DEFAULT 'open',
  category TEXT NOT NULL DEFAULT 'general',
  image TEXT,
  price TEXT,
  duration TEXT,
  "startDate" TEXT,
  "enrollmentDeadline" TEXT,
  "endDate" TEXT,
  schedule TEXT,
  location TEXT,
  teacher TEXT,
  modality TEXT,
  slug TEXT,
  level TEXT,
  objective TEXT,
  methodology TEXT,
  "finalProject" TEXT,
  "whatsappGroup" TEXT,
  requirements TEXT,
  "maxStudents" INTEGER,
  modules JSONB,
  teachers JSONB,
  "showOnHome" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
)`,

  // Create teachers table
  `CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  "schoolId" TEXT NOT NULL DEFAULT 'savio',
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  whatsapp TEXT,
  linkedin TEXT,
  "courseId" TEXT REFERENCES courses(id),
  "order" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
)`,

  // Create school_settings table
  `CREATE TABLE IF NOT EXISTS school_settings (
  id SERIAL PRIMARY KEY,
  "schoolId" TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
)`,

  // Create unique constraint  
  `ALTER TABLE school_settings ADD CONSTRAINT unique_schoolid_key UNIQUE("schoolId", key)`,

  // Create carousel_slides table
  `CREATE TABLE IF NOT EXISTS carousel_slides (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  badge TEXT,
  "ctaText" TEXT,
  "ctaLink" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
)`,

  // Create enrollments table
  `CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  "courseId" TEXT NOT NULL,
  "courseName" TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  dni TEXT NOT NULL,
  "metodoPago" TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
)`,

  // Create contact_messages table
  `CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  mensaje TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
)`,

  // Create indices (solo si las columnas existen)
  `CREATE INDEX IF NOT EXISTS idx_school_settings_schoolid ON school_settings("schoolId")`,
];

async function initializeDatabase() {
  console.log("\n🚀 Initializing Savio database...\n");

  const databaseUrl = process.env.DATABASE_URL_SAVIO;
  
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL_SAVIO not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    for (let i = 0; i < INIT_QUERIES.length; i++) {
      await sql.query(INIT_QUERIES[i]);
      console.log(`✓ Query ${i + 1}/${INIT_QUERIES.length} completed`);
    }
    console.log("\n✨ Savio database initialized!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Initialization failed:", error.message);
    process.exit(1);
  }
}

initializeDatabase();
