"use client";
import { useEffect, useState } from "react";
import { useT } from "./Lang";
export default function Install() {
  const t = useT(), [ev, setEv] = useState(null), [done, setDone] = useState(false);
  useEffect(() => {
    const h = e => { e.preventDefault(); setEv(e); };
    window.addEventListener("beforeinstallprompt", h);
    window.addEventListener("appinstalled", () => setDone(true));
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);
  if (done) return <p>✅ {t("dl_done")}</p>;
  return ev
    ? <button className="btn f" onClick={async () => { ev.prompt(); await ev.userChoice; setEv(null); }}>{t("dl_install")}</button>
    : <p style={{ color: "var(--mut)" }}>{t("dl_hint")}</p>;
}
