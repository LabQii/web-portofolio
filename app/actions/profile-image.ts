"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import cloudinary from "@/lib/cloudinary";

export async function getProfileImages() {
  return await prisma.profileImage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function uploadProfileImage(formData: FormData) {
  try {
    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "No file provided" };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Profile image size must be less than 5MB" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { 
            folder: "portfolio/profile", 
            format: "webp", 
            quality: "auto", 
            width: 800, 
            crop: "limit" 
          },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });

    await prisma.profileImage.create({
      data: { url: uploadResult.secure_url },
    });

    revalidatePath("/admin/profile");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to upload profile image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function deleteProfileImage(id: string) {
  try {
    await prisma.profileImage.delete({
      where: { id },
    });
    revalidatePath("/admin/profile");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete profile image:", error);
    return { success: false, error: "Failed to delete image" };
  }
}

export async function setActiveProfileImage(id: string) {
  try {

    await prisma.profileImage.updateMany({
      data: { isActive: false },
    });

    await prisma.profileImage.update({
      where: { id },
      data: { isActive: true },
    });
    
    revalidatePath("/admin/profile");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to set active profile image:", error);
    return { success: false, error: "Failed to set active image" };
  }
}
