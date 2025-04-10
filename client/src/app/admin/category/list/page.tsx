"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import CategoryTable from "./category-table";
import { routePath } from "@/constants/routes";
import { ChevronRight } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <span>Quản lý loại sản phẩm</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-700">Tất cả loại sản phẩm</span>
      </div>
      <div className="space-y-4 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tất cả loại sản phẩm</h2>
          <Button className="bg-lime-600 hover:bg-lime-600 text-white">
            <Link href={routePath.admin.category.add}>
              + Thêm 1 loại sản phẩm mới
            </Link>
          </Button>
        </div>
        <CategoryTable></CategoryTable>
      </div>
    </div>
  );
}
