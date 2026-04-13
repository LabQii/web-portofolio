"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function uploadCV(formData: FormData) {
  const file = formData.get("cv") as File;
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "CV file size must be less than 5MB" };
  }
  if (!file.name.endsWith(".pdf")) {
    return { success: false, error: "Only PDF files are allowed" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {

    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-t0-9]/gi, "_")
      .toLowerCase();
    
    const timestamp = Date.now();
    const publicId = `portfolio/cv/${sanitizedName}_${timestamp}`;

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { 
            folder: "portfolio/cv", 
            resource_type: "raw",
            public_id: `${sanitizedName}_${timestamp}`,
            content_disposition: `attachment; filename="${file.name}"`
          },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });

    const fileUrl = uploadResult.secure_url;

    await prisma.cV.updateMany({
      where: {},
      data: { isActive: false },
    });

    await prisma.cV.create({
      data: { fileUrl, fileName: file.name, isActive: true },
    });

    revalidatePath("/admin/cv");
    revalidatePath("/");
    return { success: true, url: fileUrl };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upload file to Cloudinary" };
  }
}

export async function setActiveCV(id: string) {
  try {
    await prisma.cV.updateMany({
      where: {},
      data: { isActive: false },
    });

    await prisma.cV.update({
      where: { id },
      data: { isActive: true },
    });

    revalidatePath("/admin/cv");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to set active CV" };
  }
}

export async function deleteCV(id: string, fileUrl: string) {
  try {
    if (fileUrl.includes("cloudinary.com")) {
      const parts = fileUrl.split("/");
      const filename = parts[parts.length - 1];
      const publicId = `portfolio/cv/${filename}`;
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      } catch (e) {

      }
    }

    await prisma.cV.delete({
      where: { id },
    });

    revalidatePath("/admin/cv");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to delete CV" };
  }
}

export async function renameCV(id: string, newName: string) {
  try {
    if (!newName.trim()) {
      return { success: false, error: "Name cannot be empty" };
    }

    let finalName = newName.trim();
    if (!finalName.toLowerCase().endsWith(".pdf")) {
      finalName += ".pdf";
    }

    await prisma.cV.update({
      where: { id },
      data: { fileName: finalName },
    });

    revalidatePath("/admin/cv");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to rename CV" };
  }
}
