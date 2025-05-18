"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SortFilter({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(initialValue);

  // Update URL when sort changes
  const handleSortChange = (value: string) => {
    setSort(value);

    // Create new URLSearchParams with current params
    const params = new URLSearchParams(searchParams.toString());

    // Clear the page to 1 when changing filters
    params.set("page", "1");

    // Update the sort parameter
    params.set("sort", value);

    // Navigate to the new URL
    router.push(`/admin/product/list?${params.toString()}`);
  };

  return (
    <div className="w-[180px]">
      <Select value={sort} onValueChange={handleSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="oldest">Cũ nhất</SelectItem>
          <SelectItem value="name_asc">Tên A-Z</SelectItem>
          <SelectItem value="name_desc">Tên Z-A</SelectItem>
          <SelectItem value="price_high">Giá cao đến thấp</SelectItem>
          <SelectItem value="price_low">Giá thấp đến cao</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
