import bcrypt from "bcryptjs";
import { del } from "@vercel/blob";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function DELETE(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  if (u.role === "ADMIN") return Response.json({ error: "e_admin_del" });
  const { password } = await req.json();
  if (!(await bcrypt.compare(String(password || ""), u.password))) return Response.json({ error: "e_bad" });
  const ids = (await db.job.findMany({ where: { postedById: u.id }, select: { id: true } })).map(j => j.id);
  if (u.resumeUrl) { try { await del(u.resumeUrl); } catch {} }
  await db.$transaction([
    db.application.deleteMany({ where: { OR: [{ userId: u.id }, { jobId: { in: ids } }] } }),
    db.savedJob.deleteMany({ where: { OR: [{ userId: u.id }, { jobId: { in: ids } }] } }),
    db.report.deleteMany({ where: { OR: [{ userId: u.id }, { jobId: { in: ids } }] } }),
    db.job.deleteMany({ where: { postedById: u.id } }),
    db.user.delete({ where: { id: u.id } }) ]);
  cookies().delete("s");
  return Response.json({ ok: true });
}
