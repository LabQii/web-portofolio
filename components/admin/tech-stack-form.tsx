"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { createOrUpdateTechStack, deleteTechStack } from "@/app/actions/tech-stack-actions";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-modal";
import { cn } from "@/lib/utils";

type TechStackItem = { id: string; name: string; customLogoUrl: string | null };

const cls = "w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.08)] transition-all bg-white";
const labelCls = "block text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] mb-1.5";

export default function TechStackAdminForm({ techStacks }: { techStacks: TechStackItem[] }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();
  const [editingTech, setEditingTech] = useState<TechStackItem | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleEdit = (tech: TechStackItem) => { setEditingTech(tech); setPreview(tech.customLogoUrl); };
  const handleCancelEdit = () => { setEditingTech(null); setPreview(null); };

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete Tech Stack",
      message: `Are you sure you want to delete "${name}"? this cannot be undone.`,
      confirmLabel: "Delete",
      type: "danger"
    });
    
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteTechStack(id);
      if (result.success) { 
        if (editingTech?.id === id) handleCancelEdit(); 
        success(`"${name}" deleted successfully!`);
        router.refresh(); 
      }
      else { toastError(result.error || "Delete failed."); }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingTech?.customLogoUrl) formData.set("existingLogoUrl", editingTech.customLogoUrl);
    startTransition(async () => {
      const result = await createOrUpdateTechStack(formData);
      if (result.success) {
        handleCancelEdit();
        router.refresh();
        (e.target as HTMLFormElement).reset();
        success("Tech stack saved successfully!");
      } else {
        toastError(result.error || "Failed to save.");
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4 px-2">Existing Stacks</h3>
          {techStacks.length === 0 ? (
            <p className="text-[#94a3b8] text-sm italic py-8 text-center">No custom tech stacks yet.</p>
          ) : (
            <div className="divide-y divide-[#f1f5f9]">
              {techStacks.map((tech) => (
                <div key={tech.id} className="flex items-center justify-between py-3 hover:bg-[#f8fafc] rounded-lg px-2 transition-colors group">
                  <div className="flex items-center gap-3">
                    {tech.customLogoUrl ? (
                      <div className="relative w-8 h-8 rounded-md overflow-hidden bg-white border border-[#e2e8f0] shadow-sm">
                        <Image src={tech.customLogoUrl} alt={tech.name} fill sizes="40px" className="object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">{tech.name.charAt(0).toUpperCase()}</div>
                    )}
                    <span className="text-[14px] font-medium text-[#0f172a]">{tech.name}</span>
                  </div>
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => handleEdit(tech)} className="text-[13px] font-medium text-[#1e293b] hover:underline">Edit</button>
                    <button type="button" onClick={() => handleDelete(tech.id, tech.name)} className="text-[13px] font-medium text-[#ef4444] hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-base font-bold text-slate-800">
              {editingTech ? "Edit Logo" : "Add New Logo"}
            </h3>
            {editingTech && (
              <button 
                onClick={handleCancelEdit}
                className="text-[12px] font-medium text-slate-500 hover:text-slate-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
            {editingTech && <input type="hidden" name="id" value={editingTech.id} />}

            <div>
              <label className={labelCls}>Tech Stack Name *</label>
              <input
                id="name"
                name="name"
                required
                placeholder="e.g. React Native"
                defaultValue={editingTech?.name ?? ""}
                key={editingTech?.id ?? "new"}
                readOnly={!!editingTech}
                className={cn(cls, editingTech && "bg-slate-50 cursor-not-allowed")}
              />
              {editingTech && <p className="text-[12px] text-[#94a3b8] mt-1.5">Name cannot be changed while editing.</p>}
            </div>

            <div>
              <label className={labelCls}>Logo Image</label>
              <div
                className="border-2 border-dashed border-[#cbd5e1] rounded-xl p-8 text-center cursor-pointer hover:border-[#1e293b] hover:bg-[#f8fafc] transition-all relative"
                onClick={() => document.getElementById("logo-input")?.click()}
              >
                <input id="logo-input" name="logo" type="file" accept="image/png, image/svg+xml, image/webp, image/jpeg" onChange={(e) => { 
                  const f = e.target.files?.[0]; 
                  if (f) {
                    if (f.size > 5 * 1024 * 1024) {
                      toastError("Logo size must be less than 5MB.");
                      e.target.value = "";
                      return;
                    }
                    setPreview(URL.createObjectURL(f)); 
                  }
                }} className="hidden" />
                {preview ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#e2e8f0] shadow-sm bg-white">
                      <Image src={preview} alt="Logo preview" fill sizes="40px" className="object-contain p-2" />
                    </div>
                    <span className="text-[13px] text-[#64748b]">Click to change image</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#94a3b8]">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Click to upload logo</span>
                    <span className="text-xs">SVG, PNG, JPG, WebP</span>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={isPending} className="w-full h-[44px] bg-[#1e293b] text-white rounded-lg text-[14px] font-medium hover:bg-[#0f172a] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}{isPending ? "Saving..." : (editingTech ? "Update Logo" : "Save Custom Logo")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
