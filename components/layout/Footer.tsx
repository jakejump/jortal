export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background-secondary py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-foreground-secondary">
            Contact:{" "}
            <a
              href="mailto:lesttheoldtraditionsfail@gmail.com"
              className="text-accent hover:underline"
            >
              lesttheoldtraditionsfail@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
