"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { tr } from "@/lib/i18n";
const C = createContext("en");
export const LangProvider = ({ lang, children }) => <C.Provider value={lang}>{children}</C.Provider>;
export const useT = () => { const l = useContext(C); return k => tr(l, k); };
const MORE = [["bho", "भोजपुरी"], ["mai", "मैथिली"], ["mr", "मराठी"], ["bn", "বাংলা"], ["ta", "தமிழ்"], ["te", "తెలుగు"], ["gu", "ગુજરાતી"], ["kn", "ಕನ್ನಡ"], ["ml", "മലയാളം"], ["pa", "ਪੰਜਾਬੀ"], ["or", "ଓଡ଼ିଆ"], ["as", "অসমীয়া"], ["ur", "اردو"], ["ne", "नेपाली"], ["sa", "संस्कृतम्"], ["ar", "العربية"], ["es", "Español"], ["fr", "Français"], ["zh-CN", "中文"]];
const setCk = (n, v) => { document.cookie = `${n}=${v};path=/;max-age=31536000`; };
const clearGt = () => { document.cookie = "googtrans=;path=/;max-age=0"; document.cookie = `googtrans=;path=/;max-age=0;domain=${location.hostname}`; };
export function Toggle() {
  const l = useContext(C), [v, setV] = useState(l);
  useEffect(() => { const m = document.cookie.match(/googtrans=\/en\/([^;]+)/); if (m) setV(decodeURIComponent(m[1])); }, []);
  function pick(x) {
    clearGt();
    if (x === "en" || x === "hi") setCk("lang", x);
    else { setCk("lang", "en"); setCk("googtrans", "/en/" + x); }
    location.reload();
  }
  return (<select aria-label="Language" translate="no" className="langsel notranslate" value={v} onChange={e => pick(e.target.value)}>
    <option value="en">English</option><option value="hi">हिंदी</option>
    {MORE.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select>);
}
