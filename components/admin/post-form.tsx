"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import type { Post } from "@prisma/client";
import { useToast } from "@/components/ui/toast";

const CATEGORIES = ["Event", "Achievement", "Experience", "Certification", "Other"];
const cls = "w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.08)] transition-all bg-white";
const label = "block text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] mb-1.5";

interface PostFormProps {
  post?: Post;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  submitLabel?: string;
}

export default function PostForm({ post, action, submitLabel = "Save Post" }: PostFormProps) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [isPending, startTransition] = useTransition();
  const [thumbnail, setThumbnail] = useState<string | null>(post?.thumbnail ?? null);

  const generateSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    const slugInput = document.getElementById("post-slug") as HTMLInputElement;
    if (slugInput) slugInput.value = slug;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result.success) {
          success(post ? "Post updated successfully!" : "Post created successfully!");
          router.push("/admin/posts");
          router.refresh();
        } else {
          toastError(result.error || "Something went wrong. Please try again.");
        }
      } catch (err) {
        console.error("Form submission error:", err);
        toastError("An unexpected error occurred. The file might be too large.");
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div><label className={label}>Title *</label><input id="post-title" name="title" defaultValue={post?.title} onChange={generateSlug} required placeholder="Post title" className={cls} /></div>
          <div><label className={label}>Slug *</label><input id="post-slug" name="slug" defaultValue={post?.slug} required className={cls} /></div>
        </div>

        <div>
          <label className={label}>Description *</label>
          <textarea id="description" name="description" defaultValue={post?.description} required rows={4} placeholder="Brief summary of this post..." className={`${cls} resize-vertical`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          <div>
            <label className={label}>Category *</label>
            <select id="category" name="category" defaultValue={post?.category ?? "Event"} required className={cls}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className={label}>Event Name</label><input id="eventName" name="eventName" defaultValue={post?.eventName ?? ""} placeholder="e.g. DICODING CYCLE 6" className={cls} /></div>
          <div><label className={label}>Team Name</label><input id="teamName" name="teamName" defaultValue={post?.teamName ?? ""} placeholder="e.g. THREE HEARTS" className={cls} /></div>
          <div className="flex items-center gap-2 pb-3">
            <input 
              type="checkbox" 
              id="featured" 
              name="featured" 
              defaultChecked={post?.featured} 
              className="w-4 h-4 rounded border-slate-300 text-navy focus:ring-navy" 
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700">Featured Activity</label>
          </div>
        </div>

        <div>
          <label className={label}>Thumbnail</label>
          <div className="border-2 border-dashed border-[#cbd5e1] rounded-xl overflow-hidden hover:border-[#1e293b] hover:bg-[#f8fafc] transition-all cursor-pointer relative group">
            <input id="thumbnail" name="thumbnail" type="file" accept="image/*" onChange={(e) => { 
              const f = e.target.files?.[0]; 
              if (f) {
                if (f.size > 5 * 1024 * 1024) {
                  toastError("File is too large. Max size is 5MB.");
                  e.target.value = "";
                  return;
                }
                setThumbnail(URL.createObjectURL(f)); 
              }
            }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            {thumbnail ? (
              <div className="relative aspect-video">
                <Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1.5 rounded-lg">Change Image</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#94a3b8] py-10">
                <Upload className="h-8 w-8" />
                <span className="text-sm">Click or drag to upload thumbnail</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.push("/admin/posts")} className="px-5 py-[10px] text-[14px] font-medium text-[#64748b] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={isPending} className="px-5 py-[10px] text-[14px] font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}{isPending ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </>
  );
}
