"use client";

import { deletePost, updateActivitiesOrder } from "@/app/actions/post-actions";
import Link from "next/link";
import { Edit, Trash2, Star, GripVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import type { Post } from "@prisma/client";
import { useConfirm } from "@/components/ui/confirm-modal";
import { useToast } from "@/components/ui/toast";
import { Reorder } from "framer-motion";

export default function AdminPostTable({ posts: initialPosts }: { posts: Post[] }) {
  const confirm = useConfirm();
  const { success, error: toastError } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [items, setItems] = useState(initialPosts);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setItems(initialPosts);
  }, [initialPosts]);

  const handleReorder = async (newOrder: Post[]) => {
    setItems(newOrder);
    setIsUpdating(true);
    try {
      await updateActivitiesOrder(newOrder.map(p => p.id));
      success("Order updated successfully");
    } catch (err) {
      toastError("Failed to update order");
      setItems(initialPosts);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete Post",
      message: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      confirmLabel: "Delete",
      type: "danger"
    });

    if (!ok) return;

    setDeletingId(id);
    try {
      await deletePost(id);
      success("Post deleted successfully!");
    } catch (err) {
      toastError("Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-[#e2e8f0] rounded-xl bg-white">
        <p className="text-[#64748b] mb-4 text-sm">No posts yet.</p>
        <Link href="/admin/posts/new" className="px-4 py-2 text-sm font-medium text-white bg-[#1e293b] rounded-lg">Add your first post</Link>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] transition-opacity ${isUpdating ? 'opacity-70 pointer-events-none' : ''}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <th className="w-10 px-4 py-3"></th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3">Title</th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3 hidden md:table-cell">Category</th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3 hidden lg:table-cell">Created</th>
            <th className="text-center text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3">Featured</th>
            <th className="text-right text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3">Actions</th>
          </tr>
        </thead>
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} as="tbody">
          {items.map((post) => (
            <Reorder.Item 
              key={post.id} 
              value={post} 
              as="tr" 
              className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-default"
            >
              <td className="px-4 py-[14px] text-center">
                <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors">
                  <GripVertical className="h-4 w-4 mx-auto" />
                </div>
              </td>
              <td className="px-4 py-[14px] font-medium text-[#0f172a]"><span className="line-clamp-1">{post.title}</span></td>
              <td className="px-4 py-[14px] hidden md:table-cell">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{post.category}</span>
              </td>
              <td className="px-4 py-[14px] text-[#64748b] text-xs hidden lg:table-cell">{formatDate(post.createdAt)}</td>
              <td className="px-4 py-[14px] text-center">
                <button
                  onClick={async () => {
                    const newFeatured = !(post as any).featured;

                    setItems(items.map(p => p.id === post.id ? { ...p, featured: newFeatured } as Post : p));
                    try {
                      const { togglePostFeatured } = await import("@/app/actions/post-actions");
                      await togglePostFeatured(post.id, newFeatured);
                      success(`Activity ${newFeatured ? "marked as featured" : "removed from featured"}`);
                    } catch (err) {
                      toastError("Failed to update featured status");

                      setItems(initialPosts);
                    }
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors hover:bg-amber-100/50 mx-auto"
                >
                  {(post as any).featured ? (
                    <>
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 
                      <span className="text-amber-600">Featured</span>
                    </>
                  ) : (
                    <>
                      <Star className="h-3 w-3 text-[#94a3b8]" />
                      <span className="text-[#94a3b8]">Mark Featured</span>
                    </>
                  )}
                </button>
              </td>
              <td className="px-4 py-[14px]">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100 transition-colors">
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-red-50 transition-colors disabled:opacity-40"
                    disabled={deletingId === post.id}
                    onClick={() => handleDelete(post.id, post.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </table>
    </div>
  );
}
