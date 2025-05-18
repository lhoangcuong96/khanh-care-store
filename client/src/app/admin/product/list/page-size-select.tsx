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

export function PageSizeSelect({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageSize, setPageSize] = useState(initialValue);

  // Update URL when page size changes
  const handlePageSizeChange = (value: string) => {
    setPageSize(value);

    // Create new URLSearchParams with current params
    const params = new URLSearchParams(searchParams.toString());

    // Clear the page to 1 when changing page size
    params.set("page", "1");

    // Update the limit parameter
    params.set("limit", value);

    // Navigate to the new URL
    router.push(`/admin/product/list?${params.toString()}`);
  };

  return (
    <div className="w-[70px]">
      <Select value={pageSize} onValueChange={handlePageSizeChange}>
        <SelectTrigger>
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
