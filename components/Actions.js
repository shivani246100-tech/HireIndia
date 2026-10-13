"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "./Lang";
const post = (u, b, m = "POST") => fetch(u, { method: m, body: JSON.stringify(b) });
export function Save({ id, saved }) {
  const t = useT(), r = useRouter(), [s, setS] = useState(saved);
  return <button className="btn" onClick={async () => {
    const x = await post("/api/save", { jobId: id });
    if (x.status === 401) return (location.href = "/login");
    setS((await x.json()).saved); r.refresh();
  }}>{s ? t("saved") : t("save")}</button>;
}
export function Approve({ id }) {
  const t = useT(), r = useRouter();
  const go = async st => { await post("/api/admin", { id, status: st }, "PATCH"); r.refresh(); };
  return <><button className="btn f" onClick={() => go("APPROVED")}>{t("approve")}</button> <button className="btn" onClick={() => go("REJECTED")}>{t("reject")}</button></>;
}
export function StatusSel({ id, value }) {
  const t = useT(), r = useRouter();
  return <select defaultValue={value} style={{ minWidth: 120 }} onChange={async e => { await post("/api/status", { appId: id, status: e.target.value }); r.refresh(); }}>
    {["APPLIED", "REVIEW", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"].map(s => <option key={s} value={s}>{t("s_" + s)}</option>)}</select>;
}
export function ProfileForm({ u }) {
  const t = useT(), [m, setM] = useState("");
  return (<form className="card col" style={{ margin: "12px 0", maxWidth: "none" }} onSubmit={async e => {
    e.preventDefault(); await post("/api/profile", Object.fromEntries(new FormData(e.target))); setM("saved_p"); }}>
    <input name="phone" defaultValue={u.phone || ""} placeholder={t("phone")} />
    <input name="city" defaultValue={u.city || ""} placeholder={t("ph_loc")} />
    <input name="skills" defaultValue={u.skills || ""} placeholder={t("f_skills")} />
    <input name="education" defaultValue={u.education || ""} placeholder={t("education")} />
    <textarea name="experience" rows={3} defaultValue={u.experience || ""} placeholder={t("experience")} />
    {m && <div>{t(m)}</div>}<button className="btn f">{t("save_p")}</button></form>);
}
