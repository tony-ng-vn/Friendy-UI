import { sql } from "@vercel/postgres";

let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `.then(() => undefined);
  }
  await schemaReady;
}

export async function addToWaitlist(phone: string): Promise<"created" | "exists"> {
  await ensureSchema();

  try {
    await sql`
      INSERT INTO waitlist (phone)
      VALUES (${phone})
    `;
    return "created";
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      return "exists";
    }
    throw error;
  }
}
