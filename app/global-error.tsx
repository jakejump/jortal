"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window !== "undefined") console.error(error);
  return (
    <html lang="en">
      <body
        style={{
          background: "#0a0a0a",
          color: "#f8f7fb",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Something went wrong
        </h2>
        <p style={{ color: "#b8b5c4", marginBottom: "1.5rem" }}>
          An unexpected error occurred.
        </p>
        <button
          onClick={() => reset()}
          style={{
            background: "#e8e6f0",
            color: "#0a0a0a",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
