import { db } from "@/lib/db";
export async function POST(req) {
  const b = await req.json();
  if (b.website) return Response.json({ ok: true });
  const c = (v, n) => String(v || "").trim().slice(0, n);
  const name = c(b.name, 80), phone = c(b.phone, 15).replace(/[^\d+]/g, ""), email = c(b.email, 100);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 10 || !/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "e_bad_form" });
  await db.lead.create({ data: { name, phone, email, kind: b.kind === "CONSULTANCY" ? "CONSULTANCY" : "COMPANY", org: c(b.org, 100) } });
  return Response.json({ ok: true });
}
