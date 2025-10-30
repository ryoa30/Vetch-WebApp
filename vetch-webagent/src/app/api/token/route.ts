import { NextResponse } from "next/server";
import { getSession } from "@/lib/utils/session";

export async function GET() {
  const session = await getSession();
  // Clear session data
  const accessToken = session.accessToken;
  return NextResponse.json({ success: true, token: accessToken });
}

