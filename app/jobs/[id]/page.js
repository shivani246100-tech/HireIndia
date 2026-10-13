import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import Apply from "@/components/Apply";
import { Save, Report } from "@/components/Actions";
export const dynamic = "force-dynamic";
export default async function JobPage({ params }) {
  const lang = cookies().get("lang")?.value === "en" ? "en" : "hi";
  const t = k => tr(lang, k);
  const [j, u] = await Promise.all([db.job.findUnique({ where: { id: params.id } }), getUser()]);
  if (!j || (j.status !== "APPROVED" && !(u && (u.role === "ADMIN" || u.id === j.postedById)))) notFound();
  const saved = u ? !!(await db.savedJob.findUnique({ where: { userId_jobId: { userId: u.id, jobId: j.id } } })) : false;
  const expired = j.expiresAt && j.expiresAt < new Date();
  const mode = tr(lang, "m_" + j.mode) === "m_" + j.mode ? j.mode : tr(lang, "m_" + j.mode);
  return (<main className="w"><div className="card">
    {j.status !== "APPROVED" && <div style={{ color: "#c60" }}>⏳ {j.status}</div>}
    {expired && <div style={{ color: "#c00" }}>⛔ {t("expired")}</div>}
    <h2 style={{ margin: 0 }}>{j.title}</h2><div><Link href={`/company/${encodeURIComponent(j.company)}`} style={{ color: "var(--pri)" }}>{j.company}</Link></div>
    <div className="m"><span>💼 {j.minExp}+ {t("yrs")}</span><span>₹ {j.salary} LPA</span><span>📍 {j.location} ({mode})</span><span>{j.createdAt.toLocaleDateString("en-IN")}</span>
      {j.expiresAt && <span>⏰ {t("until")}: {j.expiresAt.toLocaleDateString("en-IN")}</span>}</div>
    <p style={{ whiteSpace: "pre-wrap" }}>{j.description}</p>
    <div className="t">{j.skills.split(",").map(s => <span key={s}>{s.trim()}</span>)}</div>
    <p style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>{!expired && <Apply id={j.id} />}<Save id={j.id} saved={saved} /><Report id={j.id} /></p></div></main>);
}
