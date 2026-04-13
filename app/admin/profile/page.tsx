"use client";

import { useState, useEffect } from "react";
import { updateProfile, getProfile } from "@/app/actions/profile";
import { getProfileImages, uploadProfileImage, deleteProfileImage, setActiveProfileImage } from "@/app/actions/profile-image";
import { Loader2, Image as ImageIcon, Plus, Check, Trash2, Upload, X, AlertCircle } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";
import { useToast } from "@/components/ui/toast";

export default function EditProfilePage() {
  const { success, error: toastError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectsTitle, setProjectsTitle] = useState("");
  const [projectsDescription, setProjectsDescription] = useState("");
  const [activitiesTitle, setActivitiesTitle] = useState("");
  const [activitiesDescription, setActivitiesDescription] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [heroExperience, setHeroExperience] = useState("");
  const [profileImages, setProfileImages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getProfile();
        const imagesData = await getProfileImages();
        
        if (profileData) {
          setName(profileData.name);
          setDescription(profileData.description);
          setProjectsTitle(profileData.projectsTitle || "");
          setProjectsDescription(profileData.projectsDescription || "");
          setActivitiesTitle(profileData.activitiesTitle || "");
          setActivitiesDescription(profileData.activitiesDescription || "");
          setMusicUrl(profileData.musicUrl || "");
          setHeroExperience(profileData.heroExperience || "");
        } else {
          setName("Hi, I am Muhammad Iqbal Firmansyah");
          setDescription("Fullstack JavaScript Developer...");
        }
        
        setProfileImages(imagesData);
      } catch (error) {
        console.error("Failed to load profile or images:", error);
      } finally {
        setIsFetching(false);
      }
    }
    loadProfile();
  }, []);

  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      toastError("Image size must be less than 5MB.");
      return;
    }
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      
      const result = await uploadProfileImage(formData);
      if (result.success) {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        const images = await getProfileImages();
        setProfileImages(images);
        success("Image uploaded to Cloudinary successfully!");
      } else {
        toastError(result.error || "Failed to upload image");
      }
    } catch {
      toastError("An error occurred while uploading");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSetItemActive(id: string) {
    try {
      const result = await setActiveProfileImage(id);
      if (result.success) {
        const images = await getProfileImages();
        setProfileImages(images);
        success("Profile image set as active!");
        router.refresh();
      } else {
        toastError("Failed to set active image");
      }
    } catch {
      toastError("An error occurred");
    }
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    try {
      const result = await deleteProfileImage(itemToDelete);
      if (result.success) {
        setProfileImages(prev => prev.filter(img => img.id !== itemToDelete));
        success("Image deleted successfully!");
        router.refresh();
      } else {
        toastError("Failed to delete image");
      }
    } catch {
      toastError("An error occurred");
    } finally {
      setItemToDelete(null);
    }
  }

  async function handleDeleteImage(id: string) {
    setItemToDelete(id);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) { toastError("Name and description are required."); return; }
    setIsLoading(true);
    try {
      const result = await updateProfile({
        name,
        description,
        projectsTitle,
        projectsDescription,
        activitiesTitle,
        activitiesDescription,
        musicUrl,
        heroExperience,
      });
      if (result.success) { 
        router.refresh(); 
        success("Profile updated successfully!"); 
      }
      else { toastError(result.error || "Failed to update profile"); }
    } catch {
      toastError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 bg-[#f4f5f7] min-h-screen">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Manage Profile" }]} />
      <h1 className="text-[22px] font-bold text-[#0f172a] mt-2 mb-8">Manage Profile</h1>
      
      {isFetching ? (
        <div className="flex justify-center py-20 bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1e293b]" />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6 flex flex-col pb-20">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            
            <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-[28px_32px] flex flex-col h-full">
              <div className="border-l-[3px] border-[#1e293b] pl-3 mb-5">
                <h3 className="text-[15px] font-semibold text-[#0f172a]">
                  Edit Profile Information
                </h3>
              </div>
              <div className="border-b border-[#f1f5f9] mb-5"></div>
              
              <div className="space-y-4 flex-grow">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Name (Hero Heading)
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    required
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Description (Hero Paragraph)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Enter description..."
                    required
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all resize-vertical min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-[28px_32px] flex flex-col h-full">
              <div className="border-l-[3px] border-[#1e293b] pl-3 mb-5">
                <h3 className="text-[15px] font-semibold text-[#0f172a]">
                  Projects Page Settings
                </h3>
              </div>
              <div className="border-b border-[#f1f5f9] mb-5"></div>
              
              <div className="space-y-4 flex-grow">
                <div className="space-y-1.5">
                  <label htmlFor="projectsTitle" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Projects Page Title
                  </label>
                  <input
                    id="projectsTitle"
                    value={projectsTitle}
                    onChange={(e) => setProjectsTitle(e.target.value)}
                    placeholder="E.g., My Projects"
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="projectsDescription" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Projects Page Description
                  </label>
                  <textarea
                    id="projectsDescription"
                    value={projectsDescription}
                    onChange={(e) => setProjectsDescription(e.target.value)}
                    rows={6}
                    placeholder="E.g., A collection of my work..."
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all resize-vertical min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-[28px_32px] flex flex-col h-full">
              <div className="border-l-[3px] border-[#1e293b] pl-3 mb-5">
                <h3 className="text-[15px] font-semibold text-[#0f172a]">
                  Activities Page Settings
                </h3>
              </div>
              <div className="border-b border-[#f1f5f9] mb-5"></div>
              
              <div className="space-y-4 flex-grow">
                <div className="space-y-1.5">
                  <label htmlFor="activitiesTitle" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Activities Page Title
                  </label>
                  <input
                    id="activitiesTitle"
                    value={activitiesTitle}
                    onChange={(e) => setActivitiesTitle(e.target.value)}
                    placeholder="E.g., Writing"
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="activitiesDescription" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Activities Page Description
                  </label>
                  <textarea
                    id="activitiesDescription"
                    value={activitiesDescription}
                    onChange={(e) => setActivitiesDescription(e.target.value)}
                    rows={6}
                    placeholder="E.g., Sharing my thoughts..."
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all resize-vertical min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-[28px_32px] flex flex-col h-full">
              <div className="border-l-[3px] border-[#1e293b] pl-3 mb-5">
                <h3 className="text-[15px] font-semibold text-[#0f172a]">
                  Music & Hero Settings
                </h3>
              </div>
              <div className="border-b border-[#f1f5f9] mb-5"></div>
              <div className="space-y-4 flex-grow">
                <div className="space-y-1.5">
                  <label htmlFor="musicUrl" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    YouTube Music URL
                  </label>
                  <input
                    id="musicUrl"
                    type="url"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    placeholder="https://youtu.be/..."
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tempel link YouTube (e.g. https://youtu.be/abc123). Kosongkan untuk menonaktifkan musik.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="heroExperience" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Hero Experience Badge Text
                  </label>
                  <input
                    id="heroExperience"
                    type="text"
                    value={heroExperience}
                    onChange={(e) => setHeroExperience(e.target.value)}
                    placeholder="E.g., 1+ Years"
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Teks yang muncul di badge &quot;Experience&quot; pada hero. Default: 1+ Years.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-[28px_32px] flex flex-col h-full mt-6">
            <div className="border-l-[3px] border-[#1e293b] pl-3 mb-5 flex justify-between items-center">
              <h3 className="text-[15px] font-semibold text-[#0f172a]">
                Manage Profile Photos
              </h3>
            </div>
            <div className="border-b border-[#f1f5f9] mb-5"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em] uppercase">
                    Upload New Photo
                  </label>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3",
                      selectedFile 
                        ? "border-[#1e293b] bg-slate-50" 
                        : "border-[#e2e8f0] hover:border-[#1e293b] hover:bg-slate-50"
                    )}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        if (f && f.size > 5 * 1024 * 1024) {
                          toastError("Image size must be less than 5MB.");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                          setSelectedFile(null);
                          return;
                        }
                        setSelectedFile(f);
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                      selectedFile ? "bg-navy text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <Upload className="h-6 w-6" />
                    </div>
                    {selectedFile ? (
                      <div>
                        <p className="text-[14px] font-semibold text-[#0f172a]">{selectedFile.name}</p>
                        <p className="text-[12px] text-slate-400 mt-1">Ready to upload • {(selectedFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[14px] font-semibold text-[#0f172a]">Click to select photo</p>
                        <p className="text-[12px] text-slate-400 mt-1">JPG, PNG or WEBP (max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={isUploading}
                    className="w-full bg-[#1e293b] text-white py-3 rounded-lg text-[14px] font-semibold hover:bg-[#0f172a] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                    ) : (
                      "Start Upload"
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <label className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em] mb-2 uppercase">
                  EXISTING PHOTOS ({profileImages.length})
                </label>
                
                {profileImages.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[13px] text-slate-400">No photos uploaded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {profileImages.map((img) => (
                      <div 
                        key={img.id} 
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all",
                          img.isActive 
                            ? "bg-emerald-50 border-emerald-100 ring-1 ring-emerald-200" 
                            : "bg-white border-slate-100 hover:border-slate-200"
                        )}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white shadow-sm">
                          <img src={img.url} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {img.isActive && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                              <Check className="w-2.5 h-2.5" /> Active
                            </span>
                          )}
                          <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{img.url}</p>
                        </div>

                        <div className="flex gap-1.5">
                          {!img.isActive && (
                            <button
                              type="button"
                              onClick={() => handleSetItemActive(img.id)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100/50 rounded-lg transition-colors"
                              title="Set as Active"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {itemToDelete && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Photo?</h3>
                  <p className="text-slate-500 text-sm mb-6">
                    This action cannot be undone. This photo will be permanently removed from your profile.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setItemToDelete(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                    >
                      Delete Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 bg-white rounded-[16px] shadow-sm border border-slate-100 p-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="text-[14px] font-medium text-[#94a3b8] hover:text-[#1e293b] transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#1e293b] text-white px-8 py-[11px] rounded-lg text-[14px] font-semibold hover:bg-[#0f172a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save All Changes"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
