import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminNavbar from "@/components/admin/admin-navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ConfirmProvider } from "@/components/ui/confirm-modal";
import { ToastProvider } from "@/components/ui/toast";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const activeImage = await prisma.$queryRaw<any[]>`
    SELECT url FROM "ProfileImage" 
    ORDER BY 
      CASE WHEN "isActive" = true THEN 0 ELSE 1 END, 
      "createdAt" DESC 
    LIMIT 1
  `.then(rows => rows[0] || null);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f5f7] font-sans">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden relative z-0">
        <AdminSidebar profileImage={activeImage?.url} />
        <main className="flex-1 overflow-y-auto w-full relative">
          
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.01] z-0" 
            style={{ 
              backgroundImage: "url('/images/batik-pattern.jpg')", 
              backgroundSize: "600px 600px", 
              backgroundRepeat: "repeat" 
            }} 
          />
          <div className="relative z-10 w-full min-h-full">
            <ConfirmProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </ConfirmProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
