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
  const modes = [].concat(sp.mode || []);
  const where = { AND: [
    q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { company: { contains: q, mode: "insensitive" } }, { skills: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {},
    loc ? { location: { contains: loc, mode: "insensitive" } } : {},
    exp !== "" ? { minExp: { lte: +exp } } : {},
    modes.length ? { mode: { in: modes } } : {},
    sal ? { salary: { gte: sal } } : {} ] };
  const [jobs, cos] = await Promise.all([
    db.job.findMany({ where, orderBy: sort === "sal" ? { salary: "desc" } : { createdAt: "desc" }, take: 50 }),
    db.job.groupBy({ by: ["company"], _count: { _all: true }, orderBy: { _count: { company: "desc" } }, take: 8 }) ]);
  const mname = m => (tr(lang, "m_" + m) === "m_" + m ? m : tr(lang, "m_" + m));
  return (<>
    <section className="hero"><div className="w"><h1>{t("h1")}</h1>
      <form className="s"><input name="q" defaultValue={q} placeholder={t("ph_q")} />
        <select name="exp" defaultValue={exp}><option value="">{t("exp_any")}</option><option value="0">{t("exp0")}</option><option value="2">{t("exp2")}</option><option value="5">{t("exp5")}</option><option value="10">{t("exp10")}</option></select>
        <input name="loc" defaultValue={loc} placeholder={t("ph_loc")} /><button className="btn f">{t("search")}</button></form>
      <div className="chips">{CATS.map(([k, l]) => <Link key={k} className="chip" href={`/?q=${k}`}>{t(l)}</Link>)}</div>
    </div></section>
    <main className="w">
      {cos.length > 0 && <><h2>{t("top_co")}</h2><div className="cos">{cos.map(c => <Link key={c.company} className="co" href={`/?q=${encodeURIComponent(c.company)}`}><i>{c.company[0].toUpperCase()}</i><b>{c.company}</b><small>{c._count._all} {t("openings")}</small></Link>)}</div></>}
      <h2>{t("jobs")} ({jobs.length})</h2>
      <div className="lay">
        <form className="side"><input type="hidden" name="q" value={q} /><input type="hidden" name="loc" value={loc} /><input type="hidden" name="exp" value={exp} />
          <h4>{t("f_mode")}</h4>{["OFFICE", "REMOTE", "HYBRID"].map(m => <label key={m}><input type="checkbox" name="mode" value={m} defaultChecked={modes.includes(m)} />{t("m_" + m)}</label>)}
          <h4>{t("f_minsal")}</h4>{[[0, "f_all"], [5, "5 LPA+"], [10, "10 LPA+"], [20, "20 LPA+"]].map(([v, l]) => <label key={v}><input type="radio" name="sal" value={v} defaultChecked={sal === v} />{l === "f_all" ? t(l) : l}</label>)}
          <h4>{t("sort")}</h4><select name="sort" defaultValue={sort}><option value="new">{t("s_new")}</option><option value="sal">{t("s_sal")}</option></select>
          <button className="btn f">{t("apply_f")}</button></form>
        <div>{jobs.length === 0 && <div className="card">{t("none")}</div>}
          {jobs.map(j => (<div className="card" key={j.id} style={{ marginTop: 0 }}><h3>{j.title}</h3><div>{j.company}</div>
            <div className="m"><span>💼 {j.minExp}+ {t("yrs")}</span><span>₹ {j.salary} LPA</span><span>📍 {j.location} ({mname(j.mode)})</span></div>
            <p>{j.description}</p><div className="t">{j.skills.split(",").map(s => <span key={s}>{s.trim()}</span>)}</div><p><Apply id={j.id} /></p></div>))}</div>
      </div></main></>);
}
