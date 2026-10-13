import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import Del from "@/components/Del";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const u = await getUser();
  if (!u || u.role !== "ADMIN") redirect("/login");
  const t = k => tr(cookies().get("lang")?.value === "en" ? "en" : "hi", k);
  const [users, jobs, pays, apps] = await Promise.all([
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.job.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { _count: { select: { apps: true } } } }),
    db.payment.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.application.count() ]);
  const rev = pays.filter(p => p.status === "PAID").reduce((a, p) => a + p.amount, 0) / 100;
  return (<main className="w"><h2>{t("ad_t")}</h2>
    <div className="card">👤 {t("ad_users")}: <b>{users.length}</b> · 💼 {t("ad_jobs")}: <b>{jobs.length}</b> · 📨 {t("ad_apps")}: <b>{apps}</b> · ₹ {t("ad_rev")}: <b>{rev}</b></div>
    <h3>{t("ad_users")}</h3><div className="card ov"><table><tbody>
      <tr><th>{t("name")}</th><th>{t("email")}</th><th>{t("ad_role")}</th><th>{t("ad_plan")}</th></tr>
      {users.map(x => <tr key={x.id}><td>{x.name}</td><td>{x.email}</td><td>{x.role}</td><td>{x.plan}</td></tr>)}</tbody></table></div>
    <h3>{t("ad_jobs")}</h3><div className="card ov"><table><tbody>
      {jobs.map(j => <tr key={j.id}><td>{j.title}</td><td>{j.company}</td><td>{j.location}</td><td>📨 {j._count.apps}</td><td><Del id={j.id} /></td></tr>)}</tbody></table></div>
    <h3>{t("ad_pay")}</h3><div className="card ov"><table><tbody>
      <tr><th>{t("ad_amt")}</th><th>{t("ad_status")}</th><th>ID</th></tr>
      {pays.map(p => <tr key={p.id}><td>{p.amount / 100}</td><td>{p.status}</td><td>{p.paymentId || p.orderId}</td></tr>)}</tbody></table></div></main>);
}
