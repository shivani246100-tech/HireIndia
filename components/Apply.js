"use client";
import { useState } from "react";
import { useT } from "./Lang";
export default function Apply({ id }) {
  const t = useT(), [s, setS] = useState("apply");
  return <button className="btn f" onClick={async () => {
    const r = await fetch("/api/apply", { method: "POST", body: JSON.stringify({ jobId: id }) });
    if (r.status === 401) return (location.href = "/login");
    const d = await r.json(); setS(d.ok ? "applied" : d.error);
  }}>{t(s)}</button>;
}
