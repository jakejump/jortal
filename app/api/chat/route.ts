import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role === "pending") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.chatMessage.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          email: true,
          profile: { select: { name: true } },
        },
      },
    },
  });

  const formatted = messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    authorName: m.user.profile?.name ?? m.user.email,
    authorEmail: m.user.email,
  }));

  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role === "pending") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = sendMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const message = await prisma.chatMessage.create({
      data: {
        content: parsed.data.content,
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
            profile: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      authorName: message.user.profile?.name ?? message.user.email,
      authorEmail: message.user.email,
    });
  } catch (error) {
    console.error("Chat send error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
