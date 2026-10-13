"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "./Lang";
export default function EditForm({ job }) {
  const t = useT(), r = useRouter(), [m, setM] = useState("");
  return (<form className="col" onSubmit={async e => {
    e.preventDefault();
    const x = await fetch("/api/jobs", { method: "PATCH", body: JSON.stringify({ id: job.id, action: "edit", ...Object.fromEntries(new FormData(e.target)) }) });
    const d = await x.json();
    if (d.ok) { r.push("/dashboard"); r.refresh(); } else setM(d.error);
  }}><h2>{t("edit")}</h2>
    <input name="title" defaultValue={job.title} placeholder={t("f_title")} required />
    <input name="company" defaultValue={job.company} placeholder={t("f_company")} required />
    <input name="location" defaultValue={job.location} placeholder={t("f_city")} required />
    <select name="mode" defaultValue={job.mode}><option value="OFFICE">{t("m_OFFICE")}</option><option value="REMOTE">{t("m_REMOTE")}</option><option value="HYBRID">{t("m_HYBRID")}</option></select>
    <input name="minExp" type="number" defaultValue={job.minExp} placeholder={t("f_exp")} />
    <input name="salary" type="number" defaultValue={job.salary} placeholder={t("f_sal")} required />
    <input name="skills" defaultValue={job.skills} placeholder={t("f_skills")} required />
    <textarea name="description" rows={4} defaultValue={job.description} placeholder={t("f_desc")} required />
    <label style={{ color: "var(--mut)" }}>{t("last_date")}</label><input name="expiresAt" type="date" defaultValue={job.expiresAt} />
    {m && <div style={{ color: "#c00" }}>{t(m)}</div>}<button className="btn f">{t("save_c")}</button></form>);
}
