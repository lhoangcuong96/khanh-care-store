"use client";

import { categoryRequestApis } from "@/api-request/admin/category";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSpinner from "@/components/ui/table-spinner";
import useCategory from "@/hooks/modules/use-category";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { CategoryInListType } from "@/validation-schema/category";
import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CategoryTable() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);

  const { messageApi } = useHandleMessage();
  const { categories } = useCategory();

  const addChildCategory = (
    categories: CategoryInListType[],
    parentId: string,
    newCategory: CategoryInListType
  ): CategoryInListType[] => {
    return categories.map((category) => {
      if (category.id === parentId) {
        return {
          ...category,
          subCategories: [...category.subCategories, newCategory],
        };
      } else if (category.subCategories.length > 0) {
        return {
          ...category,
          subCategories: addChildCategory(
            category.subCategories,
            parentId,
            newCategory
          ),
        };
      }
      return category;
    });
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      await categoryRequestApis.deleteCategory(id);
      setCategories((prevCategories) => deleteCategory(prevCategories, id));
      messageApi.success({
        title: "Thành công",
        description: "Xoá loại sản phẩm thành công",
      });
    } catch (error) {
      messageApi.error({
        error: error as Error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = (
    categories: CategoryInListType[],
    id: string
  ): CategoryInListType[] => {
    return categories.filter((category) => {
      if (category.id === id) {
        return false;
      }
      if (category.subCategories.length > 0) {
        category.subCategories = deleteCategory(category.subCategories, id);
      }
      return true;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedCategories((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const renderCategoryRow = (
    category: CategoryInListType,
    depth: number = 0
  ) => {
    const isExpanded = expandedCategories.has(category.id);
    console.log("depth", depth);
    return (
      <>
        <TableRow
          key={category.id}
          className={`${
            depth === 0 ? "!h-24" : "!h-16 !background-red text-xs"
          }`}
        >
          <TableCell>{category.id}</TableCell>
          <TableCell>
            <div className="flex items-center">
              <div style={{ width: `${depth * 20}px` }} />
              {category.subCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 mr-2"
                  onClick={() => toggleExpand(category.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {category.name}
            </div>
          </TableCell>
          <TableCell>
            <Image
              src={category.image.thumbnail}
              key={category.image.thumbnail}
              alt={category.name}
              height={64}
              width={64}
              className={`${
                depth === 0 ? "!h-16 !w-16" : "!h-12 !w-12"
              } object-cover`}
              unoptimized={true}
            />
          </TableCell>
          <TableCell>
            <Image
              src={category.image.featured}
              alt={category.name}
              height={64}
              width={64}
              className={`${
                depth === 0 ? "!h-16 !w-16" : "!h-12 !w-12"
              } object-cover`}
              unoptimized={true}
            />
          </TableCell>
          {/* <TableCell>{category.attributes.join(" - ")}</TableCell> */}
          <TableCell>
            <Button
              variant="link"
              className="text-red-600"
              onClick={() => handleDeleteCategory(category.id)}
            >
              Xoá
            </Button>
          </TableCell>
        </TableRow>
        {isExpanded &&
          category.subCategories.map((sub: CategoryInListType) =>
            renderCategoryRow(sub, depth + 1)
          )}
      </>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Tên loại sản phẩm</TableHead>
          <TableHead>Hình ảnh</TableHead>
          <TableHead>Ví dụ về sản phẩm</TableHead>
          <TableHead>Thuộc tính</TableHead>
          <TableHead>Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="relative min-h-[600px] h-auto">
        {isLoading && (
          <div className="w-full absolute top-0 left-0 bg-white opacity-90 z-10">
            <TableSpinner className="!absolute top-1/2 left-1/2 " />
          </div>
        )}

        {categories.map((category) => renderCategoryRow(category))}
      </TableBody>
    </Table>
  );
}
