import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "लॉगिन करें" }, { status: 401 });
  const f = (await req.formData()).get("file");
  if (!f || f.size > 4e6) return Response.json({ error: "4MB तक की फाइल दें" });
  const { url } = await put(`resumes/${u.id}-${f.name}`, f, { access: "public" });
  await db.user.update({ where: { id: u.id }, data: { resumeUrl: url } });
  return Response.json({ ok: true, url });
}
