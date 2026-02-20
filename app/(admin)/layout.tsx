import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border bg-background-secondary">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/admin" className="text-xl font-bold text-foreground">
            Jortal Admin
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/admin/approvals"
              className="text-sm text-foreground-secondary hover:text-foreground"
            >
              Approvals
            </Link>
            <Link
              href="/admin/events"
              className="text-sm text-foreground-secondary hover:text-foreground"
            >
              Events
            </Link>
            <Link
              href="/admin/newsletters"
              className="text-sm text-foreground-secondary hover:text-foreground"
            >
              Newsletters
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-foreground-secondary hover:text-foreground"
            >
              Member Portal
            </Link>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
