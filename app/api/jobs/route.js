import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { planInfo } from "@/lib/plans";
export async function POST(req) {
  const u = await getUser();
  if (!u || (u.role !== "EMPLOYER" && u.role !== "ADMIN")) return Response.json({ error: "e_emp" }, { status: 401 });
  if (u.role === "EMPLOYER") {
    const pi = planInfo(u);
    if (pi.limit !== Infinity) {
      const n = await db.job.count({ where: { postedById: u.id, ...(pi.active && pi.since ? { createdAt: { gte: pi.since } } : {}) } });
      if (n >= pi.limit) return Response.json({ error: "e_free" });
    }
  }
  const b = await req.json();
  const exp = b.expiresAt ? new Date(b.expiresAt + "T23:59:59") : null;
  await db.job.create({ data: { title: b.title, company: b.company, location: b.location, mode: b.mode, minExp: +b.minExp || 0, salary: +b.salary || 0, skills: b.skills, description: b.description, expiresAt: exp, postedById: u.id, status: u.role === "ADMIN" ? "APPROVED" : "PENDING" } });
  return Response.json({ ok: true });
}
export async function PATCH(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  const b = await req.json();
  const j = await db.job.findUnique({ where: { id: b.id } });
  if (!j || (j.postedById !== u.id && u.role !== "ADMIN")) return Response.json({ error: "e_login" }, { status: 401 });
  const adm = u.role === "ADMIN";
  if (b.action === "close") await db.job.update({ where: { id: j.id }, data: { status: "CLOSED" } });
  else if (b.action === "open") await db.job.update({ where: { id: j.id }, data: { status: adm ? "APPROVED" : "PENDING" } });
  else if (b.action === "edit") {
    const exp = b.expiresAt ? new Date(b.expiresAt + "T23:59:59") : null;
    await db.job.update({ where: { id: j.id }, data: { title: b.title, company: b.company, location: b.location, mode: b.mode, minExp: +b.minExp || 0, salary: +b.salary || 0, skills: b.skills, description: b.description, expiresAt: exp, status: adm ? j.status : "PENDING" } });
  } else return Response.json({ error: "e_bad" });
  return Response.json({ ok: true });
}
