import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  eventDate: z.string(),
  location: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: { eventDate: "asc" },
  });

  // Sort: upcoming first (asc), then past (desc) so soonest/most recent appear at top
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.eventDate).getTime() >= now);
  const past = events.filter((e) => new Date(e.eventDate).getTime() < now).reverse();
  const sorted = [...upcoming, ...past];

  return NextResponse.json(sorted);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const event = await prisma.event.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        eventDate: new Date(parsed.data.eventDate),
        location: parsed.data.location,
        adminId: userId,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Event create error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
