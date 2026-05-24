import { createClient } from "@libsql/client";
import { normalizeEmail } from "@/lib/email";

type WaitlistInput = {
  email: unknown;
  phoneNumber: unknown;
  source?: unknown;
};

export type WaitlistResult =
  | { ok: true; email: string; status: "waitlisted" }
  | { ok: false; status: 400; error: "invalid_email" | "invalid_phone"; message: string }
  | { ok: false; status: 500; error: "missing_config" | "database_error"; message: string };

const DEFAULT_SOURCE = "friendy-ui";

function getTursoConfig(): { url: string; authToken: string } | null {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    return null;
  }

  return { url, authToken };
}

function normalizePhone(input: unknown): string | null {
  if (typeof input !== "string") {
    return null;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed;
}

function normalizeSource(input: unknown): string {
  if (typeof input !== "string") {
    return DEFAULT_SOURCE;
  }

  const trimmed = input.trim();
  return trimmed || DEFAULT_SOURCE;
}

export async function saveWaitlistSignup(input: WaitlistInput): Promise<WaitlistResult> {
  const email = typeof input.email === "string" ? normalizeEmail(input.email) : null;
  if (!email) {
    return {
      ok: false,
      status: 400,
      error: "invalid_email",
      message: "Enter a valid email address.",
    };
  }

  const phoneNumber = normalizePhone(input.phoneNumber);
  if (!phoneNumber) {
    return {
      ok: false,
      status: 400,
      error: "invalid_phone",
      message: "Enter the phone number you want to connect with Friendy.",
    };
  }

  const config = getTursoConfig();
  if (!config) {
    return {
      ok: false,
      status: 500,
      error: "missing_config",
      message: "Waitlist is not configured yet.",
    };
  }

  const client = createClient(config);
  const now = new Date().toISOString();
  const payload = JSON.stringify({ email, phoneNumber, source: normalizeSource(input.source) });

  try {
    await client.batch(
      [
        {
          sql: `
            CREATE TABLE IF NOT EXISTS waitlist_signups (
              id TEXT PRIMARY KEY,
              email TEXT NOT NULL UNIQUE,
              phone_number TEXT NOT NULL,
              source TEXT NOT NULL,
              status TEXT NOT NULL,
              raw_json TEXT NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
          `,
          args: [],
        },
        {
          sql: `
            CREATE INDEX IF NOT EXISTS waitlist_signups_created_at_idx
            ON waitlist_signups (created_at DESC)
          `,
          args: [],
        },
        {
          sql: `
            INSERT INTO waitlist_signups (
              id,
              email,
              phone_number,
              source,
              status,
              raw_json,
              created_at,
              updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
              phone_number = excluded.phone_number,
              source = excluded.source,
              raw_json = excluded.raw_json,
              status = excluded.status,
              updated_at = excluded.updated_at
          `,
          args: [
            crypto.randomUUID(),
            email,
            phoneNumber,
            normalizeSource(input.source),
            "waitlisted",
            payload,
            now,
            now,
          ],
        },
      ],
      "write"
    );
  } catch {
    return {
      ok: false,
      status: 500,
      error: "database_error",
      message: "Could not join the waitlist right now. Please try again.",
    };
  }

  return { ok: true, email, status: "waitlisted" };
}
