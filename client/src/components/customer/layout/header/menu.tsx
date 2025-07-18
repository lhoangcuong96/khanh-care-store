/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { routePath } from "@/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducer } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { ProductMenu } from "../product-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuProps {
  label: string;
  path: string;
  key?: string;
  isHot?: boolean;
}

export const menuItems: MenuProps[] = [
  {
    path: routePath.customer.home,
    label: "Trang chủ",
  },
  {
    path: routePath.customer.products(),
    label: "Sản phẩm",
    key: "product",
  },
  {
    path: routePath.customer.products({
      isPromotion: true,
    }),
    label: "Sản phẩm khuyến mãi",
    isHot: true,
  },
  {
    path: routePath.customer.news,
    label: "Tin tức",
  },
  {
    path: routePath.customer.introduce,
    label: "Giới  thiệu",
  },
  {
    path: routePath.customer.contact,
    label: "Liên hệ",
  },
  // {
  //   path: routePath.customer.membershipPolicy,
  //   label: "Chính sách thành viên",
  // },
  {
    path: routePath.customer.privacyPolicy,
    label: "Chính sách bảo mật",
  },
];

interface ComponentState {
  isOpenProductMenu: boolean;
}

const INITIAL_STATE: ComponentState = {
  isOpenProductMenu: false,
};

function reducer(state: ComponentState, action: { type: string; value?: any }) {
  if (action.type === "toggleProductMenu") {
    return {
      isOpenProductMenu: action.value ? action.value : !state.isOpenProductMenu,
    };
  }
  throw Error("Unknown action.");
}

export default function Menu() {
  const path = usePathname();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <div className="bg-slate-700 flex items-center gap-4 rounded-md overflow-hidden h-12 text-white text-sm font-semibold mt-7">
      {menuItems.map((item) => {
        if (item.key === "product") {
          return (
            <DropdownMenu
              key={item.key}
              onOpenChange={(value) =>
                dispatch({ type: "toggleProductMenu", value })
              }
            >
              <DropdownMenuTrigger asChild>
                <Link
                  href={item.path}
                  className="flex flex-row gap-1 text-white h-full items-center px-5"
                >
                  {item.label}{" "}
                  <span className="text-lg">
                    {state.isOpenProductMenu ? (
                      <MdArrowDropUp />
                    ) : (
                      <MdArrowDropDown />
                    )}
                  </span>
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-[1px] overflow-visible">
                <ProductMenu />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        const isHot = item.isHot ? "bg-red-500 hover:bg-red-500" : "";
        const isActive = path?.includes(item.path) ? "bg-slate-600" : "";
        return (
          <Link
            className={`flex h-full rounded-sm hover:bg-slate-600 ${isActive} ${isHot}`}
            href={item.path}
            key={item.label}
          >
            <p className="m-auto px-5">{item.label}</p>
          </Link>
        );
      })}
    </div>
  );
}
