import "./globals.css";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import Out from "@/components/Out";
export const metadata = { title: "HireIndia – नौकरी खोजें", description: "India's job portal" };
export default async function L({ children }) {
  const u = await getUser();
  return (<html lang="hi"><body>
    <header><div className="w"><Link href="/" className="logo">Hire<b>India</b></Link><span className="sp" />
      <Link href="/employer">नियोक्ता के लिए</Link>
      {u ? <><span>{u.name}</span><Out /></> : <Link className="btn f" href="/login">लॉगिन / रजिस्टर</Link>}
    </div></header>{children}</body></html>);
}
