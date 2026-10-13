import { cookies } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/db";
import { tr } from "@/lib/i18n";
import Apply from "@/components/Apply";
export const dynamic = "force-dynamic";
const CATS = [["Software", "c_it"], ["Sales", "c_sales"], ["Marketing", "c_mkt"], ["Finance", "c_fin"], ["HR", "c_hr"], ["Design", "c_design"], ["Data", "c_data"], ["Operations", "c_ops"]];
export default async function Home({ searchParams: sp }) {
  const lang = cookies().get("lang")?.value === "en" ? "en" : "hi";
  const t = k => tr(lang, k);
  const q = sp.q || "", loc = sp.loc || "", exp = sp.exp || "", sal = +sp.sal || 0, sort = sp.sort || "new";
  const page = Math.max(1, +sp.page || 1), PER = 15;
  const modes = [].concat(sp.mode || []);
  const live = { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] };
  const where = { AND: [
    { status: "APPROVED" }, live,
    q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { company: { contains: q, mode: "insensitive" } }, { skills: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {},
    loc ? { location: { contains: loc, mode: "insensitive" } } : {},
    exp !== "" ? { minExp: { lte: +exp } } : {},
    modes.length ? { mode: { in: modes } } : {},
    sal ? { salary: { gte: sal } } : {} ] };
  const [jobs, total, cos] = await Promise.all([
    db.job.findMany({ where, orderBy: sort === "sal" ? { salary: "desc" } : { createdAt: "desc" }, skip: (page - 1) * PER, take: PER }),
    db.job.count({ where }),
    db.job.groupBy({ where: { status: "APPROVED", ...live }, by: ["company"], _count: { _all: true }, orderBy: { _count: { company: "desc" } }, take: 8 }) ]);
  const mname = m => (tr(lang, "m_" + m) === "m_" + m ? m : tr(lang, "m_" + m));
  const pageHref = p => { const s = new URLSearchParams(); for (const [k, v] of Object.entries(sp)) { if (k === "page") continue; [].concat(v).forEach(x => s.append(k, x)); } s.set("page", p); return "/?" + s.toString(); };
  return (<>
    <section className="hero"><div className="w"><h1>{t("h1")}</h1>
      <form className="s"><input name="q" defaultValue={q} placeholder={t("ph_q")} />
        <select name="exp" defaultValue={exp}><option value="">{t("exp_any")}</option><option value="0">{t("exp0")}</option><option value="2">{t("exp2")}</option><option value="5">{t("exp5")}</option><option value="10">{t("exp10")}</option></select>
        <input name="loc" defaultValue={loc} placeholder={t("ph_loc")} /><button className="btn f">{t("search")}</button></form>
      <div className="chips">{CATS.map(([k, l]) => <Link key={k} className="chip" href={`/?q=${k}`}>{t(l)}</Link>)}</div>
    </div></section>
    <main className="w">
      {cos.length > 0 && <><h2>{t("top_co")}</h2><div className="cos">{cos.map(c => <Link key={c.company} className="co" href={`/company/${encodeURIComponent(c.company)}`}><i>{c.company[0].toUpperCase()}</i><b>{c.company}</b><small>{c._count._all} {t("openings")}</small></Link>)}</div></>}
      <h2>{t("jobs")} ({total})</h2>
      <div className="lay">
        <form className="side"><input type="hidden" name="q" value={q} /><input type="hidden" name="loc" value={loc} /><input type="hidden" name="exp" value={exp} />
          <h4>{t("f_mode")}</h4>{["OFFICE", "REMOTE", "HYBRID"].map(m => <label key={m}><input type="checkbox" name="mode" value={m} defaultChecked={modes.includes(m)} />{t("m_" + m)}</label>)}
          <h4>{t("f_minsal")}</h4>{[[0, "f_all"], [5, "5 LPA+"], [10, "10 LPA+"], [20, "20 LPA+"]].map(([v, l]) => <label key={v}><input type="radio" name="sal" value={v} defaultChecked={sal === v} />{l === "f_all" ? t(l) : l}</label>)}
          <h4>{t("sort")}</h4><select name="sort" defaultValue={sort}><option value="new">{t("s_new")}</option><option value="sal">{t("s_sal")}</option></select>
          <button className="btn f">{t("apply_f")}</button></form>
        <div>{jobs.length === 0 && <div className="card">{t("none")}</div>}
          {jobs.map(j => (<div className="card" key={j.id} style={{ marginTop: 0 }}><h3><Link href={`/jobs/${j.id}`}>{j.title}</Link></h3><div><Link href={`/company/${encodeURIComponent(j.company)}`}>{j.company}</Link></div>
            <div className="m"><span>💼 {j.minExp}+ {t("yrs")}</span><span>₹ {j.salary} LPA</span><span>📍 {j.location} ({mname(j.mode)})</span></div>
            <p>{j.description}</p><div className="t">{j.skills.split(",").map(s => <span key={s}>{s.trim()}</span>)}</div><p><Apply id={j.id} /></p></div>))}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "20px 0" }}>
            {page > 1 && <Link className="btn" href={pageHref(page - 1)}>← {t("prev")}</Link>}
            {page * PER < total && <Link className="btn" href={pageHref(page + 1)}>{t("next")} →</Link>}</div></div>
      </div></main></>);
}
