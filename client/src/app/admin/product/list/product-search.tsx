"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { RefreshCw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryDropdown from "../(add-update-product)/category-dropdown";
export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialpriceFrom = searchParams.get("priceFrom") || "";
  const initialpriceTo = searchParams.get("priceTo") || "";
  const initialStock = searchParams.get("stock") || "all";
  const initialCreatedAt = searchParams.get("createdAt") || "all";

  // State for form fields
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [priceFrom, setpriceFrom] = useState(initialpriceFrom);
  const [priceTo, setpriceTo] = useState(initialpriceTo);
  const [stockStatus, setStockStatus] = useState(initialStock);
  const [createdAt, setCreatedAt] = useState(initialCreatedAt);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search to avoid excessive updates
  const debouncedSearch = useDebounce(search, 500);

  // Update URL when search changes
  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      updateSearchParams({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // Function to update URL search params
  const updateSearchParams = (
    newParams: Record<string, string | number | null>
  ) => {
    // Create new URLSearchParams with current params
    const params = new URLSearchParams(searchParams.toString());

    // Update with new parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Always reset to first page when filters change
    params.set("page", "1");

    // Navigate to the new URL
    router.push(`/admin/product/list?${params.toString()}`);
  };

  // Handle filter application
  const applyFilters = () => {
    setIsSubmitting(true);
    updateSearchParams({
      category: category === "all" ? null : category,
      priceFrom: priceFrom || null,
      priceTo: priceTo || null,
      stockStatus: stockStatus === "all" ? null : stockStatus,
      createdAt: createdAt === "all" ? null : createdAt,
    });
    setIsSubmitting(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setpriceFrom("");
    setpriceTo("");
    setStockStatus("all");
    setCreatedAt("all");

    // Update URL to remove all filter params
    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(`/admin/product/list?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-gray-50">
      <h3 className="font-semibold">Lọc sản phẩm</h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => updateSearchParams({ search })}
        >
          <Search className="h-4 w-4 mr-2" />
          Tìm kiếm
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            Loại sản phẩm
          </label>
          <CategoryDropdown
            onSelect={(category) => {
              setCategory(category.id || "");
            }}
            value={category}
            required={false}
            placeholder="Tất cả"
          ></CategoryDropdown>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Giá</label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Từ"
              className="w-full"
              value={priceFrom}
              onChange={(e) => setpriceFrom(e.target.value)}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Đến"
              className="w-full"
              value={priceTo}
              onChange={(e) => setpriceTo(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Trạng thái kho
          </label>
          <Select value={stockStatus} onValueChange={setStockStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="in_stock">Còn hàng</SelectItem>
              <SelectItem value="low_stock">Sắp hết hàng</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Ngày tạo</label>
          <Select value={createdAt} onValueChange={setCreatedAt}>
            <SelectTrigger>
              <SelectValue placeholder="Ngày tạo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="this_week">Tuần này</SelectItem>
              <SelectItem value="this_month">Tháng này</SelectItem>
              <SelectItem value="this_year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" onClick={resetFilters}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Đặt lại
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={applyFilters}
          disabled={isSubmitting}
        >
          Áp dụng bộ lọc
        </Button>
      </div>
    </div>
  );
}
