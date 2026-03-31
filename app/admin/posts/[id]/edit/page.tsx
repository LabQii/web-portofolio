import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import PostForm from "@/components/admin/post-form";
import { updatePost } from "@/app/actions/post-actions";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const resolvedParams = await params;
  const post = await prisma.post.findUnique({ where: { id: resolvedParams.id } });
  if (!post) notFound();

  const action = updatePost.bind(null, resolvedParams.id);

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Activities", href: "/admin/posts" }, { label: "Edit Post" }]} />
      <h1 className="text-[22px] font-bold text-[#0f172a] mt-1 mb-1">Edit Post</h1>
      <hr className="border-[#f1f5f9] mb-6" />
      <div className="max-w-[720px] bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.05)] p-8">
        <PostForm post={post} action={action} submitLabel="Update Post" />
      </div>
    </div>
  );
}
