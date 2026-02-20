import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const role = (session.user as { role?: string }).role;
    if (role === "pending") redirect("/pending");
    if (role === "admin") redirect("/admin");
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Jortal
        </h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          The member portal
        </p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-background transition-colors hover:bg-accent/90"
          >
            Sign Up
          </Link>
          <a
            href="/api/auth/signin"
            className="rounded-lg border border-border bg-background-secondary px-6 py-3 font-medium text-foreground transition-colors hover:bg-border"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
