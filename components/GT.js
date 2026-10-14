"use client";
import { useEffect } from "react";
export default function GT() {
  useEffect(() => {
    if (!/googtrans=\/en\/[^;]+/.test(document.cookie)) return;
    const rc = Node.prototype.removeChild, ib = Node.prototype.insertBefore;
    Node.prototype.removeChild = function (c) { if (c.parentNode !== this) return c; return rc.apply(this, arguments); };
    Node.prototype.insertBefore = function (n, r) { if (r && r.parentNode !== this) return n; return ib.apply(this, arguments); };
    window.googleTranslateElementInit = () => new window.google.translate.TranslateElement({ pageLanguage: "en", autoDisplay: false }, "gt_el");
    const s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
  }, []);
  return <div id="gt_el" className="notranslate" />;
}
