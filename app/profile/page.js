import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import Upload from "@/components/Upload";
export const dynamic = "force-dynamic";
export default async function Profile() {
  const u = await getUser();
  if (!u) redirect("/login");
  const t = k => tr(cookies().get("lang")?.value === "en" ? "en" : "hi", k);
  const apps = await db.application.findMany({ where: { userId: u.id }, include: { job: true }, orderBy: { createdAt: "desc" } });
  return (<main className="w"><h2>{u.name}</h2><p style={{ color: "var(--mut)" }}>{u.email}</p>
    <Upload url={u.resumeUrl} /><h3>{t("my_apps")} ({apps.length})</h3>
    {apps.length === 0 && <div className="card">{t("no_apps")}</div>}
    {apps.map(a => <div className="card" key={a.id}><b>{a.job.title}</b> · {a.job.company}<div className="m"><span>📍 {a.job.location}</span><span>{a.createdAt.toLocaleDateString("en-IN")}</span></div></div>)}</main>);
}
