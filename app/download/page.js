import { cookies } from "next/headers";
import { tr } from "@/lib/i18n";
import Install from "@/components/Install";
export const metadata = { title: "Get the app" };
export default function Download() {
  const t = k => tr(cookies().get("lang")?.value === "en" ? "en" : "hi", k);
  const play = process.env.PLAY_URL;
  return (<main className="w"><section className="dl"><h1>{t("dl_h")}</h1><p>{t("dl_sub")}</p>
    <Install />
    {play ? <p><a className="btn" href={play}>Google Play</a></p> : <p style={{ color: "var(--mut)" }}>{t("dl_play")}</p>}</section>
    <div className="why">{["a", "i", "d"].map(k => <div className="card" key={k} style={{ marginTop: 0 }}><h3>{t("dl_" + k + "_t")}</h3><p style={{ color: "var(--mut)", marginBottom: 0 }}>{t("dl_" + k + "_d")}</p></div>)}</div></main>);
}
