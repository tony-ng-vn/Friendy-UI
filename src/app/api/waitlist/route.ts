import { NextResponse } from "next/server";
import { normalizeUsPhone } from "@/lib/phone";
import { addToWaitlist } from "@/lib/waitlist";

export async function POST(request: Request) {
  let body: { phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const phone = normalizeUsPhone(body.phone ?? "");
  if (!phone) {
    return NextResponse.json(
      { error: "Enter a valid US phone number (10 digits)." },
      { status: 400 }
    );
  }

  try {
    const result = await addToWaitlist(phone);
    return NextResponse.json({
      ok: true,
      status: result,
      message:
        result === "exists"
          ? "You're already on the list!"
          : "You're on the list!",
    });
  } catch (error) {
    console.error("waitlist insert failed", error);
    const message =
      process.env.NODE_ENV === "development"
        ? "Database is not configured. Add POSTGRES_URL to .env.local."
        : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
