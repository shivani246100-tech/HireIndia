"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { tr } from "@/lib/i18n";
const C = createContext("hi");
export const LangProvider = ({ lang, children }) => <C.Provider value={lang}>{children}</C.Provider>;
export const useT = () => { const l = useContext(C); return k => tr(l, k); };
export function Toggle() {
  const l = useContext(C), r = useRouter();
  return <button className="btn" onClick={() => { document.cookie = `lang=${l === "hi" ? "en" : "hi"};path=/;max-age=31536000`; r.refresh(); }}>{l === "hi" ? "English" : "हिंदी"}</button>;
}
