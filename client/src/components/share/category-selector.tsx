"use client";

import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import * as React from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

import { categoryAdminRequestApis } from "@/api-request/admin/category";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CategoryInListType } from "@/validation-schema/category";
import { useQuery } from "@tanstack/react-query";

interface CategorySelectorProps {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (categories: string[]) => void;
  isAllowChooseParent?: boolean;
}

export function CategorySelector({
  title = "Chỉnh sửa loại sản phẩm",
  open,
  onOpenChange,
  onSelect,
  isAllowChooseParent = false,
}: CategorySelectorProps) {
  const [search, setSearch] = React.useState("");
  const [selectedPath, setSelectedPath] = React.useState<string[]>([]);
  const [columns, setColumns] = React.useState<CategoryInListType[][]>();
  const [enable, setEnable] = React.useState(isAllowChooseParent);

  // Filter categories based on search
  const filteredFirstColumn = React.useMemo(() => {
    if (columns === undefined) return [];
    if (!search) return columns[0];
    const searchLower = search.toLowerCase();
    return columns[0].filter((category) =>
      category.name.toLowerCase().includes(searchLower)
    );
  }, [columns, search]);

  // Handle category selection
  const handleSelect = (category: CategoryInListType, columnIndex: number) => {
    // unselect category
    if (selectedPath[columnIndex] === category.name) {
      setSelectedPath((prev) => prev.slice(0, columnIndex));
      if (!isAllowChooseParent) {
        setEnable(false);
      }
      setColumns((prev) => prev?.slice(0, columnIndex + 1));
      return;
    }

    // Update selected path
    const newPath = [...selectedPath.slice(0, columnIndex), category.name];
    setSelectedPath(newPath);

    if (!category.subCategories || category.subCategories.length === 0) {
      setEnable(true);
    }

    // Update columns
    if (columns === undefined) return;
    const newColumns = [...columns.slice(0, columnIndex + 1)];
    if (category.subCategories && category.subCategories.length > 0) {
      newColumns.push(category.subCategories);
    }
    setColumns(newColumns);
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryAdminRequestApis.getCategoryList();
      return response.payload?.data;
    },
  });

  React.useEffect(() => {
    if (categories) {
      setColumns([categories]);
    }
  }, [categories]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Vui lòng nhập tối thiểu 1 ký tự"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {selectedPath.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
            <span>Đã chọn:</span>
            <span>{selectedPath.join(" > ")}</span>
          </div>
        )}
        <div className="grid grid-cols-4 gap-4 pt-4">
          {/* First column - always visible */}
          <div className="border-r pr-4">
            <div className="space-y-1 w-full h-full overflow-y-auto">
              {filteredFirstColumn.map((category) => {
                const isActive = selectedPath[0] === category.name;
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive ? "text-lime-600" : ""
                    }`}
                    onClick={() => handleSelect(category, 0)}
                    title={category.name}
                  >
                    <p className="truncate">{category.name}</p>{" "}
                    {category.subCategories.length > 0 && (
                      <MdOutlineArrowForwardIos className="!w-3 !h-3"></MdOutlineArrowForwardIos>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Subsequent columns */}
          {columns?.slice(1).map((columnCategories, index) => (
            <div key={index} className="border-r pr-4 last:border-r-0">
              <div className="space-y-1 w-full h-full max-h-[300px] overflow-y-auto">
                {columnCategories.map((category) => {
                  const isActive = selectedPath[index + 1] === category.name;
                  return (
                    <Button
                      key={category.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        isActive ? "text-lime-600" : ""
                      }`}
                      onClick={() => handleSelect(category, index + 1)}
                      title={category.name}
                    >
                      <p className="truncate">{category.name}</p>
                      {category.subCategories.length > 0 && (
                        <MdOutlineArrowForwardIos className="!w-3 !h-3"></MdOutlineArrowForwardIos>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Empty columns */}
          {columns?.length &&
            Array.from({ length: Math.max(0, 3 - columns.length) }).map(
              (_, index) => (
                <div
                  key={`empty-${index}`}
                  className="border-r pr-4 last:border-r-0"
                >
                  <div className="h-[300px] w-full" />
                </div>
              )
            )}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={!enable}
            onClick={() => {
              onSelect(selectedPath);
              onOpenChange(false);
            }}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
