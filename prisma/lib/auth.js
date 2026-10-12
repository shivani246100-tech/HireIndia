import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
const k = () => new TextEncoder().encode(process.env.AUTH_SECRET);
export async function setSession(u) {
  const t = await new SignJWT({ id: u.id }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(k());
  cookies().set("s", t, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 2592000 });
}
export async function getUser() {
  try {
    const t = cookies().get("s")?.value;
    if (!t) return null;
    const { payload } = await jwtVerify(t, k());
    return await db.user.findUnique({ where: { id: payload.id } });
  } catch { return null; }
}
