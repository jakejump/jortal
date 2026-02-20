import { ProfileGuard } from "@/components/ProfileGuard";
import Link from "next/link";

export default async function DashboardPage() {
  return (
    <ProfileGuard>
    <div>
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-2 text-foreground-secondary">
        Welcome back. Use the navigation above to explore the portal.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/directory"
          className="rounded-xl border border-border bg-background-secondary p-6 transition-colors hover:border-accent/50"
        >
          <h2 className="text-lg font-semibold text-foreground">Directory</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            Search and browse member profiles
          </p>
        </Link>
        <Link
          href="/events"
          className="rounded-xl border border-border bg-background-secondary p-6 transition-colors hover:border-accent/50"
        >
          <h2 className="text-lg font-semibold text-foreground">Events</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            View upcoming events
          </p>
        </Link>
        <Link
          href="/newsletter"
          className="rounded-xl border border-border bg-background-secondary p-6 transition-colors hover:border-accent/50"
        >
          <h2 className="text-lg font-semibold text-foreground">Newsletter</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            Browse newsletter archive
          </p>
        </Link>
        <Link
          href="/donate"
          className="rounded-xl border border-border bg-background-secondary p-6 transition-colors hover:border-accent/50"
        >
          <h2 className="text-lg font-semibold text-foreground">Donate</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            Support the society
          </p>
        </Link>
      </div>
    </div>
    </ProfileGuard>
  );
}
