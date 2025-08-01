import * as React from "react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    error?: string;
  }
>(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`
        flex h-9 w-full rounded-md border border-input ${
          error ? "border-red-600 text-red-500" : ""
        } bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none 
         disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
