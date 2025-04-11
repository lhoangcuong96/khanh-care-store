import { ReactNode } from "react";

export function ErrorMessage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={`text-red-600 text-sm ${className}`}>{children}</p>;
}
