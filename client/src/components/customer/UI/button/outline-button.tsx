import { Button, ButtonProps } from "@/components/ui/button";

export default function OutlineButton(props: ButtonProps) {
  const { className, ...rest } = props;
  return (
    <Button
      {...rest}
      variant="outline"
      className={`rounded-sm !text-slate-600 !border-slate-600 !ring-inherit !h-10 !min-w-10 disabled:opacity-75 !font-semibold
        hover:!bg-slate-600 hover:!text-white ${className} `}
    ></Button>
  );
}
