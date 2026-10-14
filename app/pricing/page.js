import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import { PLANS, planInfo } from "@/lib/plans";
import Buy from "@/components/Buy";
export const dynamic = "force-dynamic";
export const metadata = { title: "Plans & Pricing" };
export default async function Pricing() {
  const t = k => tr(cookies().get("lang")?.value === "en" ? "en" : "hi", k);
  const u = await getUser(), pi = planInfo(u);
  return (<main className="w"><h1 style={{ textAlign: "center", marginBottom: 4 }}>{t("pr_h")}</h1>
    <p style={{ textAlign: "center", color: "var(--mut)" }}>{t("pr_sub")}</p>
    {pi.active && u.planUntil && <div className="card">✅ {t("cur_plan")} · {t("valid_till")}: {u.planUntil.toLocaleDateString("en-IN")}</div>}
    <div className="plans">{Object.entries(PLANS).map(([k, p], i) => (<div className={"plan" + (i === 1 ? " pop" : "")} key={k}>
      {i === 1 && <span className="tag">{t("popular")}</span>}
      <h3 style={{ margin: 0 }}>{p.days} {t("days_plan")}</h3><div className="price">₹{p.price.toLocaleString("en-IN")}</div>
      <ul><li>{p.jobs} {t("job_posts")}</li><li>{t("f_apply")}</li><li>{t("f_search")}</li><li>{t("f_track")}</li></ul>
      <Buy plan={k} /></div>))}</div>
    <p style={{ textAlign: "center", color: "var(--mut)", fontSize: 13 }}>{t("pr_note")}</p></main>);
}
