import Link from "next/link";
import { cookies } from "next/headers";
import { tr } from "@/lib/i18n";
const email = process.env.CONTACT_EMAIL || "support@example.com";
export const metadata = { title: "Delete account" };
export default function Page() {
  const t = k => tr(cookies().get("lang")?.value === "en" ? "en" : "hi", k);
  return (<main className="w"><div className="card"><h2 style={{ marginTop: 0 }}>{t("del_acc")}</h2>
    <p>{t("del_p1")}</p>
    <p>{t("del_p2")}</p>
    <p>{t("del_p3")}</p>
    <p>{t("del_p4")} <b>{email}</b></p>
    <Link className="btn f" href="/profile">{t("nav_prof")}</Link></div></main>);
}
