import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const p = await params;
    const slug = p.slug;
    
    const updatedProject = await prisma.project.update({
      where: { slug: slug },
      data: { views: { increment: 1 } },
      select: { views: true }
    });
    
    return NextResponse.json({ views: updatedProject.views }, { status: 200 });
  } catch (error) {
    console.error("Failed to update views:", error);
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}
