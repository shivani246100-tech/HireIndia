export const dynamic = "force-dynamic";
export function GET() {
  const pkg = process.env.ANDROID_PACKAGE, fp = process.env.ANDROID_SHA256;
  return Response.json(pkg && fp ? [{ relation: ["delegate_permission/common.handle_all_urls"], target: { namespace: "android_app", package_name: pkg, sha256_cert_fingerprints: fp.split(",").map(s => s.trim()) } }] : []);
}
