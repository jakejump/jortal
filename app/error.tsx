"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-xl font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="mt-2 text-center text-foreground-secondary">
        An error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-accent px-4 py-2 font-medium text-background hover:bg-accent/90"
      >
        Try again
      </button>
    </div>
  );
}
