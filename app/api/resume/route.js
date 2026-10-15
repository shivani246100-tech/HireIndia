import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
const TYPES = { pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  const f = (await req.formData()).get("file");
  if (!f || typeof f === "string" || f.size === 0 || f.size > 4e6) return Response.json({ error: "e_file" });
  const ext = (f.name.split(".").pop() || "").toLowerCase();
  if (!TYPES[ext]) return Response.json({ error: "e_type" });
  const { url } = await put(`resumes/${u.id}.${ext}`, f, { access: "public", addRandomSuffix: true, contentType: TYPES[ext] });
  if (u.resumeUrl) { try { await del(u.resumeUrl); } catch {} }
  await db.user.update({ where: { id: u.id }, data: { resumeUrl: url } });
  return Response.json({ ok: true });
}
