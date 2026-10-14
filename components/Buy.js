"use client";
import { useState } from "react";
import { useT } from "./Lang";
export default function Buy({ plan }) {
  const t = useT(), [m, setM] = useState("");
  async function buy() {
    const r = await fetch("/api/pay/order", { method: "POST", body: JSON.stringify({ plan }) });
    if (r.status === 401) return (location.href = "/login");
    const o = await r.json();
    if (o.error) return setM(o.error);
    await new Promise(res => { if (window.Razorpay) return res(); const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = res; document.body.appendChild(s); });
    new window.Razorpay({ key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, amount: o.amount, currency: "INR", name: "HireIndia", description: "Plan " + plan, order_id: o.orderId,
      handler: async resp => { const v = await fetch("/api/pay/verify", { method: "POST", body: JSON.stringify(resp) }); setM((await v.json()).ok ? "pro_on" : "e_pay"); } }).open();
  }
  return <><button className="btn f" style={{ width: "100%" }} onClick={buy}>{t("buy_now")}</button>{m && <p style={{ margin: 0 }}>{t(m)}</p>}</>;
}
