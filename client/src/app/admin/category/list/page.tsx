"use client";

import { adminCategoryRequestApis } from "@/api-request/admin/category";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { routePath } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import type { AdminCategoryInListType } from "@/validation-schema/admin/category";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  FolderTree,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";

export default function CategoriesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Handle category deletion
  const handleDeleteCategory = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await adminCategoryRequestApis.deleteCategory(categoryToDelete);
        toast({
          title: "Đã xóa danh mục",
          description: "Danh mục đã được xóa thành công",
          variant: "success",
        });
        await refetchCategories(); // Refetch categories after deletion
      } catch (error: Error | any) {
        console.error("Error deleting category:", error);
        toast({
          title: "Lỗi",
          description: error.message || "Không thể xóa danh mục",
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
      // In a real app, you would call your API to delete the category
    }
  };

  const {
    data: categories = [],
    isLoading,
    error,
    refetch: refetchCategories,
  } = useQuery<AdminCategoryInListType[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await adminCategoryRequestApis.getCategoryList();
      if (!response.payload?.data) {
        throw new Error("lỗi khi lấy danh sách danh mục");
      }
      return response.payload?.data;
    },
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  // Filter categories based on search term
  const filteredCategories = searchTerm
    ? categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;
  // Get root categories (those without a parent)
  const rootCategories = filteredCategories.filter((cat) => !cat.);

  const renderCategoryRow = (category: AdminCategoryInListType, level = 0): JSX.Element => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren = category?.children
      ? category.children.length > 0
      : false;
    const childCategories = category?.children || [];
    const hasAttributes = category.attributes && category.attributes.length > 0;

    return (
      <>
        <TableRow key={category.id} className={level > 0 ? "bg-muted/30" : ""}>
          <TableCell>
            <div className="flex items-center gap-3">
              <div style={{ width: level * 20 }} className="flex-shrink-0" />
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleCategoryExpansion(category.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {!hasChildren && <div className="w-6" />}
              {category.image.thumbnail && (
                <div className="w-10 h-10 rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image.thumbnail || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-muted-foreground">{category.slug}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>{category.attributes?.length || 0}</TableCell>
          <TableCell>
            {category?.children && category.children.length > 0 ? (
              <Button
                variant="link"
                className="h-auto p-0 text-sm font-normal"
                onClick={() => toggleCategoryExpansion(category.id)}
              >
                {category.children.length} danh mục con
              </Button>
            ) : (
              0
            )}
          </TableCell>
          <TableCell>{category.totalProduct || 0}</TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  router.push(routePath.admin.category.edit(category.id))
                }
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </TableCell>
        </TableRow>

        {isExpanded && hasAttributes && (
          <TableRow className="bg-muted/10">
            <TableCell colSpan={6} className="py-2">
              <div className="ml-10 pl-6 border-l-2 border-muted">
                <h4 className="text-sm font-medium mb-2">Thuộc tính:</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {category.attributes?.map((attr, index) => (
                    <div
                      key={index}
                      className="text-xs p-2 bg-muted/30 rounded-md"
                    >
                      <span className="font-medium">{attr.attribute.name}</span>
                      {attr.attribute.options &&
                        attr.attribute.options.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {attr.attribute.options
                              .slice(0, 3)
                              .map((value: any, vIndex: number) => (
                                <span
                                  key={vIndex}
                                  className="text-xs bg-muted/50 px-1 rounded"
                                >
                                  {value.name}
                                </span>
                              ))}
                            {attr.attribute.options.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{attr.attribute.options.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}

        {isExpanded &&
          hasChildren &&
          childCategories.map((child) => renderCategoryRow(child, level + 1))}
      </>
    );
  };

  return (
    <div className="container p-8">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
            <p className="text-muted-foreground mt-2">
              Quản lý danh mục sản phẩm và thuộc tính
            </p>
          </div>
          <Button onClick={() => router.push(routePath.admin.category.add)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Danh sách danh mục</CardTitle>
                <CardDescription>
                  Quản lý tất cả danh mục sản phẩm trong hệ thống
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Tìm kiếm danh mục..."
                  className="w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Đang tải danh mục...
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead>Số thuộc tính</TableHead>
                    <TableHead>Số danh mục con</TableHead>
                    <TableHead>Số sản phẩm</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rootCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <FolderTree className="h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            Không tìm thấy danh mục nào
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rootCategories.map((category) =>
                      renderCategoryRow(category)
                    )
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể
                hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Xóa danh mục
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
