import crypto from "crypto";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: "लॉगिन करें" }, { status: 401 });
  const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: s } = await req.json();
  const exp = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(o + "|" + p).digest("hex");
  if (exp !== s) return Response.json({ error: "पेमेंट वेरिफाई नहीं हुआ" }, { status: 400 });
  const pay = await db.payment.findUnique({ where: { orderId: o } });
  if (!pay || pay.userId !== u.id) return Response.json({ error: "ऑर्डर नहीं मिला" }, { status: 400 });
  await db.payment.update({ where: { orderId: o }, data: { paymentId: p, status: "PAID" } });
  await db.user.update({ where: { id: u.id }, data: { plan: "PRO" } });
  return Response.json({ ok: true });
}
