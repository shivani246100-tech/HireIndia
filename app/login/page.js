"use client";
import { useEffect, useState } from "react";
import { useT } from "@/components/Lang";
export default function Login() {
  const t = useT(), [reg, setReg] = useState(false), [err, setErr] = useState("");
  useEffect(() => { if (new URLSearchParams(location.search).get("reg")) setReg(true); }, []);
  async function go(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const r = await fetch("/api/auth", { method: "POST", body: JSON.stringify({ mode: reg ? "reg" : "login", ...f }) });
    const d = await r.json();
    d.ok ? (location.href = "/") : setErr(d.error);
  }
  return (<form className="col" onSubmit={go}><h2>{reg ? t("t_reg") : t("t_login")}</h2>
    {reg && <><input name="name" placeholder={t("name")} required />
      <select name="role"><option value="SEEKER">{t("role_s")}</option><option value="EMPLOYER">{t("role_e")}</option></select></>}
    <input name="email" type="email" placeholder={t("email")} required />
    <input name="password" type="password" minLength={6} placeholder={t("pass")} required />
    {err && <div style={{ color: "#c00" }}>{t(err)}</div>}
    <button className="btn f">{reg ? t("b_reg") : t("b_login")}</button>
    <a href="#" onClick={e => { e.preventDefault(); setReg(!reg); }}>{reg ? t("sw_login") : t("sw_reg")}</a></form>);
}
