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
}
const unLoggedProfileItems: MenuProps[] = [
  {
    label: (
      <Link
        href={routePath.signIn}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <RiLoginBoxLine className="!text-lg" />
          <p>Đăng nhập</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.signIn,
  },
  {
    label: (
      <Link
        href={routePath.signUp}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <FaUserCircle className="!text-lg" />
          <p>Đăng ký</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.signUp,
  },
];
const loggedProfileItems: MenuProps[] = [
  {
    label: (
      <Link
        href={routePath.customer.account.profile}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <CgProfile className="!text-lg" />
          <p>Tài khoản</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.signIn,
  },
  {
    label: (
      <Link
        href={routePath.customer.account.orders}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <FaShoppingBasket className="!text-lg" />
          <p>Đơn hàng của tôi</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.admin.home,
  },
  {
    label: (
      <Link
        href={routePath.customer.account.changePassword}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <MdOutlinePassword className="!text-lg" />
          <p>Thay đổi mật khẩu</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.customer.account.changePassword,
  },
  {
    label: (
      <Link
        href={routePath.signOut}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <RiLoginBoxLine className="!text-lg" />
          <p>Đăng xuất</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.signOut,
  },
];

const adminProfileItems: MenuProps[] = [
  {
    label: (
      <Link
        href={routePath.customer.account.profile}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <CgProfile className="!text-lg" />
          <p>Tài khoản</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.signIn,
  },
  {
    label: (
      <Link
        href={routePath.admin.home}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <FaShoppingBasket className="!text-lg" />
          <p>Quản lý shop</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.admin.home,
  },
  {
    label: (
      <Link
        href={routePath.customer.account.orders}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <FaShoppingBasket className="!text-lg" />
          <p>Đơn hàng của tôi</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.admin.home,
  },
  {
    label: (
      <Link
        href={routePath.customer.account.changePassword}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <MdOutlinePassword className="!text-lg" />
          <p>Thay đổi mật khẩu</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.customer.account.changePassword,
  },
  {
    label: (
      <Link
        href={routePath.signOut}
        className="flex flex-col items-start gap-2 pt-2 px-4 pb-0 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <RiLoginBoxLine className="!text-lg" />
          <p>Đăng xuất</p>
        </div>
        <Separator />
      </Link>
    ),
    key: routePath.signOut,
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
        return <div key={item.key}>{item.label}</div>;
      })}
    </div>
  );
}
