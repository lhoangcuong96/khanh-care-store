import { adminProductApiRequest } from "@/api-request/admin/product";
import { Button } from "@/components/ui/button";
import { ProductStockStatus } from "@/constants/product";
import { routePath } from "@/constants/routes";
import { ProductInListType } from "@/validation-schema/admin/product";
import { Order } from "@/validation-schema/common";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { PageSizeSelect } from "./page-size-select";
import { ProductSearch } from "./product-search";
import { ProductTable } from "./product-table";
import { SortFilter } from "./sort-filter";
import { StatusFilter } from "./status-filter";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

export default async function ProductList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let products: ProductInListType = [];
  let totalProducts = 0;
  let totalPages = 1;
  const params = await searchParams;

  // Safely parse searchParams with type checking
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = (params.search as string) || "";
  const sort = (params.sort as string) || "name_asc";
  const order = (params.order as Order) || Order.Desc;
  const stockStatus =
    (params.stockStatus as ProductStockStatus) || ProductStockStatus.All;
  const priceFrom = Number(params.priceFrom) || 0;
  const priceTo = Number(params.priceTo) || 0;

  // Get additional filter params
  const category = (params.category as string) || "";
  const isPublished = (params.isPublished as string) || "";

  try {
    const response = await adminProductApiRequest.getProducts({
      page,
      limit,
      search,
      sort,
      order,
      stockStatus,
      priceFrom,
      priceTo,
      ...(category && { category }),
      ...(isPublished && { isPublished }),
    });
    if (response.payload?.data) {
      products = response.payload.data;
      totalProducts = response.payload.total;
      totalPages = response.payload.totalPages;
    }
  } catch (e) {
    console.log(e);
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of page range
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust if we're near the beginning
      if (page <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're near the end
      if (page >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Find status from params
  const status = isPublished
    ? isPublished === "false"
      ? "unapproved"
      : "active"
    : "all";

  // Fix the searchParams object by extracting only serializable properties
  const createCleanQueryObject = (params: {
    [key: string]: string | string[] | undefined;
  }) => {
    // Create a new clean object with only the properties that exist
    const cleanParams: Record<string, string | number> = {};

    if (params.page) cleanParams.page = Number(params.page);
    if (params.limit) cleanParams.limit = Number(params.limit);
    if (params.search) cleanParams.search = params.search as string;
    if (params.sort) cleanParams.sort = params.sort as string;
    if (params.order) cleanParams.order = params.order as string;
    if (params.category) cleanParams.category = params.category as string;
    if (params.isPublished)
      cleanParams.isPublished = params.isPublished as string;
    if (params.priceFrom) cleanParams.priceFrom = Number(params.priceFrom);
    if (params.priceTo) cleanParams.priceTo = Number(params.priceTo);

    return cleanParams;
  };

  // Create a cleaned version of searchParams
  const cleanParams = createCleanQueryObject(params);

  return (
    <div className="p-4">
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
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="space-y-4 p-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">Tất cả sản phẩm</h2>
          <Link href={routePath.admin.product.add}>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              + Thêm 1 sản phẩm mới
            </Button>
          </Link>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <StatusFilter initialValue={status} />
            <SortFilter initialValue={sort} />
          </div>

          <ProductSearch />

          <div className="mt-4">
            <ProductTable products={products} />
          </div>

          {totalPages > 0 && products.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(page - 1) * limit + 1} đến{" "}
                {Math.min(page * limit, totalProducts)} của {totalProducts} sản
                phẩm
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === 1}
                  asChild
                >
                  <Link
                    href={{
                      pathname: "/admin/product/list",
                      query: { ...cleanParams, page: 1 },
                    }}
                  >
                    <ChevronFirst className="h-4 w-4" />
                    <span className="sr-only">Trang đầu</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === 1}
                  asChild
                >
                  <Link
                    href={{
                      pathname: "/admin/product/list",
                      query: { ...cleanParams, page: Math.max(1, page - 1) },
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Trang trước</span>
                  </Link>
                </Button>

                {pageNumbers.map((pageNumber, index) => {
                  if (
                    pageNumber === "ellipsis-start" ||
                    pageNumber === "ellipsis-end"
                  ) {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 py-1 text-muted-foreground"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={page === pageNumber ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <Link
                        href={{
                          pathname: "/admin/product/list",
                          query: { ...cleanParams, page: pageNumber },
                        }}
                      >
                        {pageNumber}
                        <span className="sr-only">Page {pageNumber}</span>
                      </Link>
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === totalPages}
                  asChild
                >
                  <Link
                    href={{
                      pathname: "/admin/product/list",
                      query: {
                        ...cleanParams,
                        page: Math.min(totalPages, page + 1),
                      },
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Trang sau</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === totalPages}
                  asChild
                >
                  <Link
                    href={{
                      pathname: "/admin/product/list",
                      query: { ...cleanParams, page: totalPages },
                    }}
                  >
                    <ChevronLast className="h-4 w-4" />
                    <span className="sr-only">Trang cuối</span>
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Số mục mỗi trang
                </span>
                <PageSizeSelect initialValue={limit.toString()} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
