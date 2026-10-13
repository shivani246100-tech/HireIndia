import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  const { jobId, reason } = await req.json();
  if (!["FAKE", "MONEY", "OTHER"].includes(reason)) return Response.json({ error: "e_bad" });
  try { await db.report.create({ data: { userId: u.id, jobId, reason } }); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "e_reported" }); }
}
