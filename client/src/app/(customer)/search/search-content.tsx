"use client";

import { ProductCard } from "@/components/customer/UI/card/product-card";
import { ProductInListType } from "@/validation-schema/product";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchContent = ({
  products,
  query,
  totalProducts,
  page,
  totalPages,
}: {
  products: ProductInListType[];
  query: string;
  totalProducts: number;
  page: number;
  limit: number;
  totalPages: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-screen sm:p-8 flex items-center justify-center h-full">
      <div className="max-w-screen-xl w-full">
        <div className="mx-auto">
          <div className="container mx-auto px-4 py-8 font-medium">
            <div className="mb-6 self-start">
              <h1 className="text-2xl font-bold">
                {query ? `Kết quả tìm kiếm cho "${query}"` : "Tất cả sản phẩm"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {totalProducts} sản phẩm được tìm thấy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8"
                    >
                      {pageNum}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchContent;
