import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { cookies } from "next/headers";
export async function POST(req) {
  const b = await req.json();
  const email = String(b.email || "").toLowerCase().trim();
  if (b.mode === "reg") {
    if (await db.user.findUnique({ where: { email } })) return Response.json({ error: "e_dup" });
    const u = await db.user.create({ data: { name: b.name, email, password: await bcrypt.hash(b.password, 10), role: b.role === "EMPLOYER" ? "EMPLOYER" : "SEEKER" } });
    await setSession(u); return Response.json({ ok: true });
  }
  const AE = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  if (AE && email === AE && b.password === process.env.ADMIN_PASSWORD) {
    const hash = await bcrypt.hash(b.password, 10);
    const a = await db.user.upsert({ where: { email }, update: { role: "ADMIN", password: hash }, create: { name: "Admin", email, password: hash, role: "ADMIN" } });
    await setSession(a); return Response.json({ ok: true });
  }
  const u = await db.user.findUnique({ where: { email } });
  if (!u || !(await bcrypt.compare(b.password || "", u.password))) return Response.json({ error: "e_bad" });
  if (u.suspended) return Response.json({ error: "e_susp" });
  await setSession(u); return Response.json({ ok: true });
}
export async function DELETE() { cookies().delete("s"); return Response.json({ ok: true }); }
