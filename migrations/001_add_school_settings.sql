-- Migration: Add school_settings table for multi-school support
-- This table allows storing settings per school (Villada and Savio)

CREATE TABLE IF NOT EXISTS school_settings (
  id SERIAL PRIMARY KEY,
  schoolId TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(schoolId, key)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_school_settings_schoolid ON school_settings(schoolId);
