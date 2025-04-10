import NextLink, { LinkProps } from "next/link";

export function Link(
  props: LinkProps & { children: React.ReactNode; className?: string }
) {
  return (
    <NextLink
      href={props.href}
      className={`text-sm whitespace-nowrap underline text-lime-600 hover:text-lime-600 ${props.className}`}
    >
      {props.children}
    </NextLink>
  );
}
