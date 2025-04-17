import { Button, ButtonProps } from "@/components/ui/button";

export function LinkButton(props: ButtonProps) {
  return (
    <Button
      variant="link"
      className={`whitespace-nowrap underline !text-slate-600 hover:text-slate-600 ${props.className}`}
    >
      {props.children}
    </Button>
  );
}
