import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TechStackAdminForm from "@/components/admin/tech-stack-form";
import { getTechStacks } from "@/app/actions/tech-stack-actions";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default async function TechStacksAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const techStacks = await getTechStacks();

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Tech Logos" }]} />
      <h1 className="text-[22px] font-bold text-[#0f172a] mt-1 mb-1">Manage Tech Stacks</h1>
      <hr className="border-[#f1f5f9] mb-6" />
      <TechStackAdminForm techStacks={techStacks} />
    </div>
  );
}

