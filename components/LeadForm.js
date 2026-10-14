"use client";
import { useState } from "react";
import { useT } from "./Lang";
export default function LeadForm() {
  const t = useT(), [m, setM] = useState("");
  return (<form className="lead" onSubmit={async e => {
    e.preventDefault();
    const r = await fetch("/api/lead", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
    const d = await r.json();
    if (d.ok) { setM("lead_ok"); e.target.reset(); } else setM(d.error || "e_bad_form");
  }}><h3 style={{ margin: 0 }}>{t("lead_t")}</h3>
    <input name="name" placeholder={t("name")} required />
    <input name="phone" placeholder={t("lead_phone")} required />
    <input name="email" type="email" placeholder={t("lead_email")} required />
    <select name="kind"><option value="COMPANY">{t("lead_company")}</option><option value="CONSULTANCY">{t("lead_cons")}</option></select>
    <input name="org" placeholder={t("lead_org")} />
    <input name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
    {m && <div style={{ color: m === "lead_ok" ? "var(--pri)" : "#c00" }}>{t(m)}</div>}
    <button className="btn f">{t("lead_send")}</button></form>);
}
