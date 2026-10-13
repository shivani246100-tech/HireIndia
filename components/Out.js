"use client";
import { useT } from "./Lang";
export default function Out() {
  const t = useT();
  return <button className="btn" onClick={async () => { await fetch("/api/auth", { method: "DELETE" }); location.href = "/"; }}>{t("logout")}</button>;
}
