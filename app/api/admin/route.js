import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
async function admin() { const u = await getUser(); return u && u.role === "ADMIN" ? u : null; }
export async function DELETE(req) {
  if (!(await admin())) return Response.json({ error: "e_login" }, { status: 401 });
  const { id } = await req.json();
  await db.application.deleteMany({ where: { jobId: id } });
  await db.savedJob.deleteMany({ where: { jobId: id } });
  await db.report.deleteMany({ where: { jobId: id } });
  await db.job.delete({ where: { id } });
  return Response.json({ ok: true });
}
export async function PATCH(req) {
  if (!(await admin())) return Response.json({ error: "e_login" }, { status: 401 });
  const { id, status } = await req.json();
  if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) return Response.json({ error: "e_bad" });
  await db.job.update({ where: { id }, data: { status } });
  return Response.json({ ok: true });
}
