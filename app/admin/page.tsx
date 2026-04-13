import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Folder, FileText, Briefcase, FileClock, Plus, Upload, User, Users, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const projectCount = await prisma.project.count();
  const postCount = await prisma.post.count();
  const cv = await prisma.cV.findFirst({ where: { isActive: true } });
  const experienceCount = await prisma.experience.count();
  const recentProjects = await prisma.project.findMany({ take: 4, orderBy: { createdAt: "desc" } });
  const recentPosts = await prisma.post.findMany({ take: 4, orderBy: { createdAt: "desc" } });

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8 space-y-10 pb-20">

      <div>
        <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]} />
        <p className="text-[22px] text-slate-500">Welcome back, <span className="font-semibold text-slate-700">{session.user?.email}</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Folder className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">Total</span>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 mb-1">{projectCount}</div>
            <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Total Projects</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">Posts</span>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 mb-1">{postCount}</div>
            <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Total Posts</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">Exp</span>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 mb-1">{experienceCount}</div>
            <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Experiences</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
              <FileClock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">Status</span>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 mb-2">{cv ? formatDate(cv.updatedAt) : "Never"}</div>
            <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">CV Last Updated</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-4">Quick Actions</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link href="/admin/projects/new" className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">New Project</span>
          </Link>
          <Link href="/admin/posts/new" className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">New Post</span>
          </Link>
          <Link href="/admin/cv" className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Upload CV</span>
          </Link>
          <Link href="/admin/profile" className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Manage Profile</span>
          </Link>
          <Link href="/admin/users" className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Manage Admins</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">Recent Projects</h2>
            <Link href="/admin/projects" className="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors">See all projects</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentProjects.length > 0 ? recentProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{p.title}</td>
                    <td className="px-6 py-4">
                      {p.featured ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">Live</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/projects/${p.id}/edit`} className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">No projects found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">Recent Posts</h2>
            <Link href="/admin/posts" className="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors">Manage all posts</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Post Title</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPosts.length > 0 ? recentPosts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{p.title}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(p.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/posts/${p.id}/edit`} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                        EDIT
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">No posts found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
