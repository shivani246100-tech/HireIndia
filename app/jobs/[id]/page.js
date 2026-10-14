import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { tr } from "@/lib/i18n";
import Apply from "@/components/Apply";
import { Save, Report } from "@/components/Actions";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  const j = await db.job.findUnique({ where: { id: params.id } });
  if (!j || j.status !== "APPROVED") return { title: "Job", robots: { index: false } };
  const title = `${j.title} – ${j.company}, ${j.location}`;
  return { title, description: j.description.slice(0, 155), alternates: { canonical: `/jobs/${j.id}` }, openGraph: { title, description: j.description.slice(0, 155) } };
}
export default async function JobPage({ params }) {
  const lang = cookies().get("lang")?.value === "en" ? "en" : "hi";
  const t = k => tr(lang, k);
  const [j, u] = await Promise.all([db.job.findUnique({ where: { id: params.id } }), getUser()]);
  if (!j || (j.status !== "APPROVED" && !(u && (u.role === "ADMIN" || u.id === j.postedById)))) notFound();
  const saved = u ? !!(await db.savedJob.findUnique({ where: { userId_jobId: { userId: u.id, jobId: j.id } } })) : false;
  const expired = j.expiresAt && j.expiresAt < new Date();
  const mode = tr(lang, "m_" + j.mode) === "m_" + j.mode ? j.mode : tr(lang, "m_" + j.mode);
  const ld = j.status === "APPROVED" && !expired ? {
    "@context": "https://schema.org", "@type": "JobPosting", title: j.title, description: j.description,
    datePosted: j.createdAt.toISOString(), ...(j.expiresAt ? { validThrough: j.expiresAt.toISOString() } : {}),
    employmentType: "FULL_TIME", hiringOrganization: { "@type": "Organization", name: j.company },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: j.location, addressCountry: "IN" } },
    baseSalary: { "@type": "MonetaryAmount", currency: "INR", value: { "@type": "QuantitativeValue", value: j.salary * 100000, unitText: "YEAR" } },
    ...(j.mode === "REMOTE" ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "IN" } } : {}) } : null;
  return (<main className="w">
    {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
    <div className="card">
    {j.status !== "APPROVED" && <div style={{ color: "#c60" }}>⏳ {j.status}</div>}
    {expired && <div style={{ color: "#c00" }}>⛔ {t("expired")}</div>}
    <h1 style={{ margin: 0, fontSize: 24 }}>{j.title}</h1><div><Link href={`/company/${encodeURIComponent(j.company)}`} style={{ color: "var(--pri)" }}>{j.company}</Link></div>
    <div className="m"><span>💼 {j.minExp}+ {t("yrs")}</span><span>₹ {j.salary} LPA</span><span>📍 {j.location} ({mode})</span><span>{j.createdAt.toLocaleDateString("en-IN")}</span>
      {j.expiresAt && <span>⏰ {t("until")}: {j.expiresAt.toLocaleDateString("en-IN")}</span>}</div>
    <p style={{ whiteSpace: "pre-wrap" }}>{j.description}</p>
    <div className="t">{j.skills.split(",").map(s => <span key={s}>{s.trim()}</span>)}</div>
    <p style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>{!expired && <Apply id={j.id} />}<Save id={j.id} saved={saved} /><Report id={j.id} /></p></div></main>);
}
