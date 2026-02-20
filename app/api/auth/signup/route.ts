import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  classYear: z.number().min(1900).max(2100),
  email: z.string().email(),
  phone: z.string().min(1, "Phone is required"),
  residence: z.string().min(1, "Residence is required"),
  occupation: z.string().min(1, "Occupation is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = signupSchema.safeParse({
      ...body,
      classYear: parseInt(body.classYear, 10),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, classYear, email, phone, residence, occupation, password } =
      parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "pending",
        pendingApproval: {
          create: {
            name,
            classYear,
            email,
            phone,
            residence,
            occupation,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Registration successful. Awaiting admin approval.",
      userId: user.id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
