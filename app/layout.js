import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import { LangProvider, Toggle } from "@/components/Lang";
import Out from "@/components/Out";
export const metadata = { title: "HireIndia – Jobs | नौकरी", description: "India's job portal" };
export default async function L({ children }) {
  const lang = cookies().get("lang")?.value === "en" ? "en" : "hi";
  const u = await getUser();
  const t = k => tr(lang, k);
  return (<html lang={lang}><body><LangProvider lang={lang}>
    <header><div className="w"><Link href="/" className="logo">Hire<b>India</b></Link><span className="sp" />
      <Toggle />
      {u?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
      <Link href="/employer">{t("emp")}</Link>
      {u?.role === "EMPLOYER" && <Link href="/dashboard">{t("nav_dash")}</Link>}
      {u && <Link href="/profile">{t("nav_prof")}</Link>}
      {u ? <><span>{u.name}</span><Out /></> : <Link className="btn f" href="/login">{t("login")}</Link>}
    </div></header>{children}</LangProvider></body></html>);
}
