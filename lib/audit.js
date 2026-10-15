import { db } from "./db";
export const audit = (actorId, action, target, note) =>
  db.auditLog.create({ data: { actorId, action, target: String(target || ""), note: note ? String(note).slice(0, 200) : null } }).catch(() => {});
