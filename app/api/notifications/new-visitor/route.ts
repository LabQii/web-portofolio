import { prisma } from "@/lib/prisma";
import { NextResponse, userAgent } from "next/server";

export async function POST(request: Request) {
  try {
    const { device, browser, os } = userAgent(request);
    
    // Construct a friendly message
    const deviceType = device.type ? `${device.type} ` : "";
    const browserName = browser.name || "Unknown Browser";
    const osName = os.name || "Unknown OS";
    
    const title = "New Device Visit";
    const message = `A new ${deviceType}device (${browserName} on ${osName}) has visited your site.`;

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: "visitor",
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("Failed to create visitor notification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
