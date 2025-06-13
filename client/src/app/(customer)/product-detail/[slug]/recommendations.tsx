"use client";

import productRequestApi from "@/api-request/product";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductListResType } from "@/validation-schema/product";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Recommendations({ productId }: { productId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery<ProductListResType | null>({
    queryKey: ["recommendations", productId],
    queryFn: async () => {
      const resp = await productRequestApi.getRelatedProducts(productId, {
        page: currentPage,
        limit: productsPerPage,
      });
      return resp.payload;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, res?.totalPages || 0));
  };

  const totalPages = res?.totalPages || 0;

  const disableNext =
    currentPage === totalPages || totalPages === 0 || isLoading;
  const disablePrevious = currentPage === 1 || isLoading;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Có thể bạn thích
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrevious}
            disabled={disablePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={disableNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isError && (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Lỗi khi tải sản phẩm</p>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      {!isLoading && res?.data?.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Không có sản phẩm</p>
        </div>
      )}
      <div className="space-y-4">
        {res?.data?.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex gap-4">
              <Link href={`/product/${product.slug}`}>
                <Image
                  src={product.image.thumbnail}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              </Link>

              <div className="flex-1">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-sm font-medium line-clamp-2 hover:underline">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slatee-600">
                    {product.price.toLocaleString()}₫
                  </span>
                  {product.isPromotion && product.promotionPercent && (
                    <span className="text-sm line-through text-muted-foreground">
                      {(
                        product.price * product.promotionPercent
                      ).toLocaleString()}
                      ₫
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
