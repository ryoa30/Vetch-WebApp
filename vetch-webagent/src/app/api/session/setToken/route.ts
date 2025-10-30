import { NextResponse } from "next/server";
import { getSession } from "@/lib/utils/session";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { accessToken } = payload ?? {};
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Missing token or user" }, { status: 400 });
    }
    const session = await getSession();
    session.accessToken = accessToken;
    await session.save();
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
