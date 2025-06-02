import productRequestApi from "@/api-request/product";
import Breadcrumb from "@/components/customer/layout/breadcrumb";
import {
  ProductInListType,
  ProductListQueryType,
} from "@/validation-schema/product";
import SearchContent from "./search-content";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<ProductListQueryType>;
}) {
  const params = await searchParams;
  const query = params.search || "";
  const page = params.page || 1;
  const limit = params.limit || 10;

  let products: ProductInListType[] = [];
  let totalProducts = 0;
  const totalPages = 0;

  try {
    const { payload } = await productRequestApi.getProducts({
      page: page,
      limit: limit,
      search: query,
    });
    if (payload?.data) {
      products = payload.data;
    }
    if (payload?.total) {
      totalProducts = payload.total;
    }
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <Breadcrumb
        pageTitle="Tìm kiếm"
        breadcrumbItems={[
          { title: "Trang chủ", href: "/" },
          { title: "Tìm kiếm", href: "/search" },
          { title: query || "Tất cả sản phẩm", href: `/search?q=${query}` },
        ]}
      />
      <SearchContent
        products={products}
        query={query}
        totalProducts={totalProducts}
        page={page}
        limit={limit}
        totalPages={totalPages}
      />
    </div>
  );
}
