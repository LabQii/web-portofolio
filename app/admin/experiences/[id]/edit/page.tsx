import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import ExperienceForm from "@/components/admin/experience-form";
import { updateExperience } from "@/app/actions/experience-actions";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) notFound();

  const action = async (formData: FormData) => {
    "use server";
    return updateExperience(id, formData);
  };

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Experiences", href: "/admin/experiences" }, { label: "Edit Experience" }]} />
      <h1 className="text-[22px] font-bold text-[#0f172a] mt-1 mb-1">Edit Experience</h1>
      <hr className="border-[#f1f5f9] mb-6" />
      <div className="max-w-[720px] bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.05)] p-8">
        <ExperienceForm experience={experience} action={action} submitLabel="Update Experience" />
      </div>
    </div>
  );
}
