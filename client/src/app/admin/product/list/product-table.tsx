"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductInListType } from "@/validation-schema/admin/product";
import { routePath } from "@/constants/routes";
import Link from "next/link";
import {
  Edit,
  Eye,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash,
  PackageOpen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { adminProductApiRequest } from "@/api-request/admin/product";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function ProductTable({ products }: { products: ProductInListType }) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const deleteSelectedProducts = async () => {
    try {
      const response = await adminProductApiRequest.deleteProducts(
        selectedProducts
      );
      if (response.payload?.message) {
        toast({
          title: "Thành công",
          description: response.payload.message,
          duration: 500,
          variant: "success",
        });
      }
      setSelectedProducts([]);
      router.push(`/admin/product/list?${searchParams.toString()}`, {
        scroll: false,
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa sản phẩm",
        duration: 500,
        variant: "destructive",
      });
    }
  };

  const publishProduct = async (id: string) => {
    const response = await adminProductApiRequest.publishProduct(id);
    if (response.payload?.message) {
      toast({
        title: "Thành công",
        description: response.payload.message,
        duration: 500,
        variant: "success",
      });
      router.push(`/admin/product/list?${searchParams.toString()}`, {
        scroll: false,
      });
    }
  };

  const unpublishProduct = async (id: string) => {
    const response = await adminProductApiRequest.unpublishProduct(id);
    if (response.payload?.message) {
      toast({
        title: "Thành công",
        description: response.payload.message,
        duration: 500,
        variant: "success",
      });
      router.push(`/admin/product/list?${searchParams.toString()}`, {
        scroll: false,
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await adminProductApiRequest.deleteProduct(id);
      if (response.payload?.message) {
        toast({
          title: "Thành công",
          description: response.payload.message,
          duration: 500,
          variant: "success",
        });
        router.push(`/admin/product/list?${searchParams.toString()}`, {
          scroll: false,
        });
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa sản phẩm",
        duration: 500,
        variant: "destructive",
      });
    }
  };

  // Handle empty products array
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 border rounded-md bg-gray-50">
        <div className="flex flex-col items-center justify-center gap-2">
          <PackageOpen className="h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium">Không tìm thấy sản phẩm nào</h3>
          <p className="text-sm text-gray-500">
            Vui lòng thử thay đổi bộ lọc hoặc thêm sản phẩm mới
          </p>
          <Link href={routePath.admin.product.add} className="mt-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              + Thêm sản phẩm mới
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Đã chọn {selectedProducts.length} sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash className="h-4 w-4 mr-2" />
                      Xóa đã chọn
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa {selectedProducts.length} sản
                        phẩm đã chọn? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteSelectedProducts}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={selectedProducts.length > 0 ? "pb-16" : ""}>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedProducts.length === products.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Doanh số</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Kho hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Nổi bật</TableHead>
                <TableHead>Bán chạy</TableHead>
                <TableHead>Có khuyến mãi</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectProduct(product.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image
                        src={product.image.thumbnail || ""}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <p>{product.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{product.sold || 0}</TableCell>
                  <TableCell>{product.price.toLocaleString()}đ</TableCell>
                  <TableCell>
                    {product.stock ? (
                      product.stock.toLocaleString()
                    ) : (
                      <Button variant="link" className="text-slate-600">
                        Cập nhật
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.isPublished ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm">
                        {product.isPublished ? "Đã đăng" : "Chưa đăng"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={product.isFeatured} />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={product.isBestSeller} />
                  </TableCell>
                  <TableCell>
                    {product.isPromotion ? (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {product.promotionPercent}% giảm giá
                        </div>
                      </div>
                    ) : (
                      "X"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={routePath.admin.product.update(
                                product.slug
                              )}
                            >
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4 text-slate-600" />
                                <span className="sr-only">Sửa sản phẩm</span>
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sửa sản phẩm</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href="#">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4 text-slate-600" />
                                <span className="sr-only">Xem sản phẩm</span>
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Xem sản phẩm</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href="#">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (product.isPublished) {
                                    unpublishProduct(product.id);
                                  } else {
                                    publishProduct(product.id);
                                  }
                                }}
                              >
                                {product.isPublished ? (
                                  <ArrowDownCircle className="h-4 w-4 text-orange-600" />
                                ) : (
                                  <ArrowUpCircle className="h-4 w-4 text-blue-600" />
                                )}
                                <span className="sr-only">
                                  {product.isPublished
                                    ? "Ẩn sản phẩm"
                                    : "Đẩy sản phẩm"}
                                </span>
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {product.isPublished
                                ? "Ẩn sản phẩm"
                                : "Đẩy sản phẩm"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4 text-red-600" />
                                  <span className="sr-only">Xoá sản phẩm</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Xác nhận xóa sản phẩm
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa sản phẩm này? Hành
                                    động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteProduct(product.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Xoá sản phẩm</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg bg-white p-4 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={(checked) =>
                    handleSelectProduct(product.id, checked as boolean)
                  }
                />
                <Image
                  src={product.image.thumbnail || ""}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{product.name}</div>
                  {/* <div className="text-xs text-muted-foreground truncate">
                    SKU: {product.sku}
                  </div> */}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs mt-1">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Giá: {product.price.toLocaleString()}đ
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Kho:{" "}
                  {product.stock ? (
                    product.stock.toLocaleString()
                  ) : (
                    <span className="text-orange-600">Cập nhật</span>
                  )}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Đã bán: {product.sold || 0}
                </span>
                {product.isPromotion && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    {product.promotionPercent}% giảm giá
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Nổi bật
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    Bán chạy
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded ${
                    product.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {product.isPublished ? "Đã đăng" : "Chưa đăng"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Link href={routePath.admin.product.update(product.slug)}>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4 text-slate-600" />
                    <span className="sr-only">Sửa sản phẩm</span>
                  </Button>
                </Link>
                <Link href="#">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4 text-slate-600" />
                    <span className="sr-only">Xem sản phẩm</span>
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (product.isPublished) {
                      unpublishProduct(product.id);
                    } else {
                      publishProduct(product.id);
                    }
                  }}
                >
                  {product.isPublished ? (
                    <ArrowDownCircle className="h-4 w-4 text-orange-600" />
                  ) : (
                    <ArrowUpCircle className="h-4 w-4 text-blue-600" />
                  )}
                  <span className="sr-only">
                    {product.isPublished ? "Ẩn sản phẩm" : "Đẩy sản phẩm"}
                  </span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4 text-red-600" />
                      <span className="sr-only">Xoá sản phẩm</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này
                        không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
