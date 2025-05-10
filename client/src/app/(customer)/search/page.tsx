"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/customer/UI/card/product-card";
import { ProductInListType } from "@/validation-schema/product";
import Breadcrumb from "@/components/customer/layout/breadcrumb";

// Mock data - replace with actual API calls
const mockProducts: ProductInListType[] = [
  {
    id: 1,
    name: "Sản phẩm A",
    price: 100000,
    image: {
      thumbnail: "/images/product-placeholder.jpg",
    },
    slug: "san-pham-a",
    isPromotion: true,
    promotionPercent: 10,
  },
  {
    id: 2,
    name: "Sản phẩm B",
    price: 200000,
    image: {
      thumbnail: "/images/product-placeholder.jpg",
    },
    slug: "san-pham-b",
    isPromotion: false,
    promotionPercent: 0,
  },
  {
    id: 3,
    name: "Sản phẩm C",
    price: 300000,
    image: {
      thumbnail: "/images/product-placeholder.jpg",
    },
    slug: "san-pham-c",
    isPromotion: true,
    promotionPercent: 20,
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

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
      <div className="w-screen sm:p-8 flex items-center justify-center h-full">
        <div className="max-w-screen-xl w-full">
          <div className="mx-auto">
            <div className="container mx-auto px-4 py-8 font-medium">
              <div className="mb-6 self-start">
                <h1 className="text-2xl font-bold">
                  {query
                    ? `Kết quả tìm kiếm cho "${query}"`
                    : "Tất cả sản phẩm"}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {mockProducts.length} sản phẩm được tìm thấy
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
