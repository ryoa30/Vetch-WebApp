import { NextResponse } from "next/server";
import { getSession } from "@/lib/utils/session";

export async function POST() {
  const session = await getSession();
  // Clear session data
  session.accessToken = undefined;
  session.user = undefined as any;
  await session.destroy();
  return NextResponse.json({ success: true });
}

export async function GET() {
  // Allow GET for convenience; you can restrict to POST if you prefer
  return POST();
}
