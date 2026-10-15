"use client";
import { useRouter } from "next/navigation";
import { useT } from "./Lang";
export default function UserActions({ id, suspended }) {
  const t = useT(), r = useRouter();
  return <button className="btn" onClick={async () => {
    if (!suspended && !confirm(t("sus_confirm"))) return;
    await fetch("/api/admin/user", { method: "POST", body: JSON.stringify({ id, action: suspended ? "restore" : "suspend" }) });
    r.refresh();
  }}>{suspended ? t("restore") : t("suspend")}</button>;
}
