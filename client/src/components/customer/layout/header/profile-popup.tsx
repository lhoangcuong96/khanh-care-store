"use client";

import { CgProfile } from "react-icons/cg";
import { FaShoppingBasket, FaUserCircle } from "react-icons/fa";

import { RiLoginBoxLine } from "react-icons/ri";

import { routePath } from "@/constants/routes";
import { Account } from "@prisma/client";
import Link from "next/link";
import { MdOutlinePassword } from "react-icons/md";

import { Separator } from "@/components/ui/separator";
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
    <div className="w-[200px] bg-white rounded-lg shadow-lg font-semibold text-sm">
      {account && (
        <p className="border-b border-gray-200 p-4">Hi, {account?.fullname}</p>
      )}
      {items?.map((item) => {
        return (
          <div
            key={item.key}
            className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {item.icon} {item.label}
            </div>
            <Separator />
          </div>
        );
      })}
    </div>
  );
}
