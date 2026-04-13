"use client";

import { useState, useTransition, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type Experience = {
  id: string; category: string; period: string; title: string;
  organization: string; description: string; tags: string[];
  featured: boolean; order: number; createdAt: Date; updatedAt: Date;
};

const CATEGORIES = ["Work", "Internship", "Organization", "Event Committee", "Research & Leadership", "Volunteer", "Freelance", "Mentorship"];
const cls = "w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.08)] transition-all bg-white";
const label = "block text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] mb-1.5";

interface ExperienceFormProps {
  experience?: Experience;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  submitLabel?: string;
}

export default function ExperienceForm({ experience, action, submitLabel = "Save Experience" }: ExperienceFormProps) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<string[]>(experience?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [featured, setFeatured] = useState(experience?.featured ?? false);

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val) && tags.length < 6) { setTags((p) => [...p, val]); setTagInput(""); }
  };
  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } };
  const removeTag = (tag: string) => setTags((p) => p.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("tags", tags.join(","));
    formData.set("featured", featured ? "on" : "");
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) { 
        success(experience ? "Experience updated successfully!" : "Experience created successfully!");
        router.push("/admin/experiences"); 
        router.refresh(); 
      }
      else { toastError(result.error ?? "Something went wrong."); }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div><label className={label}>Title *</label><input id="title" name="title" defaultValue={experience?.title} required placeholder="e.g. Team Lead" className={cls} /></div>
          <div><label className={label}>Organization *</label><input id="organization" name="organization" defaultValue={experience?.organization} required placeholder="e.g. PKM-KC BINUS" className={cls} /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={label}>Category *</label>
            <select id="category" name="category" defaultValue={experience?.category ?? "Organization"} required className={cls}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Period *</label>
            <input id="period" name="period" defaultValue={experience?.period} required placeholder="e.g. Jun 2024 – Oct 2024" className={cls} />
            <p className="text-[12px] text-[#94a3b8] mt-1.5">You can write a range or a single year.</p>
          </div>
        </div>

        <div>
          <label className={label}>Description *</label>
          <textarea id="description" name="description" defaultValue={experience?.description} required rows={5} placeholder="Describe your role and achievements..." className={`${cls} resize-vertical min-h-[140px]`} />
        </div>

        <div>
          <label className={label}>Tags <span className="normal-case font-normal text-[#94a3b8]">(max 6)</span></label>
          <div className="border border-[#e2e8f0] rounded-lg px-3 py-2 min-h-[44px] flex flex-wrap gap-2 items-center focus-within:border-[#1e293b] focus-within:shadow-[0_0_0_3px_rgba(30,41,59,0.08)] transition-all">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f1f5f9] rounded-full text-[12px] font-medium text-[#0f172a]">
                {tag}<button type="button" onClick={() => removeTag(tag)} className="text-[#94a3b8] hover:text-[#ef4444]"><X className="h-3 w-3" /></button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              disabled={tags.length >= 6}
              placeholder={tags.length === 0 ? "Type and press Enter..." : tags.length >= 6 ? "Max 6 tags" : ""}
              className="flex-1 min-w-[120px] border-0 outline-none text-[14px] bg-transparent placeholder:text-[#94a3b8] disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex flex-col justify-end pb-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${featured ? "bg-[#1e293b]" : "bg-slate-200"}`}
              onClick={() => setFeatured(!featured)}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${featured ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-[14px] font-medium text-[#0f172a]">Mark as featured</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.push("/admin/experiences")} className="px-5 py-[10px] text-[14px] font-medium text-[#64748b] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={isPending} className="px-5 py-[10px] text-[14px] font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}{isPending ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </>
  );
}
