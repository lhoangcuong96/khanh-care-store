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

export function StatusFilter({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(initialValue);

  // Update URL when status changes
  const handleStatusChange = (value: string) => {
    setStatus(value);

    // Create new URLSearchParams with current params
    const params = new URLSearchParams(searchParams.toString());

    // Clear the page to 1 when changing filters
    params.set("page", "1");

    // Set appropriate status value based on selection
    if (value === "all") {
      params.delete("isPublished");
    } else if (value === "active") {
      params.set("isPublished", "true");
    } else if (value === "unapproved") {
      params.set("isPublished", "false");
    }

    // Remove any old stock parameter if it exists
    params.delete("stock");

    // Navigate to the new URL
    router.push(`/admin/product/list?${params.toString()}`);
  };

  return (
    <div className="w-[180px]">
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="active">Đang hoạt động</SelectItem>
          <SelectItem value="unapproved">Chưa được đăng</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
