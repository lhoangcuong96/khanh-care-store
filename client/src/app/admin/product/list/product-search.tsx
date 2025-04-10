import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function ProductSearch() {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
          className="w-full"
        />
      </div>
      <Input placeholder="Tìm kiếm theo loại sản phẩm" className="w-[300px]" />
      <Button variant="outline">
        <Search className="h-4 w-4" />
      </Button>
      <Button>Áp dụng</Button>
      <Button variant="link">Nhập Lại</Button>
    </div>
  );
}
