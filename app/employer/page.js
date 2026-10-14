"use client";
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
  async function buy() {
    const r = await fetch("/api/pay/order", { method: "POST" });
    if (r.status === 401) return (location.href = "/login");
    const o = await r.json();
    await new Promise(res => { const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = res; document.body.appendChild(s); });
    new window.Razorpay({ key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, amount: o.amount, currency: "INR", name: "HireIndia", description: "PRO - Unlimited job posting", order_id: o.orderId,
      handler: async resp => { const v = await fetch("/api/pay/verify", { method: "POST", body: JSON.stringify(resp) }); setMsg((await v.json()).ok ? "pro_on" : "e_pay"); } }).open();
  }
  return (<div className="w"><div className="card"><h3>{t("pro_t")}</h3><p>{t("pro_d")}</p><button className="btn f" onClick={buy}>{t("buy")}</button></div>
    <form className="col" style={{ margin: "0 auto" }} onSubmit={post}><h2>{t("post_t")}</h2>
      <input name="title" placeholder={t("f_title")} required /><input name="company" placeholder={t("f_company")} required />
      <input name="location" placeholder={t("f_city")} required />
      <select name="mode"><option value="OFFICE">{t("m_OFFICE")}</option><option value="REMOTE">{t("m_REMOTE")}</option><option value="HYBRID">{t("m_HYBRID")}</option></select>
      <input name="minExp" type="number" placeholder={t("f_exp")} /><input name="salary" type="number" placeholder={t("f_sal")} required />
      <input name="skills" placeholder={t("f_skills")} required /><textarea name="description" rows={4} placeholder={t("f_desc")} required />
      {msg && <div>{t(msg)}</div>}<button className="btn f">{t("post")}</button></form></div>);
}
