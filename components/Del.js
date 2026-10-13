"use client";
import { useRouter } from "next/navigation";
import { useT } from "./Lang";
export default function Del({ id }) {
  const t = useT(), r = useRouter();
  return <button className="btn" onClick={async () => { await fetch("/api/admin", { method: "DELETE", body: JSON.stringify({ id }) }); r.refresh(); }}>{t("del")}</button>;
}
