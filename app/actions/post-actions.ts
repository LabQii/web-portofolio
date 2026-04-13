"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function uploadThumbnail(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "portfolio/posts", format: "webp", quality: "auto", width: 800, crop: "limit" },
        (err, res) => (err ? reject(err) : resolve(res))
      )
      .end(buffer);
  });
  return result.secure_url;
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const teamName = formData.get("teamName") as string | null;
  const eventName = formData.get("eventName") as string | null;
  const featured = formData.get("featured") === "on";
  const slug = formData.get("slug") as string || generateSlug(title);

  const thumbnailFile = formData.get("thumbnail") as File | null;
  let thumbnailUrl = "";
  if (thumbnailFile && thumbnailFile.size > 0) {
    if (thumbnailFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "Thumbnail file size must be less than 5MB" };
    }
    thumbnailUrl = await uploadThumbnail(thumbnailFile);
  }

  const lastPost = await prisma.post.findFirst({
    orderBy: { order: "desc" },
  });
  const newOrder = (lastPost?.order ?? 0) + 1;

  await prisma.post.create({
    data: {
      title,
      slug,
      description,
      thumbnail: thumbnailUrl,
      category,
      teamName: teamName || null,
      eventName: eventName || null,
      featured,
      order: newOrder,
    },
  });

  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  return { success: true };
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const teamName = formData.get("teamName") as string | null;
  const eventName = formData.get("eventName") as string | null;
  const featured = formData.get("featured") === "on";
  const slug = formData.get("slug") as string;

  const existing = await prisma.post.findUnique({ where: { id } });
  let thumbnailUrl = existing?.thumbnail || "";

  const thumbnailFile = formData.get("thumbnail") as File | null;
  if (thumbnailFile && thumbnailFile.size > 0) {
    if (thumbnailFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "Thumbnail file size must be less than 5MB" };
    }
    thumbnailUrl = await uploadThumbnail(thumbnailFile);
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      thumbnail: thumbnailUrl,
      category,
      teamName: teamName || null,
      eventName: eventName || null,
      featured,
    },
  });

  revalidatePath("/posts");
  revalidatePath(`/posts/${slug}`);
  revalidatePath("/admin/posts");
  revalidatePath("/");
  return { success: true };
}

export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } });
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  return { success: true };
}

export async function updateActivitiesOrder(ids: string[]) {
  const updates = ids.map((id, index) =>
    prisma.post.update({
      where: { id },
      data: { order: index + 1 },
    })
  );
  await Promise.all(updates);
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  return { success: true };
}

export async function togglePostFeatured(id: string, featured: boolean) {
  await prisma.post.update({ where: { id }, data: { featured } });
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  return { success: true };
}
