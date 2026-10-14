"use client";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/components/Lang";
export default function Employer() {
  const t = useT(), [msg, setMsg] = useState("");
  async function post(e) {
    e.preventDefault();
    const r = await fetch("/api/jobs", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
    if (r.status === 401) return (location.href = "/login");
    const d = await r.json();
    setMsg(d.ok ? "posted" : d.error); if (d.ok) e.target.reset();
  }
  return (<div className="w"><div className="card"><h3>{t("plans_link")}</h3><p>{t("plans_d")}</p><Link className="btn f" href="/pricing">{t("nav_plans")}</Link></div>
    <form className="col" style={{ margin: "0 auto" }} onSubmit={post}><h2>{t("post_t")}</h2>
      <input name="title" placeholder={t("f_title")} required /><input name="company" placeholder={t("f_company")} required />
      <input name="location" placeholder={t("f_city")} required />
      <select name="mode"><option value="OFFICE">{t("m_OFFICE")}</option><option value="REMOTE">{t("m_REMOTE")}</option><option value="HYBRID">{t("m_HYBRID")}</option></select>
      <input name="minExp" type="number" placeholder={t("f_exp")} /><input name="salary" type="number" placeholder={t("f_sal")} required />
      <input name="skills" placeholder={t("f_skills")} required /><textarea name="description" rows={4} placeholder={t("f_desc")} required />
      <label style={{ color: "var(--mut)" }}>{t("last_date")}</label><input name="expiresAt" type="date" />
      {msg && <div>{t(msg)}</div>}<button className="btn f">{t("post")}</button></form></div>);
}
