"use client";
import { useState } from "react";
export default function Employer() {
  const [msg, setMsg] = useState("");
  async function post(e) {
    e.preventDefault();
    const r = await fetch("/api/jobs", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
    const d = await r.json();
    if (r.status === 401) return (location.href = "/login");
    setMsg(d.ok ? "जॉब पोस्ट हो गई ✓" : d.error); if (d.ok) e.target.reset();
  }
  async function buy() {
    const r = await fetch("/api/pay/order", { method: "POST" });
    if (r.status === 401) return (location.href = "/login");
    const o = await r.json();
    await new Promise(res => { const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = res; document.body.appendChild(s); });
    new window.Razorpay({ key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, amount: o.amount, currency: "INR", name: "HireIndia", description: "PRO – अनलिमिटेड जॉब पोस्टिंग", order_id: o.orderId,
      handler: async resp => { const v = await fetch("/api/pay/verify", { method: "POST", body: JSON.stringify(resp) }); setMsg((await v.json()).ok ? "PRO एक्टिव हो गया ✓" : "पेमेंट वेरिफाई नहीं हुआ"); } }).open();
  }
  return (<div className="w"><div className="card"><h3>PRO प्लान – ₹999</h3><p>अनलिमिटेड जॉब पोस्टिंग। फ्री प्लान में 1 जॉब।</p><button className="btn f" onClick={buy}>अभी खरीदें (Razorpay)</button></div>
    <form className="col" style={{ margin: "0 auto" }} onSubmit={post}><h2>नई जॉब पोस्ट करें</h2>
      <input name="title" placeholder="जॉब टाइटल" required /><input name="company" placeholder="कंपनी का नाम" required />
      <input name="location" placeholder="शहर" required />
      <select name="mode"><option>ऑफिस</option><option>रिमोट</option><option>हाइब्रिड</option></select>
      <input name="minExp" type="number" placeholder="न्यूनतम अनुभव (साल)" /><input name="salary" type="number" placeholder="सैलरी (LPA)" required />
      <input name="skills" placeholder="स्किल्स (कॉमा से अलग)" required /><textarea name="description" rows={4} placeholder="जॉब डिस्क्रिप्शन" required />
      {msg && <div>{msg}</div>}<button className="btn f">पोस्ट करें</button></form></div>);
}
