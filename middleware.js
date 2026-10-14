import { NextResponse } from "next/server";
export function middleware(req) {
  if (req.cookies.get("lang")) return NextResponse.next();
  const h = new Headers(req.headers);
  const c = h.get("cookie");
  h.set("cookie", (c ? c + "; " : "") + "lang=en");
  const res = NextResponse.next({ request: { headers: h } });
  res.cookies.set("lang", "en", { path: "/", maxAge: 31536000 });
  return res;
}
export const config = { matcher: ["/((?!_next|api|icons|.*\\..*).*)"] };
