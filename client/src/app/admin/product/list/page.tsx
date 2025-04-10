import { adminProductApiRequest } from "@/api-request/admin/product";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/validation-schema/common";
import { ChevronRight } from "lucide-react";
import { ProductSearch } from "./product-search";
import { ProductTable } from "./product-table";
import { ProductInListType } from "@/validation-schema/admin/product";
import Link from "next/link";
import { routePath } from "@/constants/routes";

export default async function ProductList() {
  let products: ProductInListType = [];
  try {
    const response = await adminProductApiRequest.getProducts({
      page: 1,
      limit: 20,
      search: "",
      sort: "name",
      order: Order.Desc,
    });
    console.log(response);
    if (response.payload?.data) {
      products = response.payload.data as ProductInListType;
    }
  } catch (e) {
    console.log(e);
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <span>Quản lý sản phẩm</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-700">Tất cả sản phẩm</span>
      </div>
      <div className="space-y-4 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tất cả sản phẩm</h2>
          <Link href={routePath.admin.product.add}>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              + Thêm 1 sản phẩm mới
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="active">Đang hoạt động (3)</TabsTrigger>
            <TabsTrigger value="unapproved">Chưa được đăng (0)</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <ProductSearch />
          </div>

          <TabsContent value="all" className="mt-4">
            <ProductTable products={products} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
