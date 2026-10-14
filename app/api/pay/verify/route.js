import crypto from "crypto";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { PLANS } from "@/lib/plans";
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "e_login" }, { status: 401 });
  const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: s } = await req.json();
  const exp = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(o + "|" + p).digest("hex");
  if (exp !== s) return Response.json({ error: "e_pay" }, { status: 400 });
  const pay = await db.payment.findUnique({ where: { orderId: o } });
  if (!pay || pay.userId !== u.id) return Response.json({ error: "e_order" }, { status: 400 });
  if (pay.status === "PAID") return Response.json({ ok: true });
  const plan = PLANS[pay.planKey], now = new Date();
  await db.$transaction([
    db.payment.update({ where: { orderId: o }, data: { paymentId: p, status: "PAID" } }),
    db.user.update({ where: { id: u.id }, data: plan ? { plan: "PRO", planStart: now, planUntil: new Date(now.getTime() + plan.days * 864e5), jobLimit: plan.jobs } : { plan: "PRO" } }) ]);
  return Response.json({ ok: true });
}
