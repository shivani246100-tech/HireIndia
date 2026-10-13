import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  const { jobId } = await req.json();
  const k = { userId_jobId: { userId: u.id, jobId } };
  if (await db.savedJob.findUnique({ where: k })) { await db.savedJob.delete({ where: k }); return Response.json({ saved: false }); }
  await db.savedJob.create({ data: { userId: u.id, jobId } });
  return Response.json({ saved: true });
}
