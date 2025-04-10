import { Button, ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";

export default function DefaultButton(
  props: ButtonProps & {
    prefix?: ReactNode;
    suffix?: ReactNode;
  }
) {
  const { className, prefix, suffix, children, ...rest } = props;
  return (
    <Button
      {...rest}
      className={`rounded-sm !bg-lime-600 !ring-inherit !text-white flex flex-row gap-2
         !h-10 !min-w-10 ${className} disabled:opacity-75 hover:!ring-inherit hover:!border-lime-600 	`}
    >
      {prefix}
      {children}
      {suffix}
    </Button>
  );
}
