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

export function ProductTable({ products }: { products: ProductInListType }) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox />
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
              <Checkbox />
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
                {/* <div>
                  <div>{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    SKU: {product.sku}
                  </div>
                </div> */}
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
                      <Link href={routePath.admin.product.update(product.slug)}>
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
                        {product.isPublished ? "Ẩn sản phẩm" : "Đẩy sản phẩm"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="#">
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4 text-red-600" />
                          <span className="sr-only">Xoá sản phẩm</span>
                        </Button>
                      </Link>
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
  );
}
