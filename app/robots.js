const SITE = process.env.SITE_URL || "https://hire-india-two.vercel.app";
export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/dashboard", "/profile", "/search"] }], sitemap: `${SITE}/sitemap.xml` };
}
