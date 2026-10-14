import Razorpay from "razorpay";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { PLANS } from "@/lib/plans";
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  if (u.role !== "EMPLOYER") return Response.json({ error: "e_emp" });
  const b = await req.json().catch(() => ({}));
  const p = PLANS[b.plan];
  if (!p) return Response.json({ error: "e_bad" });
  const rz = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  const amount = p.price * 100;
  const o = await rz.orders.create({ amount, currency: "INR", receipt: "r_" + Date.now() });
  await db.payment.create({ data: { userId: u.id, orderId: o.id, amount, planKey: b.plan } });
  return Response.json({ orderId: o.id, amount });
}
