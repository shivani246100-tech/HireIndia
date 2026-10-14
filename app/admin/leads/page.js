import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default async function Leads() {
  const u = await getUser();
  if (!u || u.role !== "ADMIN") redirect("/login");
  const t = k => tr(cookies().get("lang")?.value === "en" ? "en" : "hi", k);
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (<main className="w"><h2>{t("leads_t")} ({leads.length})</h2><div className="card ov"><table><tbody>
    <tr><th>{t("name")}</th><th>{t("lead_phone")}</th><th>{t("email")}</th><th>{t("lead_company")}</th><th>{t("lead_org")}</th><th></th></tr>
    {leads.map(l => <tr key={l.id}><td>{l.name}</td><td>{l.phone}</td><td>{l.email}</td><td>{l.kind}</td><td>{l.org}</td><td>{l.createdAt.toLocaleDateString("en-IN")}</td></tr>)}</tbody></table></div></main>);
}
