import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cv = await prisma.cV.findUnique({
      where: { id },
    });

    if (!cv) {
      return new NextResponse("CV not found", { status: 404 });
    }

    const response = await fetch(cv.fileUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch file from storage");
    }

    const blob = await response.blob();

    const headers = new Headers();
    headers.set("Content-Disposition", `inline; filename="${cv.fileName}"`);
    headers.set("Content-Type", "application/pdf");

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Failed to download CV", { status: 500 });
  }
}
