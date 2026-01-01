"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
        <h1 style={{ color: "#333" }}>Something went wrong</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          We ran into an unexpected issue. Please try again or reload the page.
        </p>
        <button
          onClick={() => reset()}
          style={{
            background: "#0070f3",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
