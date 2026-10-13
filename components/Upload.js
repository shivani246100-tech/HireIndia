"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "./Lang";
export default function Upload({ url }) {
  const t = useT(), r = useRouter(), [m, setM] = useState("");
  async function up(e) {
    const fd = new FormData(); fd.append("file", e.target.files[0]);
    const d = await (await fetch("/api/resume", { method: "POST", body: fd })).json();
    setM(d.ok ? "uploaded" : d.error || "e_file"); r.refresh();
  }
  return (<div className="card"><p><b>{t("up_resume")}</b></p><input type="file" accept=".pdf,.doc,.docx" onChange={up} />
    {m && <p>{t(m)}</p>}{url && <p><a href={url} target="_blank" style={{ color: "var(--pri)" }}>📄 {t("cur_resume")}</a></p>}</div>);
}
