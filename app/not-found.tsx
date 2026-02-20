import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-xl font-semibold text-foreground">Page not found</h2>
      <p className="mt-2 text-foreground-secondary">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-4 py-2 font-medium text-background hover:bg-accent/90"
      >
        Go home
      </Link>
    </div>
  );
}
