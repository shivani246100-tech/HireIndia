import { PrismaClient } from "@prisma/client";
const g = globalThis;
export const db = g.p || new PrismaClient();
if (process.env.NODE_ENV !== "production") g.p = db;
