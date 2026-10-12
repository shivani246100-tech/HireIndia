"use client";
export default function Out() {
  return <button className="btn" onClick={async () => { await fetch("/api/auth", { method: "DELETE" }); location.href = "/"; }}>लॉगआउट</button>;
}
