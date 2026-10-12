import Razorpay from "razorpay";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST() {
  const u = await getUser();
  if (!u) return Response.json({ error: "लॉगिन करें" }, { status: 401 });
  const rz = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  const amount = 99900; // ₹999 in paise
  const o = await rz.orders.create({ amount, currency: "INR", receipt: "r_" + Date.now() });
  await db.payment.create({ data: { userId: u.id, orderId: o.id, amount } });
  return Response.json({ orderId: o.id, amount });
}
