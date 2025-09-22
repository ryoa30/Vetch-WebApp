import "server-only";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

type SessionData = { accessToken?: string; user?: { id: string; role: string; fullName: string; email: string } };
export const sessionOptions = {
  cookieName: "sess",
  password: process.env.SESSION_SECRET!, // 32+ chars
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};
export const getSession = async () => {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
};
