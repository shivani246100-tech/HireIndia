"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "./Lang";
export default function Upload({ uid, has }) {
  const t = useT(), r = useRouter(), [m, setM] = useState("");
  async function up(e) {
    const f = e.target.files[0];
    if (!f) return;
    const fd = new FormData(); fd.append("file", f);
    const d = await (await fetch("/api/resume", { method: "POST", body: fd })).json();
    setM(d.ok ? "uploaded" : d.error || "e_file"); r.refresh();
  }
  return (<div className="card"><p><b>{t("up_resume")}</b></p><input type="file" accept=".pdf,.doc,.docx" onChange={up} />
    {m && <p>{t(m)}</p>}{has && <p><a href={`/api/resume/${uid}`} target="_blank" style={{ color: "var(--pri)" }}>📄 {t("cur_resume")}</a></p>}</div>);
}
