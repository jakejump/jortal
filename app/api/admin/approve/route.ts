import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  try {
    const pending = await prisma.pendingApproval.findUnique({
      where: { userId },
    });

    if (!pending) {
      return NextResponse.json(
        { error: "Pending approval not found" },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role: "member" },
      }),
      prisma.profile.create({
        data: {
          userId,
          name: pending.name,
          classYear: pending.classYear,
          residence: pending.residence,
          occupation: pending.occupation,
          phone: pending.phone,
        },
      }),
      prisma.pendingApproval.delete({
        where: { userId },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { error: "Failed to approve" },
      { status: 500 }
    );
  }
}
