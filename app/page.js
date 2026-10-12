import { db } from "@/lib/db";
import Apply from "@/components/Apply";
export const dynamic = "force-dynamic";
export default async function Home({ searchParams }) {
  const { q = "", loc = "" } = searchParams;
  const jobs = await db.job.findMany({
    where: { AND: [
      q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { company: { contains: q, mode: "insensitive" } }, { skills: { contains: q, mode: "insensitive" } }] } : {},
      loc ? { location: { contains: loc, mode: "insensitive" } } : {} ] },
    orderBy: { createdAt: "desc" }, take: 50 });
  return (<>
    <section className="hero"><div className="w"><h1>अपनी अगली नौकरी खोजें</h1>
      <form className="s"><input name="q" defaultValue={q} placeholder="स्किल, डिज़ाइनेशन या कंपनी" /><input name="loc" defaultValue={loc} placeholder="शहर" /><button className="btn f">खोजें</button></form>
    </div></section>
    <main className="w"><h2>नौकरियां ({jobs.length})</h2>
      {jobs.length === 0 && <div className="card">अभी कोई नौकरी नहीं है। नियोक्ता पैनल से पहली जॉब पोस्ट करें।</div>}
      {jobs.map(j => (<div className="card" key={j.id}><h3>{j.title}</h3><div>{j.company}</div>
        <div className="m"><span>💼 {j.minExp}+ साल</span><span>₹ {j.salary} LPA</span><span>📍 {j.location} ({j.mode})</span></div>
        <p>{j.description}</p>
        <div className="t">{j.skills.split(",").map(s => <span key={s}>{s.trim()}</span>)}</div><p><Apply id={j.id} /></p></div>))}
    </main></>);
}
