import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
const OK = ["APPLIED", "REVIEW", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"];
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  const { appId, status } = await req.json();
  const a = await db.application.findUnique({ where: { id: appId }, include: { job: true } });
  if (!a || (a.job.postedById !== u.id && u.role !== "ADMIN")) return Response.json({ error: "e_login" }, { status: 401 });
  if (!OK.includes(status)) return Response.json({ error: "e_bad" });
  await db.application.update({ where: { id: appId }, data: { status } });
  return Response.json({ ok: true });
}
