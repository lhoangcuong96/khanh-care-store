import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { ProductForm } from "../product-form";
import { routePath } from "@/constants/routes";
import { ChevronRight } from "lucide-react";

export default function AddProduct() {
  return (
    <div className="min-h-screen bg-slate-100 p-4">
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
            Thêm sản phẩm
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <ProductForm />
    </div>
  );
}
