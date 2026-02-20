import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const classYear = searchParams.get("classYear");
  const residence = searchParams.get("residence");

  const where: Prisma.ProfileWhereInput = {};

  if (q) {
    const yearNum = parseInt(q, 10);
    where.OR = [
      { name: { contains: q } },
      { residence: { contains: q } },
      { occupation: { contains: q } },
      { interests: { contains: q } },
      ...(isNaN(yearNum) || yearNum < 1900 || yearNum > 2100
        ? []
        : [{ classYear: yearNum }]),
    ];
  }

  if (classYear) {
    where.classYear = parseInt(classYear, 10);
  }

  if (residence) {
    where.residence = { contains: residence };
  }

  const profiles = await prisma.profile.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: [{ classYear: "desc" }, { name: "asc" }],
  });

  return NextResponse.json(profiles);
}
