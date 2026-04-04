"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, Activity, Briefcase, ImageIcon, User, Users, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "Activities", href: "/admin/posts", icon: Activity },
  { name: "Experiences", href: "/admin/experiences", icon: Briefcase },
  { name: "Tech Logos", href: "/admin/tech-stacks", icon: ImageIcon },
  { name: "Manage Profile", href: "/admin/profile", icon: User },
  { name: "Manage Admins", href: "/admin/users", icon: Users },
  { name: "CV Manager", href: "/admin/cv", icon: FileUp },
];

interface AdminSidebarProps {
  profileImage?: string | null;
}

export default function AdminSidebar({ profileImage }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-white border-r border-[#e2e8f0] flex flex-col h-full shrink-0 z-10">
      {/* Profile Card */}
      <div className="px-4 py-5 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#e2e8f0] bg-slate-50 shrink-0 flex items-center justify-center p-1 shadow-sm">
            <Image 
              src={profileImage || "/images/logo-new.png"} 
              alt="Profile" 
              fill 
              className={cn("object-cover", !profileImage && "object-contain opacity-80")} 
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold text-[#0f172a] truncate">Iqbal</span>
            <span className="text-[11px] text-[#64748b] truncate">Administrator</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-[14px] py-[10px] rounded-lg text-[14px] font-medium transition-all",
                isActive
                  ? "bg-[#1e293b] text-white"
                  : "text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a]"
              )}
            >
              <item.icon className={cn("w-[16px] h-[16px] shrink-0", isActive ? "text-white" : "text-[#94a3b8]")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
