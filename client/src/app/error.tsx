"use client"; // Error boundaries must be Client Components
// handle uncaught error

// khi 1 lỗi chưa dc caught(bắt) thì ErrorBoundary component của Nextjs sẽ được gọi => fallback(ở đây là error.tsx) sẽ được render ra để tránh crash app
// xem trong component hierarchy(phân cấp) để xem thêm

import { useEffect } from "react";

export default function Error({
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
