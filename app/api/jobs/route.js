import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req) {
  const u = await getUser();
  if (!u || (u.role !== "EMPLOYER" && u.role !== "ADMIN")) return Response.json({ error: "e_emp" }, { status: 401 });
  if (u.role === "EMPLOYER" && u.plan !== "PRO" && (await db.job.count({ where: { postedById: u.id } })) >= 1)
    return Response.json({ error: "e_free" });
  const b = await req.json();
  await db.job.create({ data: { title: b.title, company: b.company, location: b.location, mode: b.mode, minExp: +b.minExp || 0, salary: +b.salary || 0, skills: b.skills, description: b.description, postedById: u.id, status: u.role === "ADMIN" ? "APPROVED" : "PENDING" } });
  return Response.json({ ok: true });
}
