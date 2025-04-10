import NextLink, { LinkProps } from "next/link";

type PropsType = LinkProps & {
  className?: string;
  children: React.ReactNode | string;
};
export function Link(props: PropsType) {
  return (
    <NextLink
      {...props}
      className={`text-lime-600 text-sm hover:text-lime-600 underline`}
    >
      {props.children}
    </NextLink>
  );
}
