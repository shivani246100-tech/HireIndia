import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import { LangProvider, Toggle } from "@/components/Lang";
import Out from "@/components/Out";
import SW from "@/components/SW";
import GT from "@/components/GT";
const SITE = process.env.SITE_URL || "https://hire-india-two.vercel.app";
export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: "HireIndia – Jobs in India | नौकरी खोजें", template: "%s | HireIndia" },
  description: "Search jobs by skill, city and experience. Free for job seekers. | स्किल, शहर और अनुभव से नौकरी खोजें, उम्मीदवारों के लिए मुफ़्त।",
  applicationName: "HireIndia",
  openGraph: { type: "website", siteName: "HireIndia", title: "HireIndia – Jobs in India", description: "Find your next job on HireIndia." } };
export const viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };
const F = {
  hi: { about: "हमारे बारे में", contact: "संपर्क करें", privacy: "प्राइवेसी पॉलिसी", terms: "नियम व शर्तें", refund: "रिफंड पॉलिसी" },
  en: { about: "About us", contact: "Contact us", privacy: "Privacy Policy", terms: "Terms & Conditions", refund: "Refund Policy" } };
export default async function L({ children }) {
  const lang = cookies().get("lang")?.value === "hi" ? "hi" : "en";
  const u = await getUser();
  const t = k => tr(lang, k);
  return (<html lang={lang}><body><LangProvider lang={lang}><SW /><GT />
    <header><div className="w"><Link href="/" className="logo notranslate">Hire<b>India</b></Link>
      <Link href="/#jobs">{t("nav_jobs")}</Link><Link href="/#companies">{t("nav_co")}</Link><span className="sp" />
      <Toggle />
      {u?.role === "ADMIN" && <><Link href="/admin">Admin</Link><Link href="/admin/leads">Leads</Link></>}
      {u?.role === "EMPLOYER" && <Link href="/pricing">{t("nav_plans")}</Link>}
      {(u?.role === "EMPLOYER" || u?.role === "ADMIN") && <Link href="/search">{t("find_t")}</Link>}
      {u?.role === "EMPLOYER" && <Link href="/dashboard">{t("nav_dash")}</Link>}
      {u && <Link href="/profile">{t("nav_prof")}</Link>}
      {u ? <><span>{u.role === "ADMIN" ? "" : u.name}</span><Out /></> : <><Link className="btn" href="/login">{t("b_login")}</Link><Link className="btn f" href="/login?reg=1">{t("b_reg")}</Link></>}
      <Link href="/employers">{t("emp")}</Link>
    </div></header>{children}
    <footer><div className="w"><span>© HireIndia</span>
      {Object.keys(F.en).map(k => <Link key={k} href={`/info/${k}`}>{F[lang][k]}</Link>)}
      <Link href="/download">📲 {t("nav_app")}</Link></div></footer>
  </LangProvider></body></html>);
}
