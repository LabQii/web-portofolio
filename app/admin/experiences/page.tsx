import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminExperienceTable from "@/components/admin/experience-table";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default async function AdminExperiencesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Experiences" }]} />
      <div className="flex items-center justify-between mt-1 mb-1">
        <h1 className="text-[22px] font-bold text-[#0f172a]">Experiences</h1>
        <Link href="/admin/experiences/new" className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] rounded-lg transition-colors">
          + Add Experience
        </Link>
      </div>
      <hr className="border-[#f1f5f9] mb-6" />
      <AdminExperienceTable experiences={experiences} />
    </div>
  );
}
