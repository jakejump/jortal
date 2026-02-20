import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileGuard } from "@/components/ProfileGuard";
import Link from "next/link";

export default async function NewsletterViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
  });

  if (!newsletter) {
    notFound();
  }

  return (
    <ProfileGuard>
      <div>
        <Link
          href="/newsletter"
          className="text-sm text-foreground-secondary hover:text-accent"
        >
          ← Back to Newsletter Archive
        </Link>
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-foreground">
            {newsletter.title}
          </h1>
          <a
            href={newsletter.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 font-medium text-background hover:bg-accent/90"
          >
            Open PDF in new tab
          </a>
          <iframe
            src={newsletter.fileUrl}
            className="mt-6 h-[80vh] w-full rounded-lg border border-border"
            title={newsletter.title}
          />
        </div>
      </div>
    </ProfileGuard>
  );
}
