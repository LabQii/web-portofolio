"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function getTechStacks() {
  try {
    const techStacks = await prisma.techStack.findMany({
      orderBy: { name: "asc" },
    });
    return techStacks;
  } catch (error) {
    console.error("Error fetching tech stacks:", error);
    return [];
  }
}

export async function createOrUpdateTechStack(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const file = formData.get("logo") as File | null;
    let customLogoUrl = formData.get("existingLogoUrl") as string | null;

    if (!name) {
      return { success: false, error: "Tech stack name is required" };
    }

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: "Logo file size must be less than 5MB" };
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64File, {
        folder: "portfolio/tech-stacks",
      });
      
      customLogoUrl = uploadResponse.secure_url;
    }

    await prisma.techStack.upsert({
      where: { name: name.trim() },
      update: {
        customLogoUrl: customLogoUrl || null,
      },
      create: {
        name: name.trim(),
        customLogoUrl: customLogoUrl || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to save tech stack:", error);
    return { success: false, error: "Failed to save tech stack" };
  }
}

export async function deleteTechStack(id: string) {
  try {
    const techStack = await prisma.techStack.findUnique({
      where: { id }
    });

    if (techStack?.customLogoUrl && techStack.customLogoUrl.includes("cloudinary.com")) {
      try {
        const publicIdMatch = techStack.customLogoUrl.match(/\/v\d+\/(portfolio\/tech-stacks\/[^\.]+)/);
        if (publicIdMatch && publicIdMatch[1]) {
           await cloudinary.uploader.destroy(publicIdMatch[1]);
        }
      } catch (e) {
        console.error("Failed to delete from Cloudinary", e);
      }
    }

    await prisma.techStack.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tech stack:", error);
    return { success: false, error: "Failed to delete tech stack" };
  }
}
