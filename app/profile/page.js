import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import Upload from "@/components/Upload";
import ProfileEdit from "@/components/ProfileEdit";
import DeleteAccount from "@/components/DeleteAccount";
export const dynamic = "force-dynamic";
export default async function Profile() {
  const u = await getUser();
  if (!u) redirect("/login");
  const t = k => tr(cookies().get("lang")?.value === "hi" ? "hi" : "en", k);
  const [apps, saved] = await Promise.all([
    db.application.findMany({ where: { userId: u.id }, include: { job: true }, orderBy: { createdAt: "desc" } }),
    db.savedJob.findMany({ where: { userId: u.id }, include: { job: true } }) ]);
  const p = { phone: u.phone, city: u.city, skills: u.skills, education: u.education, experience: u.experience, visible: u.visible };
  const fields = [u.phone, u.city, u.skills, u.education, u.experience, u.resumeUrl];
  const pct = Math.round((fields.filter(Boolean).length / fields.length) * 100);
  const short = apps.filter(a => ["SHORTLISTED", "INTERVIEW", "SELECTED"].includes(a.status)).length;
  return (<main className="w"><h2>{u.name}</h2><p style={{ color: "var(--mut)" }}>{u.email}</p>
    <div className="stats"><div className="stat"><b>{apps.length}</b><span>{t("st_apps")}</span></div><div className="stat"><b>{short}</b><span>{t("st_short")}</span></div><div className="stat"><b>{saved.length}</b><span>{t("saved_jobs")}</span></div><div className="stat"><b>{pct}%</b><span>{t("complete")}</span></div></div>
    <div className="card"><div className="bar" style={{ marginTop: 0 }}><div style={{ width: pct + "%" }} /></div></div>
    <ProfileEdit u={p} /><Upload uid={u.id} has={!!u.resumeUrl} />
    <h3>{t("my_apps")} ({apps.length})</h3>
    {apps.length === 0 && <div className="card">{t("no_apps")}</div>}
    {apps.map(a => <div className="card" key={a.id}><Link href={`/jobs/${a.job.id}`}><b>{a.job.title}</b></Link> · {a.job.company}
      <div className="m"><span>📍 {a.job.location}</span><span>{a.createdAt.toLocaleDateString("en-IN")}</span><span className="t"><span>{t("s_" + a.status)}</span></span></div></div>)}
    <h3>{t("saved_jobs")} ({saved.length})</h3>
    {saved.map(s => <div className="card" key={s.id}><Link href={`/jobs/${s.job.id}`}><b>{s.job.title}</b></Link> · {s.job.company}<div className="m"><span>📍 {s.job.location}</span></div></div>)}
    {u.role !== "ADMIN" && <DeleteAccount />}</main>);
}
