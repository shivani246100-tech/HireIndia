import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
const SITE = process.env.SITE_URL || "https://hire-india-two.vercel.app";
export default async function sitemap() {
  const jobs = await db.job.findMany({ where: { status: "APPROVED", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }, select: { id: true, createdAt: true }, take: 5000 });
  return [{ url: SITE, changeFrequency: "daily" },
    ...["about", "contact", "privacy", "terms", "refund"].map(k => ({ url: `${SITE}/info/${k}` })),
    ...jobs.map(j => ({ url: `${SITE}/jobs/${j.id}`, lastModified: j.createdAt })) ];
}
