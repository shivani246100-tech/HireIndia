import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { audit } from "@/lib/audit";
async function admin() { const u = await getUser(); return u && u.role === "ADMIN" ? u : null; }
export async function DELETE(req) {
  const a = await admin();
  if (!a) return Response.json({ error: "e_login" }, { status: 401 });
  const { id } = await req.json();
  const j = await db.job.findUnique({ where: { id } });
  if (!j) return Response.json({ error: "e_bad" });
  await db.application.deleteMany({ where: { jobId: id } });
  await db.savedJob.deleteMany({ where: { jobId: id } });
  await db.report.deleteMany({ where: { jobId: id } });
  await db.job.delete({ where: { id } });
  await audit(a.id, "JOB_DELETE", id, j.title + " · " + j.company);
  return Response.json({ ok: true });
}
export async function PATCH(req) {
  const a = await admin();
  if (!a) return Response.json({ error: "e_login" }, { status: 401 });
  const { id, status } = await req.json();
  if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) return Response.json({ error: "e_bad" });
  const j = await db.job.update({ where: { id }, data: { status } });
  await audit(a.id, "JOB_" + status, id, j.title + " · " + j.company);
  return Response.json({ ok: true });
}
