import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/components/admin/project-form";
import { createProject } from "@/app/actions/project-actions";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Projects", href: "/admin/projects" }, { label: "Add Project" }]} />
      <h1 className="text-[22px] font-bold text-[#0f172a] mt-1 mb-1">Add Project</h1>
      <hr className="border-[#f1f5f9] mb-6" />
      <div className="max-w-[720px] bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.05)] p-8">
        <ProjectForm action={createProject} submitLabel="Create Project" />
      </div>
    </div>
  );
}
