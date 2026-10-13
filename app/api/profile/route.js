import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  const b = await req.json();
  const c = (v, n) => String(v || "").slice(0, n);
  await db.user.update({ where: { id: u.id }, data: { phone: c(b.phone, 20), city: c(b.city, 60), skills: c(b.skills, 300), education: c(b.education, 200), experience: c(b.experience, 1000) } });
  return Response.json({ ok: true });
}
