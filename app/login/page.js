"use client";
import { useState } from "react";
export default function Login() {
  const [reg, setReg] = useState(false), [err, setErr] = useState("");
  async function go(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const r = await fetch("/api/auth", { method: "POST", body: JSON.stringify({ mode: reg ? "reg" : "login", ...f }) });
    const d = await r.json();
    d.ok ? (location.href = "/") : setErr(d.error);
  }
  return (<form className="col" onSubmit={go}><h2>{reg ? "प्रोफाइल बनाएं" : "लॉगिन करें"}</h2>
    {reg && <><input name="name" placeholder="पूरा नाम" required />
      <select name="role"><option value="SEEKER">मैं नौकरी खोज रहा हूं</option><option value="EMPLOYER">मैं नियोक्ता हूं</option></select></>}
    <input name="email" type="email" placeholder="ईमेल" required />
    <input name="password" type="password" minLength={6} placeholder="पासवर्ड" required />
    {err && <div style={{ color: "#c00" }}>{err}</div>}
    <button className="btn f">{reg ? "रजिस्टर करें" : "लॉगिन"}</button>
    <a href="#" onClick={e => { e.preventDefault(); setReg(!reg); }}>{reg ? "पहले से अकाउंट है? लॉगिन" : "नया अकाउंट बनाएं"}</a></form>);
}
