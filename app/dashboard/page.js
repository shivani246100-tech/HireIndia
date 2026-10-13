import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import { StatusSel } from "@/components/Actions";
import JobActions from "@/components/JobActions";
export const dynamic = "force-dynamic";
export default async function Dash() {
  const u = await getUser();
  if (!u || (u.role !== "EMPLOYER" && u.role !== "ADMIN")) redirect("/login");
  const t = k => tr(cookies().get("lang")?.value === "en" ? "en" : "hi", k);
  const jobs = await db.job.findMany({ where: { postedById: u.id }, orderBy: { createdAt: "desc" }, include: { apps: { include: { user: true } } } });
  return (<main className="w"><h2>{t("nav_dash")}</h2>
    {jobs.map(j => <div className="card" key={j.id}><h3>{j.title} · {j.company} {j.status !== "APPROVED" && <small style={{ color: "#c60" }}>({j.status})</small>}</h3>
      <p style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}><span>{t("applicants")}: <b>{j.apps.length}</b></span><JobActions id={j.id} status={j.status} /></p>
      {j.apps.length === 0 ? <p style={{ color: "var(--mut)" }}>{t("no_app_yet")}</p> : <div className="ov"><table><tbody>{j.apps.map(a => <tr key={a.id}>
        <td>{a.user.name}</td><td>{a.user.email}</td><td>{a.user.phone || "-"}</td><td>{a.user.skills || "-"}</td>
        <td>{a.user.resumeUrl ? <a href={a.user.resumeUrl} target="_blank" style={{ color: "var(--pri)" }}>📄 {t("view_resume")}</a> : t("no_resume")}</td>
        <td><StatusSel id={a.id} value={a.status} /></td></tr>)}</tbody></table></div>}</div>)}</main>);
}
