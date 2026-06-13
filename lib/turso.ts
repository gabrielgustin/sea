import { createClient } from "@libsql/client";

const tursoUrl = process.env.TURSO_CONNECTION_URL!;
const tursoToken = process.env.TURSO_AUTH_TOKEN!;

export const db = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        price REAL,
        duration TEXT,
        level TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS carousel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        link TEXT,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        bio TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("[v0] Database initialized successfully");
    return true;
  } catch (error) {
    console.error("[v0] Database initialization error:", error);
    throw error;
  }
}
