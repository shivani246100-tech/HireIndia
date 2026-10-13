import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { tr } from "@/lib/i18n";
import Apply from "@/components/Apply";
export const dynamic = "force-dynamic";
export default async function Company({ params }) {
  const lang = cookies().get("lang")?.value === "en" ? "en" : "hi";
  const t = k => tr(lang, k);
  const name = decodeURIComponent(params.name);
  const jobs = await db.job.findMany({
    where: { company: name, status: "APPROVED", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { createdAt: "desc" } });
  if (!jobs.length) notFound();
  return (<main className="w"><div className="card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
    <div className="co" style={{ border: 0, padding: 0 }}><i>{name[0].toUpperCase()}</i></div>
    <div><h2 style={{ margin: 0 }}>{name}</h2><div style={{ color: "var(--mut)" }}>{jobs.length} {t("openings")}</div></div></div>
    <h3>{t("company_jobs")}</h3>
    {jobs.map(j => <div className="card" key={j.id}><h3><Link href={`/jobs/${j.id}`}>{j.title}</Link></h3>
      <div className="m"><span>💼 {j.minExp}+ {t("yrs")}</span><span>₹ {j.salary} LPA</span><span>📍 {j.location}</span></div>
      <p><Apply id={j.id} /></p></div>)}</main>);
}
