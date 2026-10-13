import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import EditForm from "@/components/EditForm";
export const dynamic = "force-dynamic";
export default async function Edit({ params }) {
  const u = await getUser();
  if (!u) redirect("/login");
  const j = await db.job.findUnique({ where: { id: params.id } });
  if (!j || (j.postedById !== u.id && u.role !== "ADMIN")) notFound();
  return <EditForm job={{ id: j.id, title: j.title, company: j.company, location: j.location, mode: j.mode, minExp: j.minExp, salary: j.salary, skills: j.skills, description: j.description, expiresAt: j.expiresAt ? j.expiresAt.toISOString().slice(0, 10) : "" }} />;
}
