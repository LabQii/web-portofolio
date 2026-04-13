"use client";

import { useState, useEffect, useTransition } from "react";
import { getAdmins, deleteAdmin, createAdmin, updateAdmin } from "@/app/actions/admin";
import { Loader2, Trash2, ShieldAlert, UserPlus, Mail, Lock, Pencil, X as CloseIcon, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Admin = { id: string; email: string };

export default function UsersPage() {
  const { success, error: toastError } = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: session } = useSession() || {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to load admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setEditingAdmin(null);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setEmail(admin.email);
    setPassword("");
    setConfirmPassword("");

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toastError("Email is required.");
      return;
    }

    if (!editingAdmin && !password.trim()) {
      toastError("Password is required for new accounts.");
      return;
    }

    if (password && password !== confirmPassword) {
      toastError("Passwords do not match.");
      return;
    }

    if (password && password.length < 6) {
      toastError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (editingAdmin) {
        result = await updateAdmin(editingAdmin.id, { 
          email, 
          password: password || undefined 
        });
      } else {
        result = await createAdmin({ email, password });
      }

      if (result.success) {
        success(editingAdmin ? "Admin updated successfully!" : "Admin created successfully!");
        resetForm();
        await fetchAdmins();
      } else {
        toastError(result.error || "Failed to process request.");
      }
    } catch (error) {
      toastError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Admin",
      message: "Are you sure you want to delete this admin account? This action cannot be undone.",
      confirmLabel: "Delete",
      type: "danger"
    });
    
    if (!ok) return;

    setDeletingId(id);
    try {
      if (!(session?.user as any)?.id) { toastError("Session error."); return; }
      const result = await deleteAdmin(id, (session?.user as any).id);
      if (result.success) { 
        success("Admin deleted successfully!");
        await fetchAdmins(); 
      }
      else { toastError(result.error || "Failed to delete admin."); }
    } catch (error) { toastError("An unexpected error occurred."); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Manage Admins" }]} />
      <div className="mt-1 mb-8">
        <h1 className="text-[22px] font-bold text-[#0f172a]">Manage Admins</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center py-1 px-[28px_32px] pt-7 border-l-[3px] border-[#1e293b]">
            <h2 className="text-[15px] font-semibold text-[#0f172a] pl-3">
              {editingAdmin ? "Update Administrator" : "Add New Admin"}
            </h2>
            {editingAdmin && (
              <button 
                onClick={resetForm}
                className="text-[12px] font-medium text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                title="Cancel editing"
              >
                <CloseIcon className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
          </div>
          <div className="h-px bg-[#f1f5f9] mx-7 mt-5 mb-5" />
          
          <div className="px-7 pb-8 pt-2">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all text-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                  {editingAdmin && <span className="text-[10px] text-slate-400 font-medium italic">(Leave blank to keep current)</span>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder={editingAdmin ? "Set new password" : "Minimum 6 characters"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!editingAdmin}
                    minLength={6}
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all text-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!!password}
                    minLength={6}
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all text-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`w-full h-11 text-white font-semibold rounded-xl transition-all shadow-md shadow-slate-200 flex items-center justify-center gap-2 ${
                    editingAdmin ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#1e293b] hover:bg-[#0f172a]"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingAdmin ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {editingAdmin ? "Update Admin Account" : "Create Admin Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden self-stretch flex flex-col">
          <div className="border-l-[3px] border-[#1e293b] py-1 px-[28px_32px] pt-7">
            <h2 className="text-[15px] font-semibold text-[#0f172a] pl-3">Active Administrators</h2>
          </div>
          <div className="h-px bg-[#f1f5f9] mx-7 mt-5 mb-[1px]" />

          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-7 w-7 animate-spin text-[#64748b]" />
              </div>
            ) : admins.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                    <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.05em] px-7 py-4">Email</th>
                    <th className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-[0.05em] px-7 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {admins.map((admin) => {
                    const isCurrentUser = session?.user?.email === admin.email;
                    const isEditing = editingAdmin?.id === admin.id;
                    return (
                      <tr key={admin.id} className={`transition-colors ${isEditing ? 'bg-emerald-50/50' : 'hover:bg-[#f8fafc]/50'}`}>
                        <td className="px-7 py-4 font-medium">
                          <div className="flex items-center gap-2">
                            <span className={isEditing ? 'text-emerald-700' : 'text-[#1e293b]'}>{admin.email}</span>
                            {isCurrentUser && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">You</span>
                            )}
                          </div>
                        </td>
                        <td className="px-7 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEdit(admin)}
                              className={`p-2 rounded-lg transition-colors ${
                                isEditing ? 'text-emerald-600 bg-emerald-100/50' : 'text-[#94a3b8] hover:text-[#1e293b] hover:bg-slate-100'
                              }`}
                              title="Edit Admin"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              disabled={isCurrentUser || deletingId === admin.id}
                              onClick={() => handleDelete(admin.id)}
                              className="p-2 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title={isCurrentUser ? "You cannot delete yourself" : "Delete Admin"}
                            >
                              {deletingId === admin.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <ShieldAlert className="h-8 w-8 text-[#cbd5e1]" />
                </div>
                <p className="text-[#64748b] text-sm font-medium">No other admins found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
