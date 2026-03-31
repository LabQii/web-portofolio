import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CVUploadClient from "@/components/admin/cv-upload";
import CVListClient from "@/components/admin/cv-list";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default async function AdminCVPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const cvs = await prisma.cV.findMany({ orderBy: { updatedAt: "desc" } });
  const activeCV = cvs.find(c => c.isActive) || null;

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "CV Manager" }]} />
      <h1 className="text-[22px] font-bold text-[#0f172a] mt-1 mb-1">CV Manager</h1>
      <hr className="border-[#f1f5f9] mb-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] p-8 h-fit">
          <CVUploadClient currentCV={activeCV} />
        </div>
        
        <div className="h-fit">
          <CVListClient cvs={cvs} />
        </div>
      </div>
    </div>
  );
}

