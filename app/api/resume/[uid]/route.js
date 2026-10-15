import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { planInfo } from "@/lib/plans";
export async function GET(req, { params }) {
  const v = await getUser();
  if (!v) return new Response("Login required", { status: 401 });
  const c = await db.user.findUnique({ where: { id: params.uid } });
  if (!c || !c.resumeUrl) return new Response("Not found", { status: 404 });
  let ok = v.id === c.id || v.role === "ADMIN";
  if (!ok && v.role === "EMPLOYER") {
    ok = !!(await db.application.findFirst({ where: { userId: c.id, job: { postedById: v.id } } }));
    if (!ok && c.visible && planInfo(v).active) ok = true;
  }
  if (!ok) return new Response("Forbidden", { status: 403 });
  const r = await fetch(c.resumeUrl);
  if (!r.ok) return new Response("Not found", { status: 404 });
  const ext = c.resumeUrl.split("?")[0].split(".").pop();
  return new Response(r.body, { headers: {
    "Content-Type": r.headers.get("content-type") || "application/octet-stream",
    "Content-Disposition": `inline; filename="resume.${ext}"`,
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
