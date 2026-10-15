import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import Del from "@/components/Del";
import { Approve } from "@/components/Actions";
import UserActions from "@/components/UserActions";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const u = await getUser();
  if (!u || u.role !== "ADMIN") redirect("/login");
  const t = k => tr(cookies().get("lang")?.value === "hi" ? "hi" : "en", k);
  const [users, jobs, pays, apps, reports, logs] = await Promise.all([
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.job.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { _count: { select: { apps: true } } } }),
    db.payment.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.application.count(),
    db.report.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { job: true, user: true } }),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 30 }) ]);
  const rev = pays.filter(p => p.status === "PAID").reduce((a, p) => a + p.amount, 0) / 100;
  const pending = jobs.filter(j => j.status === "PENDING");
  return (<main className="w"><h2>{t("ad_t")}</h2>
    <div className="stats">
      <div className="stat"><b>{users.length}</b><span>{t("ad_users")}</span></div>
      <div className="stat"><b>{pending.length}</b><span>{t("ad_pending")}</span></div>
      <div className="stat"><b>{jobs.length}</b><span>{t("ad_jobs")}</span></div>
      <div className="stat"><b>{apps}</b><span>{t("ad_apps")}</span></div>
      <div className="stat"><b>{reports.length}</b><span>{t("ad_reports")}</span></div>
      <div className="stat"><b>₹{rev}</b><span>{t("ad_rev")}</span></div></div>
    {pending.length > 0 && <><h3>⏳ {t("ad_pending")}</h3><div className="card ov"><table><tbody>
      {pending.map(j => <tr key={j.id}><td><Link href={`/jobs/${j.id}`} style={{ color: "var(--pri)" }}>{j.title}</Link></td><td>{j.company}</td><td>{j.location}</td><td><Approve id={j.id} /></td></tr>)}</tbody></table></div></>}
    {reports.length > 0 && <><h3>🚩 {t("ad_reports")}</h3><div className="card ov"><table><tbody>
      <tr><th>{t("ad_jobs")}</th><th>{t("reason")}</th><th>{t("email")}</th></tr>
      {reports.map(r => <tr key={r.id}><td><Link href={`/jobs/${r.job.id}`} style={{ color: "var(--pri)" }}>{r.job.title}</Link> · {r.job.company}</td><td>{t("rep_" + r.reason.toLowerCase())}</td><td>{r.user.email}</td></tr>)}</tbody></table></div></>}
    <h3>{t("ad_jobs")}</h3><div className="card ov"><table><tbody>
      {jobs.map(j => <tr key={j.id}><td>{j.title}</td><td>{j.company}</td><td>{j.location}</td><td>📨 {j._count.apps}</td><td>{j.status}</td><td><Approve id={j.id} /></td><td><Del id={j.id} /></td></tr>)}</tbody></table></div>
    <h3>{t("ad_users")}</h3><div className="card ov"><table><tbody>
      <tr><th>{t("name")}</th><th>{t("email")}</th><th>{t("ad_role")}</th><th>{t("ad_plan")}</th><th>{t("ad_status")}</th><th></th></tr>
      {users.map(x => <tr key={x.id}><td>{x.name}</td><td>{x.email}</td><td>{x.role}</td><td>{x.plan}</td><td>{x.suspended ? "🚫 " + t("suspended_l") : "✓"}</td><td>{x.role !== "ADMIN" && <UserActions id={x.id} suspended={x.suspended} />}</td></tr>)}</tbody></table></div>
    <h3>{t("ad_pay")}</h3><div className="card ov"><table><tbody>
      <tr><th>{t("ad_amt")}</th><th>{t("ad_status")}</th><th>ID</th></tr>
      {pays.map(p => <tr key={p.id}><td>{p.amount / 100}</td><td>{p.status}</td><td>{p.paymentId || p.orderId}</td></tr>)}</tbody></table></div>
    <h3>🧾 {t("ad_audit")}</h3><div className="card ov"><table><tbody>
      <tr><th>{t("ad_when")}</th><th>{t("ad_action")}</th><th>{t("ad_note")}</th></tr>
      {logs.map(l => <tr key={l.id}><td>{l.createdAt.toLocaleString("en-IN")}</td><td>{l.action}</td><td>{l.note || l.target}</td></tr>)}</tbody></table></div></main>);
}
