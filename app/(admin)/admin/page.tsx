import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mt-2 text-foreground-secondary">
        Manage the Jortal portal.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/approvals"
          className="rounded-xl border border-border bg-background-secondary p-6 transition-colors hover:border-accent/50"
        >
          <h2 className="text-lg font-semibold text-foreground">
            Pending Approvals
          </h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            Review and approve new member applications
          </p>
        </Link>
        <Link
          href="/admin/events"
          className="rounded-xl border border-border bg-background-secondary p-6 transition-colors hover:border-accent/50"
        >
          <h2 className="text-lg font-semibold text-foreground">Events</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            Create and manage upcoming events
          </p>
        </Link>
        <Link
          href="/admin/newsletters"
          className="rounded-xl border border-border bg-background-secondary p-6 transition-colors hover:border-accent/50"
        >
          <h2 className="text-lg font-semibold text-foreground">Newsletters</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            Upload PDF newsletters to the archive
          </p>
        </Link>
      </div>
    </div>
  );
}
