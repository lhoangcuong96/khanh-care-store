import productRequestApi from "@/api-request/product";
import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import Promotions from "@/components/ui/promotions";
import { routePath } from "@/constants/routes";
import {
  ProductInListType,
  ProductListQueryParamsType,
} from "@/validation-schema/product";
import { Metadata } from "next";
import ProductGrid from "./product-grid";
import { Sidebar } from "./sidebar";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm",
  description: "Danh sách sản phẩm",
};
export default async function Products({
  searchParams,
}: {
  searchParams: Promise<ProductListQueryParamsType>;
}) {
  const params = await searchParams;

  async function getProducts() {
    const res = await productRequestApi.getProducts(params);
    if (res.payload?.data) {
      return res.payload.data;
    } else {
      throw new Error("Không tim thấy sản phẩm nào");
    }
  }

  let initialProducts: ProductInListType[] = [];
  try {
    initialProducts = await getProducts();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle="Danh sách sản phẩm"
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Danh sách sản phẩm",
          },
        ]}
      ></AppBreadcrumb>
      <div className="w-screen sm:p-8 flex items-center justify-center h-full">
        <div className="max-w-screen-xl w-full">
          <div className="mx-auto">
            <div className="container mx-auto px-4 py-8 font-medium">
              <Promotions />
              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                <aside>
                  <Sidebar params={params} />
                </aside>
                <main>
                  {/* <ProductSort /> */}
                  <ProductGrid initialProducts={initialProducts} />
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
