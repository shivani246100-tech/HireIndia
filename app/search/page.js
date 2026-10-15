import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import { planInfo } from "@/lib/plans";
export const dynamic = "force-dynamic";
export default async function Search({ searchParams: sp }) {
  const t = k => tr(cookies().get("lang")?.value === "hi" ? "hi" : "en", k);
  const u = await getUser();
  if (!u) redirect("/login");
  const ok = u.role === "ADMIN" || (u.role === "EMPLOYER" && planInfo(u).active);
  if (!ok) return (<main className="w"><div className="card"><h3>{t("find_t")}</h3><p>{t("need_pro")}</p><Link className="btn f" href="/pricing">{t("nav_plans")}</Link></div></main>);
  const q = sp.q || "", city = sp.city || "", page = Math.max(1, +sp.page || 1), PER = 20;
  const where = { role: "SEEKER", visible: true, AND: [
    q ? { OR: [{ skills: { contains: q, mode: "insensitive" } }, { experience: { contains: q, mode: "insensitive" } }, { education: { contains: q, mode: "insensitive" } }] } : {},
    city ? { city: { contains: city, mode: "insensitive" } } : {} ] };
  const [list, total] = await Promise.all([
    db.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER }),
    db.user.count({ where }) ]);
  const href = p => `/search?q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}&page=${p}`;
  return (<main className="w"><h2>{t("find_t")} ({total})</h2>
    <form className="s" style={{ margin: "0 0 14px" }}><input name="q" defaultValue={q} placeholder={t("f_skills")} /><input name="city" defaultValue={city} placeholder={t("ph_loc")} /><button className="btn f">{t("search")}</button></form>
    {list.length === 0 && <div className="card">{t("no_cand")}</div>}
    {list.map(c => <div className="card" key={c.id}><h3>{c.name}</h3>
      <div className="m"><span>📍 {c.city || "-"}</span><span>🎓 {c.education || "-"}</span><span>📞 {c.phone || "-"}</span><span>✉️ {c.email}</span></div>
      <div className="t">{(c.skills || "").split(",").filter(Boolean).map(s => <span key={s}>{s.trim()}</span>)}</div>
      {c.experience && <p>{c.experience}</p>}
      {c.resumeUrl && <p><a href={`/api/resume/${c.id}`} target="_blank" style={{ color: "var(--pri)" }}>📄 {t("view_resume")}</a></p>}</div>)}
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "20px 0" }}>
      {page > 1 && <Link className="btn" href={href(page - 1)}>← {t("prev")}</Link>}
      {page * PER < total && <Link className="btn" href={href(page + 1)}>{t("next")} →</Link>}</div></main>);
}
