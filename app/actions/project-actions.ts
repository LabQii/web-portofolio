"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { randomBytes } from "crypto";

function generateSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  
  const hash = randomBytes(3).toString("hex");
  return `${baseSlug}-${hash}`;
}

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tags = Array.from(new Set((formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)));
  const techStack = Array.from(new Set((formData.get("techStack") as string).split(",").map((t) => t.trim()).filter(Boolean)));
  const demoUrl = formData.get("demoUrl") as string | null;
  const videoUrl = formData.get("videoUrl") as string | null;
  const githubUrl = formData.get("githubUrl") as string | null;
  const featured = formData.get("featured") === "on";

  let slug = formData.get("slug") as string;
  if (!slug || slug.trim() === "") {
    slug = generateSlug(title);
  }

  // Ensure slug is unique in the database to prevent Prisma constraint errors
  const existingProject = await prisma.project.findUnique({ where: { slug } });
  if (existingProject) {
    slug = `${slug}-${randomBytes(3).toString("hex")}`;
  }

  // Thumbnail and images are already uploaded to Cloudinary by the client via /api/upload
  const thumbnailUrl = (formData.get("thumbnailUrl") as string) || "";
  const imageUrlsRaw = formData.get("imageUrls") as string;
  const images = imageUrlsRaw ? imageUrlsRaw.split(",").filter(Boolean) : [];

  // Get latest order for new projects
  const lastProject = await prisma.project.findFirst({
    orderBy: { order: "desc" },
  });
  const newOrder = (lastProject?.order ?? 0) + 1;

  await prisma.project.create({
    data: {
      title,
      slug,
      description,
      content: content || null,
      thumbnail: thumbnailUrl,
      images,
      tags,
      techStack,
      demoUrl: demoUrl || null,
      videoUrl: videoUrl || null,
      githubUrl: githubUrl || null,
      category,
      featured,
      order: newOrder,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tags = Array.from(new Set((formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)));
  const techStack = Array.from(new Set((formData.get("techStack") as string).split(",").map((t) => t.trim()).filter(Boolean)));
  const demoUrl = formData.get("demoUrl") as string | null;
  const videoUrl = formData.get("videoUrl") as string | null;
  const githubUrl = formData.get("githubUrl") as string | null;
  const featured = formData.get("featured") === "on";
  const slug = formData.get("slug") as string;

  const existing = await prisma.project.findUnique({ where: { id } });

  // Thumbnail and images are already uploaded to Cloudinary by the client via /api/upload
  const thumbnailUrl = (formData.get("thumbnailUrl") as string) || existing?.thumbnail || "";
  const imageUrlsRaw = formData.get("imageUrls") as string;
  const images = imageUrlsRaw ? imageUrlsRaw.split(",").filter(Boolean) : (existing?.images ?? []);

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      content: content || null,
      thumbnail: thumbnailUrl,
      images,
      tags,
      techStack,
      demoUrl: demoUrl || null,
      videoUrl: videoUrl || null,
      githubUrl: githubUrl || null,
      category,
      featured,
    },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProjectsOrder(projectIds: string[]) {
  const updates = projectIds.map((id, index) =>
    prisma.project.update({
      where: { id },
      data: { order: index + 1 },
    })
  );
  await Promise.all(updates);
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  await prisma.project.update({ where: { id }, data: { featured } });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}
