import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function ProfileGuard({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const userId = (session.user as { id: string }).id;
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile || !profile.bio) {
    redirect("/profile?required=1");
  }

  return <>{children}</>;
}
