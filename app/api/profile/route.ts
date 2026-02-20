import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1),
  classYear: z.number().min(1900).max(2100),
  residence: z.string().min(1),
  occupation: z.string().min(1),
  phone: z.string().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.string().optional(),
  interests: z.string().optional(),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) return NextResponse.json(null);

  // Parse socialLinks JSON string for frontend
  const socialLinks = profile.socialLinks
    ? (JSON.parse(profile.socialLinks) as Record<string, string>)
    : null;

  return NextResponse.json({ ...profile, socialLinks });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  try {
    const body = await request.json();

    const parsed = profileSchema.safeParse({
      ...body,
      classYear: parseInt(body.classYear, 10),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const linkedinUrl =
      !data.linkedinUrl || data.linkedinUrl === "" ? null : data.linkedinUrl;
    const phone =
      !data.phone || data.phone === "" ? null : data.phone;
    const socialLinksStr = data.socialLinks
      ? JSON.stringify(data.socialLinks)
      : null;

    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        name: data.name,
        classYear: data.classYear,
        residence: data.residence,
        occupation: data.occupation,
        phone,
        bio: data.bio ?? null,
        linkedinUrl,
        interests: data.interests ?? null,
        socialLinks: socialLinksStr,
      },
      update: {
        name: data.name,
        classYear: data.classYear,
        residence: data.residence,
        occupation: data.occupation,
        phone,
        bio: data.bio ?? null,
        linkedinUrl,
        interests: data.interests ?? null,
        socialLinks: socialLinksStr,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
