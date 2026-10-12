"use client";
import { useState } from "react";
export default function Apply({ id }) {
  const [t, setT] = useState("अप्लाई करें");
  return <button className="btn f" onClick={async () => {
    const r = await fetch("/api/apply", { method: "POST", body: JSON.stringify({ jobId: id }) });
    const d = await r.json();
    if (r.status === 401) location.href = "/login"; else setT(d.ok ? "आवेदन हो गया ✓" : d.error);
  }}>{t}</button>;
}
