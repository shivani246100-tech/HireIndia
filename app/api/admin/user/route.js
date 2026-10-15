import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { audit } from "@/lib/audit";
export async function POST(req) {
  const a = await getUser();
  if (!a || a.role !== "ADMIN") return Response.json({ error: "e_login" }, { status: 401 });
  const { id, action } = await req.json();
  if (!["suspend", "restore"].includes(action)) return Response.json({ error: "e_bad" });
  const t = await db.user.findUnique({ where: { id } });
  if (!t || t.role === "ADMIN") return Response.json({ error: "e_bad" });
  const sus = action === "suspend";
  await db.user.update({ where: { id }, data: { suspended: sus } });
  if (sus) await db.job.updateMany({ where: { postedById: id, status: { in: ["APPROVED", "PENDING"] } }, data: { status: "CLOSED" } });
  await audit(a.id, sus ? "USER_SUSPEND" : "USER_RESTORE", id, t.email);
  return Response.json({ ok: true });
}
