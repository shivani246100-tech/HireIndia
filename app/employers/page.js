import Link from "next/link";
import { cookies } from "next/headers";
import { tr } from "@/lib/i18n";
import LeadForm from "@/components/LeadForm";
export const metadata = { title: "Hire talent – For Employers" };
export default function Employers() {
  const t = k => tr(cookies().get("lang")?.value === "en" ? "en" : "hi", k);
  return (<>
    <section className="dark"><div className="w"><div>
      <h1>{t("em_h1")}</h1><p>{t("em_sub")}</p>
      <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Link className="btn" style={{ background: "#fff" }} href="/pricing">{t("em_cta")}</Link><Link className="btn" style={{ color: "#fff", borderColor: "#fff", background: "transparent" }} href="/employer">{t("em_post")}</Link></p></div>
      <LeadForm /></div></section>
    <main className="w"><h2>{t("why_h")}</h2>
      <div className="why">{[1, 2, 3].map(i => <div className="card" key={i} style={{ marginTop: 0 }}><h3>{t("w" + i + "t")}</h3><p style={{ color: "var(--mut)", marginBottom: 0 }}>{t("w" + i + "d")}</p></div>)}</div></main></>);
}
