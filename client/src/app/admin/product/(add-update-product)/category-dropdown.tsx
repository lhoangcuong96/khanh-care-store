"use client";

import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCategory from "@/hooks/modules/use-category";

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function CategoryDropdown({
  onSelect,
  value,
}: {
  onSelect: (category: Category) => void;
  value?: string;
}) {
  const { categories } = useCategory();

  const selectedCategory = categories.find((category) => category.id === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] justify-between font-semibold text-gray-700 text-sm"
        >
          <span> {selectedCategory?.name || "Chọn loại sản phẩm"}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]">
        <DropdownMenuLabel>Loại</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              onSelect={() => onSelect(category)}
              className={`${
                selectedCategory?.id === category.id ? "bg-gray-100" : ""
              }`}
            >
              <span>{category.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {category.count}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
