import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  const { jobId } = await req.json();
  const j = await db.job.findUnique({ where: { id: jobId } });
  if (!j || j.status !== "APPROVED" || (j.expiresAt && j.expiresAt < new Date())) return Response.json({ error: "e_expired" });
  try { await db.application.create({ data: { userId: u.id, jobId } }); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "e_applied" }); }
}
