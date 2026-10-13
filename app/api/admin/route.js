import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function DELETE(req) {
  const u = await getUser();
  if (!u || u.role !== "ADMIN") return Response.json({ error: "e_login" }, { status: 401 });
  const { id } = await req.json();
  await db.application.deleteMany({ where: { jobId: id } });
  await db.job.delete({ where: { id } });
  return Response.json({ ok: true });
}
