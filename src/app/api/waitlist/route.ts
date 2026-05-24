import { NextResponse } from "next/server";
import { saveWaitlistSignup } from "@/lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", message: "Send a valid JSON body." },
      { status: 400 }
    );
  }

  const payload = typeof body === "object" && body !== null ? body : {};
  const result = await saveWaitlistSignup({
    email: "email" in payload ? payload.email : undefined,
    phoneNumber: "phoneNumber" in payload ? payload.phoneNumber : undefined,
    source: "source" in payload ? payload.source : undefined,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, message: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      status: result.status,
      message: "You're on the waitlist. We'll email you when Friendy is ready.",
    },
    { status: 201 }
  );
}
