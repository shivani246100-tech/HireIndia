export const PLANS = {
  p30: { days: 30, jobs: 2, price: 999 },
  p45: { days: 45, jobs: 3, price: 1799 },
  p60: { days: 60, jobs: 5, price: 2499 } };
export function planInfo(u) {
  if (!u || u.plan !== "PRO") return { active: false, limit: 1 };
  if (!u.planUntil) return { active: true, limit: Infinity, legacy: true };
  const active = u.planUntil > new Date();
  return { active, limit: active ? u.jobLimit : 1, since: u.planStart };
}
