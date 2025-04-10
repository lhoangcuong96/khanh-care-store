import { Input } from "@/components/ui/input";
import { ReactNode, Ref } from "react";

export default function DefaultInput(
  props: React.ComponentProps<"input"> & {
    wrapperClassName?: string;
    suffix?: ReactNode;
    suffixClassName?: string;
  }
) {
  const { suffix, className, suffixClassName, wrapperClassName, ref, ...rest } =
    props;
  return (
    <div className={`relative ${wrapperClassName}`}>
      <Input
        {...rest}
        ref={ref as Ref<HTMLInputElement>}
        className={`!border-lime-600 !border-2 !ring-inherit h-12 rounded-sm ${className} relative`}
      ></Input>
      {suffix && (
        <span
          className={`absolute top-1/2 -translate-y-1/2 right-2 ${suffixClassName}`}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}
