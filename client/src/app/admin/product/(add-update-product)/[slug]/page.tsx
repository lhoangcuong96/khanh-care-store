import { adminProductApiRequest } from "@/api-request/admin/product";
import { ProductForm } from "../product-form";
import { ProductDetailType } from "@/validation-schema/admin/product";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { routePath } from "@/constants/routes";
import { ChevronRight } from "lucide-react";

export default async function UpdateProduct({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  let errorMessage = "";
  let productDetail: ProductDetailType | undefined;
  if (!slug) {
    errorMessage = "Lỗi không tìm thấy sản phẩm";
  } else {
    try {
      const response = await adminProductApiRequest.getProductDetail(slug);
      productDetail = response.payload?.data;
      if (!productDetail) {
        throw new Error("Lỗi không tìm thấy sản phẩm");
      }
    } catch (error) {
      errorMessage = (error as Error).message;
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 w-full p-4">
      <Breadcrumb className="mb-4 mt-4">
        <BreadcrumbItem>
          <BreadcrumbLink
            href={routePath.admin.home}
            className="text-sm text-muted-foreground"
          >
            Trang chủ
          </BreadcrumbLink>
          <ChevronRight className="w-4 h-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={routePath.admin.product.list}
            className="text-sm text-muted-foreground"
          >
            Danh sách sản phẩm
          </BreadcrumbLink>
          <ChevronRight className="w-4 h-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={routePath.admin.product.list}
            className="text-sm text-muted-foreground"
          >
            Cập nhật sản phẩm
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <ProductForm productDetail={productDetail} />
      )}
    </div>
  );
}
