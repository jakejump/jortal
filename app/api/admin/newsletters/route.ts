import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = (session.user as { id: string }).id;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const dateStr = formData.get("date") as string | null;

    if (!file || !title) {
      return NextResponse.json(
        { error: "Title and PDF file required" },
        { status: 400 }
      );
    }

    const publishedAt = dateStr ? new Date(dateStr) : new Date();

    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const newslettersDir = path.join(process.cwd(), "public", "newsletters");
    await mkdir(newslettersDir, { recursive: true });

    const sanitizedTitle = title.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 50);
    const filename = `${Date.now()}_${sanitizedTitle}.pdf`;
    const filepath = path.join(newslettersDir, filename);

    await writeFile(filepath, buffer);

    const fileUrl = `/newsletters/${filename}`;

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        fileUrl,
        publishedAt,
        adminId: userId,
      },
    });

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("Newsletter upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload newsletter" },
      { status: 500 }
    );
  }
}
