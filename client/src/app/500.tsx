"use client";

import { useEffect } from "react";

export default function Custom500({
  error,
  reset,
}: {
  error: Error & { digest: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return () => {
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try Again</button>
    </div>;
  };
}
