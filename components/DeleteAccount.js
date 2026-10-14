"use client";
import { useState } from "react";
import { useT } from "./Lang";
export default function DeleteAccount() {
  const t = useT(), [m, setM] = useState("");
  return (<form className="card col" style={{ margin: "20px 0", maxWidth: "none", borderColor: "#e0b4b4" }} onSubmit={async e => {
    e.preventDefault();
    if (!confirm(t("del_confirm"))) return;
    const r = await fetch("/api/account", { method: "DELETE", body: JSON.stringify({ password: new FormData(e.target).get("password") }) });
    const d = await r.json();
    if (d.ok) location.href = "/"; else setM(d.error);
  }}><h3 style={{ margin: 0, color: "#b00020" }}>{t("del_acc")}</h3><p style={{ margin: 0 }}>{t("del_acc_d")}</p>
    <input name="password" type="password" placeholder={t("pass")} required />
    {m && <div style={{ color: "#c00" }}>{t(m)}</div>}
    <button className="btn" style={{ borderColor: "#b00020", color: "#b00020" }}>{t("del_acc")}</button></form>);
}
