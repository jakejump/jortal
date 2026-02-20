import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileGuard } from "@/components/ProfileGuard";
import { ProfileDetail } from "@/components/directory/ProfileDetail";

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });

  if (!profile) {
    notFound();
  }

  return (
    <ProfileGuard>
      <ProfileDetail
        profile={profile}
        email={profile.user.email}
        phone={profile.phone}
      />
    </ProfileGuard>
  );
}
