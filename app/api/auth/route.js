import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { cookies } from "next/headers";
export async function POST(req) {
  const b = await req.json();
  const email = String(b.email || "").toLowerCase().trim();
  if (b.mode === "reg") {
    if (await db.user.findUnique({ where: { email } })) return Response.json({ error: "यह ईमेल पहले से रजिस्टर है" });
    const u = await db.user.create({ data: { name: b.name, email, password: await bcrypt.hash(b.password, 10), role: b.role === "EMPLOYER" ? "EMPLOYER" : "SEEKER" } });
    await setSession(u); return Response.json({ ok: true });
  }
  const u = await db.user.findUnique({ where: { email } });
  if (!u || !(await bcrypt.compare(b.password || "", u.password))) return Response.json({ error: "ईमेल या पासवर्ड गलत है" });
  await setSession(u); return Response.json({ ok: true });
}
export async function DELETE() { cookies().delete("s"); return Response.json({ ok: true }); }
