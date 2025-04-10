"use client";

import { routePath } from "@/constants/routes";
import LocalStore, { STORE_KEYS } from "@/helper/local-store";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
type MenuSubItem = {
  label: string;
  url: string;
  key: string;
};
type MenuItem = {
  label: string;
  key: string;
  subItems?: MenuSubItem[];
};

const menuItems: MenuItem[] = [
  {
    label: "Quản lý đơn hàng",
    key: "orders",
    subItems: [
      {
        label: "Tất cả ",
        url: routePath.admin.order.list,
        key: "orders",
      },
      {
        label: "Đơn hàng đang xử lý",
        url: routePath.customer.account.orders,
        key: "orders-processing",
      },
      {
        label: "Đơn hàng đã hoàn thành",
        url: routePath.customer.account.orders,
        key: "orders-completed",
      },
      {
        label: "Đơn hàng đã hủy",
        url: routePath.customer.account.orders,
        key: "orders-cancelled",
      },
    ],
  },
  {
    label: "Quản lý sản phẩm",
    key: "products",
    subItems: [
      {
        label: "Tất cả sản phẩm",
        url: routePath.admin.product.list,
        key: "products",
      },
      {
        label: "Thêm sản phẩm",
        url: routePath.admin.product.add,
        key: "add-new",
      },
    ],
  },
  {
    label: "Quản lý sản loại sản phẩm",
    key: "products",
    subItems: [
      {
        label: "Tất cả loại sản phẩm",
        url: routePath.admin.category.list,
        key: "category/list",
      },
      {
        label: "Thêm loại sản phẩm",
        url: routePath.admin.category.add,
        key: "category/add-new",
      },
    ],
  },
  {
    label: "Quản lý công nợ",
    key: "debt management",
    subItems: [
      {
        label: "Thông tin công nợ",
        url: routePath.admin.debtManagement.debtOverview,
        key: "debt-information",
      },
      {
        label: "Quản lý đối tác",
        url: routePath.admin.debtManagement.partners,
        key: "partners",
      },
      {
        label: "Giao dịch",
        url: routePath.admin.debtManagement.transactions,
        key: "transactions",
      },
      {
        label: "Thêm giao dịch mới",
        url: routePath.admin.debtManagement.transactionAdd,
        key: "add-new-transaction",
      },
    ],
  },
  {
    label: "Kênh marketing",
    key: "marketing",
    subItems: [
      {
        label: "Kênh Marketing",
        url: "",
        key: "marketing",
      },
      {
        label: "Khuyến mãi của Shop",
        url: routePath.customer.account.vouchers,
        key: "shop-promotions",
      },
      {
        label: "Mã giảm giá của Shop",
        url: routePath.customer.account.shopVouchers,
        key: "shop-vouchers",
      },
    ],
  },
  {
    label: "Chăm sóc khách hàng",
    key: "customer-care",
    subItems: [
      {
        label: "Quản lý chat",
        url: "",
        key: "chat",
      },
      {
        label: "Quản lý đánh giá",
        url: "",
        key: "reviews",
      },
    ],
  },

  {
    label: "Dữ liệu",
    key: "data",
    subItems: [
      {
        label: "Phân tích bán hàng",
        url: "",
        key: "sales-analysis",
      },
      {
        label: "Hiệu quả hoạt động",
        url: "",
        key: "activity-effectiveness",
      },
    ],
  },
  {
    label: "Quản lý",
    key: "management",
    subItems: [
      {
        label: "Hồ sơ",
        url: "",
        key: "profile",
      },
      {
        label: "Thiết lập shop",
        url: "",
        key: "shop-settings",
      },
    ],
  },
];

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarItem = ({
  isExpand,
  item,
  handleExpand,
}: {
  isExpand: boolean;
  item: MenuItem;
  handleExpand: (value: string) => void;
}) => {
  return (
    <div>
      <div
        className={cn(
          "!text-gray-700 no-underline cursor-pointer flex items-center justify-between px-4 py-2 rounded-lg mb-1"
        )}
        onClick={() => {
          handleExpand(item.key);
        }}
      >
        <div className="flex items-center space-x-3 text-sm text-gray-600 font-bold">
          <span>{item.label}</span>
        </div>
        {item.subItems &&
          (isExpand ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isExpand ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {item.subItems && isExpand && (
          <div className="ml-6 mb-2 ">
            {item.subItems.map((subItem) => {
              return <SidebarSubItem key={subItem.key} item={subItem} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const SidebarSubItem = ({ item }: { item: MenuSubItem }) => {
  const isActive = window.location.pathname.includes(item.key);
  return (
    <Link
      key={item.url}
      href={item.url}
      className={cn(
        "block px-4 py-2 rounded-lg mb-1 text-sm text-gray-600 hover:text-lime-600",
        isActive && "text-lime-600"
      )}
    >
      {item.label}
    </Link>
  );
};

export function Sidebar({ className }: SidebarProps) {
  const [expandedItem, setExpandedItem] = useState<string[]>(() => {
    const expandList = LocalStore?.getKey(STORE_KEYS.adminSidebarExpandList);
    return expandList?.split(",") || [];
  });

  const handleExpand = (key: string) => {
    LocalStore?.setKey(STORE_KEYS.adminSidebarExpandList, key);
    setExpandedItem((prev) => {
      let newExpandList = [...prev];
      if (prev.includes(key)) {
        newExpandList = prev.filter((i) => i !== key);
        return newExpandList;
      } else {
        newExpandList = [...prev, key];
      }
      LocalStore?.setKey(
        STORE_KEYS.adminSidebarExpandList,
        newExpandList.join(",")
      );
      return newExpandList;
    });
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4 sticky top-16">
        <div className="px-3 py-2">
          {menuItems.map((item) => {
            const isExpand = expandedItem?.includes(item.key) || false;
            return (
              <SidebarItem
                key={item.label}
                isExpand={isExpand}
                item={item}
                handleExpand={handleExpand}
              ></SidebarItem>
            );
          })}
        </div>
      </div>
    </div>
  );
}
