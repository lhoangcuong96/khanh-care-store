"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/components/ui/link";
import { routePath } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/provider/app-provider";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Home,
  ShoppingBag,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { RiEdit2Line } from "react-icons/ri";

type MenuItem = {
  icon: React.ElementType;
  label: string;
  url: string;
  key: string;
  subItems?: { label: string; url: string; key: string }[];
};

export const AccountItems: MenuItem[] = [
  { icon: Home, label: "Trang chủ", url: routePath.customer.home, key: "home" },
  {
    icon: User,
    label: "Tài khoản của tôi",
    url: "",
    key: "profile",
    subItems: [
      {
        label: "Hồ sơ",
        url: routePath.customer.account.profile,
        key: "profile",
      },
      { label: "Ngân hàng", url: routePath.customer.account.bank, key: "bank" },
      {
        label: "Địa chỉ",
        url: routePath.customer.account.address,
        key: "address",
      },
      {
        label: "Đổi mật khẩu",
        url: routePath.customer.account.changePassword,
        key: "change-password",
      },
      {
        label: "Đổi email",
        url: routePath.customer.account.changeEmail,
        key: "change-email",
      },
      {
        label: "Đổi số điện thoại",
        url: routePath.customer.account.changePhoneNumber,
        key: "change-phone-number",
      },
    ],
  },
  {
    icon: ShoppingBag,
    label: "Đơn hàng",
    url: routePath.customer.account.orders,
    key: "orders",
  },
  {
    icon: Bell,
    label: "Thông báo",
    url: routePath.customer.account.notifications,
    key: "notifications",
  },
  {
    icon: CreditCard,
    label: "Kho voucher",
    url: routePath.customer.account.vouchers,
    key: "vouchers",
  },
];

export function LeftSidebar() {
  const { account } = useAppContext();
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(
    AccountItems[1].label
  );

  return (
    <div
      key={pathname}
      className="hidden lg:block w-72 bg-transparent p-4 border-gray-200 text-sm font-semibold"
    >
      <div className="grid grid-cols-[max-content_auto] items-center space-x-3 mb-8">
        <Avatar className="w-12 h-12 relative ">
          {account?.avatar ? (
            <AvatarImage src={account.avatar} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-gray-100">
              <User className="w-6 h-6" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="w-[calc(100%_-_3rem)]">
          <p className="font-semibold text-ellipsis overflow-hidden">
            {account?.fullname}
          </p>
          <Link
            href={routePath.customer.account.profile}
            className="!text-gray-500 no-underline !hover:text-gray-500 flex flex-row items-center gap-1"
          >
            <RiEdit2Line />
            Sửa hồ sơ
          </Link>
        </div>
      </div>
      <nav>
        {AccountItems.map((item, index) => {
          const isActive = pathname.includes(item.key);
          console.log(item.label, isActive);
          return (
            <div key={index}>
              <Link href={item.url ? item.url : "#"} className="no-underline">
                <div
                  className={cn(
                    "!text-gray-700 no-underline cursor-pointer flex items-center justify-between px-4 py-2 rounded-lg mb-1 hover:text-lime-600",
                    isActive && "!text-lime-600"
                  )}
                  onClick={() => {
                    setExpandedItem((prev) => {
                      return expandedItem === item.label ? item.label : prev;
                    });
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.subItems &&
                    (expandedItem === item.label ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    ))}
                </div>
              </Link>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-out",
                  expandedItem === item.label
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                {item.subItems && expandedItem === item.label && (
                  <div className="ml-9 mb-2 ">
                    {item.subItems.map((subItem, subIndex) => {
                      const isSubActive =
                        window.location.pathname === subItem.url;
                      return (
                        <a
                          key={subIndex}
                          href={subItem.url}
                          className={cn(
                            "block px-4 py-2 rounded-lg mb-1 text-sm text-gray-600 hover:text-lime-600",
                            isSubActive && "text-lime-600"
                          )}
                        >
                          {subItem.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
