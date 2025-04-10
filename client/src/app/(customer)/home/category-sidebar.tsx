"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";

// Mega menu data structure
const megaMenuData: Record<
  string,
  { columns: { title: string; items: { name: string; href: string }[] }[] }
> = {
  "may-rua-xe": {
    columns: [
      {
        title: "Nhu cầu",
        items: [
          { name: "Máy rửa xe tải", href: "/may-rua-xe/tai" },
          { name: "Máy rửa xe máy", href: "/may-rua-xe/may" },
          { name: "Máy rửa xe ô tô", href: "/may-rua-xe/o-to" },
          { name: "Máy cao áp giá rẻ", href: "/may-rua-xe/gia-re" },
          { name: "Máy rửa xe tự động", href: "/may-rua-xe/tu-dong" },
          { name: "Máy rửa xe gia đình", href: "/may-rua-xe/gia-dinh" },
          { name: "Máy rửa xe Italy / Ý", href: "/may-rua-xe/italy" },
          { name: "Máy rửa xe Nhật bãi", href: "/may-rua-xe/nhat-bai" },
          { name: "Máy giặt nồi báo hiểm", href: "/may-rua-xe/giat-noi" },
          { name: "Máy rửa xe công nghiệp", href: "/may-rua-xe/cong-ngiep" },
        ],
      },
      {
        title: "Tính năng",
        items: [
          { name: "Máy rửa xe mini", href: "/may-rua-xe/mini" },
          { name: "Máy rửa xe cao áp", href: "/may-rua-xe/cao-ap" },
          { name: "Máy rửa xe dây dài", href: "/may-rua-xe/day-dai" },
          { name: "Máy rửa xe cầm tay", href: "/may-rua-xe/cam-tay" },
          { name: "Máy rửa xe treo tường", href: "/may-rua-xe/treo-tuong" },
          { name: "Máy rửa xe nước nóng", href: "/may-rua-xe/nuoc-nong" },
          { name: "Máy rửa xe siêu cao áp", href: "/may-rua-xe/sieu-cao-ap" },
          {
            name: "Máy rửa xe hơi nước nóng",
            href: "/may-rua-xe/hoi-nuoc-nong",
          },
          {
            name: "Máy rửa xe chạy xăng dầu",
            href: "/may-rua-xe/chay-xang-dau",
          },
        ],
      },
      {
        title: "Thương hiệu",
        items: [
          { name: "Máy rửa xe Vjet", href: "/may-rua-xe/vjet" },
          { name: "Máy rửa xe Urali", href: "/may-rua-xe/urali" },
          { name: "Máy rửa xe Projet", href: "/may-rua-xe/projet" },
          { name: "Thương hiệu khác", href: "/may-rua-xe/thuong-hieu-khac" },
          { name: "Máy rửa xe Lutian", href: "/may-rua-xe/lutian" },
          { name: "Máy rửa xe Kokoro", href: "/may-rua-xe/kokoro" },
          { name: "Máy rửa xe ANNOVI", href: "/may-rua-xe/annovi" },
          { name: "Máy rửa xe Mazzoni", href: "/may-rua-xe/mazzoni" },
          { name: "Máy rửa xe Toàn Phát", href: "/may-rua-xe/toan-phat" },
        ],
      },
      {
        title: "Phụ kiện theo cùng",
        items: [
          { name: "Mô tơ điện", href: "/phu-kien/mo-to-dien" },
          { name: "Dây rửa xe", href: "/phu-kien/day-rua-xe" },
          { name: "Súng rửa xe", href: "/phu-kien/sung-rua-xe" },
          { name: "Phụ kiện súng", href: "/phu-kien/phu-kien-sung" },
          { name: "Đầu béc rửa xe", href: "/phu-kien/dau-bec-rua-xe" },
          { name: "Đầu bơm rửa xe", href: "/phu-kien/dau-bom-rua-xe" },
          { name: "Phụ kiện vệ điện", href: "/phu-kien/phu-kien-ve-dien" },
          { name: "Đầu bơm Oshima", href: "/phu-kien/dau-bom-oshima" },
          { name: "Phụ kiện đầu bơm", href: "/phu-kien/phu-kien-dau-bom" },
          {
            name: "Phụ kiện đầu máy rửa xe",
            href: "/phu-kien/phu-kien-dau-may-rua-xe",
          },
          {
            name: "Phụ kiện máy rửa xe bằng pin",
            href: "/phu-kien/phu-kien-may-rua-xe-bang-pin",
          },
        ],
      },
    ],
  },
  // Add other mega menus for different categories as needed
};

const categories = [
  {
    name: "Dung dịch rửa xe Biovi",
    href: "/dung-dich-rua-xe-biovi",
    icon: "/images/icons/nuoc-rua-xe-100x100.png",
    key: "dung-dich-rua-xe-biovi",
    children: [
      { name: "Bọt tuyết có chạm", href: "/bot-tuyet-co-cham" },
      { name: "Bọt tuyết không chạm", href: "" },
      { name: "Dung dịch làm sạch bề mặt kim loại", href: "" },
      { name: "Sản phẩm vệ sinh chi tiết", href: "" },
      { name: "Sản phẩm dưỡng & phục hồi", href: "" },
      { name: "Dung dịch xông khói khử mùi", href: "" },
    ],
  },
  {
    name: "Dung dịch rửa xe Ekokemika",
    href: "/dung-dich-rua-xe-ekokemika",
    icon: "/images/icons/nuoc-rua-xe-100x100.png",
    key: "dung-dich-rua-xe-ekokemika",
    children: [
      { name: "Bọt tuyết có chạm", href: "/bot-tuyet-co-cham" },
      { name: "Bọt tuyết không chạm", href: "" },
      { name: "Dung dịch làm sạch bề mặt kim loại", href: "" },
      { name: "Sản phẩm vệ sinh chi tiết", href: "" },
      { name: "Sản phẩm dưỡng & phục hồi", href: "" },
      { name: "Dung dịch xông khói khử mùi", href: "" },
    ],
  },
  {
    name: "Dụng cụ rửa & chăm sóc xe",
    href: "/thiet-bi-nang-ha",
    icon: "/images/icons/thiet-bi-phong-son-100x100.png",
    key: "thiet-bi-nang-ha",
    children: [
      {
        name: "Khăn",
        href: "/may-hut-bui-cong-nghiep",
      },
      { name: "Cọ & bàn chải", href: "/may-nen-khi" },
      { name: "Bình xịt cầm tay", href: "/may-hut-bui-o-to" },
      { name: "Bao tay rửa xe", href: "/may-hut-bui-gia-dinh" },
      { name: "Bình xịt tạo bọt tuyết", href: "/may-hut-bui-mini" },
      { name: "Dụng cụ khác", href: "/may-hut-bui-cam-tay" },
    ],
  },
  {
    name: "Thiết bị rửa xe",
    href: "/binh-bot-tuyet",
    icon: "/images/icons/dung-cu-rua-xe-100x100.png",
    key: "binh-bot-tuyet",
    children: [
      { name: "Cầu nâng rửa xe", href: "/may-rua-xe" },
      { name: "Máy rửa xe ", href: "/may-nen-khi" },
      { name: "Máy hút bụi", href: "/may-hut-bui" },
      { name: "Rulo tự rút", href: "/may-bom-hoi" },
      { name: "Thiết bị khác", href: "/may-hut-bui-cong-nghiep" },
    ],
  },
];

export default function CategorySidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleMouseEnter = (key: string) => {
    setHoveredCategory(key);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  console.log(
    "Hovered category:",
    megaMenuData[hoveredCategory as keyof typeof megaMenuData]
  );

  return (
    <Card className="rounded-md bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-orange-50 text-orange-500 font-medium border-b"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📋</span>
          <span>Danh mục</span>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>

      {isOpen && (
        <ul className="divide-y">
          {categories.map((category) => (
            <li
              key={category.href}
              onMouseEnter={() => handleMouseEnter(category.key)}
              onMouseLeave={handleMouseLeave}
              className="relative group"
            >
              <Link
                href={category.href}
                className={cn(
                  "flex items-center justify-between p-3 text-sm hover:bg-orange-500 hover:text-white transition-colors",
                  hoveredCategory === category.key
                    ? "bg-orange-500 text-white"
                    : "text-gray-700"
                )}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={20}
                    height={20}
                  ></Image>
                  <span>{category.name}</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Link>

              {/* Mega Menu */}
              <div className="hidden group-hover:flex flex-col gap-4 absolute left-full top-0 z-50 bg-white shadow-lg border rounded-md p-6 min-w-[300px]">
                {category.children.length > 0 &&
                  category.children.map((child) => (
                    <Link
                      href={child.href}
                      className="text-sm text-gray-600 hover:text-orange-500"
                      key={child.name}
                    >
                      {child.name}
                    </Link>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
