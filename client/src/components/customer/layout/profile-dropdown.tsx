"use client";

import { CgProfile } from "react-icons/cg";
import { FaShoppingBasket, FaUserCircle } from "react-icons/fa";

import { RiLoginBoxLine } from "react-icons/ri";
import DefaultButton from "../UI/button/default-button";

import { routePath } from "@/constants/routes";
import { Account } from "@prisma/client";
import Link from "next/link";
import { MdOutlinePassword } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JSX } from "react";
interface MenuProps {
  label: JSX.Element;
  key: string;
  icon: JSX.Element;
}
const unLoggedProfileItems: MenuProps[] = [
  {
    label: <Link href={routePath.signIn}>Đăng nhập</Link>,
    key: routePath.signIn,
    icon: <RiLoginBoxLine className="!text-lg" />,
  },
  {
    label: <Link href={routePath.signUp}>Đăng ký</Link>,
    key: routePath.signUp,
    icon: <FaUserCircle className="!text-lg" />,
  },
];
const loggedProfileItems: MenuProps[] = [
  {
    label: <Link href={routePath.customer.account.profile}>Tài khoản</Link>,
    key: routePath.signIn,
    icon: <CgProfile className="!text-lg" />,
  },
  {
    label: (
      <Link href={routePath.customer.account.orders}>Đơn hàng của bạn</Link>
    ),
    key: routePath.admin.home,
    icon: <FaShoppingBasket className="!text-lg" />,
  },
  {
    label: (
      <Link href={routePath.customer.account.changePassword}>
        Thay đổi mật khẩu
      </Link>
    ),
    key: routePath.customer.account.changePassword,
    icon: <MdOutlinePassword className="!text-lg" />,
  },
  {
    label: <Link href={routePath.signOut}>Đăng xuất</Link>,
    key: routePath.signOut,
    icon: <RiLoginBoxLine className="!text-lg" />,
  },
];

const adminProfileItems: MenuProps[] = [
  {
    label: <Link href={routePath.customer.account.profile}>Tài khoản</Link>,
    key: routePath.signIn,
    icon: <CgProfile className="!text-lg" />,
  },
  {
    label: <Link href={routePath.admin.home}>Quản lý shop</Link>,
    key: routePath.admin.home,
    icon: <FaShoppingBasket className="!text-lg" />,
  },
  {
    label: (
      <Link href={routePath.customer.account.changePassword}>
        Thay đổi mật khẩu
      </Link>
    ),
    key: routePath.customer.account.changePassword,
    icon: <MdOutlinePassword className="!text-lg" />,
  },
  {
    label: <Link href={routePath.signOut}>Đăng xuất</Link>,
    key: routePath.signOut,
    icon: <RiLoginBoxLine className="!text-lg" />,
  },
];

export default function ProfileDropdown({
  account,
}: {
  account: Partial<Account> | undefined;
}) {
  const isAdmin = account?.role === "ADMIN";
  const items = isAdmin
    ? adminProfileItems
    : account
    ? loggedProfileItems
    : unLoggedProfileItems;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DefaultButton
          suffix={<CgProfile className="!w-6 !h-6"></CgProfile>}
          className="!font-semibold"
        ></DefaultButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {account && (
          <>
            <DropdownMenuLabel>Hi, {account.fullname}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {items?.map((item) => {
          return (
            <DropdownMenuItem key={item.key}>
              {item.icon} {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
