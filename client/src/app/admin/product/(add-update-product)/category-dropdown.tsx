"use client";

import { ChevronRight, ChevronsUpDown } from "lucide-react";

import { categoryApiRequests } from "@/api-request/category";
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LiteCategoryInListType } from "@/validation-schema/category";

export default function CategoryDropdown({
  onSelect,
  value,
  placeholder,
  required = true,
}: {
  onSelect: (category: LiteCategoryInListType) => void;
  value?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const resp = await categoryApiRequests.getListCategoryLite();
      if (!resp.payload?.data) {
        throw new Error("Lấy danh mục thất bại");
      }

      return resp.payload.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [isOpen, setIsOpen] = useState(false);

  // Find the selected category (could be a parent or child)
  const findSelectedCategory = (
    cats: LiteCategoryInListType[]
  ): LiteCategoryInListType | undefined => {
    for (const cat of cats) {
      if (cat.id === value) return cat;
      if (cat.children) {
        const found = cat.children.find((child) => child.id === value);
        if (found) return found;
      }
    }
    return undefined;
  };

  const selectedCategory = categories
    ? findSelectedCategory(categories)
    : undefined;

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const renderCategoryItem = (category: LiteCategoryInListType) => {
    const hasChildren = category.children && category.children.length > 0;
    const isOpen = !category?.id ? false : openCategories[category?.id];

    if (!hasChildren) {
      return (
        <DropdownMenuItem
          key={category.id}
          onSelect={(e) => {
            e.preventDefault();
            onSelect(category);
            setIsOpen(false);
          }}
          className={`px-4 py-2 rounded transition font-normal hover:bg-gray-100 ${
            selectedCategory?.id === category.id
              ? "bg-blue-100 font-semibold"
              : ""
          }`}
        >
          <span>{category.name}</span>
        </DropdownMenuItem>
      );
    }

    return (
      <div key={category.id} className="relative">
        <div
          className={`flex items-center justify-between px-4 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 transition ${
            selectedCategory?.id === category.id
              ? "bg-blue-100 font-semibold"
              : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleCategory(category.id || "");
          }}
        >
          <div
            className="flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(category);
              setIsOpen(false);
            }}
          >
            <span>{category.name}</span>
          </div>
          {hasChildren && (
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          )}
        </div>
        {isOpen && (
          <div className="pl-6 border-l-2 border-gray-200 ml-2 mt-1">
            {category.children?.map((child) => (
              <DropdownMenuItem
                key={child.id}
                onSelect={(e) => {
                  e.preventDefault();
                  onSelect(child);
                  setIsOpen(false);
                }}
                className={`pl-4 py-2 rounded hover:bg-gray-100 ${
                  selectedCategory?.id === child.id
                    ? "bg-blue-100 font-semibold"
                    : ""
                }`}
              >
                <span>{child.name}</span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </div>
    );
  };

  const placeholderText = placeholder || "Chọn loại sản phẩm";

  const dropdownItems = [
    ...(required
      ? []
      : [
          {
            id: undefined,
            name: placeholderText,
            children: [],
          },
        ]),
    ...(categories || []),
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="justify-between font-semibold bg-inherit text-gray-700 text-sm w-full"
        >
          <span className="truncate">
            {selectedCategory?.name || placeholderText}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[var(--radix-popper-anchor-width)] shadow-lg rounded-md p-2">
        <DropdownMenuLabel className="font-bold text-base pb-2">
          Loại
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {dropdownItems.map((category) => renderCategoryItem(category))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
