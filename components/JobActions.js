"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "./Lang";
export default function JobActions({ id, status }) {
  const t = useT(), r = useRouter(), closed = status === "CLOSED";
  return (<span style={{ display: "inline-flex", gap: 8, flexWrap: "wrap" }}>
    <Link className="btn" href={`/dashboard/edit/${id}`}>{t("edit")}</Link>
    <button className="btn" onClick={async () => {
      await fetch("/api/jobs", { method: "PATCH", body: JSON.stringify({ id, action: closed ? "open" : "close" }) });
      r.refresh();
    }}>{closed ? t("reopen") : t("close")}</button></span>);
}
