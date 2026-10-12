import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "लॉगिन करें" }, { status: 401 });
  const { jobId } = await req.json();
  try { await db.application.create({ data: { userId: u.id, jobId } }); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "पहले ही अप्लाई किया" }); }
}
