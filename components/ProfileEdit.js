"use client";
import { useState } from "react";
import { useT } from "./Lang";
export default function ProfileEdit({ u }) {
  const t = useT(), [m, setM] = useState("");
  return (<form className="card col" style={{ margin: "12px 0", maxWidth: "none" }} onSubmit={async e => {
    e.preventDefault();
    await fetch("/api/profile", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
    setM("saved_p"); }}>
    <input name="phone" defaultValue={u.phone || ""} placeholder={t("phone")} />
    <input name="city" defaultValue={u.city || ""} placeholder={t("ph_loc")} />
    <input name="skills" defaultValue={u.skills || ""} placeholder={t("f_skills")} />
    <input name="education" defaultValue={u.education || ""} placeholder={t("education")} />
    <textarea name="experience" rows={3} defaultValue={u.experience || ""} placeholder={t("experience")} />
    <label style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><input type="checkbox" name="visible" defaultChecked={u.visible} style={{ width: "auto", flex: "none", minWidth: 0, marginTop: 4 }} /><span>{t("visible_label")}</span></label>
    {m && <div>{t(m)}</div>}<button className="btn f">{t("save_p")}</button></form>);
}
