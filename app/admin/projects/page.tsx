import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminProjectTable from "@/components/admin/project-table";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default async function AdminProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const projects = await prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Projects" }]} />
      <div className="flex items-center justify-between mt-1 mb-1">
        <h1 className="text-[22px] font-bold text-[#0f172a]">Projects</h1>
        <Link href="/admin/projects/new" className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] rounded-lg transition-colors">
          + Add Project
        </Link>
      </div>
      <hr className="border-[#f1f5f9] mb-6" />
      <AdminProjectTable projects={projects} />
    </div>
  );
}
