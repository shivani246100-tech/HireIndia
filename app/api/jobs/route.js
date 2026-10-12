import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req) {
  const u = await getUser();
  if (!u || u.role !== "EMPLOYER") return Response.json({ error: "सिर्फ़ नियोक्ता जॉब पोस्ट कर सकते हैं" }, { status: 401 });
  if (u.plan !== "PRO" && (await db.job.count({ where: { postedById: u.id } })) >= 1)
    return Response.json({ error: "फ्री प्लान में 1 जॉब। अनलिमिटेड के लिए PRO खरीदें।" });
  const b = await req.json();
  await db.job.create({ data: { title: b.title, company: b.company, location: b.location, mode: b.mode, minExp: +b.minExp || 0, salary: +b.salary || 0, skills: b.skills, description: b.description, postedById: u.id } });
  return Response.json({ ok: true });
}
